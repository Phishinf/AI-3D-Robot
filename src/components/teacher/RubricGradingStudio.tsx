import React, { useState } from 'react';
import { Milestone, StudentProfile, RubricCriterion } from '../../types';
import { CheckCircle2, Award, FileText, Sparkles, MessageSquare, Send, Check, ShieldCheck, Cpu } from 'lucide-react';

interface RubricGradingStudioProps {
  milestone: Milestone;
  student: StudentProfile;
  onSaveAssessment: (record: any) => void;
}

export const RubricGradingStudio: React.FC<RubricGradingStudioProps> = ({
  milestone,
  student,
  onSaveAssessment
}) => {
  const [criterionScores, setCriterionScores] = useState<Record<string, number>>({
    [milestone.rubricCriteria[0]?.id || 'rc-1']: 10
  });
  const [criterionFeedback, setCriterionFeedback] = useState<Record<string, string>>({
    [milestone.rubricCriteria[0]?.id || 'rc-1']: 'Exemplary geometric rigor. Anisotropic shrinkage correction was precisely calculated.'
  });
  const [qualitativeFrictionNote, setQualitativeFrictionNote] = useState<string>(
    'Student encountered initial confusion when converting unstructured STL coordinates to CAD reference frames. Suggest adding pre-flight bounding box normalization in next curriculum version.'
  );
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleScoreChange = (criterionId: string, pts: number) => {
    setCriterionScores((prev) => ({ ...prev, [criterionId]: pts }));
  };

  const handleFeedbackChange = (criterionId: string, txt: string) => {
    setCriterionFeedback((prev) => ({ ...prev, [criterionId]: txt }));
  };

  // Automated Signal Bonus (e.g. Telemetry verified print completion + tolerance pass)
  const automatedBonus = milestone.automatedSignals.filter((s) => s.passed).length * 5;

  const totalRubricPoints: number = Object.keys(criterionScores).reduce(
    (sum, key) => sum + Number(criterionScores[key] || 0),
    0
  );
  const maxRubricPoints: number = (milestone.rubricCriteria || []).reduce(
    (sum, c) => sum + Number(c.maxPoints || 10),
    0
  ) || 10;
  const computedGoalFulfillment: number = Math.min(
    100,
    Math.round((totalRubricPoints / maxRubricPoints) * 90 + automatedBonus)
  );

  const handlePublishAssessment = () => {
    const record = {
      id: `ass-${Date.now()}`,
      studentId: student.id,
      milestoneId: milestone.id,
      teacherId: 'lead-dr-vance',
      teacherName: 'Dr. Evelyn Vance (Chief Curriculum Lead)',
      scores: milestone.rubricCriteria.map((c) => ({
        criterionId: c.id,
        pointsAwarded: criterionScores[c.id] || 0,
        feedback: criterionFeedback[c.id] || ''
      })),
      automatedSignalBonus: automatedBonus,
      finalScore: computedGoalFulfillment,
      qualitativeFrictionNote,
      assessedAt: new Date().toISOString().substring(0, 10),
      status: 'published'
    };

    onSaveAssessment(record);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold">
              ASSESSMENT & GOAL-FULFILLMENT ENGINE
            </span>
            <span className="text-slate-500 text-xs font-mono">Section 3.4 Architecture</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            Rubric Evaluation: {milestone.title}
          </h3>
          <p className="text-xs text-slate-500">
            Student: <strong className="text-slate-800">{student.name}</strong> &bull; Cohort: {student.cohort}
          </p>
        </div>

        {/* Real-Time Goal-Fulfillment Score Badge */}
        <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center space-x-3 self-start sm:self-auto">
          <div>
            <div className="text-[10px] text-slate-500 font-mono uppercase font-semibold">Computed Goal-Fulfillment</div>
            <div className="text-lg font-bold font-mono text-blue-600">{computedGoalFulfillment}%</div>
          </div>
          <Award className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Automated Telemetry Signals (Read-Only Machine Ingestion) */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-800 font-bold flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>Automated Hardware & API Telemetry Signals</span>
          </span>
          <span className="text-blue-700 font-bold">+{automatedBonus} pts Ingest Bonus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {milestone.automatedSignals.map((sig, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
            >
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-900">{sig.name}</div>
                <div className="text-[11px] text-slate-500">{sig.description}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                  sig.passed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {sig.passed ? 'VERIFIED' : 'PENDING'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Teacher Rubric Criteria */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 px-1">
          Teacher Rubric Scoring Criteria
        </div>

        {milestone.rubricCriteria.map((crit) => {
          const currentScore = criterionScores[crit.id] ?? crit.maxPoints;
          return (
            <div
              key={crit.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-white text-blue-700 text-[10px] font-mono border border-slate-200 font-semibold">
                    {crit.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{crit.criterionText}</h4>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-600 font-medium">Score:</span>
                  <select
                    value={currentScore}
                    onChange={(e) => handleScoreChange(crit.id, Number(e.target.value))}
                    className="bg-white border border-slate-300 text-slate-900 rounded px-2.5 py-1 text-xs font-mono font-bold focus:border-blue-500 focus:outline-none"
                  >
                    {crit.descriptors.map((d) => (
                      <option key={d.points} value={d.points}>
                        {d.points} / {crit.maxPoints} pts
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rubric Descriptors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                {crit.descriptors.map((desc) => (
                  <div
                    key={desc.points}
                    onClick={() => handleScoreChange(crit.id, desc.points)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition ${
                      currentScore === desc.points
                        ? 'bg-blue-50/60 border-blue-600 text-slate-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-mono font-bold text-blue-700 text-[11px] mb-1">
                      {desc.points} Points Descriptor:
                    </div>
                    <p className="text-[11px] leading-relaxed">{desc.description}</p>
                  </div>
                ))}
              </div>

              {/* Specific Teacher Feedback per criterion */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Criterion-Specific Teacher Assessment Feedback:
                </label>
                <input
                  type="text"
                  value={criterionFeedback[crit.id] || ''}
                  onChange={(e) => handleFeedbackChange(crit.id, e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 font-sans focus:outline-none focus:border-blue-500"
                  placeholder="Enter detailed pedagogical guidance..."
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Qualitative Friction Note (Feeds Adaptation Loop Engine) */}
      <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold">
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <span>Qualitative Teacher Friction Note (Feeds Milestone-Adaptation Engine)</span>
        </div>
        <p className="text-[11px] text-slate-600">
          Notes entered here are aggregated with telemetry to generate Milestone Change Proposals for Curriculum Lead review (Section 3.5).
        </p>
        <textarea
          rows={2}
          value={qualitativeFrictionNote}
          onChange={(e) => setQualitativeFrictionNote(e.target.value)}
          className="w-full bg-white border border-amber-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 resize-none font-sans"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-2">
        <button
          id="btn-publish-teacher-rubric"
          onClick={handlePublishAssessment}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center space-x-2 transition shadow-xs ${
            savedSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Assessment Published to Student Portfolio!</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Publish Rubric & Goal-Fulfillment Record</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
