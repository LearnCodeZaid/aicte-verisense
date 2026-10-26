import { FileText, Database, Radio, ScanSearch, Info, Gavel } from "lucide-react";
import { AdvisoryMarker } from "./Section";
import { cn } from "@/lib/utils";

export type ExampleEvidence = {
  type: "DOCUMENT" | "RECORD" | "SOURCE_RESPONSE" | "IMAGE_REGION" | "METADATA" | "RULE";
  label: string;
  detail: string;
};

export type ExampleFinding = {
  severity: "CRITICAL" | "MAJOR" | "MINOR" | "INFO";
  kind: string;
  title: string;
  reason: string;
  ruleId: string;
  clause: string;
  evidence: ExampleEvidence[];
};

const SEV: Record<ExampleFinding["severity"], string> = {
  CRITICAL: "bg-red-50 text-red-800 border-red-200",
  MAJOR: "bg-orange-50 text-orange-800 border-orange-200",
  MINOR: "bg-blue-50 text-blue-800 border-blue-200",
  INFO: "bg-slate-50 text-slate-700 border-slate-200",
};

const ICON = {
  DOCUMENT: FileText,
  RECORD: Database,
  SOURCE_RESPONSE: Radio,
  IMAGE_REGION: ScanSearch,
  METADATA: Info,
  RULE: Gavel,
} as const;

export function FindingCard({ f, className }: { f: ExampleFinding; className?: string }) {
  return (
    <article className={cn("flex h-full flex-col rounded-lg border border-slate-200 bg-white", className)}>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
        <span className={cn("rounded border px-2 py-0.5 text-[11px] font-semibold tracking-wide", SEV[f.severity])}>
          {f.severity}
        </span>
        <span className="vs-mono text-[11px] text-slate-500">{f.kind}</span>
      </div>
      <div className="flex flex-1 flex-col px-4 py-4">
        <h4 className="text-[15px] font-semibold leading-snug text-slate-900">{f.title}</h4>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.reason}</p>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Evidence</p>
        <ul className="mt-2 space-y-2">
          {f.evidence.map((e, i) => {
            const Icon = ICON[e.type];
            return (
              <li key={i} className="flex gap-2.5 rounded-md bg-[#F5F7FA] px-3 py-2 text-sm">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4E89]" aria-hidden />
                <span className="min-w-0">
                  <span className="font-medium text-slate-800">{e.label}</span>{" "}
                  <span className="break-words text-slate-600">{e.detail}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <dl className="mt-4 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs">
          <dt className="text-slate-500">Rule</dt>
          <dd className="vs-mono break-all text-slate-800">{f.ruleId}</dd>
          <dt className="text-slate-500">Clause</dt>
          <dd className="text-slate-800">{f.clause}</dd>
        </dl>
        <div className="mt-auto pt-4">
          <AdvisoryMarker />
        </div>
      </div>
    </article>
  );
}

export const EXAMPLE_FINDINGS: ExampleFinding[] = [
  {
    severity: "CRITICAL",
    kind: "EXPIRED_DOCUMENT",
    title: "Fire NOC expired 16 days before submission",
    reason:
      "The validity date extracted from the Fire NOC is earlier than the application submission date, and no renewal was uploaded.",
    ruleId: "R-EXP-001",
    clause: "APH 2024-27 (illustrative) — Ch. III, Safety norms: valid Fire NOC",
    evidence: [
      { type: "DOCUMENT", label: "FIRE_NOC p.1", detail: "“Valid upto 10/10/2026”" },
      { type: "RECORD", label: "Application", detail: "Submitted 26/10/2026" },
      { type: "SOURCE_RESPONSE", label: "Fire services (simulated)", detail: "Status EXPIRED for the same reference number" },
    ],
  },
  {
    severity: "MAJOR",
    kind: "RECORD_MISMATCH",
    title: "Declared intake differs from approved intake",
    reason:
      "The intake declared for B.Tech Computer Engineering is higher than the intake in the previous Extension of Approval, but the category is EoA, not intake increase.",
    ruleId: "R-REC-002",
    clause: "APH 2024-27 (illustrative) — Ch. I, Approved intake",
    evidence: [
      { type: "RECORD", label: "Approved programmes", detail: "B.Tech CE, intake 120 (EoA 2025-26)" },
      { type: "DOCUMENT", label: "Application form", detail: "Declared intake 180" },
    ],
  },
  {
    severity: "MAJOR",
    kind: "ANOMALY",
    title: "Possible alteration on land document, page 2",
    reason:
      "Error level analysis shows a localised region with compression behaviour different from the rest of the page, and the file was last saved by an image editor.",
    ruleId: "R-FOR-001",
    clause: "APH 2024-27 (illustrative) — Authenticity of uploaded documents",
    evidence: [
      { type: "IMAGE_REGION", label: "LAND_DOCUMENT p.2", detail: "High-ELA region around the survey number" },
      { type: "METADATA", label: "Producer", detail: "Image editing software; modified 41 days after creation" },
    ],
  },
];
