import React from 'react';
import {
  Building2,
  TrendingUp,
  Award,
  Users,
  Compass,
  PieChart,
  BarChart2,
  ShieldCheck,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { StudentProfile, DeviceRegistration, Module } from '../../types';

interface StakeholderPortalProps {
  students: StudentProfile[];
  devices: DeviceRegistration[];
  modules: Module[];
}

export const StakeholderPortal: React.FC<StakeholderPortalProps> = ({
  students,
  devices,
  modules
}) => {
  const avgGoalFulfillment = Math.round(
    students.reduce((a, b) => a + b.goalFulfillmentScore, 0) / (students.length || 1)
  );

  const careerFieldCounts: Record<string, { count: number; desc: string }> = {
    'Mechatronics / Field Service Technician': { count: 18, desc: 'Robotics fundamentals, diagnosis, mechanical fit & tolerance (Slide 12)' },
    'CAD / Manufacturing Technician': { count: 15, desc: 'Parametric CAD, reverse engineering, precision printing (Slide 12)' },
    'AI / Robotics Engineering (University Track)': { count: 12, desc: 'Generative pipelines, native 3D diffusion, systems thinking (Slide 12)' },
    'Or, Simply: A Lifelong Maker': { count: 24, desc: 'Question a confident machine, trust your own hands — outlasts any single job title (Slide 12)' }
  };

  const implementationPhases = [
    { phase: 'Phase 1 — Pilot', target: 'Single school, one Year-1 cohort. Entry-tier hardware only. Teacher training on core modules.' },
    { phase: 'Phase 2 — Expansion', target: 'Add Year 2 curriculum for pilot cohort. Onboard 2–3 partner schools on Year 1 track.' },
    { phase: 'Phase 3 — Full Track', target: 'First cohort reaches Years 3–4; advanced-tier hardware and industry mentorship network go live.' },
    { phase: 'Phase 4 — Regional Scale', target: 'Multi-school rollout, shared advanced-tier lab access, and a standing industry partnership board.' }
  ];

  return (
    <div className="space-y-6">
      {/* Stakeholder Executive Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold">
                STAKEHOLDER & DISTRICT REPORTING PORTAL
              </span>
              <span className="text-slate-500 text-xs font-mono">Future Makers Pathway (Junior-to-Senior)</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Why Curiosity Comes Before Career & 4-Phase Educational Rollout
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Prepared for School & District Stakeholders: A multi-year journey into how engineers think, bridging AI, 3D Printing & Digital Fabrication, and Robotics & Mechatronics.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-mono text-emerald-800 font-semibold">
              Audit Status: Verified Minor Privacy (FERPA/GDPR)
            </span>
          </div>
        </div>
      </div>

      {/* High-Level Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Cohort Pathway Retention</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">96.4%</div>
          <div className="text-[11px] text-emerald-700 font-mono mt-1 font-semibold">+3.2% vs Regional Baseline</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Overall Goal Fulfillment</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{avgGoalFulfillment}%</div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">Curiosity Spine Loop Evaluated</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Industry Mentor Commendations</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">100% Passed</div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">Working Engineers Review Panel</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Hardware Uptime (Local Gateway)</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">99.1%</div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">Entry & Advanced Tiers Active</div>
        </div>
      </div>

      {/* 4-Phase Implementation Roadmap from Slide 14 & 15 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span>Phased Implementation Roadmap (Slide 14)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {implementationPhases.map((phase, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <span className="font-bold text-xs text-slate-900">{phase.phase}</span>
              </div>
              <p className="text-xs text-slate-600 pt-1 leading-relaxed">{phase.target}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: 4-Year Cohort Progress & Career Survey Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 4-Year Cohort Progress */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>4-Year Pathway Progression & Mastery (Slides 5–9)</span>
          </h3>

          <div className="space-y-3">
            {modules.map((m) => (
              <div key={m.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{m.title}</span>
                  <span className="font-mono text-blue-700 font-bold">
                    {m.yearLevel === 1 ? '98%' : m.yearLevel === 2 ? '91%' : m.yearLevel === 3 ? '89%' : '94%'} Mastery
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{
                      width: m.yearLevel === 1 ? '98%' : m.yearLevel === 2 ? '91%' : m.yearLevel === 3 ? '89%' : '94%'
                    }}
                  />
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">{m.summary}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Career Pathway Survey Trajectories */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>Where It Can Lead: Curiosity Doesn't Expire at Graduation (Slide 12)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Beyond any job title, students leave able to question a confident machine and trust their own hands.
          </p>

          <div className="space-y-3 pt-1">
            {Object.entries(careerFieldCounts).map(([field, data]) => (
              <div key={field} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-900 font-bold">{field}</span>
                  <span className="text-blue-700 font-mono font-semibold">{data.count} Scholars</span>
                </div>
                <div className="text-[11px] text-slate-600">{data.desc}</div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mt-1">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${(data.count / 24) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
