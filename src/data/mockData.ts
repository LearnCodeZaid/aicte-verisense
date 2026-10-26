import { InstitutionalApplication } from '../types';

export const SAMPLE_APPLICATIONS: InstitutionalApplication[] = [
  {
    id: 'APP-2026-AICTE-001',
    permanentId: '1-39482910',
    applicationNumber: 'AICTE/WR/2026/EOA-001',
    instituteName: 'Pune Institute of Advanced Technology (PIAT)',
    region: 'WESTERN',
    state: 'Maharashtra',
    city: 'Pune',
    category: 'EXTENSION_OF_APPROVAL',
    academicYear: '2026-2027',
    overallComplianceScore: 78,
    riskLevel: 'MEDIUM',
    status: 'DEFICIENCIES_FLAGGED',
    terPaymentStatus: 'PAID',
    terTransactionId: 'TER-SBI-2026-98124982',
    totalStudentsIntake: 480,
    totalFacultyCount: 22,
    fsrRatio: '1:21.8', // norm is 1:20
    cadreRatio: '1:2:8', // Professor:Assoc:Asst (norm 1:2:6)
    documents: [
      {
        id: 'DOC-001',
        name: 'Fire Safety Certificate (NOC)',
        category: 'SAFETY_COMPLIANCE',
        fileName: 'PMC_Fire_Safety_NOC_2025.pdf',
        fileSize: '2.4 MB',
        uploadDate: '2026-09-12',
        expiryDate: '2026-10-10', // Expired 16 days ago!
        issuingAuthority: 'Pune Municipal Fire Brigade Department',
        issuingReferenceNumber: 'PMC/FIRE/2025/9482',
        verificationStatus: 'EXPIRED',
        statusDetails: 'Certificate expired on 10 Oct 2026. Renewal application receipt not enclosed.',
        hasTamperingAlert: false,
        aphClauseReference: 'APH 2024-27, Clause 5.4.1 (Mandatory Fire Safety Compliance)',
        extractedFields: {
          'Building Coverage': '12,450 sq. m',
          'Floors Cleared': 'G+4 Floors',
          'NOC Status': 'EXPIRED'
        }
      },
      {
        id: 'DOC-002',
        name: 'Society Registration & Land Title Deed',
        category: 'LEGAL_OWNERSHIP',
        fileName: 'Registered_Trust_Land_Deed_Pune.pdf',
        fileSize: '4.8 MB',
        uploadDate: '2026-09-10',
        issuingAuthority: 'Sub-Registrar Office, Haveli, Pune',
        issuingReferenceNumber: 'MH-HAV-2018-84920',
        verificationStatus: 'VERIFIED',
        statusDetails: 'Cryptographically matched with Maharashtra e-Mahabhulekh Land Records API.',
        hasTamperingAlert: false,
        aphClauseReference: 'APH 2024-27, Appendix 4 (Land Requirement & Ownership)',
        extractedFields: {
          'Survey No': '48/1A and 48/1B',
          'Total Area': '7.5 Acres (Contiguous)',
          'Title Status': 'Clear and Unencumbered',
          'Owner': 'Shri Chhatrapati Educational Trust'
        }
      },
      {
        id: 'DOC-003',
        name: 'AICTE Mandatory Affidavit 1 (Anti-Ragging & Norms)',
        category: 'AFFIDAVIT',
        fileName: 'Notarized_Affidavit_1_PIAT.pdf',
        fileSize: '1.2 MB',
        uploadDate: '2026-09-12',
        issuingAuthority: 'Govt Notary Advocate R. K. Deshmukh',
        issuingReferenceNumber: 'NOTARY-PUN-8492/2026',
        verificationStatus: 'VERIFIED',
        statusDetails: 'Verified via National e-Notary registry with stamp QR code.',
        hasTamperingAlert: false,
        aphClauseReference: 'APH 2024-27, Appendix 1 (Format for Affidavits)',
        extractedFields: {
          'Stamp Paper Value': 'INR 100',
          'Notary Seal Date': '08-Sep-2026',
          'Authorized Signatory': 'Dr. Prakash Joshi (Principal)'
        }
      },
      {
        id: 'DOC-004',
        name: 'Faculty Master Roster & Salary Bank Advice',
        category: 'ACADEMIC_FACULTY',
        fileName: 'Faculty_Roster_Bank_Disbursement_Aug2026.pdf',
        fileSize: '3.1 MB',
        uploadDate: '2026-09-14',
        issuingAuthority: 'Bank of Maharashtra (Institutional Branch)',
        issuingReferenceNumber: 'BOM-PUN-DISB-77291',
        verificationStatus: 'MANUAL_REVIEW_REQUIRED',
        statusDetails: 'Discrepancy: Faculty-to-Student Ratio (1:21.8) falls short of mandatory 1:20 norm.',
        hasTamperingAlert: false,
        aphClauseReference: 'APH 2024-27, Clause 4.3.2 (Cadre and FSR Ratio for Degree Tech Programs)',
        extractedFields: {
          'Approved Intake': 480,
          'Required Faculty (1:20)': 24,
          'Active Faculty': 22,
          'Deficiency Count': 2
        }
      }
    ],
    infrastructureEvidence: [
      {
        id: 'INFRA-001',
        type: 'COMPUTER_LAB',
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
        requiredMetric: 'Student-to-Computer Ratio 1:4 (Min 120 Terminals)',
        detectedCount: 38, // In this specific computer lab photo
        requiredCount: 40,
        isCompliant: false,
        aphClause: 'APH 2024-27, Clause 5.2.1 (Computer & Laboratory Terminal Norms)',
        confidenceScore: 0.94,
        boundingBoxes: [
          { label: 'Workstation Monitor', x: 120, y: 140, w: 60, h: 50, confidence: 0.96 },
          { label: 'Workstation Monitor', x: 200, y: 140, w: 60, h: 50, confidence: 0.95 },
          { label: 'Workstation Monitor', x: 280, y: 140, w: 60, h: 50, confidence: 0.94 },
          { label: 'Workstation Monitor', x: 360, y: 140, w: 60, h: 50, confidence: 0.92 },
          { label: 'Workstation Monitor', x: 440, y: 140, w: 60, h: 50, confidence: 0.95 },
          { label: 'Workstation Monitor', x: 520, y: 140, w: 60, h: 50, confidence: 0.91 },
          { label: 'Workstation Monitor', x: 600, y: 140, w: 60, h: 50, confidence: 0.93 },
          { label: 'Fire Extinguisher', x: 40, y: 80, w: 30, h: 70, confidence: 0.89 }
        ]
      },
      {
        id: 'INFRA-002',
        type: 'PWD_RAMP',
        imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1000&q=80',
        requiredMetric: 'Barrier-Free PWD Access with 1:12 slope and handrail',
        detectedCount: 1,
        requiredCount: 1,
        isCompliant: true,
        aphClause: 'APH 2024-27, Clause 5.6 (Barrier-Free Built Environment for Divyangjan)',
        confidenceScore: 0.97,
        boundingBoxes: [
          { label: 'PWD Ramp Surface', x: 100, y: 200, w: 350, h: 180, confidence: 0.97 },
          { label: 'Continuous Handrail', x: 110, y: 150, w: 330, h: 50, confidence: 0.94 },
          { label: 'Tactile Warning Surface', x: 80, y: 360, w: 120, h: 40, confidence: 0.91 }
        ]
      }
    ],
    deficiencies: [
      {
        id: 'DEF-001',
        severity: 'CRITICAL',
        category: 'SAFETY_COMPLIANCE',
        title: 'Expired Fire Safety Certificate',
        description: 'The uploaded Fire NOC (PMC/FIRE/2025/9482) expired on 10 Oct 2026. Institutional operation cannot be validated without an active fire safety audit report.',
        aphClause: 'APH 2024-27, Clause 5.4.1',
        evidenceSource: 'Document Scrutiny (PMC_Fire_Safety_NOC_2025.pdf)',
        remedyAction: 'Upload valid Fire Department Renewal Receipt or provisional NOC within 15 days.'
      },
      {
        id: 'DEF-002',
        severity: 'MAJOR',
        category: 'FACULTY_DEFICIENCY',
        title: 'Faculty Shortfall in Computer Engineering Cadre',
        description: 'Active faculty count is 22 against the prescribed requirement of 24 (shortfall of 2 Assistant Professors to satisfy 1:20 FSR).',
        aphClause: 'APH 2024-27, Clause 4.3.2',
        evidenceSource: 'Academic Faculty Audit (Faculty_Roster_Bank_Disbursement_Aug2026.pdf)',
        remedyAction: 'Submit recruitment advertisement or appointment orders for 2 qualified faculty members.'
      }
    ],
    auditLogs: [
      {
        id: 'LOG-001',
        timestamp: '2026-10-24 10:14:22',
        operatorId: 'SYSTEM_OCR_BOT',
        operatorRole: 'Automated Ingestion Worker',
        action: 'DOCUMENT_PARSED',
        targetDocumentOrField: 'PMC_Fire_Safety_NOC_2025.pdf',
        outcome: 'Flagged Expiry Date (10-Oct-2026)'
      },
      {
        id: 'LOG-002',
        timestamp: '2026-10-24 10:14:28',
        operatorId: 'SYSTEM_QR_VALIDATOR',
        operatorRole: 'Cryptographic Gateway',
        action: 'QR_QUERY_EXECUTED',
        targetDocumentOrField: 'MH-HAV-2018-84920 (Land Record)',
        outcome: 'STATUS: VERIFIED via e-Mahabhulekh Registry'
      },
      {
        id: 'LOG-003',
        timestamp: '2026-10-25 14:32:00',
        operatorId: 'OFFICER_AICTE_WRO_04',
        operatorRole: 'Regional Scrutiny Officer',
        action: 'DEFICIENCY_ENDORSED',
        targetDocumentOrField: 'Fire NOC & Faculty Cadre',
        outcome: 'Generated Show-Cause Rectification Advisory'
      }
    ]
  },
  {
    id: 'APP-2026-AICTE-002',
    permanentId: '1-84920482',
    applicationNumber: 'AICTE/NR/2026/INC-042',
    instituteName: 'Apex Institute of Technology & Management',
    region: 'NORTHERN',
    state: 'Uttar Pradesh',
    city: 'Noida',
    category: 'INCREASE_IN_INTAKE',
    academicYear: '2026-2027',
    overallComplianceScore: 42,
    riskLevel: 'CRITICAL',
    status: 'DEFICIENCIES_FLAGGED',
    terPaymentStatus: 'PAID',
    terTransactionId: 'TER-HDFC-2026-1049281',
    totalStudentsIntake: 600,
    totalFacultyCount: 18,
    fsrRatio: '1:33.3', // Extremely poor
    cadreRatio: '0:1:17', // Zero professors!
    documents: [
      {
        id: 'DOC-010',
        name: 'Land Conversion Order & Encumbrance Certificate',
        category: 'LEGAL_OWNERSHIP',
        fileName: 'Noida_Authority_Land_Allotment_2024.pdf',
        fileSize: '3.8 MB',
        uploadDate: '2026-10-02',
        issuingAuthority: 'New Okhla Industrial Development Authority (NOIDA)',
        issuingReferenceNumber: 'NOIDA/COMM/LAND/2024-9128',
        verificationStatus: 'MISMATCH_DETECTED',
        statusDetails: 'Tampering Alert: Error Level Analysis shows altered plot numbers and forged digital stamp overlay.',
        hasTamperingAlert: true,
        tamperingConfidence: 0.91,
        elaHeatmapUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        aphClauseReference: 'APH 2024-27, Appendix 4 (Authenticity of Land Documents)',
        extractedFields: {
          'Submitted Plot No': 'Plot C-14, Sector 62',
          'Authority Registered Plot': 'Plot C-12, Sector 62 (Different Allottee)',
          'ELA Tamper Score': '91.4% (Severe Inconsistency)',
          'Software Modified': 'Adobe Photoshop 24.1 (Detected in EXIF)'
        }
      },
      {
        id: 'DOC-011',
        name: 'Faculty PAN & Aadhaar Cross-Verification Roster',
        category: 'ACADEMIC_FACULTY',
        fileName: 'Faculty_KYC_Consent_Roster.pdf',
        fileSize: '2.1 MB',
        uploadDate: '2026-10-04',
        issuingAuthority: 'Income Tax Department (via NSDL)',
        issuingReferenceNumber: 'PAN-VERIFY-APEX-2026',
        verificationStatus: 'MISMATCH_DETECTED',
        statusDetails: 'Duplicate Faculty Alert: 3 Faculty PAN cards are actively registered full-time at Greater Noida College ID: 1-1928491.',
        hasTamperingAlert: true,
        tamperingConfidence: 0.88,
        aphClauseReference: 'APH 2024-27, Clause 4.3.4 (Ghost/Duplicate Faculty Penalties)',
        extractedFields: {
          'Total Declared': 18,
          'Duplicate Matches': '3 Professors (PAN: ABCDE1234F, PQRSK5678M, WXYZT9012P)',
          'Conflict College': 'Greater Noida Institute of Technology'
        }
      }
    ],
    infrastructureEvidence: [
      {
        id: 'INFRA-010',
        type: 'COMPUTER_LAB',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
        requiredMetric: 'Required 150 PCs for proposed intake increase',
        detectedCount: 14,
        requiredCount: 150,
        isCompliant: false,
        aphClause: 'APH 2024-27, Clause 5.2 (Laboratory Norms for Additional Intake)',
        confidenceScore: 0.91,
        boundingBoxes: [
          { label: 'Workstation Monitor', x: 150, y: 180, w: 70, h: 60, confidence: 0.94 },
          { label: 'Workstation Monitor', x: 260, y: 180, w: 70, h: 60, confidence: 0.92 }
        ]
      }
    ],
    deficiencies: [
      {
        id: 'DEF-010',
        severity: 'CRITICAL',
        category: 'FRAUD_TAMPERING',
        title: 'Suspected Document Tampering on Land Allotment Deed',
        description: 'Error Level Analysis (ELA) and EXIF metadata confirm image splicing and altered plot registration identifiers on NOIDA land certificate.',
        aphClause: 'APH 2024-27, Clause 1.3.1 (Misrepresentation of Essential Records)',
        evidenceSource: 'Forensic ELA Analysis (Noida_Authority_Land_Allotment_2024.pdf)',
        remedyAction: 'Refer to AICTE Standing Hearing Committee (SHC) for physical scrutiny.'
      },
      {
        id: 'DEF-011',
        severity: 'CRITICAL',
        category: 'DUPLICATE_FACULTY',
        title: '3 Faculty Registered Simultaneously at Multiple Institutions',
        description: 'PAN cross-verification detected 3 faculty members claimed as full-time regular staff who are also listed on AICTE portal for College 1-1928491.',
        aphClause: 'APH 2024-27, Clause 4.3.4',
        evidenceSource: 'Central AICTE Faculty Cross-Verification Database',
        remedyAction: 'Immediate disqualification of contested faculty; institute must show-cause.'
      }
    ],
    auditLogs: [
      {
        id: 'LOG-010',
        timestamp: '2026-10-24 16:20:11',
        operatorId: 'SYSTEM_ELA_DETECTOR',
        operatorRole: 'Image Forensics Engine',
        action: 'IMAGE_SPLICING_FLAGGED',
        targetDocumentOrField: 'Noida_Authority_Land_Allotment_2024.pdf (Page 1)',
        outcome: 'ELA Heatmap Peak Score 91.4% - Discrepant compression layers'
      },
      {
        id: 'LOG-011',
        timestamp: '2026-10-24 16:20:15',
        operatorId: 'SYSTEM_FACULTY_CROSS_MATCHER',
        operatorRole: 'AICTE Central Registry Scanner',
        action: 'PAN_COLLISION_DETECTED',
        targetDocumentOrField: 'Faculty_KYC_Consent_Roster.pdf',
        outcome: '3 Duplicate PAN Hits against Active 2026 AICTE Institutional Records'
      }
    ]
  },
  {
    id: 'APP-2026-AICTE-003',
    permanentId: '1-10294822',
    applicationNumber: 'AICTE/WR/2026/EOA-088',
    instituteName: 'Vidyavardhini College of Engineering & Technology',
    region: 'WESTERN',
    state: 'Maharashtra',
    city: 'Vasai',
    category: 'EXTENSION_OF_APPROVAL',
    academicYear: '2026-2027',
    overallComplianceScore: 98,
    riskLevel: 'LOW',
    status: 'APPROVED_RECOMMENDED',
    terPaymentStatus: 'PAID',
    terTransactionId: 'TER-ICICI-2026-0019284',
    totalStudentsIntake: 720,
    totalFacultyCount: 38,
    fsrRatio: '1:18.9', // Better than 1:20 norm
    cadreRatio: '1:2:6', // Perfect cadre
    documents: [
      {
        id: 'DOC-020',
        name: 'Fire & Life Safety Clearance Certificate',
        category: 'SAFETY_COMPLIANCE',
        fileName: 'VVCMC_Fire_NOC_2026_2027.pdf',
        fileSize: '1.9 MB',
        uploadDate: '2026-09-01',
        expiryDate: '2027-08-31',
        issuingAuthority: 'Vasai-Virar City Municipal Corporation',
        issuingReferenceNumber: 'VVCMC/FIRE/2026/1029',
        verificationStatus: 'VERIFIED',
        statusDetails: 'Digital signature verified. Municipal QR code cryptographic handshake confirmed.',
        hasTamperingAlert: false,
        aphClauseReference: 'APH 2024-27, Clause 5.4.1',
        extractedFields: {
          'Validity': 'Valid until 31-Aug-2027',
          'Coverage': '18,500 sq. m Approved',
          'Audit Signatory': 'Chief Fire Officer, VVCMC'
        }
      },
      {
        id: 'DOC-021',
        name: 'NBA Accreditation Certificate (Tier-II Accredited)',
        category: 'ACCREDITATION',
        fileName: 'NBA_Accreditation_Letter_2024_2027.pdf',
        fileSize: '2.5 MB',
        uploadDate: '2026-09-02',
        issuingAuthority: 'National Board of Accreditation (NBA)',
        issuingReferenceNumber: 'NBA/ACC/2024-ENG-819',
        verificationStatus: 'VERIFIED',
        statusDetails: 'Verified via National Academic Depository / NBA Public Registry API.',
        hasTamperingAlert: false,
        aphClauseReference: 'APH 2024-27, Chapter 3 (Accredited Institutional Privileges)',
        extractedFields: {
          'Accredited Courses': 'Computer Eng, Mech Eng, EXTC, IT',
          'Validity Period': 'Academic Years 2024-2025 to 2026-2027',
          'Score': '685 / 1000'
        }
      }
    ],
    infrastructureEvidence: [
      {
        id: 'INFRA-020',
        type: 'COMPUTER_LAB',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
        requiredMetric: 'Min 180 Terminals for 720 Intake',
        detectedCount: 195,
        requiredCount: 180,
        isCompliant: true,
        aphClause: 'APH 2024-27, Clause 5.2',
        confidenceScore: 0.98,
        boundingBoxes: [
          { label: 'Workstation Monitor', x: 80, y: 120, w: 50, h: 45, confidence: 0.98 },
          { label: 'Workstation Monitor', x: 140, y: 120, w: 50, h: 45, confidence: 0.97 },
          { label: 'Workstation Monitor', x: 200, y: 120, w: 50, h: 45, confidence: 0.99 },
          { label: 'Workstation Monitor', x: 260, y: 120, w: 50, h: 45, confidence: 0.96 }
        ]
      }
    ],
    deficiencies: [],
    auditLogs: [
      {
        id: 'LOG-020',
        timestamp: '2026-10-23 09:12:00',
        operatorId: 'SYSTEM_DIGILOCKER_GATEWAY',
        operatorRole: 'National API Gateway',
        action: 'ACCREDITATION_MATCHED',
        targetDocumentOrField: 'NBA_Accreditation_Letter_2024_2027.pdf',
        outcome: 'STATUS: VERIFIED (Source: official.nba.gov.in/registry)'
      },
      {
        id: 'LOG-021',
        timestamp: '2026-10-23 09:12:10',
        operatorId: 'SYSTEM_COMPLIANCE_EVALUATOR',
        operatorRole: 'APH Rule Engine',
        action: 'RULE_EVAL_PASSED',
        targetDocumentOrField: 'Full Application Record',
        outcome: 'Zero Deficiencies. Compliance Score 98/100. Recommended for Automated EoA Endorsement.'
      }
    ]
  }
];

