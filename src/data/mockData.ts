import {
  StudentProfile,
  GuardianConsent,
  DeviceRegistration,
  IterationLog,
  Artifact,
  MilestoneChangeProposal,
  AssessmentRecord,
  TelemetryEvent
} from '../types';

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'std-01',
    name: 'Maya Lin Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    schoolId: 'sch-taipei-tech',
    cohort: '2026 Junior Cohort (Year 3)',
    yearLevel: 3,
    safetyCertified: true,
    safetyCertDate: '2024-09-15',
    activeProject: 'Precision Robotic End-Effector Adapter',
    goalFulfillmentScore: 94,
    completedMilestones: 7,
    totalMilestones: 8,
    careerInterests: ['Robotics Hardware Engineering', 'Generative CAD Systems', 'Medical Devices']
  },
  {
    id: 'std-02',
    name: 'Alexandre Dubois',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    schoolId: 'sch-taipei-tech',
    cohort: '2026 Senior Cohort (Year 4)',
    yearLevel: 4,
    safetyCertified: true,
    safetyCertDate: '2023-09-10',
    activeProject: 'Adaptive Bio-Robotic Prosthetic Exoskeleton Mechanism',
    goalFulfillmentScore: 98,
    completedMilestones: 10,
    totalMilestones: 11,
    careerInterests: ['Biomechatronics', 'Advanced Composite 3D Printing', 'Surgical Robotics']
  },
  {
    id: 'std-03',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    schoolId: 'sch-taipei-tech',
    cohort: '2026 Sophomore Cohort (Year 2)',
    yearLevel: 2,
    safetyCertified: true,
    safetyCertDate: '2025-09-18',
    activeProject: 'Algorithmic Form Benchmark & Mesh Repair Pipeline',
    goalFulfillmentScore: 88,
    completedMilestones: 4,
    totalMilestones: 6,
    careerInterests: ['Computational Geometry', 'Autonomous Drones', 'Industrial Design']
  },
  {
    id: 'std-04',
    name: 'Marcus Thorne',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    schoolId: 'sch-taipei-tech',
    cohort: '2026 Freshman Cohort (Year 1)',
    yearLevel: 1,
    safetyCertified: true,
    safetyCertDate: '2026-09-08',
    activeProject: 'Personal Kinetic Desk Artifact',
    goalFulfillmentScore: 82,
    completedMilestones: 2,
    totalMilestones: 4,
    careerInterests: ['Aerospace Engineering', 'Generative AI Modeling']
  }
];

export const INITIAL_DEVICES: DeviceRegistration[] = [
  {
    id: 'dev-prt-01',
    schoolId: 'sch-taipei-tech',
    classroom: 'Lab 402 — Fabrication Bay A',
    name: 'Bambu Lab X1-Carbon #1',
    type: '3d_printer',
    vendorModel: 'Bambu X1C (Dual AMS)',
    status: 'printing',
    ipAddress: '192.168.10.45',
    localAgentConnected: true,
    currentJob: {
      jobName: 'm-401-3_prosthetic_chassis_v3.gcode',
      studentName: 'Alexandre Dubois',
      progress: 68,
      timeLeftMinutes: 42,
      nozzleTemp: 245,
      bedTemp: 60,
      toleranceDeltaMm: 0.04
    }
  },
  {
    id: 'dev-prt-02',
    schoolId: 'sch-taipei-tech',
    classroom: 'Lab 402 — Fabrication Bay A',
    name: 'Bambu Lab P1S #2',
    type: '3d_printer',
    vendorModel: 'Bambu P1S',
    status: 'idle',
    ipAddress: '192.168.10.46',
    localAgentConnected: true
  },
  {
    id: 'dev-prt-03',
    schoolId: 'sch-taipei-tech',
    classroom: 'Lab 402 — Fabrication Bay B',
    name: 'Voron 2.4 (Moonraker/Klipper)',
    type: '3d_printer',
    vendorModel: 'Voron 2.4r2 350mm',
    status: 'printing',
    ipAddress: '192.168.10.51',
    localAgentConnected: true,
    currentJob: {
      jobName: 'm-301-2_motor_bracket_PETGCF.gcode',
      studentName: 'Maya Lin Chen',
      progress: 84,
      timeLeftMinutes: 18,
      nozzleTemp: 260,
      bedTemp: 90,
      toleranceDeltaMm: 0.06
    }
  },
  {
    id: 'dev-scn-01',
    schoolId: 'sch-taipei-tech',
    classroom: 'Lab 405 — Metrology & Scan Bay',
    name: 'Revopoint MetroX 3D Scanner',
    type: '3d_scanner',
    vendorModel: 'MetroX Blue Laser / Structured Light',
    status: 'idle',
    ipAddress: '192.168.10.60',
    localAgentConnected: true
  },
  {
    id: 'dev-gpu-01',
    schoolId: 'sch-taipei-tech',
    classroom: 'Server Room 410',
    name: 'Edge AI Inference Node (RTX 4090 × 2)',
    type: 'local_gpu_workstation',
    vendorModel: 'TRELLIS.2 / Hunyuan3D 2.1 Cluster',
    status: 'computing',
    ipAddress: '192.168.10.12',
    localAgentConnected: true,
    currentJob: {
      jobName: 'TRELLIS.2 Parametric Lattice Synthesis',
      studentName: 'Alexandre Dubois',
      progress: 92,
      timeLeftMinutes: 1
    }
  },
  {
    id: 'dev-rob-01',
    schoolId: 'sch-taipei-tech',
    classroom: 'Lab 408 — Mechatronics Bench',
    name: 'ROS2 Serial Micro-controller Gateway',
    type: 'robotics_hub',
    vendorModel: 'Teensy 4.1 + CAN Bus Transceiver',
    status: 'idle',
    ipAddress: '192.168.10.88',
    localAgentConnected: true
  }
];

