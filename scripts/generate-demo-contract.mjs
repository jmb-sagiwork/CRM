import fs from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const contracts = [
  {
    filename: "demo-saas-agreement.docx",
    title: "ENTERPRISE SOFTWARE AS A SERVICE AGREEMENT",
    paragraphs: [
      "This Enterprise Software as a Service Agreement (the \"Agreement\") is entered into by and between Northstar Cloud Systems, Inc. (\"Provider\") and Meridian Health Analytics, Inc. (\"Customer\").",
      "1. EFFECTIVE DATE AND TERM",
      "This Agreement is effective on January 1, 2026 and continues through December 31, 2027. It automatically renews for successive twelve-month periods unless either party provides written notice at least sixty days before the end of the then-current term.",
      "2. SERVICES AND DELIVERABLES",
      "Provider will provide access to its hosted analytics platform, implementation assistance, standard support, and quarterly business reviews. Customer may authorize up to 500 named users. Additional integrations or professional services require a mutually signed statement of work.",
      "3. FEES AND PAYMENT",
      "Customer will pay USD 280,000 for the initial twenty-four-month term. Provider invoices quarterly in advance. Payment is due within thirty days after the invoice date. Overdue undisputed amounts accrue interest at 1.5 percent per month.",
      "4. CUSTOMER RESPONSIBILITIES",
      "Customer will provide timely access to personnel and systems, maintain the confidentiality of account credentials, and ensure its use of the Services complies with applicable law.",
      "5. SERVICE LEVEL AGREEMENT",
      "Provider will make the production service available 99.5 percent of each calendar month, excluding scheduled maintenance. Provider will respond to Priority 1 incidents within four hours and Priority 2 incidents within eight hours. Customer's sole remedy for an SLA failure is a service credit equal to five percent of the affected monthly fee.",
      "6. DATA PRIVACY AND SECURITY",
      "Provider will maintain reasonable administrative, technical, and physical safeguards. Provider will notify Customer within seventy-two hours after confirming a breach involving Customer Data. Provider may use subprocessors but does not provide a current subprocessor list in this Agreement.",
      "7. CONFIDENTIALITY",
      "Each party will protect the other party's Confidential Information using reasonable care and use it only to perform this Agreement. Confidentiality obligations do not apply to information independently developed, publicly available, or lawfully received from a third party.",
      "8. LIABILITY",
      "Except for Customer's payment obligations, each party's aggregate liability will not exceed fees paid or payable during the twelve months preceding the event giving rise to liability. Neither party is liable for indirect, incidental, special, or consequential damages.",
      "9. TERMINATION",
      "Either party may terminate for material breach if the breach remains uncured thirty days after written notice. Customer may terminate for convenience on ninety days written notice and must pay twenty percent of the fees remaining in the current term.",
      "10. GOVERNING LAW AND DISPUTES",
      "This Agreement is governed by the laws of the State of Delaware. The parties will first attempt good-faith executive negotiation before filing a claim in the state or federal courts located in Wilmington, Delaware.",
      "11. NOTICES",
      "Formal notices must be delivered by recognized overnight courier or email with confirmation of receipt to the addresses designated by each party.",
      "12. ENTIRE AGREEMENT",
      "This Agreement and signed statements of work constitute the entire agreement between the parties and may be amended only in a writing signed by both parties.",
      "INTENTIONAL REVIEW GAPS",
      "This synthetic demo agreement intentionally omits an indemnification clause and does not name specific notice email addresses. The scope of Provider's security audit obligations and Customer's data-deletion rights are also not defined.",
    ],
  },
  {
    filename: "customer-friendly-cloud-services-agreement.pdf",
    title: "CUSTOMER-FRIENDLY CLOUD SERVICES AGREEMENT",
    paragraphs: [
      "This Cloud Services Agreement is between Harborline Data Platforms LLC (\"Provider\") and Atlas Retail Group, Inc. (\"Customer\").",
      "1. TERM",
      "The Agreement begins February 1, 2026 and expires January 31, 2028. Renewal requires a written agreement signed by both parties at least thirty days before expiration. There is no automatic renewal.",
      "2. SERVICES",
      "Provider will deliver the Harborline inventory forecasting platform, implementation, two production integrations, administrator training, and twenty-four-hour support for critical incidents. Acceptance occurs only after Customer completes written acceptance testing.",
      "3. FEES",
      "The total contract value is USD 420,000. Provider invoices monthly in arrears and Customer pays undisputed invoices within forty-five days. Customer may withhold disputed amounts while the parties investigate.",
      "4. SERVICE LEVELS",
      "Monthly uptime must be at least 99.95 percent. Priority 1 incidents require a fifteen-minute response and four-hour restoration target. Repeated SLA failures permit Customer to terminate without penalty and receive a prorated refund.",
      "5. SECURITY AND PRIVACY",
      "Provider will maintain SOC 2 Type II certification, encrypt Customer Data in transit and at rest, conduct annual penetration testing, and notify Customer within twenty-four hours of a confirmed security incident. Provider must obtain written approval before adding a subprocessor.",
      "6. DATA OWNERSHIP AND DELETION",
      "Customer owns all Customer Data. Within thirty days after termination, Provider will return Customer Data in a commonly readable format and permanently delete remaining copies, except where retention is legally required.",
      "7. INDEMNIFICATION",
      "Provider will defend and indemnify Customer against third-party claims alleging that the Services infringe intellectual property rights or that Provider's breach of its security obligations caused unauthorized disclosure of Customer Data.",
      "8. LIABILITY",
      "General liability is capped at two times fees paid during the prior twelve months. Liability for confidentiality breaches, security incidents caused by Provider, infringement indemnity, fraud, or willful misconduct is capped at four times such fees.",
      "9. TERMINATION",
      "Customer may terminate for convenience with sixty days written notice and receive a prorated refund of prepaid unused fees. Either party may terminate an uncured material breach after thirty days written notice.",
      "10. CONFIDENTIALITY",
      "Each party will protect Confidential Information using at least the same care used for its own similar information and no less than reasonable care.",
      "11. GOVERNING LAW",
      "The laws of the State of New York govern this Agreement. Exclusive venue lies in state and federal courts located in New York County, New York.",
      "12. NOTICES",
      "Legal notices to Provider must be sent to legal@harborline.example and notices to Customer must be sent to contracts@atlasretail.example.",
    ],
  },
  {
    filename: "vendor-heavy-ai-platform-agreement.pdf",
    title: "AI PLATFORM SUBSCRIPTION AGREEMENT",
    paragraphs: [
      "This AI Platform Subscription Agreement is entered into by VectorPeak AI Corporation (\"Vendor\") and Summit Lending Services Ltd. (\"Customer\") effective March 15, 2026.",
      "1. SUBSCRIPTION AND SCOPE",
      "Vendor grants Customer a limited subscription to its hosted AI platform. Features, model providers, usage limits, and support coverage may be modified by Vendor at any time without prior notice.",
      "2. TERM AND AUTOMATIC RENEWAL",
      "The initial term is thirty-six months. The Agreement automatically renews for additional three-year terms unless Customer gives written non-renewal notice at least one hundred eighty days before the renewal date.",
      "3. FEES",
      "Customer will pay USD 900,000 annually in advance. Vendor may increase fees by up to twenty-five percent each renewal term. All fees are non-refundable and payment is due within ten days.",
      "4. DATA RIGHTS",
      "Vendor may use Customer Data, prompts, outputs, and derived data to operate, improve, train, and commercialize Vendor products. Vendor may retain de-identified derived data indefinitely.",
      "5. SERVICE LEVEL",
      "Vendor will use commercially reasonable efforts to keep the platform available. No uptime commitment, response-time commitment, service credits, or remedies apply.",
      "6. SECURITY",
      "Vendor maintains security controls it considers appropriate. Vendor will notify Customer of confirmed breaches without unreasonable delay. No specific notification period, audit right, certification, or encryption requirement is provided.",
      "7. WARRANTY DISCLAIMER",
      "The platform and all AI outputs are provided as-is. Vendor disclaims all warranties, including accuracy, non-infringement, fitness for purpose, and uninterrupted availability.",
      "8. LIABILITY",
      "Vendor's total liability will not exceed fees paid by Customer in the thirty days before the claim. Customer's liability is unlimited. Vendor is not liable for data loss, security incidents, regulatory penalties, or reliance on AI outputs.",
      "9. INDEMNIFICATION",
      "Customer will defend and indemnify Vendor against all claims arising from Customer Data, prompts, outputs, regulatory obligations, and Customer's use of the platform. Vendor provides no indemnification.",
      "10. TERMINATION",
      "Vendor may suspend or terminate immediately for suspected misuse, reputational risk, late payment, or any reason Vendor determines necessary. Customer may terminate only for Vendor's material breach remaining uncured for ninety days, and prepaid fees are not refundable.",
      "11. CONFIDENTIALITY",
      "Customer must protect Vendor Confidential Information indefinitely. Vendor may disclose Customer Confidential Information to affiliates, contractors, model providers, and business partners as Vendor considers necessary.",
      "12. GOVERNING LAW",
      "The Agreement is governed by Delaware law, and all disputes must be resolved through confidential arbitration selected by Vendor.",
    ],
  },
  {
    filename: "ambiguous-startup-saas-order-form.pdf",
    title: "STARTUP SAAS ORDER FORM AND TERMS",
    paragraphs: [
      "This Order Form is between BrightDesk Labs (\"Supplier\") and Greenfield Operations (\"Client\"). The service starts around July 2026.",
      "1. SERVICE",
      "Supplier will provide its workflow platform and normal support. The specific modules, user count, implementation deliverables, acceptance criteria, and support channels will be agreed later.",
      "2. PRICE",
      "Client will pay approximately USD 60,000 per year, subject to adjustment based on usage. Invoices are due promptly.",
      "3. TERM",
      "The parties expect an initial one-year relationship and may continue afterward. No renewal process, notice period, or fixed expiration date is stated.",
      "4. AVAILABILITY",
      "Supplier aims for high availability but does not guarantee uptime, response times, restoration targets, or service credits.",
      "5. DATA",
      "Supplier may process Client data as needed to provide and improve the service. Security safeguards, breach notification timing, subprocessors, data location, return, and deletion are not specified.",
      "6. TERMINATION",
      "Either party may end the relationship if things are not working out. The effect of termination, notice requirement, refund rights, and transition assistance are not specified.",
      "7. CONFIDENTIALITY",
      "The parties agree to keep sensitive business information confidential. No duration, exclusions, disclosure rules, or required safeguards are stated.",
      "8. GENERAL",
      "The parties will work together in good faith. This document does not specify liability limits, indemnification, governing law, dispute resolution, formal notices, or amendment requirements.",
    ],
  },
  {
    filename: "regulated-healthcare-saas-agreement.docx",
    title: "REGULATED HEALTHCARE SAAS AND BUSINESS ASSOCIATE AGREEMENT",
    paragraphs: [
      "This Healthcare SaaS and Business Associate Agreement is between CareBridge Systems, Inc. (\"Business Associate\" or \"Provider\") and Sunrise Regional Clinics (\"Covered Entity\" or \"Customer\").",
      "1. EFFECTIVE DATE AND TERM",
      "The Agreement begins April 1, 2026 and expires March 31, 2029. It renews for one-year periods unless either party provides ninety days written notice before expiration.",
      "2. SERVICES",
      "Provider will deliver hosted patient engagement, appointment reminder, secure messaging, implementation, migration, training, and premium support services for up to 2,000 users.",
      "3. FEES AND PAYMENT",
      "Customer will pay USD 1,200,000 over the initial three-year term. Provider invoices annually in advance. Undisputed invoices are payable within thirty days.",
      "4. HIPAA AND PRIVACY",
      "Provider will comply with HIPAA as a Business Associate, use protected health information only as permitted by this Agreement, and report any security incident or breach of unsecured protected health information within forty-eight hours after discovery.",
      "5. SECURITY",
      "Provider will maintain encryption in transit and at rest, multifactor authentication, annual penetration testing, SOC 2 Type II reports, role-based access, audit logs, and a documented incident response program.",
      "6. SUBCONTRACTORS",
      "Provider will ensure each subcontractor that handles protected health information signs a written business associate agreement imposing equivalent restrictions. Provider will give Customer thirty days advance notice of material new subprocessors.",
      "7. SERVICE LEVELS",
      "Provider guarantees 99.99 percent monthly uptime. Priority 1 incidents require a ten-minute response and two-hour restoration target. Three SLA failures in six months permit termination without penalty.",
      "8. DATA RETURN AND DELETION",
      "At termination, Provider will return or destroy protected health information when feasible and certify destruction within forty-five days. If destruction is infeasible, protections continue for retained data.",
      "9. INDEMNIFICATION",
      "Provider will indemnify Customer against third-party claims, regulatory penalties, and reasonable response costs arising from Provider's breach of HIPAA obligations, security commitments, or confidentiality obligations.",
      "10. LIABILITY",
      "General liability is capped at fees paid during the prior twelve months. Liability for breaches of protected health information, indemnification obligations, fraud, or willful misconduct is capped at USD 5,000,000.",
      "11. TERMINATION",
      "Either party may terminate for an uncured material breach after thirty days notice. Customer may terminate immediately if Provider violates a material HIPAA obligation and cure is not possible.",
      "12. CONFIDENTIALITY",
      "Each party will protect Confidential Information and use it only for this Agreement. These obligations continue for five years after termination, while trade secrets and protected health information remain protected as required by law.",
      "13. GOVERNING LAW AND NOTICES",
      "California law governs this Agreement. Notices must be sent to legal@carebridge.example and compliance@sunriseclinics.example by email and recognized overnight courier.",
    ],
  },
  {
    filename: "startup-growth-saas-agreement.docx",
    title: "GROWTH-STAGE SAAS SUBSCRIPTION AGREEMENT",
    paragraphs: [
      "This SaaS Subscription Agreement is between LaunchMetric Technologies, Inc. (\"Provider\") and Copperline Commerce LLC (\"Customer\").",
      "1. TERM",
      "The Agreement begins May 1, 2026 and continues for twelve months. It automatically renews for additional twelve-month periods unless either party gives thirty days written notice before renewal.",
      "2. PLATFORM AND SUPPORT",
      "Provider will deliver its revenue analytics platform for 100 named users, onboarding, one data integration, email support during business hours, and monthly success reviews.",
      "3. FEES",
      "Customer will pay USD 72,000 annually in advance. Payment is due within fifteen days. Provider may increase renewal pricing by up to ten percent.",
      "4. SERVICE LEVELS",
      "Provider targets 99.9 percent monthly uptime. If uptime falls below 99.0 percent, Customer may request a credit equal to ten percent of the monthly fee. The Agreement does not define response or restoration times.",
      "5. DATA AND SECURITY",
      "Customer owns Customer Data. Provider will use reasonable security practices and notify Customer within seventy-two hours of a confirmed breach. The Agreement does not require a security certification, penetration testing, or prior notice of subprocessors.",
      "6. CONFIDENTIALITY",
      "Each party will protect Confidential Information for three years after termination. Trade secrets remain protected while they qualify as trade secrets.",
      "7. LIABILITY",
      "Each party's aggregate liability is capped at fees paid in the six months before the claim. The cap also applies to confidentiality and security breaches. Neither party is liable for consequential damages.",
      "8. TERMINATION",
      "Either party may terminate for an uncured material breach after thirty days written notice. Customer has no termination-for-convenience right, and prepaid fees are non-refundable.",
      "9. GOVERNING LAW",
      "Texas law governs this Agreement, and exclusive venue lies in Travis County, Texas.",
      "10. REVIEW GAPS",
      "The Agreement contains no indemnification obligations, data-return timeline, data-deletion commitment, disaster recovery objective, or formal notice addresses.",
    ],
  },
];

