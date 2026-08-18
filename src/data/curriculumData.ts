import { CurriculumVersion, Module } from '../types';

export const INITIAL_MODULES: Module[] = [
  {
    id: 'mod-year-1',
    yearLevel: 1,
    title: 'Year 1: Foundations of Maker Intelligence',
    theme: 'Foundations & Physical-Digital Translation',
    summary: 'Workshop safety, prompt-to-physical loop, personal Object of the Year, and cloud-tier 3D generation basics.',
    badge: 'Y1 Foundations',
    units: [
      {
        id: 'u1-1',
        moduleId: 'mod-year-1',
        title: 'Unit 1: Studio Safety & Toolchain Onboarding',
        description: 'Physical lab protocols, emergency stops, basic slicer settings, and digital artifact logging.',
        projects: [
          {
            id: 'proj-101',
            unitId: 'u1-1',
            yearLevel: 1,
            title: 'Safety Certification & Slicer Telemetry',
            subtitle: 'Zero-hazard certification & automated slicer telemetry ingestion',
            brief: 'Complete hands-on safety training, pass the digital workshop exam, slice a reference calibration cube, and log machine telemetry.',
            toolsUsed: ['Bambu Lab P1S', 'Bambu Studio', 'Safety Station', 'Meshy Cloud AI'],
            milestones: [
              {
                id: 'm-101-1',
                projectId: 'proj-101',
                order: 1,
                title: 'Lab Safety Protocol & Emergency Procedure Exam',
                description: 'Demonstrate active physical emergency stop drill, PPE compliance, and zero-hazard protocol.',
                yearLevel: 1,
                requiredProviderType: 'cad_signoff',
                automatedSignals: [
                  { name: 'Safety Quiz Passing Score (100%)', description: 'Digital quiz validation via LMS', passed: true, timestamp: '2026-09-08' },
                  { name: 'Physical Station Checkoff', description: 'Badge swipe at safety hub', passed: true, timestamp: '2026-09-09' }
                ],
                rubricCriteria: [
                  {
                    id: 'rc-101-1',
                    milestoneId: 'm-101-1',
                    criterionText: 'PPE & Emergency Drill Execution',
                    category: 'Fabrication & Execution',
                    maxPoints: 10,
                    descriptors: [
                      { points: 10, description: 'Flawless execution of E-stop and material handling under 10 seconds' },
                      { points: 7, description: 'Minor delay in locating proper PPE or secondary switch' },
                      { points: 4, description: 'Required instructor prompt to follow lockdown sequence' }
                    ]
                  }
                ],
                humanSignoffRequired: true,
                status: 'passed',
                avgCompletionHoursExpected: 4
              },
              {
                id: 'm-101-2',
                projectId: 'proj-101',
                order: 2,
                title: 'Calibration Cube Fabrication & Bed Leveling Log',
                description: 'Slice, print, and measure a 20mm calibration cube to verify X/Y/Z dimension offsets within +/- 0.2mm.',
                yearLevel: 1,
                requiredProviderType: 'printer',
                automatedSignals: [
                  { name: 'Local Agent Print Completion', description: 'OctoPrint/Bambu job telemetry sent', passed: true, timestamp: '2026-09-12' },
                  { name: 'Temperature Stability Signal', description: 'Nozzle temp variance < 2°C', passed: true, timestamp: '2026-09-12' }
                ],
                rubricCriteria: [
                  {
                    id: 'rc-101-2',
                    milestoneId: 'm-101-2',
                    criterionText: 'Dimensional Accuracy & Bed Adhesion',
                    category: 'Precision & Tolerances',
                    maxPoints: 10,
                    descriptors: [
                      { points: 10, description: 'Cube dimensions within 0.1mm tolerance with zero warping or elephant foot' },
                      { points: 7, description: 'Slight corner lift or 0.2-0.3mm deviation' },
                      { points: 4, description: 'Visible layer shifting or stringing requiring reslice' }
                    ]
                  }
                ],
                humanSignoffRequired: false,
                status: 'passed',
                avgCompletionHoursExpected: 6
              }
            ]
          }
        ]
      },
      {
        id: 'u1-2',
        moduleId: 'mod-year-1',
        title: 'Unit 2: The Object of the Year (Cloud AI to Physical)',
        description: 'Iterative design of a personal desk talisman bridging cloud 3D generation and FDM 3D printing.',
        projects: [
          {
            id: 'proj-102',
            unitId: 'u1-2',
            yearLevel: 1,
            title: 'Personal Kinetic Desk Artifact',
            subtitle: 'AI prompt generation, geometric simplification, and print optimization',
            brief: 'Formulate design intent, generate initial mesh using Meshy AI, log defects (non-manifold geometry, floating islands), simplify for supportless printing, and fabricate.',
            toolsUsed: ['Meshy AI Cloud', 'Bambu Studio', 'Digital Calipers'],
            milestones: [
              {
                id: 'm-102-1',
                projectId: 'proj-102',
                order: 1,
                title: 'Design Intent Formulation & Cloud AI Generation Log',
                description: 'Write detailed prompt parameters, generate 3 candidates in Meshy AI, and document generation limitations.',
                yearLevel: 1,
                requiredProviderType: 'cloud_ai',
                automatedSignals: [
                  { name: 'Cloud API Ingestion', description: '3 generation attempts logged with seed metadata', passed: true, timestamp: '2026-09-20' },
                  { name: 'Polygon Count Telemetry', description: 'Mesh polycount < 150,000 tris', passed: true, timestamp: '2026-09-20' }
                ],
                rubricCriteria: [
                  {
                    id: 'rc-102-1',
                    milestoneId: 'm-102-1',
                    criterionText: 'Human Intent vs Model Interpretation Analysis',
                    category: 'AI Prompting & Refinement',
                    maxPoints: 10,
                    descriptors: [
                      { points: 10, description: 'Deep analysis of AI mesh defects vs intended physics; clear prompt refinement path' },
                      { points: 7, description: 'Basic description of generation failures with partial prompt iteration' },
                      { points: 4, description: 'Passive acceptance of first AI output without critique' }
                    ]
                  }
                ],
                humanSignoffRequired: false,
                status: 'passed',
                avgCompletionHoursExpected: 8
              },
              {
                id: 'm-102-2',
                projectId: 'proj-102',
                order: 2,
                title: 'Mesh Slicing Optimization & Final Physical Print',
                description: 'Orient part for overhang minimization (<45°), configure infill density, and record final print metrics.',
                yearLevel: 1,
                requiredProviderType: 'printer',
                automatedSignals: [
                  { name: 'Print Telemetry Signal', description: 'Job duration 2h 45m; zero print halts', passed: true, timestamp: '2026-09-28' }
                ],
                rubricCriteria: [
                  {
                    id: 'rc-102-2',
                    milestoneId: 'm-102-2',
                    criterionText: 'Surface Quality & Functional Overhangs',
                    category: 'Fabrication & Execution',
                    maxPoints: 10,
                    descriptors: [
                      { points: 10, description: 'Flawless overhang finish with smooth layer transitions and stable base' },
                      { points: 7, description: 'Minor sag on extreme bridges requiring minor post-processing' }
                    ]
                  }
                ],
                humanSignoffRequired: true,
                status: 'passed',
                avgCompletionHoursExpected: 10
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-year-2',
    yearLevel: 2,
    title: 'Year 2: Applied Generation & Mesh Topology',
    theme: 'Multi-Provider Evaluation, Mesh Repair & Sandboxed Scripting',
    summary: 'Side-by-side multi-provider comparison (Meshy vs Tripo vs TRELLIS.2), mesh repair pipelines, and Python sandbox scripting.',
    badge: 'Y2 Applied Gen',
    units: [
      {
        id: 'u2-1',
        moduleId: 'mod-year-2',
        title: 'Unit 1: Multi-Provider AI Topology Comparison',
        description: 'Benchmark generative AI models for geometric manifoldness, watertightness, and topology efficiency.',
        projects: [
          {
            id: 'proj-201',
            unitId: 'u2-1',
            yearLevel: 2,
            title: 'Algorithmic Form Benchmark & Mesh Repair Pipeline',
            subtitle: 'Comparative topology analysis across cloud and local GPU generation pipelines',
            brief: 'Feed identical parametric prompts to Meshy AI, Tripo AI, and TRELLIS.2. Inspect non-manifold edges, self-intersections, run automated repair scripts in Python, and log all topology metrics.',
            toolsUsed: ['Meshy AI', 'Tripo AI', 'TRELLIS.2 (Local GPU)', 'Python Mesh Sandbox', 'Blender / MeshLab'],
            milestones: [
              {
                id: 'm-201-1',
                projectId: 'proj-201',
                order: 1,
                title: 'Multi-Provider Generation Matrix & Defect Audit',
                description: 'Generate 3 comparative meshes with standardized seed; execute automated watertightness check; document non-manifold faces.',
                yearLevel: 2,
                requiredProviderType: 'multi_ai',
                automatedSignals: [
                  { name: 'Multi-Provider Ingest Event', description: 'Captured 3 provider outputs via Integration Gateway', passed: true, timestamp: '2026-10-14' },
                  { name: 'Automated Topology Check', description: 'Watertightness: Tripo 94%, Meshy 88%, TRELLIS 99%', passed: true, timestamp: '2026-10-14' }
                ],
                rubricCriteria: [
                  {
                    id: 'rc-201-1',
                    milestoneId: 'm-201-1',
                    criterionText: 'Comparative Defect Taxonomy & Provider Evaluation',
                    category: 'AI Prompting & Refinement',
                    maxPoints: 10,
                    descriptors: [
                      { points: 10, description: 'Exemplary taxonomy categorizing topological errors (inverted normals, non-manifold vertices, degenerated triangles)' },
                      { points: 7, description: 'Good comparison of triangle count and general visual fidelity' },
                      { points: 4, description: 'Superficial visual comparison without geometric rigor' }
                    ]
                  }
                ],
                humanSignoffRequired: false,
                status: 'passed',
                avgCompletionHoursExpected: 8
              },
              {
                id: 'm-201-2',
                projectId: 'proj-201',
                order: 2,
                title: 'Python Scripted Mesh Repair & Watertight Validation',
                description: 'Write Python script to remesh, weld vertices under 0.05mm threshold, recalculate normals, and verify manifold geometry.',
                yearLevel: 2,
                requiredProviderType: 'multi_ai',
                automatedSignals: [
                  { name: 'Sandbox Code Execution', description: 'Python script executed in isolated sandbox with 0 errors', passed: true, timestamp: '2026-10-22' },
                  { name: 'Manifold Verification Signal', description: 'Non-manifold edges reduced to 0', passed: true, timestamp: '2026-10-22' }
                ],
                rubricCriteria: [
                  {
                    id: 'rc-201-2',
                    milestoneId: 'm-201-2',
                    criterionText: 'Algorithmic Mesh Repair Quality & Script Cleanliness',
                    category: 'Precision & Tolerances',
                    maxPoints: 10,
                    descriptors: [
                      { points: 10, description: 'Fully automated Python pipeline producing 100% watertight mesh with optimal quad/tri distribution' },
                      { points: 7, description: 'Script runs with minor manual intervention required for extreme sharp angles' }
                    ]
                  }
                ],
                humanSignoffRequired: true,
                status: 'in_progress',
                avgCompletionHoursExpected: 12
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-year-3',
    yearLevel: 3,
    title: 'Year 3: Precision, Systems & Hardware Telemetry',
    theme: '3D Optical Scanning, CAD Fit Tolerances & Robotics Kinematics',
    summary: 'Reverse engineering with 3D scanners, sub-millimeter mating tolerances (+/- 0.15mm), and real-time robotics sensor/actuator telemetry.',
    badge: 'Y3 Precision Systems',
    units: [
      {
        id: 'u3-1',
        moduleId: 'mod-year-3',
        title: 'Unit 1: Optical Scan Ingestion & Reverse Engineering',
        description: 'High-density structured light scanning, point cloud mesh reconstruction, and mating part CAD alignment.',
        projects: [
          {
            id: 'proj-301',
            unitId: 'u3-1',
            yearLevel: 3,
            title: 'Precision Robotic End-Effector Adapter',
            subtitle: 'Reverse engineering physical motor mounts & verified interference checking',
            brief: '3D scan an industrial servo motor flange with structured light scanner, extract mounting hole pitch and keyway dimensions in CAD, design an interlocking end-effector bracket, and verify physical fit with digital caliper tolerances.',
            toolsUsed: ['Revopoint 3D Scanner', 'Onshape / Fusion 360', 'Bambu X1-Carbon (PETG-CF)', 'Digital Caliper / Micro-gauge'],
            milestones: [
              {
                id: 'm-301-1',
                projectId: 'proj-301',
                order: 1,
                title: 'High-Density 3D Scan Ingestion & Alignment Registration',
                description: 'Scan physical mating motor housing, align multi-pass point clouds, and export registered mesh with < 0.08mm deviation.',
                yearLevel: 3,
                requiredProviderType: 'scanner',
                automatedSignals: [
                  { name: 'Local Agent Scan Ingestion', description: 'Transferred 24MB registered PLY file to Artifact Store', passed: true, timestamp: '2026-11-04' },
                  { name: 'Point Density Check', description: 'Point density > 120 pts/mm²', passed: true, timestamp: '2026-11-04' }
                ],
                rubricCriteria: [
                  {
                    id: 'rc-301-1',
                    milestoneId: 'm-301-1',
                    criterionText: 'Scan Resolution & Alignment Registration',
                    category: 'Precision & Tolerances',
                    maxPoints: 10,
                    descriptors: [
                      { points: 10, description: 'Zero alignment drift; clear feature edge recognition on mounting flanges' },
                      { points: 7, description: 'Minor noise in deep hole recesses but usable feature boundaries' }
                    ]
                  }
                ],
                humanSignoffRequired: false,
                status: 'passed',
                avgCompletionHoursExpected: 10
              },
              {
                id: 'm-301-2',
                projectId: 'proj-301',
                order: 2,
                title: 'CAD Fit Verification & Quantitative Tolerance Measurement',
                description: 'Fabricate mating bracket in engineering filament, log caliper measurements across 4 mounting pins, and verify snap-fit tolerance within +/- 0.15mm.',
                yearLevel: 3,
                requiredProviderType: 'cad_signoff',
                automatedSignals: [
                  { name: 'Tolerance Verification Checksum', description: 'Measured pin pitch delta: +0.06mm (within limit)', passed: true, timestamp: '2026-11-12' },
                  { name: 'PETG-CF Print Telemetry', description: 'Chamber temp 50°C, 0 warping detected', passed: true, timestamp: '2026-11-12' }
                ],
                rubricCriteria: [
                  {
                    id: 'rc-301-2',
                    milestoneId: 'm-301-2',
                    criterionText: 'Mechanical Fit & Interference Analysis',
                    category: 'Precision & Tolerances',
                    maxPoints: 10,
                    descriptors: [
                      { points: 10, description: 'Snug mechanical engagement with zero play, exact fastener concentricity, and stress-free seating' },
                      { points: 7, description: 'Functional fit with slight friction requiring minor reaming' }
                    ]
                  }
                ],
                humanSignoffRequired: true,
                status: 'ready_for_review',
                avgCompletionHoursExpected: 14
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-year-4',
    yearLevel: 4,
    title: 'Year 4: Capstone, Career Pathway & Industry Review',
    theme: 'End-to-End Orchestrated Pipeline, Industry Mentorship & Certified Portfolio',
    summary: 'Complete 5-stage workflow (Scan → AI Fill → Human Verification Gate → Print → Install), industry mentor review, and exportable career pathway portfolio.',
    badge: 'Y4 Capstone & Career',
    units: [
      {
        id: 'u4-1',
        moduleId: 'mod-year-4',
        title: 'Unit 1: Industrial Capstone System Deployment',
        description: 'End-to-end integration of generative design, robotic actuators, physical verification gates, and external mentor evaluation.',
        projects: [
          {
            id: 'proj-401',
            unitId: 'u4-1',
            yearLevel: 4,
            title: 'Adaptive Bio-Robotic Prosthetic Exoskeleton Mechanism',
            subtitle: '5-Stage full workflow orchestration with mandatory human teacher verification gate',
            brief: 'Scan subject anatomy, apply AI generative lattice infill for lightweight topology optimization, execute rigorous CAD clearance and finite element verification, pass human teacher sign-off gate before fabrication, 3D print in multi-material composite, and install.',
            toolsUsed: ['Revopoint MetroX', 'TRELLIS.2 / Hunyuan3D', 'Ansys / Fusion FEA', 'Bambu X1-Carbon Multi-Material', 'ROS2 Serial Controller'],
            milestones: [
              {
                id: 'm-401-1',
                projectId: 'proj-401',
                order: 1,
                title: 'Subject Anatomical Scan & AI Generative Infill Synthesis',
                description: 'Capture 3D scan of mating limb geometry, generate weight-reduced internal lattice using AI topology engine, and compute stress distribution.',
                yearLevel: 4,
                requiredProviderType: 'multi_ai',
                automatedSignals: [
                  { name: 'Scan Upload & Encryption Check', description: 'Minor data anonymization & encrypted storage confirmed', passed: true, timestamp: '2026-11-20' },
                  { name: 'AI Weight Reduction Signal', description: 'Mass reduced by 42.4% while maintaining 180N load rating', passed: true, timestamp: '2026-11-20' }
                ],
                rubricCriteria: [
                  {
                    id: 'rc-401-1',
                    milestoneId: 'm-401-1',
                    criterionText: 'Generative Optimization & Biomechanical Intent',
                    category: 'Intent & Design',
                    maxPoints: 10,
                    descriptors: [
                      { points: 10, description: 'Innovative lattice density gradation matching organic stress lines with ergonomic contouring' },
                      { points: 7, description: 'Uniform infill reduction with basic ergonomic fit' }
                    ]
                  }
                ],
                humanSignoffRequired: false,
                status: 'passed',
                avgCompletionHoursExpected: 16
              },
              {
                id: 'm-401-2',
                projectId: 'proj-401',
                order: 2,
                title: 'MANDATORY Human Verification Gate & Tolerance Sign-off',
                description: 'Pre-fabrication safety and fit verification. Teacher/Curriculum Lead must inspect tolerance margins (+/- 0.15mm) and approve sign-off before printer dispatch.',
                yearLevel: 4,
                requiredProviderType: 'cad_signoff',
                automatedSignals: [
                  { name: 'Automated Collision & Wall Thickness Check', description: 'Minimum wall thickness: 2.4mm (Threshold: 2.0mm)', passed: true, timestamp: '2026-11-25' },
                  { name: 'Teacher Gate Clearance', description: 'Pending Curriculum Lead digital signature', passed: false }
                ],
                rubricCriteria: [
                  {
                    id: 'rc-401-2',
                    milestoneId: 'm-401-2',
                    criterionText: 'Pre-Flight Safety, Clearance & Defect Risk Analysis',
                    category: 'Precision & Tolerances',
                    maxPoints: 10,
                    descriptors: [
                      { points: 10, description: 'Exhaustive pre-flight tolerance validation, fail-safe mechanical stops, and documented risk mitigation' },
                      { points: 7, description: 'Adequate clearance analysis with minor unnoted edge chamfering' },
                      { points: 4, description: 'High risk of binding or collision during actuation' }
                    ]
                  }
                ],
                humanSignoffRequired: true,
                status: 'ready_for_review',
                avgCompletionHoursExpected: 12
              },
              {
                id: 'm-401-3',
                projectId: 'proj-401',
                order: 3,
                title: 'Multi-Material Fabrication, Assembly & Hardware Installation',
                description: 'Print compliant hinges in TPU 95A and structural frame in Carbon-PETG; assemble fasteners; log sensor serial telemetry.',
                yearLevel: 4,
                requiredProviderType: 'printer',
                automatedSignals: [
                  { name: 'Bambu Cloud Print Ingestion', description: 'Dual-material 14h print completed with 0 errors', passed: true, timestamp: '2026-12-02' },
                  { name: 'ROS2 Actuator Angle Telemetry', description: 'Range of motion: 112 degrees (Target: 110)', passed: true, timestamp: '2026-12-02' }
                ],
                rubricCriteria: [
                  {
                    id: 'rc-401-3',
                    milestoneId: 'm-401-3',
                    criterionText: 'System Integration & Functional Actuation',
                    category: 'Fabrication & Execution',
                    maxPoints: 10,
                    descriptors: [
                      { points: 10, description: 'Seamless multi-material bonding, smooth low-latency robotic actuation, and robust mechanical performance' },
                      { points: 7, description: 'Good mechanical assembly with slight friction at full extension' }
                    ]
                  }
                ],
                humanSignoffRequired: true,
                status: 'in_progress',
                avgCompletionHoursExpected: 24
              }
            ]
          }
        ]
      }
    ]
  }
];

export const CURRENT_CURRICULUM_VERSION: CurriculumVersion = {
  version: 'v2.4.1-stable',
  commitHash: '7f9c2d1',
  updatedAt: '2026-08-10',
  status: 'active',
  changelog: 'Refined Year 2 Python mesh remeshing thresholds; added local GPU TRELLIS.2 provider adapter to integration gateway.',
  modules: INITIAL_MODULES
};
