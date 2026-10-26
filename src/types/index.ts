export type ApplicationCategory = 
  | 'EXTENSION_OF_APPROVAL'
  | 'NEW_INSTITUTION'
  | 'INCREASE_IN_INTAKE'
  | 'SUPERNUMERARY_SEATS'
  | 'CLOSURE_CHANGE_SITE';

export type VerificationStatus = 
  | 'VERIFIED'
  | 'MISMATCH_DETECTED'
  | 'EXPIRED'
  | 'VERIFICATION_PENDING'
  | 'SOURCE_UNAVAILABLE'
  | 'MANUAL_REVIEW_REQUIRED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DocumentItem {
  id: string;
  name: string;
  category: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  issuingAuthority: string;
  issuingReferenceNumber: string;
  verificationStatus: VerificationStatus;
  statusDetails: string;
  hasTamperingAlert: boolean;
  tamperingConfidence?: number;
  elaHeatmapUrl?: string;
  extractedFields: Record<string, string | number>;
  aphClauseReference?: string;
}

export interface InfrastructureAssetDetection {
  id: string;
  type: 'COMPUTER_LAB' | 'CLASSROOM' | 'WORKSHOP' | 'RESTROOM' | 'PWD_RAMP';
  imageUrl: string;
  requiredMetric: string;
  detectedCount: number;
  requiredCount: number;
  isCompliant: boolean;
  aphClause: string;
  confidenceScore: number;
  boundingBoxes: Array<{
    label: string;
    x: number;
    y: number;
    w: number;
    h: number;
    confidence: number;
  }>;
}

export interface DeficiencyItem {
  id: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  category: string;
  title: string;
  description: string;
  aphClause: string;
  evidenceSource: string;
  remedyAction: string;
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  operatorId: string;
  operatorRole: string;
  action: string;
  targetDocumentOrField: string;
  outcome: string;
  notes?: string;
}

export interface InstitutionalApplication {
  id: string;
  permanentId: string;
  applicationNumber: string;
  instituteName: string;
  region: 'WESTERN' | 'NORTHERN' | 'SOUTHERN' | 'EASTERN' | 'CENTRAL';
  state: string;
  city: string;
  category: ApplicationCategory;
  academicYear: string;
  overallComplianceScore: number;
  riskLevel: RiskLevel;
  status: 'PENDING_SCRUTINY' | 'DEFICIENCIES_FLAGGED' | 'SOURCE_VERIFY_PENDING' | 'APPROVED_RECOMMENDED' | 'INSPECTION_ORDERED';
  terPaymentStatus: 'PAID' | 'PENDING' | 'EXEMPTED';
  terTransactionId: string;
  totalStudentsIntake: number;
  totalFacultyCount: number;
  fsrRatio: string;
  cadreRatio: string;
  documents: DocumentItem[];
  infrastructureEvidence: InfrastructureAssetDetection[];
  deficiencies: DeficiencyItem[];
  auditLogs: AuditLogEvent[];
}
