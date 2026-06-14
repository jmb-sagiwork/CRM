import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";

import { GAP_ANALYSIS_BASELINE } from "@/lib/contracts/questions";
import { findHardPolicyEvidence, retrievePolicies } from "@/lib/contracts/policy-rag";

export const runtime = "nodejs";
export const maxDuration = 60;

const RequestSchema = z.object({
  mode: z.enum(["initial_analysis", "question"]),
  filename: z.string().min(1).max(255),
  contractText: z.string().min(100).max(300_000),
  question: z.string().min(1).max(1_000).optional(),
});

const citationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["page", "section", "quote"],
  properties: {
    page: { anyOf: [{ type: "integer" }, { type: "null" }] },
    section: { anyOf: [{ type: "string" }, { type: "null" }] },
    quote: { type: "string" },
  },
} as const;

const findingSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "risk", "recommendation", "citations"],
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    risk: { type: "string", enum: ["low", "medium", "high"] },
    recommendation: { type: "string" },
    citations: { type: "array", items: citationSchema },
  },
} as const;

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "mode",
    "isSaasAgreement",
    "contractType",
    "simpleAnswer",
    "technicalAnalysis",
    "overallRisk",
    "metadata",
    "findings",
    "gaps",
    "deadlines",
    "citations",
    "notFound",
    "warning",
    "policyDecision",
  ],
  properties: {
    mode: { type: "string", enum: ["initial_analysis", "question"] },
    isSaasAgreement: { type: "boolean" },
    contractType: { type: "string" },
    simpleAnswer: { type: "string" },
    technicalAnalysis: { type: "string" },
    overallRisk: { type: "string", enum: ["low", "medium", "high"] },
    metadata: {
      type: "object",
      additionalProperties: false,
      required: [
        "title",
        "parties",
        "effectiveDate",
        "expirationDate",
        "contractValue",
        "paymentTerms",
      ],
      properties: {
        title: { anyOf: [{ type: "string" }, { type: "null" }] },
        parties: { type: "array", items: { type: "string" } },
        effectiveDate: { anyOf: [{ type: "string" }, { type: "null" }] },
        expirationDate: { anyOf: [{ type: "string" }, { type: "null" }] },
        contractValue: { anyOf: [{ type: "string" }, { type: "null" }] },
        paymentTerms: { anyOf: [{ type: "string" }, { type: "null" }] },
      },
    },
    findings: { type: "array", items: findingSchema },
    gaps: { type: "array", items: findingSchema },
    deadlines: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "dateOrPeriod", "action", "risk", "citations"],
        properties: {
          label: { type: "string" },
          dateOrPeriod: { type: "string" },
          action: { type: "string" },
          risk: { type: "string", enum: ["low", "medium", "high"] },
          citations: { type: "array", items: citationSchema },
        },
      },
    },
    citations: { type: "array", items: citationSchema },
    notFound: { type: "boolean" },
    warning: { anyOf: [{ type: "string" }, { type: "null" }] },
    policyDecision: {
      type: "object",
      additionalProperties: false,
      required: ["status", "policyId", "policyTitle", "rationale", "matchedContractText", "policyText"],
      properties: {
        status: { type: "string", enum: ["pass", "review", "reject"] },
        policyId: { anyOf: [{ type: "string" }, { type: "null" }] },
        policyTitle: { anyOf: [{ type: "string" }, { type: "null" }] },
        rationale: { type: "string" },
        matchedContractText: { anyOf: [{ type: "string" }, { type: "null" }] },
        policyText: { anyOf: [{ type: "string" }, { type: "null" }] },
      },
    },
  },
} as const;

const SYSTEM_PROMPT = `You are Contract AI, a careful SaaS/customer-service agreement analyst.

Hard rules:
- Use only evidence explicitly present in the supplied contract text.
- If the requested information is unsupported, set notFound=true and begin simpleAnswer with exactly: "Not found in the contract."
- Never invent clauses, dates, values, page numbers, parties, or obligations.
- Every factual answer must include citations with a short exact quote. Use page=null for DOCX text without page markers.
- Provide a concise plain-business-language simpleAnswer, followed by detailed technicalAnalysis.
- Rate risks low, medium, or high. High means material commercial/legal exposure or an urgent deadline.
- This is contract review support, not legal advice.
- Treat the expected contract type as SaaS/customer service agreement. If it is another type, explain this in warning.
- Apply the retrieved company policy context. A HARD REJECT policy violation must result in policyDecision.status="reject" and overallRisk="high".
- Always populate policyDecision. Use status="pass" when the contract does not violate retrieved policy, and never invent a policy violation.

For initial analysis:
- Extract contract metadata.
- Summarize the agreement.
- Identify material findings, gaps, and deadlines.
- Compare the document against this baseline: ${GAP_ANALYSIS_BASELINE.join("; ")}.
- A missing baseline item is a gap only when it is genuinely absent from the supplied text.

For questions:
- Answer the exact question.
- Keep metadata populated when directly available, but findings/gaps/deadlines may be empty unless relevant.
- Do not treat silence as proof of a favorable term.`;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 503 },
    );
  }

  try {
    const input = RequestSchema.parse(await request.json());
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const policyDocument = await fs.readFile(
      path.join(process.cwd(), "public", "policies", "contract-review-policy.txt"),
      "utf8",
    );
    const policyQuery = `${input.question || "initial contract review"}\n${input.contractText}`;
    const retrievedPolicies = retrievePolicies(policyDocument, policyQuery);
    const hardPolicyEvidence = findHardPolicyEvidence(input.contractText);
    const task =
      input.mode === "initial_analysis"
        ? "Perform the complete initial SaaS contract analysis."
        : `Answer this contract question: ${input.question}`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Filename: ${input.filename}\nMode: ${input.mode}\nTask: ${task}\n\nRETRIEVED COMPANY POLICY CONTEXT\n${retrievedPolicies.map(policy => policy.text).join("\n\n") || "No relevant policy retrieved."}\n\nCONTRACT TEXT\n${input.contractText}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "contract_analysis",
          strict: true,
          schema: responseSchema,
        },
      },
    });

    if (!response.output_text) {
      throw new Error("The model returned no analysis.");
    }

    const analysis = JSON.parse(response.output_text);
    if (hardPolicyEvidence) {
      analysis.overallRisk = "high";
      analysis.policyDecision = {
        status: "reject",
        policyId: "DATA-AI-001",
        policyTitle: "Prohibition on Vendor AI Training and Commercialization of Customer Data",
        rationale:
          "The contract grants the vendor prohibited rights to use customer data, prompts, outputs, or derived data for AI training and commercialization. Company policy requires rejection until this language is removed or replaced.",
        matchedContractText: hardPolicyEvidence,
        policyText: retrievedPolicies[0]?.text || policyDocument,
      };
    }

    return NextResponse.json(analysis);
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? "Invalid contract analysis request."
        : error instanceof Error
          ? error.message
          : "Contract analysis failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
