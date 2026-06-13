# CRM Demo

This Next.js application contains a Salesforce-style CRM demo with a GPT-powered
Contract Analyzer.

## Contract Analyzer

The demo:

- Accepts text-based PDF and DOCX SaaS/customer-service agreements.
- Extracts document text in the browser.
- Sends extracted text to a server-side OpenAI Responses API route.
- Runs an initial summary, risk, gap, and deadline review.
- Answers predefined and custom questions using contract evidence only.
- Returns section/page citations when the source provides page markers.

Scanned PDFs are not supported in this demo.

## Local setup

Create `.env.local` from `.env.example` and set your API key:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Then run:

```bash
npm install
npm run dev
```

The API key is only read by `src/app/api/contracts/analyze/route.ts` and must
never be exposed through a `NEXT_PUBLIC_` environment variable.

## Supabase loaded contracts

The Contract Analyzer has two nested sections:

- **Loaded Contracts** lists preloaded contracts stored in a private Supabase
  Storage bucket with metadata in PostgreSQL.
- **Upload Contract Analyzer** preserves the browser-upload workflow.

Required server-side variables:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
POSTGRES_URL=
```

The `/api/contracts` endpoint idempotently creates the `contracts` table and
private storage bucket, seeds missing preload files, and returns short-lived
signed download URLs.

## Vercel setup

In the Vercel project, open **Settings > Environment Variables** and add:

```text
OPENAI_API_KEY
OPENAI_MODEL=gpt-4.1-mini
```

Apply the variables to Production, Preview, and Development as needed, then
redeploy.

## Demo fixture

Synthetic samples under `public/samples` cover varied SaaS terms and risk
profiles:

- `demo-saas-agreement.docx`
- `customer-friendly-cloud-services-agreement.pdf`
- `vendor-heavy-ai-platform-agreement.pdf`
- `ambiguous-startup-saas-order-form.pdf`
- `regulated-healthcare-saas-agreement.docx`
- `startup-growth-saas-agreement.docx`

The upload screen links to the original `demo-saas-agreement.docx`. The other
files can be opened directly from `public/samples`.
Regenerate it with:

```bash
npm run generate:demo-contract
```
