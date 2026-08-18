import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  FileCode,
  Layers,
  History,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Share2,
  Check
} from 'lucide-react';
import { StudentProfile, IterationLog, Artifact } from '../../types';

interface IterationPortfolioProps {
  student: StudentProfile;
  iterations: IterationLog[];
  artifacts: Artifact[];
}

export const IterationPortfolio: React.FC<IterationPortfolioProps> = ({
  student,
  iterations,
  artifacts
}) => {
  const [activeTab, setActiveTab] = useState<'iterations' | 'artifacts' | 'credentials'>('iterations');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  const handleExportPortfolio = () => {
    setExporting(true);
    setTimeout(() => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ student, iterations, artifacts }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${student.name.replace(/\s+/g, '_')}_Maker_Portfolio.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setExporting(false);
    }, 600);
  };

  const handleCopyShareLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
                <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-medium">
                  Year {student.yearLevel} Scholar
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {student.cohort} &bull; Safety Certified: <strong className="text-emerald-700 font-mono">{student.safetyCertDate}</strong>
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {student.careerInterests.map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-copy-portfolio-link"
              onClick={handleCopyShareLink}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Scoped Link'}</span>
            </button>

            <button
              id="btn-export-portfolio-json"
              onClick={handleExportPortfolio}
              disabled={exporting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Compiling Package...' : 'Export Certified Portfolio'}</span>
            </button>
          </div>
        </div>

        {/* Goal-Fulfillment Summary Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-slate-500 text-[11px] font-medium font-sans">Goal-Fulfillment Index</div>
            <div className="text-xl font-bold text-blue-600 mt-0.5">{student.goalFulfillmentScore}%</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-slate-500 text-[11px] font-medium font-sans">Milestones Passed</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {student.completedMilestones} / {student.totalMilestones}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-slate-500 text-[11px] font-medium font-sans">Logged Iterations</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{iterations.length} Attempts</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-slate-500 text-[11px] font-medium font-sans">Certified Artifacts</div>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">{artifacts.length} CAD/Scans</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          id="tab-btn-iterations"
          onClick={() => setActiveTab('iterations')}
          className={`pb-2.5 px-3 text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'iterations'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4 text-blue-600" />
          <span>Iteration Timeline & Defect Log ({iterations.length})</span>
        </button>

        <button
          id="tab-btn-artifacts"
          onClick={() => setActiveTab('artifacts')}
          className={`pb-2.5 px-3 text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'artifacts'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Verified Artifact Vault ({artifacts.length})</span>
        </button>

        <button
          id="tab-btn-credentials"
          onClick={() => setActiveTab('credentials')}
          className={`pb-2.5 px-3 text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'credentials'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Rubric & Safety Credentials</span>
        </button>
      </div>

      {/* Tab 1: Iteration Timeline */}
      {activeTab === 'iterations' && (
        <div className="space-y-4">
          {iterations.map((iter) => (
            <div
              key={iter.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-blue-700 text-xs font-mono font-bold border border-slate-200">
                    Attempt #{iter.attemptNumber}
                  </span>
                  <span className="font-semibold text-sm text-slate-900">{iter.provider}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{iter.durationMinutes} mins</span>
                  </span>
                  <span>{iter.timestamp}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      iter.passedVerification
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {iter.passedVerification ? 'VERIFIED PASS' : 'REVISION REQUIRED'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-semibold uppercase text-[10px]">Prompt / Input Intent:</span>
                  <p className="text-slate-800 font-mono text-[11px] mt-1 leading-relaxed">{iter.promptOrInput}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-semibold uppercase text-[10px]">Physical / Geometric Output:</span>
                  <p className="text-slate-800 text-[11px] mt-1 leading-relaxed">{iter.outputDescription}</p>
                </div>
              </div>

              {/* Student Critical Reflection & Defects */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <div>
                  <span className="font-semibold text-slate-900">Student Critical Reflection: </span>
                  <span className="text-slate-700">{iter.studentReflection}</span>
                </div>
                {iter.aiIdentifiedDefects.length > 0 && (
                  <div className="text-[11px] text-amber-800 font-mono">
                    <strong>Defects Logged: </strong> {iter.aiIdentifiedDefects.join('; ')}
                  </div>
                )}
                {iter.repairActionsTaken.length > 0 && (
                  <div className="text-[11px] text-emerald-700 font-mono">
                    <strong>Repair Actions: </strong> {iter.repairActionsTaken.join('; ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Artifact Vault */}
      {activeTab === 'artifacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artifacts.map((art) => (
            <div
              key={art.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{art.title}</h4>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {art.fileType} &bull; {art.fileSize} &bull; {art.createdAt}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-600 space-y-1">
                {Object.entries(art.metadata).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-slate-500 capitalize">{k}:</span>
                    <span className="text-slate-800 font-medium">{String(v)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  id={`btn-download-artifact-${art.id}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Download Hash-Verified File</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Credentials */}
      {activeTab === 'credentials' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Workshop Safety Badges & Cryptographic Sign-offs</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Workshop Zero-Hazard Safety Certification</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-semibold border border-emerald-200">
                    ACTIVE
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Pass certified on emergency shutdown, PPE, composite particulate handling, and high-temp nozzle safety.
                </p>
                <div className="text-slate-500 font-mono text-[10px]">Issued: {student.safetyCertDate}</div>
              </div>

              <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">ISO 2768-m Precision Metrology Badge</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-semibold border border-blue-200">
                    VERIFIED
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Demonstrated sub-0.15mm tolerance mating fit on composite robotic end-effector fixtures.
                </p>
                <div className="text-slate-500 font-mono text-[10px]">Evaluated by: Curriculum Lead Dr. Vance</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
