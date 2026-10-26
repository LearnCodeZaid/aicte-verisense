import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, Loader2, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdvisoryNote } from "@/components/common/AdvisoryNote";
import { EmptyState, ErrorState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { ScoreRing } from "@/components/common/ScoreBar";
import { RiskBandPill, SeverityBadge } from "@/components/common/SeverityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { api, errorMessage } from "@/lib/api";
import { useApplication, useChecklists, useInvalidateApp, useMeta, useUpdateFinding } from "@/lib/hooks";
import { CATEGORY_LABEL, SEVERITY_ORDER } from "@/lib/labels";
import type { ApplicationCategory, ChecklistItem, Finding, FindingStatus, ValidationReport } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSetCrumb } from "../../layout/crumbs";
import { Panel } from "../../components/Panel";
import { PageSkeleton } from "../../components/Skeletons";
import { FindingCard } from "../application/FindingsTab";
import StepDetails, { formFromData, formToData, type FormState, EMPTY_FORM } from "./StepDetails";
import StepDocuments, { evaluateChecklist } from "./StepDocuments";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type StepId = "respond" | "category" | "details" | "documents" | "check";

const CATEGORY_HINT: Record<string, string> = {
  EOA: "Annual continuation of approval for an existing institution.",
  NEW_INSTITUTION: "Establish a new technical institution.",
  INTAKE_INCREASE: "Increase the approved intake of existing courses.",
  NEW_COURSE: "Introduce a new course or programme.",
  CHANGE_OF_NAME: "Change the name of the institution.",
  CHANGE_OF_SITE: "Relocate the institution to a new site.",
  CLOSURE: "Progressive or complete closure.",
};

function normaliseChecklists(raw: any): Record<string, ChecklistItem[]> {
  const out: Record<string, ChecklistItem[]> = {};
  if (!raw || typeof raw !== "object") return out;
  const src = raw.categories && typeof raw.categories === "object" ? raw.categories : raw;
  for (const [k, v] of Object.entries<any>(src)) {
    if (Array.isArray(v)) out[k] = v;
    else if (v && Array.isArray(v.items)) out[k] = v.items;
  }
  return out;
}

function currentAY() {
  const d = new Date();
  const y = d.getMonth() >= 3 ? d.getFullYear() + 1 : d.getFullYear();
  return `${y}-${String((y + 1) % 100).padStart(2, "0")}`;
}