export const INITIAL_PROPOSALS: MilestoneChangeProposal[] = [
  {
    id: 'prop-2026-001',
    proposalNumber: 'MCP-2026-04',
    milestoneId: 'm-201-2',
    milestoneTitle: 'Python Scripted Mesh Repair & Watertight Validation',
    yearLevel: 2,
    currentCurriculumVersion: 'v2.4.1',
    targetCurriculumVersion: 'v2.5.0',
    status: 'under_review',
    triggerReason: 'High Failure Rate (>35%)',
    supportingTelemetry: {
      avgTimeSpentHrs: 18.4,
      expectedTimeSpentHrs: 12.0,
      failureRatePercentage: 41.2,
      affectedStudentsCount: 28,
      topErrorSummary: 'Degenerate triangle float precision error during automated scipy KD-tree vertex merging when mesh scale is undefined.',
      teacherNotesCount: 5
    },
    proposedDiff: {
      currentText: 'Weld vertices under 0.05mm threshold without automatic unit normalization.',
      proposedText: 'Include pre-flight bounding box unit normalization (auto-scale to mm bounding box 100.0) prior to KD-tree vertex merging with adaptive tolerance delta 0.05% of diagonal.',
      rubricAdjustment: 'Update rubric criterion RC-201-2 to award 3 points specifically for dimensional unit validation before boolean repair.',
      rationale: 'Telemetry indicates 41% of students experienced silent Python kernel crashes due to unscaled mesh coordinates imported from varied cloud generation providers. Adding normalization removes tool friction while preserving mathematical rigor.'
    },
    createdAt: '2026-08-12'
  },
  {
    id: 'prop-2026-002',
    proposalNumber: 'MCP-2026-03',
    milestoneId: 'm-102-1',
    milestoneTitle: 'Design Intent Formulation & Cloud AI Generation Log',
    yearLevel: 1,
    currentCurriculumVersion: 'v2.4.0',
    targetCurriculumVersion: 'v2.4.1',
    status: 'approved',
    triggerReason: 'Vendor API Deprecated',
    supportingTelemetry: {
      avgTimeSpentHrs: 8.1,
      expectedTimeSpentHrs: 8.0,
      failureRatePercentage: 8.5,
      affectedStudentsCount: 42,
      topErrorSummary: 'Legacy Meshy v1 API endpoint deprecation; token format upgraded to v2 Bearer key schema.',
      teacherNotesCount: 2
    },
    proposedDiff: {
      currentText: 'Use Meshy v1 standard parameter prompts with manual polycount cap.',
      proposedText: 'Connect via Unified Integration Gateway AI Provider adapter supporting both Meshy v2 and Tripo v2 fallback.',
      rubricAdjustment: 'No rubric standard change; adapter config update.',
      rationale: 'Vendor upgrade without affecting learning objectives.'
    },
    approvalRecord: {
      curriculumLeadId: 'lead-dr-vance',
      curriculumLeadName: 'Dr. Evelyn Vance (Chief Curriculum Lead)',
      decision: 'approved',
      decisionRationale: 'Verified with Integration Gateway adapter. Seamless upgrade for all pilot cohorts.',
      decidedAt: '2026-08-14'
    },
    createdAt: '2026-08-09'
  }
];

