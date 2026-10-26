// Evaluation methodology and results. Results are transcribed from samples/evaluation.json
// (produced by the evaluation script over the synthetic dataset). null = not yet measured.

export type EvalCriterion = {
  key: string;
  name: string;
  measures: string;
  method: string;
  metric: string;
};

export const EVAL_CRITERIA: EvalCriterion[] = [
  {
    key: "extraction",
    name: "Extraction accuracy",
    measures: "How often key fields (reference number, dates, issuer, amounts, intake) are read correctly.",
    method: "Each synthetic document is generated with known ground-truth field values; the pipeline's extracted values are compared after normalisation.",
    metric: "Exact-match accuracy per field; classification accuracy per document type",
  },
  {
    key: "validation",
    name: "Validation accuracy",
    measures: "Whether the rule engine raises the findings each scenario is designed to contain, and no others.",
    method: "Every demo application lists its expected findings (kind and document type). The validator's output is compared with that list.",
    metric: "Precision, recall and F1 over expected findings",
  },
  {
    key: "anomaly",
    name: "Anomaly detection performance",
    measures: "Ability to tell tampered or duplicated documents from clean ones.",
    method: "Clean documents and tampered variants (edited regions, editing-software metadata, duplicates) are run through forensics.",
    metric: "Precision and recall on the tampered set; false-positive rate on the clean set",
  },
  {
    key: "verification",
    name: "Source-verification success rate",
    measures: "Share of verifiable documents for which the source returns a conclusive result.",
    method: "Verifiable documents are checked against the simulated authorities, with some sources deliberately offline.",
    metric: "Conclusive results / verifiable documents; distribution across the six states",
  },
  {
    key: "discrepancy",
    name: "Discrepancy reliability",
    measures: "Whether mismatches reported against source or records are real.",
    method: "Documents with planted field differences are compared with source records; reported mismatches are checked against the planted ones.",
    metric: "Precision of MISMATCH_DETECTED and RECORD_MISMATCH",
  },
  {
    key: "time",
    name: "Average verification time",
    measures: "Time from upload to a complete validation report.",
    method: "Wall-clock time of the document pipeline per file and of the full application validation, on a laptop CPU.",
    metric: "Mean and 95th percentile seconds per document and per application",
  },
  {
    key: "alerts",
    name: "Alert timeliness",
    measures: "Delay between a critical condition being detectable and the officer being alerted.",
    method: "Alerts are created inside the same validation transaction that writes the finding.",
    metric: "Seconds from submission to alert",
  },
  {
    key: "effort",
    name: "Reduction in manual effort",
    measures: "Officer time saved on preliminary scrutiny.",
    method: "Estimated from the number of checks performed automatically per application multiplied by an assumed manual time per check; stated as an estimate.",
    metric: "Estimated hours saved per application",
  },
];

export type EvalResult = { headline: string; detail?: string };

/** Filled from samples/evaluation.json. */
export const EVAL_RESULTS: Record<string, EvalResult> | null = null;

export const EVAL_DATASET: { generatedAt?: string; summary: string } = {
  summary: "Synthetic dataset of institutions, applications and documents, including tampered variants, produced by samples/tools/generate.py.",
};