export default function NewApplicationPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const loc = useLocation();
  const initialStep = (loc.state as { step?: StepId } | null)?.step;
  const editing = !!id;
  const appQ = useApplication(id);
  const meta = useMeta();
  const checklistsQ = useChecklists();
  const inv = useInvalidateApp();
  useSetCrumb(appQ.data?.applicationNo);

  const [category, setCategory] = useState<ApplicationCategory | null>(null);
  const [ay, setAy] = useState(currentAY());
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [step, setStep] = useState<StepId>(initialStep ?? (editing ? "details" : "category"));
  const [saving, setSaving] = useState(false);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  const app = appQ.data;
  const rectification = app?.status === "RECTIFICATION_REQUESTED";

  useEffect(() => {
    if (app && loadedId !== String(app.id)) {
      setLoadedId(String(app.id));
      setCategory(app.category);
      setAy(app.academicYear);
      setForm(formFromData(app.formData));
      if (app.status === "RECTIFICATION_REQUESTED" && !initialStep) setStep("respond");
    }
  }, [app, loadedId]);

  const steps: { id: StepId; label: string }[] = useMemo(
    () =>
      [
        rectification ? { id: "respond" as const, label: "Respond to findings" } : !editing ? { id: "category" as const, label: "Category" } : null,
        { id: "details" as const, label: "Application details" },
        { id: "documents" as const, label: "Documents" },
        { id: "check" as const, label: rectification ? "Self-check & resubmit" : "Self-check & submit" },
      ].filter(Boolean) as { id: StepId; label: string }[],
    [rectification, editing],
  );

  const checklists = normaliseChecklists(checklistsQ.data);
  const templ = category ? checklists[category] ?? [] : [];
  const metaLabel = (dt: string) => meta.data?.docTypes?.find((t) => t.id === dt)?.label;
  const liveChecklist: ChecklistItem[] = (
    app?.checklist?.length ? app.checklist.filter((c) => c.status !== "NOT_REQUIRED") : evaluateChecklist(templ, formToData(form))
  ).map((c) => ({ ...c, label: c.label || metaLabel(c.docType) || c.docType }));

  if (editing && appQ.isLoading) return <PageSkeleton />;
  if (editing && (appQ.isError || !app)) return <ErrorState error={appQ.error ?? "Application not found"} />;
  if (editing && app && app.status !== "DRAFT" && app.status !== "RECTIFICATION_REQUESTED")
    return (
      <EmptyState
        title="This application can no longer be edited"
        description="It has been submitted and is under scrutiny."
        action={<Button onClick={() => nav(`/portal/applications/${app.id}`)}>View application</Button>}
      />
    );

  const idx = steps.findIndex((s) => s.id === step);

  async function saveDetails(): Promise<boolean> {
    setSaving(true);
    try {
      const data = formToData(form);
      if (!app) {
        if (!category) throw new Error("Choose a category first");
        const created = await api.createApplication({ category, academicYear: ay, formData: data });
        inv(created.id);
        toast.success("Draft created", { description: created.applicationNo });
        nav(`/portal/applications/${created.id}/edit`, { replace: true, state: { step: "documents" } });
        return false;
      }
      await api.updateApplication(app.id, data);
      inv(app.id);
      toast.success("Details saved");
      return true;
    } catch (e) {
      toast.error("Could not save", { description: errorMessage(e) });
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function runCheck() {
    if (!app) return;
    setChecking(true);
    try {
      const r = await api.validate(app.id);
      setReport(r);
      inv(app.id);
    } catch (e) {
      toast.error("Self-check failed", { description: errorMessage(e) });
    } finally {
      setChecking(false);
    }
  }

  async function submit() {
    if (!app) return;
    setSubmitting(true);
    try {
      await api.submit(app.id);
      inv(app.id);
      toast.success(rectification ? "Application resubmitted" : "Application submitted", { description: "It is now with AICTE for scrutiny." });
      nav(`/portal/applications/${app.id}`);
    } catch (e) {
      toast.error("Submission failed", { description: errorMessage(e) });
    } finally {
      setSubmitting(false);
    }
  }

  async function next() {
    if (step === "category") {
      if (!category) return toast.error("Choose an application category");
      setStep("details");
    } else if (step === "respond") setStep("details");
    else if (step === "details") {
      const ok = await saveDetails();
      if (ok) setStep("documents");
    } else if (step === "documents") {
      setStep("check");
      runCheck();
    }
  }

  return (
    <div>
      <PageHeader
        title={app ? (rectification ? "Respond to rectification request" : "Continue application") : "New application"}
        description={
          app ? (
            <>
              <span className="mono">{app.applicationNo}</span> · {CATEGORY_LABEL[app.category]} · AY {app.academicYear}
            </>
          ) : (
            "Prepare your application, upload documents and run a self-check before submitting to AICTE."
          )
        }
        actions={app && <StatusBadge status={app.status} kind="application" size="md" />}
      />

      {/* Stepper */}
      <ol className="mb-6 flex flex-wrap items-center gap-2" aria-label="Progress">
        {steps.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          const reachable = i <= idx || (!!app && s.id !== "category");
          return (
            <li key={s.id} className="flex items-center gap-2">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => {
                  setStep(s.id);
                  if (s.id === "check" && !report) runCheck();
                }}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed",
                  active ? "border-navy bg-navy text-white" : done ? "border-green-200 bg-green-50 text-green-800" : "bg-card text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-2xs font-semibold",
                    active ? "bg-white text-navy" : done ? "bg-green-700 text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                {s.label}
              </button>
              {i < steps.length - 1 && <span className="hidden h-px w-6 bg-border sm:block" aria-hidden />}
            </li>
          );
        })}
      </ol>

      {step === "category" && (
        <div className="space-y-4">
          <Panel title="Application category" description="The category determines the required documents and the rules applied.">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="radiogroup" aria-label="Category">
              {(meta.data?.categories ?? (Object.keys(CATEGORY_LABEL) as ApplicationCategory[]).map((c) => ({ id: c, label: CATEGORY_LABEL[c] }))).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={category === c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    category === c.id ? "border-primary-600 bg-navy-50 ring-1 ring-primary-600" : "hover:border-primary-600/40",
                  )}
                >
                  <span className="block text-sm font-semibold">{c.label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{CATEGORY_HINT[c.id]}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 max-w-[200px] space-y-1.5">
              <Label htmlFor="ay">Academic year</Label>
              <Input id="ay" value={ay} onChange={(e) => setAy(e.target.value)} placeholder="2026-27" />
            </div>
          </Panel>
          {category && (
            <Panel title={`Checklist for ${CATEGORY_LABEL[category]}`} description="Documents you will need to upload. Conditional items depend on your declarations." flush>
              {checklistsQ.isLoading ? (
                <p className="p-4 text-sm text-muted-foreground">Loading checklist…</p>
              ) : templ.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No checklist configured for this category.</p>
              ) : (
                <ul className="divide-y">
                  {templ.map((c: any) => (
                    <li key={c.docType} className="flex items-start gap-3 px-4 py-2.5">
                      <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-navy" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{c.label || metaLabel(c.docType) || c.docType}</p>
                        {c.clause && <p className="text-xs text-muted-foreground">{c.clause}</p>}
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded px-1.5 py-0.5 text-2xs font-medium",
                          c.mandatory ? "bg-red-50 text-red-800" : c.when ? "bg-blue-50 text-blue-800" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {c.mandatory ? "Mandatory" : c.when ? "Conditional" : "Optional"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}
        </div>
      )}

      {step === "respond" && app && <RespondStep findings={app.findings ?? []} appId={app.id} onOpenDocument={(d) => nav(`/portal/applications/${app.id}?tab=documents&doc=${d}`)} />}

      {step === "details" && category && <StepDetails form={form} setForm={setForm} category={category} />}

      {step === "documents" && app && <StepDocuments app={app} checklist={liveChecklist} />}

      {step === "check" && app && <CheckStep report={report} checking={checking} onRerun={runCheck} />}

      {/* Footer nav */}
      <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex items-center justify-between gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <Button variant="outline" onClick={() => (idx > 0 ? setStep(steps[idx - 1].id) : nav(-1))} disabled={saving || submitting}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> {idx > 0 ? "Back" : "Cancel"}
        </Button>
        {step !== "check" ? (
          <Button onClick={next} disabled={saving || (step === "category" && !category)}>
            {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            {step === "details" ? (app ? "Save & continue" : "Create draft & continue") : step === "documents" ? "Run self-check" : "Continue"}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={submitting || checking}>
            {submitting ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Send className="mr-1.5 h-4 w-4" />}
            {rectification ? "Resubmit to AICTE" : "Submit to AICTE"}
          </Button>
        )}
      </div>
    </div>
  );
}

function CheckStep({ report, checking, onRerun }: { report: ValidationReport | null; checking: boolean; onRerun: () => void }) {
  if (checking || !report)
    return (
      <Panel title="Pre-submission self-check">
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Running checklist, rules and source verification…
        </div>
      </Panel>
    );
  const s = report.summary;
  const findings = [...(report.findings ?? [])]
    .filter((f) => f.status !== "DISMISSED" && f.status !== "RECTIFIED")
    .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));
  const missing = (report.checklist ?? []).filter((c) => c.mandatory && c.status !== "PRESENT" && c.status !== "NOT_REQUIRED");
  return (
    <div className="space-y-4">
      <Panel
        title="Pre-submission self-check"
        description="Fix issues now to avoid a deficiency letter later. You can still submit with open items."
        actions={
          <Button size="sm" variant="outline" onClick={onRerun}>
            <ShieldCheck className="mr-1.5 h-4 w-4" /> Re-run check
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-6">
          <ScoreRing value={s.complianceScore} label="Compliance score" />
          <RiskBandPill band={s.riskBand} score={s.riskScore} />
          <p className="text-sm">
            <span className="font-semibold text-red-700">{s.critical ?? 0}</span> critical ·{" "}
            <span className="font-semibold text-orange-700">{s.major ?? 0}</span> major · <span className="font-semibold">{s.minor ?? 0}</span> minor
          </p>
        </div>
        {missing.length > 0 && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
            <p className="font-semibold">Mandatory documents missing or invalid</p>
            <ul className="mt-1 list-inside list-disc text-sm">
              {missing.map((m) => (
                <li key={m.docType}>
                  {m.label} — {m.status?.toLowerCase()}
                </li>
              ))}
            </ul>
          </div>
        )}
        <AdvisoryNote className="mt-4">This self-check is indicative. AICTE scrutiny officers will review your application independently.</AdvisoryNote>
      </Panel>
      {findings.length === 0 ? (
        <EmptyState icon={Check} title="No issues found" description="Your application is ready to submit." />
      ) : (
        <div className="space-y-3">
          {findings.map((f) => (
            <FindingCard key={f.id} f={f} docName={() => undefined} onOpenDocument={() => undefined} />
          ))}
        </div>
      )}
    </div>
  );
}

function RespondStep({ findings, appId, onOpenDocument }: { findings: Finding[]; appId: string | number; onOpenDocument: (id: string | number) => void }) {
  const [pending, setPending] = useState<{ f: Finding; status: FindingStatus } | null>(null);
  const [note, setNote] = useState("");
  const m = useUpdateFinding(appId);
  const active = findings
    .filter((f) => f.status !== "DISMISSED")
    .sort((a, b) => Number(a.status === "RECTIFIED") - Number(b.status === "RECTIFIED") || SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));
  const remaining = active.filter((f) => f.status === "OPEN" || f.status === "ESCALATED").length;
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p className="font-semibold">AICTE has requested rectification</p>
        <p className="mt-0.5">
          Respond to each finding below: acknowledge it, or mark it rectified after correcting the declaration or uploading a corrected document
          in the next steps. {remaining} finding{remaining === 1 ? "" : "s"} still need a response.
        </p>
      </div>
      {active.length === 0 ? (
        <EmptyState title="No findings to respond to" />
      ) : (
        active.map((f) => (
          <FindingCard key={f.id} f={f} docName={() => undefined} onOpenDocument={onOpenDocument} onAction={(status) => setPending({ f, status })} />
        ))
      )}
      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pending?.status === "RECTIFIED" ? "Mark as rectified" : "Acknowledge finding"}</DialogTitle>
            <DialogDescription>{pending?.f.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="resp-note">
              Your response <span className="text-red-700">*</span>
            </Label>
            <Textarea id="resp-note" rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Explain what was corrected or provide context." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button
              disabled={note.trim().length < 3 || m.isPending}
              onClick={() =>
                pending &&
                m.mutate(
                  { id: pending.f.id, status: pending.status, note: note.trim() },
                  {
                    onSuccess: () => {
                      setPending(null);
                      setNote("");
                    },
                  },
                )
              }
            >
              {m.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Save response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