export const INITIAL_GUARDIAN_CONSENTS: GuardianConsent[] = [
  {
    guardianId: 'g-01',
    guardianName: 'Dr. Winston Chen',
    guardianEmail: 'winston.chen@gmail.com',
    studentId: 'std-01',
    consentGranted: true,
    grantedAt: '2024-08-25',
    jurisdiction: 'Taiwan Student Data Regs',
    dataMinimizationMode: true,
    biometricScanConsent: true,
    cloudAiConsent: true
  },
  {
    guardianId: 'g-02',
    guardianName: 'Claire Dubois',
    guardianEmail: 'claire.dubois@wanadoo.fr',
    studentId: 'std-02',
    consentGranted: true,
    grantedAt: '2023-08-28',
    jurisdiction: 'GDPR (EU)',
    dataMinimizationMode: true,
    biometricScanConsent: true,
    cloudAiConsent: true
  },
  {
    guardianId: 'g-03',
    guardianName: 'Mikhail Rostov',
    guardianEmail: 'mikhail.rostov@outlook.com',
    studentId: 'std-03',
    consentGranted: true,
    grantedAt: '2025-08-30',
    jurisdiction: 'FERPA/COPPA (US)',
    dataMinimizationMode: true,
    biometricScanConsent: true,
    cloudAiConsent: true
  },
  {
    guardianId: 'g-04',
    guardianName: 'Sarah Thorne',
    guardianEmail: 'sarah.thorne@icloud.com',
    studentId: 'std-04',
    consentGranted: true,
    grantedAt: '2026-08-20',
    jurisdiction: 'FERPA/COPPA (US)',
    dataMinimizationMode: true,
    biometricScanConsent: false,
    cloudAiConsent: true
  }
];

export const INITIAL_ITERATIONS: IterationLog[] = [
  {
    id: 'iter-01',
    studentId: 'std-01',
    milestoneId: 'm-301-2',
    attemptNumber: 1,
    provider: 'Custom CAD',
    promptOrInput: 'Direct loft between NEMA 17 servo flange 4-hole pattern (31mm square pitch) and robotic knuckle hinge.',
    settingsUsed: 'Filament: PETG-CF, 0.16mm layer height, 4 perimeters, 40% gyroid infill',
    outputDescription: 'Printed bracket seated tightly but outer mounting pin hole pitch was 30.82mm, causing binding on M3 screw.',
    studentReflection: 'PETG-CF material shrinkage of ~0.6% was uncompensated in CAD model. Need to apply anisotropic scaling factor 1.006 in X/Y plane before slicing.',
    aiIdentifiedDefects: ['Pin pitch delta: -0.18mm (Tolerance limit: +/-0.15mm)', 'Friction binding on pin 3'],
    repairActionsTaken: ['Applied 1.006 scale factor', 'Added 0.3mm lead-in chamfer to pin holes'],
    durationMinutes: 135,
    timestamp: '2026-11-10 14:30',
    passedVerification: false
  },
  {
    id: 'iter-02',
    studentId: 'std-01',
    milestoneId: 'm-301-2',
    attemptNumber: 2,
    provider: 'Custom CAD',
    promptOrInput: 'Shrinkage-compensated CAD model v2 with lead-in chamfers and 31.18mm nominal pitch.',
    settingsUsed: 'Filament: PETG-CF, 0.12mm layer height, 5 perimeters, 45% gyroid infill',
    outputDescription: 'Printed bracket mates cleanly with micro-gauge measured pitch 31.06mm (delta +0.06mm). Snap-fit engaging with audible click.',
    studentReflection: 'Compensation worked cleanly. The lead-in chamfer guided the assembly smoothly without thread galling.',
    aiIdentifiedDefects: [],
    repairActionsTaken: ['Passed all 4 pin pitch checks', 'Zero play verified under 15N shear load'],
    durationMinutes: 140,
    timestamp: '2026-11-12 16:45',
    passedVerification: true
  },
  {
    id: 'iter-03',
    studentId: 'std-02',
    milestoneId: 'm-401-1',
    attemptNumber: 1,
    provider: 'TRELLIS.2 (Local GPU)',
    promptOrInput: 'Parametric bio-mechanical exoskeleton arm bracket with organic stress-relief voronoi lattice, ergonomic wrist cuff curvature matching scan 3D_wrist_pts.ply',
    settingsUsed: 'Guidance Scale: 7.5, Step count: 50, Voxel resolution: 512^3, Anonymized limb mesh seed',
    outputDescription: 'Generated organic lattice with high aesthetic flow, but 2 disconnected floating struts near inner wrist flexion crease.',
    studentReflection: 'TRELLIS.2 created stunning organic structural channels, but the floating struts would cause FDM nozzle collisions during supportless printing.',
    aiIdentifiedDefects: ['2 floating islands detected in mesh topology check', 'Wall thickness at inner radius was 1.6mm (below 2.0mm threshold)'],
    repairActionsTaken: ['Ran Python bridge script to weld floating struts to primary spine', 'Thickened inner wall thickness in CAD to 2.4mm'],
    durationMinutes: 45,
    timestamp: '2026-11-19 11:20',
    passedVerification: true
  }
];

