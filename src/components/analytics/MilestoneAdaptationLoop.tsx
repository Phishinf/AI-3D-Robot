import React, { useState } from 'react';
import { MilestoneChangeProposal, CurriculumVersion } from '../../types';
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileDiff,
  TrendingUp,
  Activity,
  History,
  GitBranch,
  ShieldCheck,
  Check,
  Clock,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface MilestoneAdaptationLoopProps {
  proposals: MilestoneChangeProposal[];
  currentVersion: CurriculumVersion;
  onApproveProposal: (proposalId: string, leadName: string, rationale: string) => void;
  onRejectProposal: (proposalId: string, rationale: string) => void;
}

export const MilestoneAdaptationLoop: React.FC<MilestoneAdaptationLoopProps> = ({
  proposals,
  currentVersion,
  onApproveProposal,
  onRejectProposal
}) => {
  const [selectedProposal, setSelectedProposal] = useState<MilestoneChangeProposal>(proposals[0]);
  const [leadRationale, setLeadRationale] = useState<string>(
    'Approved for Year 2 Cohort 2027 rollout. Pre-flight bounding box normalization eliminates unneeded tool friction while preserving mathematical rigor.'
  );
  const [leadName, setLeadName] = useState<string>('Dr. Evelyn Vance (Chief Curriculum Lead)');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleApprove = () => {
    onApproveProposal(selectedProposal.id, leadName, leadRationale);
    setActionSuccess('Approved! New Curriculum Version staged: ' + selectedProposal.targetCurriculumVersion);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleReject = () => {
    onRejectProposal(selectedProposal.id, leadRationale);
    setActionSuccess('Proposal marked rejected with feedback rationale.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Adaptation Engine Core Principle */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold">
                HUMAN-IN-THE-LOOP ADAPTATION LOOP (SECTION 8)
              </span>
              <span className="text-slate-500 text-xs font-mono">Curriculum Version: {currentVersion.version}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Milestone-Adaptation Engine & Curriculum Change Gate
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              The system models the exact habit it teaches students: automated signals detect friction trends and propose milestone diffs, but a human Curriculum Lead must evaluate and approve before rolling out to future cohorts.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 flex items-center space-x-2 font-medium">
              <GitBranch className="w-3.5 h-3.5 text-blue-600" />
              <span>Git Commit: {currentVersion.commitHash}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptation Loop Flowchart Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="text-xs font-mono font-bold text-slate-600 uppercase mb-3">
          Continuous Adaptive Feedback Architecture
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono text-center">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <div className="text-blue-700 font-bold">1. Ingest</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Telemetry & Rubrics</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <div className="text-blue-700 font-bold">2. Detect</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Trend & Error Outliers</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-amber-300 text-slate-700">
            <div className="text-amber-700 font-bold">3. Propose</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Draft Milestone Diff</div>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-400 text-amber-900 font-bold">
            <div className="text-amber-800">4. Human Gate</div>
            <div className="text-[10px] text-amber-700 mt-0.5">Lead Review & Diff</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900">
            <div className="text-emerald-800 font-bold">5. Next Cohort</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">Isolated Rollout</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Proposals List + Detailed Diff Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Proposal List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
            Active Milestone Change Proposals
          </div>

          <div className="space-y-2.5">
            {proposals.map((prop) => {
              const isSelected = selectedProposal.id === prop.id;
              return (
                <div
                  key={prop.id}
                  id={`card-proposal-${prop.id}`}
                  onClick={() => setSelectedProposal(prop)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/40 border-blue-600 ring-1 ring-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-700">{prop.proposalNumber}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        prop.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : prop.status === 'under_review'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {prop.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-2">
                    {prop.milestoneTitle}
                  </h4>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Trigger:</span>
                      <span className="text-rose-700 font-semibold">{prop.triggerReason}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Target Version:</span>
                      <span className="text-slate-800 font-medium">{prop.targetCurriculumVersion}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Diff Viewer & Human Decision Gate */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
            {/* Proposal Details Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-blue-700">{selectedProposal.proposalNumber}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono border border-slate-200">
                    Year {selectedProposal.yearLevel} Curriculum
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedProposal.milestoneTitle}
                </h3>
              </div>

              <div className="text-right text-xs font-mono text-slate-500">
                <div>Created: {selectedProposal.createdAt}</div>
                <div className="text-blue-700 font-semibold">Target: {selectedProposal.targetCurriculumVersion}</div>
              </div>
            </div>

            {/* Supporting Telemetry Evidence Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-rose-600" />
                  <span>Telemetry Evidence & Trend Signal (Why this Proposal was Formed)</span>
                </span>
                <span className="text-rose-700 font-bold">{selectedProposal.triggerReason}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
                <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                  <div className="text-slate-500 text-[10px]">Failure Rate</div>
                  <div className="text-rose-700 font-bold text-sm mt-0.5">
                    {selectedProposal.supportingTelemetry.failureRatePercentage}%
                  </div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                  <div className="text-slate-500 text-[10px]">Avg Time Spent</div>
                  <div className="text-amber-800 font-bold text-sm mt-0.5">
                    {selectedProposal.supportingTelemetry.avgTimeSpentHrs}h (Exp: {selectedProposal.supportingTelemetry.expectedTimeSpentHrs}h)
                  </div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                  <div className="text-slate-500 text-[10px]">Affected Students</div>
                  <div className="text-slate-900 font-bold text-sm mt-0.5">
                    {selectedProposal.supportingTelemetry.affectedStudentsCount} Scholars
                  </div>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                  <div className="text-slate-500 text-[10px]">Teacher Notes</div>
                  <div className="text-blue-700 font-bold text-sm mt-0.5">
                    {selectedProposal.supportingTelemetry.teacherNotesCount} Logs
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 font-mono pt-1">
                <strong className="text-slate-800">Dominant Error Pattern:</strong> {selectedProposal.supportingTelemetry.topErrorSummary}
              </div>
            </div>

            {/* Interactive Git-Style Curriculum Text Diff */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                <span className="flex items-center space-x-1.5">
                  <FileDiff className="w-4 h-4 text-blue-600" />
                  <span>Curriculum Milestone Specification Diff</span>
                </span>
                <span className="text-slate-500 font-mono text-[11px] font-normal">
                  {selectedProposal.currentCurriculumVersion} &rarr; {selectedProposal.targetCurriculumVersion}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                {/* Current Version */}
                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
                  <div className="text-rose-700 font-bold text-[11px] flex items-center space-x-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Current Specification ({selectedProposal.currentCurriculumVersion})</span>
                  </div>
                  <p className="text-rose-950 leading-relaxed bg-white p-2.5 rounded border border-rose-200">
                    {selectedProposal.proposedDiff.currentText}
                  </p>
                </div>

                {/* Proposed Version */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="text-emerald-700 font-bold text-[11px] flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Proposed Adaptation ({selectedProposal.targetCurriculumVersion})</span>
                  </div>
                  <p className="text-emerald-950 leading-relaxed bg-white p-2.5 rounded border border-emerald-200">
                    {selectedProposal.proposedDiff.proposedText}
                  </p>
                </div>
              </div>

              {/* Rubric Adjustment Diff */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="text-blue-700 font-bold font-mono">Rubric Criterion Adjustment: </span>
                <span className="text-slate-700">{selectedProposal.proposedDiff.rubricAdjustment}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="text-amber-800 font-bold font-mono">Proposal Rationale: </span>
                <span className="text-slate-700">{selectedProposal.proposedDiff.rationale}</span>
              </div>
            </div>

            {/* Curriculum Lead Approval Form */}
            <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200 space-y-3">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Curriculum Lead Evaluation & Decision Gate</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Evaluating Lead Name:</label>
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Target Cohort Rollout:</label>
                  <input
                    type="text"
                    readOnly
                    value="Rollout to Next Year Cohort (Current Cohort Unaffected)"
                    className="w-full bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-xs mb-1 font-medium">Decision Rationale & Pedagogical Notes:</label>
                <textarea
                  rows={2}
                  value={leadRationale}
                  onChange={(e) => setLeadRationale(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 resize-none font-sans"
                />
              </div>

              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center space-x-2 font-medium">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  id="btn-reject-proposal"
                  onClick={handleReject}
                  className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition"
                >
                  Reject Proposal
                </button>
                <button
                  id="btn-approve-proposal"
                  onClick={handleApprove}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-xs transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Tag Curriculum {selectedProposal.targetCurriculumVersion}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
