// Demo scenarios seeded into the portal. Synced with samples/scenarios.json.

export type Scenario = {
  key: string;
  category: string;
  login: string;
  title: string;
  description: string;
  expect: string[];
};

export const SCENARIOS: Scenario[] = [
  {
    key: "piat-eoa-2026",
    category: "Extension of Approval",
    login: "inst.piat",
    title: "Expired Fire NOC and faculty shortfall",
    description: "A routine EoA application with deficiencies an officer would normally find only after reading every page.",
    expect: ["Fire NOC expired before submission", "Faculty-student ratio above the configured limit", "Computer-lab photo short of the required count"],
  },
  {
    key: "apex-intake-2026",
    category: "Increase in intake",
    login: "inst.apex",
    title: "Altered land document and shared faculty",
    description: "A high-risk intake increase with signs of document alteration and faculty claimed by another institution.",
    expect: ["ELA and metadata indicators on the land document", "Duplicate faculty PAN across institutions", "Signed QR payload does not match printed values"],
  },
  {
    key: "clean-eoa-2026",
    category: "Extension of Approval",
    login: "officer.wro",
    title: "Clean application",
    description: "Every document present, current and verified at source — the baseline that shows the system does not over-flag.",
    expect: ["All checklist items present", "All verifiable documents Verified", "Low risk band"],
  },
];