export const APH_CONFIGURABLE_RULES = [
  {
    code: 'RULE-FSR',
    name: 'Faculty to Student Ratio (FSR)',
    category: 'ACADEMIC_NORMS',
    currentThreshold: 20,
    unit: 'Students per Faculty',
    aphClause: 'Clause 4.3.2',
    description: 'Undergraduate Engineering programs must maintain a minimum of 1 faculty member for every 20 students enrolled.'
  },
  {
    code: 'RULE-CADRE',
    name: 'Cadre Distribution Ratio',
    category: 'ACADEMIC_NORMS',
    currentThreshold: '1:2:6',
    unit: 'Professor : Associate : Assistant',
    aphClause: 'Clause 4.3.3',
    description: 'Mandatory cadre structure across approved academic programs.'
  },
  {
    code: 'RULE-COMP-RATIO',
    name: 'Student to Computer Terminal Ratio',
    category: 'INFRASTRUCTURE_NORMS',
    currentThreshold: 4,
    unit: 'Students per Computer',
    aphClause: 'Clause 5.2.1',
    description: 'Minimum number of internet-connected computer terminals equipped in authorized laboratories.'
  },
  {
    code: 'RULE-LAND-URBAN',
    name: 'Minimum Contiguous Land Area (Urban / Metro)',
    category: 'LAND_REQUIREMENT',
    currentThreshold: 2.5,
    unit: 'Acres',
    aphClause: 'Appendix 4.1',
    description: 'Contiguous unencumbered land parcel registered in the name of the sponsoring Trust/Society.'
  },
  {
    code: 'RULE-BARRIER-FREE',
    name: 'Barrier-Free Divyangjan Accessibility',
    category: 'INCLUSIVITY_INFRA',
    currentThreshold: 'Mandatory 1:12 Ramp + Accessible Toilet',
    unit: 'Binary (Required)',
    aphClause: 'Clause 5.6',
    description: 'Ramps, tactile tiles, lift facilities, and dedicated accessible washrooms on all academic floors.'
  }
];
