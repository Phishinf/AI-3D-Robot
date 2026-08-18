// Future Makers Pathway - Core Type Definitions (Data Model matching System Blueprint)

export type UserRole = 'student' | 'teacher' | 'curriculum_lead' | 'guardian' | 'industry_mentor' | 'district_admin';

export interface School {
  id: string;
  name: string;
  district: string;
  region: string;
  activeCohorts: string[];
}

export interface GuardianConsent {
  guardianId: string;
  guardianName: string;
  guardianEmail: string;
  studentId: string;
  consentGranted: boolean;
  grantedAt: string;
  jurisdiction: 'FERPA/COPPA (US)' | 'GDPR (EU)' | 'Taiwan Student Data Regs' | 'Hong Kong PPO';
  dataMinimizationMode: boolean;
  biometricScanConsent: boolean;
  cloudAiConsent: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  schoolId: string;
  cohort: string;
  yearLevel: 1 | 2 | 3 | 4;
  safetyCertified: boolean;
  safetyCertDate?: string;
  activeProject: string;
  goalFulfillmentScore: number; // 0-100%
  completedMilestones: number;
  totalMilestones: number;
  careerInterests: string[];
}

export interface RubricCriterion {
  id: string;
  milestoneId: string;
  criterionText: string;
  category: 'Intent & Design' | 'AI Prompting & Refinement' | 'Precision & Tolerances' | 'Fabrication & Execution' | 'Critical Reflection';
  maxPoints: number;
  descriptors: {
    points: number;
    description: string;
  }[];
}

export interface Milestone {
  id: string;
  projectId: string;
  order: number;
  title: string;
  description: string;
  yearLevel: 1 | 2 | 3 | 4;
  requiredProviderType: 'cloud_ai' | 'multi_ai' | 'scanner' | 'printer' | 'robotics' | 'cad_signoff';
  automatedSignals: {
    name: string;
    description: string;
    passed: boolean;
    timestamp?: string;
  }[];
  rubricCriteria: RubricCriterion[];
  humanSignoffRequired: boolean;
  status: 'locked' | 'in_progress' | 'ready_for_review' | 'passed' | 'revising';
  avgCompletionHoursExpected: number;
}

export interface Project {
  id: string;
  unitId: string;
  yearLevel: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  brief: string;
  milestones: Milestone[];
  toolsUsed: string[];
}

export interface Unit {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  projects: Project[];
}

export interface Module {
  id: string;
  yearLevel: 1 | 2 | 3 | 4;
  title: string;
  theme: string;
  summary: string;
  badge: string;
  units: Unit[];
}

export interface CurriculumVersion {
  version: string;
  commitHash: string;
  updatedAt: string;
  status: 'active' | 'draft_proposal' | 'archived';
  changelog: string;
  modules: Module[];
}

export interface Artifact {
  id: string;
  studentId: string;
  milestoneId: string;
  title: string;
  fileType: 'CAD (.step)' | 'Mesh (.stl/.obj)' | '3D Scan (.ply)' | 'Prompt Log' | 'Print Log' | 'Tolerance Report' | 'Signoff Sheet';
  fileSize: string;
  url: string;
  createdAt: string;
  previewUrl?: string;
  metadata: Record<string, any>;
}

export interface IterationLog {
  id: string;
  studentId: string;
  milestoneId: string;
  attemptNumber: number;
  provider: 'Meshy AI' | 'Tripo AI' | 'TRELLIS.2 (Local GPU)' | 'Hunyuan3D 2.1' | 'Bambu Lab X1-Carbon' | 'Revopoint 3D' | 'Custom CAD';
  promptOrInput: string;
  settingsUsed: string;
  outputDescription: string;
  studentReflection: string;
  aiIdentifiedDefects: string[];
  repairActionsTaken: string[];
  durationMinutes: number;
  timestamp: string;
  passedVerification: boolean;
}

export interface AssessmentRecord {
  id: string;
  submissionId: string;
  studentId: string;
  milestoneId: string;
  teacherId: string;
  teacherName: string;
  scores: {
    criterionId: string;
    pointsAwarded: number;
    feedback: string;
  }[];
  automatedSignalBonus: number; // 0 to 10
  finalScore: number;
  qualitativeFrictionNote?: string;
  assessedAt: string;
  status: 'draft' | 'published';
}

export interface TelemetryEvent {
  id: string;
  schoolId: string;
  cohort: string;
  studentId: string;
  milestoneId: string;
  yearLevel: number;
  deviceType: 'printer' | 'scanner' | 'ai_inference_cloud' | 'ai_inference_local_gpu' | 'robotics_serial';
  provider: string;
  durationSeconds: number;
  outcome: 'success' | 'failure' | 'tolerance_violation' | 'ai_hallucination_logged' | 'timeout';
  errorType?: string;
  timestamp: string;
}

export interface MilestoneChangeProposal {
  id: string;
  proposalNumber: string;
  milestoneId: string;
  milestoneTitle: string;
  yearLevel: number;
  currentCurriculumVersion: string;
  targetCurriculumVersion: string;
  status: 'draft' | 'under_review' | 'approved' | 'rejected';
  triggerReason: 'High Failure Rate (>35%)' | 'Time Outlier (+180% Avg)' | 'Vendor API Deprecated' | 'Teacher Qualitative Friction Consensus';
  supportingTelemetry: {
    avgTimeSpentHrs: number;
    expectedTimeSpentHrs: number;
    failureRatePercentage: number;
    affectedStudentsCount: number;
    topErrorSummary: string;
    teacherNotesCount: number;
  };
  proposedDiff: {
    currentText: string;
    proposedText: string;
    rubricAdjustment: string;
    rationale: string;
  };
  approvalRecord?: {
    curriculumLeadId: string;
    curriculumLeadName: string;
    decision: 'approved' | 'rejected' | 'modified';
    decisionRationale: string;
    decidedAt: string;
  };
  createdAt: string;
}

export interface DeviceRegistration {
  id: string;
  schoolId: string;
  classroom: string;
  name: string;
  type: '3d_printer' | '3d_scanner' | 'local_gpu_workstation' | 'robotics_hub';
  vendorModel: string;
  status: 'idle' | 'printing' | 'scanning' | 'computing' | 'offline' | 'error';
  ipAddress: string;
  localAgentConnected: boolean;
  currentJob?: {
    jobName: string;
    studentName: string;
    progress: number;
    timeLeftMinutes: number;
    nozzleTemp?: number;
    bedTemp?: number;
    toleranceDeltaMm?: number;
  };
}

export interface CapstoneWorkflowStep {
  stepNumber: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  completedAt?: string;
  signoffRequired: boolean;
  signoffBy?: string;
  signoffRole?: string;
  notes?: string;
}
