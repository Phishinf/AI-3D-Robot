import React, { useState } from 'react';
import {
  Layers,
  FolderTree,
  Database,
  Cpu,
  Server,
  Network,
  GitBranch,
  Shield,
  Radio,
  Printer,
  ChevronRight,
  Code,
  Box,
  CheckCircle2,
  Terminal
} from 'lucide-react';

export const ArchitectureBlueprintView: React.FC = () => {
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('integration');

  const subsystems = [
    {
      id: 'clients',
      title: 'Clients & UI Surfaces',
      color: 'blue',
      badge: 'React 19 / Vite SPA',
      desc: 'Role-scoped web applications optimized for desktop lab stations and workshop tablets.',
      items: [
        { name: 'apps/student-app', role: 'Student Workshop Studio', path: '/src/components/student/*' },
        { name: 'apps/teacher-dashboard', role: 'Teacher & Curriculum Lead Cockpit', path: '/src/components/teacher/*' },
        { name: 'apps/stakeholder-portal', role: 'District Outcome Reporting', path: '/src/components/stakeholder/*' }
      ]
    },
    {
      id: 'core',
      title: 'Core Platform Services',
      color: 'blue',
      badge: 'TypeScript / Node Services',
      desc: 'Business logic for versioned curriculum graphs, rubric scoring, artifact storage, and the adaptation loop.',
      items: [
        { name: 'services/curriculum-engine', role: 'Git-backed Module → Unit → Project → Milestone graph', path: '/src/data/curriculumData.ts' },
        { name: 'services/portfolio-service', role: 'Artifact store, iteration logs, and 3D mesh repository', path: '/src/components/student/IterationPortfolio.tsx' },
        { name: 'services/assessment-service', role: 'Rubric criteria scoring + automated telemetry signals', path: '/src/components/teacher/RubricGradingStudio.tsx' },
        { name: 'services/analytics-engine', role: 'Trend outlier detection & Milestone Change Proposal generator', path: '/src/components/analytics/MilestoneAdaptationLoop.tsx' },
        { name: 'services/identity-service', role: 'Minor data protection, role RBAC, and guardian consent registry', path: '/src/components/teacher/GuardianPrivacyPanel.tsx' }
      ]
    },
    {
      id: 'integration',
      title: 'Integration Layer & Local Agent',
      color: 'amber',
      badge: 'Vendor-Agnostic Adapters + LAN Daemon',
      desc: 'Decouples platform from rapidly churning hardware/AI vendors. Local agent relays LAN-only devices to cloud.',
      items: [
        { name: 'ai-providers/', role: 'Unified AI Gateway (Meshy, Tripo, TRELLIS.2, Hunyuan3D)', path: '/src/components/student/AiGenerationComparator.tsx' },
        { name: 'device-providers/', role: 'Fabrication Gateway (Bambu Cloud, Moonraker/OctoPrint)', path: '/src/components/student/FabricationQueue.tsx' },
        { name: 'local-agent/printer-bridge', role: 'Classroom LAN daemon relaying local USB/MQTT printer telemetry', path: '/src/components/teacher/DeviceFleetManager.tsx' },
        { name: 'local-agent/scanner-uploader', role: 'Point cloud ingest and registered PLY mesh sync', path: '/src/components/student/CadScanVerification.tsx' },
        { name: 'lms-connectors/', role: 'Google Classroom, Canvas & Clever roster sync', path: 'OAuth2 Connectors' }
      ]
    },
    {
      id: 'data',
      title: 'Data Layer & Artifact Vault',
      color: 'emerald',
      badge: 'PostgreSQL + S3 Vault + TimeSeries Warehouse',
      desc: 'Multi-model storage architecture separating relational curriculum graphs from heavy 3D mesh files.',
      items: [
        { name: 'Profile & Curriculum DB (PostgreSQL)', role: 'Relational schema for schools, cohorts, students, rubrics', path: 'Curriculum Schema' },
        { name: 'Artifact Store (S3-Compatible Object Store)', role: 'Encrypted storage for heavy STEP, STL, and PLY scans', path: 'Object Storage' },
        { name: 'Telemetry Event Store (Pub/Sub Queue)', role: 'Append-only event stream of printer/AI durations and errors', path: 'Event Stream' },
        { name: 'Analytics Warehouse (BigQuery/Snowflake)', role: 'Periodic cohort aggregation for the adaptation loop', path: 'Milestone Analysis' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Blueprint Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold">
                SYSTEM ARCHITECTURE & REPOSITORY BLUEPRINT
              </span>
              <span className="text-slate-500 text-xs font-mono">Future Makers Pathway Standard</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              End-to-End System Blueprint & Repository Structure
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Explore the 5 interconnected architecture tiers, integration adapters, classroom local agent daemon, and git-backed curriculum data model.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 font-semibold">
              Pattern: Human-in-the-Loop Loop
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Tier Flowchart */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {subsystems.map((sub) => {
          const isSelected = selectedSubsystem === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubsystem(sub.id)}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50/40 border-blue-600 ring-1 ring-blue-500 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-blue-700 border border-slate-200">
                  {sub.badge}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{sub.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{sub.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-blue-700 font-mono font-semibold flex items-center justify-between">
                <span>{sub.items.length} Modules</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Subsystem View */}
      {(() => {
        const active = subsystems.find((s) => s.id === selectedSubsystem) || subsystems[0];
        return (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <span className="text-xs font-mono text-blue-700 font-bold uppercase">
                  Inspecting Tier: {active.title}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{active.desc}</h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs font-semibold">
                {active.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {active.items.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-xs font-mono text-slate-900">{item.name}</span>
                  </div>
                  <p className="text-xs text-slate-700">{item.role}</p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    Component: <code className="text-blue-700 font-semibold">{item.path}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Blueprint Repository Tree View */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs shadow-xs text-slate-200">
        <div className="flex items-center justify-between text-slate-300 pb-2 border-b border-slate-800">
          <span className="flex items-center space-x-2 font-bold text-slate-100">
            <FolderTree className="w-4 h-4 text-teal-400" />
            <span>Target Repository Structure (Section 7)</span>
          </span>
          <span className="text-slate-400 text-[11px]">Git-Tracked Monorepo</span>
        </div>

        <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto p-3 bg-slate-950 rounded-lg border border-slate-800">
{`future-makers-platform/
├── apps/
│   ├── student-app/                 # React web app (+ PWA wrapper for workshop tablets)
│   ├── teacher-dashboard/           # Curriculum lead + teacher console
│   └── stakeholder-portal/          # Read-only reporting for district/admin
├── services/
│   ├── curriculum-engine/           # Module/Unit/Project/Milestone graph, versioning
│   ├── portfolio-service/           # Artifacts, iteration logs
│   ├── assessment-service/          # Rubric scoring, goal-fulfillment computation
│   ├── analytics-engine/            # Telemetry aggregation, milestone-change proposals
│   ├── identity-service/            # SSO, roles, guardian consent records
│   └── integration-gateway/
│       ├── ai-providers/            # Meshy / Tripo / TRELLIS / Hunyuan3D adapters
│       ├── device-providers/        # Printer / scanner / robotics adapters
│       └── lms-connectors/          # Google Classroom / Clever / roster sync
├── local-agent/                     # Runs on a classroom machine; bridges LAN-only
│   ├── printer-bridge/              # OctoPrint / Bambu Lab / Moonraker local relay
│   ├── scanner-uploader/            # Revopoint / Einstar registered mesh sync
│   └── robotics-listener/           # Serial micro:bit / Teensy CAN-bus ROS2 listener
└── curriculum-data/                 # Git-tracked curriculum-as-data (YAML)
    ├── year-1-foundations/
    ├── year-2-applied-generation/
    ├── year-3-precision-systems/
    └── year-4-capstone/`}
        </pre>
      </div>
    </div>
  );
};
