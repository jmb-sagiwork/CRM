import { NextResponse } from "next/server";
import pg from "pg";

import type { LoadedContract } from "@/lib/contracts/loaded-contracts";
import { PRELOADED_CONTRACTS } from "@/lib/contracts/preloaded-contracts";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

async function ensurePreloadedContracts(origin: string) {
  if (!process.env.POSTGRES_URL) throw new Error("POSTGRES_URL is not configured.");

  const database = new pg.Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });
  await database.connect();
  try {
    await database.query(`
      create extension if not exists pgcrypto;
      create table if not exists public.contracts (
        id uuid primary key default gen_random_uuid(),
        display_name text not null unique,
        company_name text not null,
        contract_type text not null,
        filename text not null,
        storage_path text not null unique,
        mime_type text not null,
        size_bytes bigint not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
    `);

    const supabase = createSupabaseAdmin();
    const { error: bucketError } = await supabase.storage.createBucket("contracts", {
      public: false,
      fileSizeLimit: 20 * 1024 * 1024,
      allowedMimeTypes: ["application/pdf"],
    });
    if (bucketError && !bucketError.message.toLowerCase().includes("already exists")) {
      throw bucketError;
    }

    for (const contract of PRELOADED_CONTRACTS) {
      const displayName = `${contract.companyName} - ${contract.contractType}`;
      const existing = await database.query(
        "select id from public.contracts where display_name = $1 limit 1",
        [displayName],
      );
      if (existing.rowCount) continue;

      const response = await fetch(`${origin}/preloaded-contracts/${encodeURIComponent(contract.filename)}`);
      if (!response.ok) throw new Error(`Unable to load preload file: ${contract.filename}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      const storagePath = `preloaded/${contract.filename}`;
      const { error: uploadError } = await supabase.storage
        .from("contracts")
        .upload(storagePath, bytes, { contentType: "application/pdf", upsert: true });
      if (uploadError) throw uploadError;

      await database.query(
        `insert into public.contracts
          (display_name, company_name, contract_type, filename, storage_path, mime_type, size_bytes)
         values ($1, $2, $3, $4, $5, 'application/pdf', $6)
         on conflict (display_name) do nothing`,
        [displayName, contract.companyName, contract.contractType, contract.filename, storagePath, bytes.length],
      );
    }
  } finally {
    await database.end();
  }
}

export async function GET(request: Request) {
  try {
    await ensurePreloadedContracts(new URL(request.url).origin);
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("contracts")
      .select("id, display_name, company_name, contract_type, filename, storage_path, mime_type, size_bytes, created_at")
      .order("display_name");

    if (error) throw error;

    const contracts: LoadedContract[] = await Promise.all(
      (data || []).map(async (contract) => {
        const { data: signed, error: signedError } = await supabase.storage
          .from("contracts")
          .createSignedUrl(contract.storage_path, 600);
        if (signedError) throw signedError;

        return {
          id: contract.id,
          displayName: contract.display_name,
          companyName: contract.company_name,
          contractType: contract.contract_type,
          filename: contract.filename,
          mimeType: contract.mime_type,
          sizeBytes: contract.size_bytes,
          downloadUrl: signed.signedUrl,
          createdAt: contract.created_at,
        };
      }),
    );

    return NextResponse.json({ contracts });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load contracts." },
      { status: 500 },
    );
  }
}
