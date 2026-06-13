import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

const sourceDirectory = "C:/Users/Administrator/Downloads/Samples CRM";
const bucket = "contracts";
const contracts = [
  {
    source: "Sample_Contract_1_Formal_Managed_IT_Services.pdf",
    filename: "NorthBridge Technology Services - Managed IT Services Agreement.pdf",
    companyName: "NorthBridge Technology Services",
    contractType: "Managed IT Services Agreement",
  },
  {
    source: "Sample_Contract_2_Computer_Repair_Work_Order.pdf",
    filename: "Byte Harbor Repair - Computer Repair Authorization.pdf",
    companyName: "Byte Harbor Repair",
    contractType: "Computer Repair Authorization",
  },
  {
    source: "Sample_Contract_3_Prepaid_AMC_Contract.pdf",
    filename: "SilverOak Managed IT - Annual Maintenance Contract.pdf",
    companyName: "SilverOak Managed IT",
    contractType: "Annual Maintenance Contract",
  },
  {
    source: "Sample_Contract_4_Network_Installation_SOW.pdf",
    filename: "SignalCore Networks - Network Installation and Support SOW.pdf",
    companyName: "SignalCore Networks",
    contractType: "Network Installation and Support SOW",
  },
  {
    source: "Sample_IT_Service_and_Maintenance_Contract.pdf",
    filename: "BluePeak IT Solutions - IT Service and Maintenance Agreement.pdf",
    companyName: "BluePeak IT Solutions",
    contractType: "IT Service and Maintenance Agreement",
  },
];

const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "POSTGRES_URL"];
for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} is required.`);
}

const database = new pg.Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});
await database.connect();
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

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { error: bucketError } = await supabase.storage.createBucket(bucket, {
  public: false,
  fileSizeLimit: 20 * 1024 * 1024,
  allowedMimeTypes: ["application/pdf"],
});
if (bucketError && !bucketError.message.toLowerCase().includes("already exists")) throw bucketError;

for (const contract of contracts) {
  const bytes = await fs.readFile(path.join(sourceDirectory, contract.source));
  const storagePath = `preloaded/${contract.filename}`;
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, bytes, { contentType: "application/pdf", upsert: true });
  if (uploadError) throw uploadError;

  await database.query(
    `
      insert into public.contracts
        (display_name, company_name, contract_type, filename, storage_path, mime_type, size_bytes, updated_at)
      values ($1, $2, $3, $4, $5, 'application/pdf', $6, now())
      on conflict (display_name) do update set
        company_name = excluded.company_name,
        contract_type = excluded.contract_type,
        filename = excluded.filename,
        storage_path = excluded.storage_path,
        mime_type = excluded.mime_type,
        size_bytes = excluded.size_bytes,
        updated_at = now()
    `,
    [
      `${contract.companyName} - ${contract.contractType}`,
      contract.companyName,
      contract.contractType,
      contract.filename,
      storagePath,
      bytes.length,
    ],
  );
  console.log(`Preloaded ${contract.filename}`);
}

await database.end();