export const INITIAL_ARTIFACTS: Artifact[] = [
  {
    id: 'art-01',
    studentId: 'std-01',
    milestoneId: 'm-301-1',
    title: 'NEMA17_Motor_Flange_Dense_Scan.ply',
    fileType: '3D Scan (.ply)',
    fileSize: '24.8 MB',
    url: '#',
    createdAt: '2026-11-04',
    metadata: { scanner: 'Revopoint MetroX', points: 1420000, deviationMm: 0.04 }
  },
  {
    id: 'art-02',
    studentId: 'std-01',
    milestoneId: 'm-301-2',
    title: 'Robotic_EndEffector_Bracket_v2.step',
    fileType: 'CAD (.step)',
    fileSize: '4.2 MB',
    url: '#',
    createdAt: '2026-11-12',
    metadata: { software: 'Onshape', toleranceRating: 'ISO 2768-m', passVerified: true }
  },
  {
    id: 'art-03',
    studentId: 'std-02',
    milestoneId: 'm-401-1',
    title: 'Exoskeleton_Lattice_Optimized_Mesh.stl',
    fileType: 'Mesh (.stl/.obj)',
    fileSize: '18.6 MB',
    url: '#',
    createdAt: '2026-11-20',
    metadata: { generator: 'TRELLIS.2 Edge Node', triangles: 284000, massReductionPct: 42.4 }
  },
  {
    id: 'art-04',
    studentId: 'std-02',
    milestoneId: 'm-401-2',
    title: 'PreFlight_Teacher_Signoff_Clearance_Sheet.pdf',
    fileType: 'Signoff Sheet',
    fileSize: '840 KB',
    url: '#',
    createdAt: '2026-11-25',
    metadata: { status: 'Pending Curriculum Lead Signature', teacherAssigned: 'Prof. K. Thorne' }
  }
];

export const INITIAL_TELEMETRY_LOGS: TelemetryEvent[] = [
  {
    id: 'tel-01',
    schoolId: 'sch-taipei-tech',
    cohort: '2026 Junior Cohort (Year 3)',
    studentId: 'std-01',
    milestoneId: 'm-301-2',
    yearLevel: 3,
    deviceType: 'printer',
    provider: 'Bambu Lab X1-Carbon',
    durationSeconds: 8400,
    outcome: 'success',
    timestamp: '2026-11-12 16:45'
  },
  {
    id: 'tel-02',
    schoolId: 'sch-taipei-tech',
    cohort: '2026 Senior Cohort (Year 4)',
    studentId: 'std-02',
    milestoneId: 'm-401-1',
    yearLevel: 4,
    deviceType: 'ai_inference_local_gpu',
    provider: 'TRELLIS.2 (Local GPU)',
    durationSeconds: 180,
    outcome: 'ai_hallucination_logged',
    errorType: 'Floating island defect detected and logged by student',
    timestamp: '2026-11-19 11:20'
  },
  {
    id: 'tel-03',
    schoolId: 'sch-taipei-tech',
    cohort: '2026 Sophomore Cohort (Year 2)',
    studentId: 'std-03',
    milestoneId: 'm-201-2',
    yearLevel: 2,
    deviceType: 'ai_inference_cloud',
    provider: 'Python Mesh Sandbox',
    durationSeconds: 3200,
    outcome: 'tolerance_violation',
    errorType: 'Unscaled coordinate float delta precision failure',
    timestamp: '2026-10-21 15:10'
  }
];