const outputDirectory = path.join(process.cwd(), "public", "samples");
const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const isHeading = (paragraph) =>
  /^\d+\./.test(paragraph) || paragraph === "INTENTIONAL REVIEW GAPS";

async function createDocx(contract) {
  const paragraphs = [contract.title, ...contract.paragraphs];
  const body = paragraphs
    .map((paragraph, index) => {
      const heading = index === 0 || isHeading(paragraph);
      const properties = heading ? '<w:pPr><w:pStyle w:val="Heading1"/></w:pPr>' : "";
      return `<w:p>${properties}<w:r><w:t xml:space="preserve">${escapeXml(paragraph)}</w:t></w:r></w:p>`;
    })
    .join("");

  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
  );
  zip.folder("_rels").file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
  );
  zip.folder("word").file(
    "document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`,
  );
  return zip.generateAsync({ type: "nodebuffer" });
}

function wrapText(text, font, fontSize, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function createPdf(contract) {
  const pdf = await PDFDocument.create();
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 54;
  let page;
  let y;

  const addPage = () => {
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
    page.drawText(`Synthetic demo contract · ${contract.filename}`, {
      x: margin,
      y: 26,
      size: 7,
      font: bodyFont,
      color: rgb(0.45, 0.45, 0.45),
    });
    page.drawText(`Page ${pdf.getPageCount()}`, {
      x: pageWidth - margin - 38,
      y: 26,
      size: 7,
      font: bodyFont,
      color: rgb(0.45, 0.45, 0.45),
    });
  };

  const drawParagraph = (text, heading = false) => {
    const font = heading ? boldFont : bodyFont;
    const size = heading ? 11 : 9.5;
    const lineHeight = heading ? 15 : 13;
    const before = heading ? 8 : 0;
    const after = heading ? 4 : 9;
    const lines = wrapText(text, font, size, pageWidth - margin * 2);

    if (y - before - lines.length * lineHeight - after < margin) addPage();
    y -= before;
    for (const line of lines) {
      page.drawText(line, { x: margin, y, size, font, color: rgb(0.12, 0.15, 0.2) });
      y -= lineHeight;
    }
    y -= after;
  };

  addPage();
  drawParagraph(contract.title, true);
  for (const paragraph of contract.paragraphs) drawParagraph(paragraph, isHeading(paragraph));
  return Buffer.from(await pdf.save());
}

await fs.mkdir(outputDirectory, { recursive: true });
for (const contract of contracts) {
  const output =
    path.extname(contract.filename).toLowerCase() === ".pdf"
      ? await createPdf(contract)
      : await createDocx(contract);
  const outputPath = path.join(outputDirectory, contract.filename);
  await fs.writeFile(outputPath, output);
  console.log(`Generated ${outputPath}`);
}
