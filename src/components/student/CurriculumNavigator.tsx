import React from 'react';
import { Module, Milestone } from '../../types';
import { CheckCircle2, Circle, Lock, Clock, ChevronRight, Sparkles } from 'lucide-react';

interface CurriculumNavigatorProps {
  modules: Module[];
  selectedMilestone: Milestone | null;
  onSelectMilestone: (m: Milestone) => void;
  activeYearLevel: 1 | 2 | 3 | 4;
  onSelectYearLevel: (year: 1 | 2 | 3 | 4) => void;
}

export const CurriculumNavigator: React.FC<CurriculumNavigatorProps> = ({
  modules,
  selectedMilestone,
  onSelectMilestone,
  activeYearLevel,
  onSelectYearLevel
}) => {
  const currentModule = modules.find((m) => m.yearLevel === activeYearLevel) || modules[0];

  return (
    <div className="space-y-4">
      {/* 4-Year Pathway Level Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {modules.map((mod) => {
          const isActive = mod.yearLevel === activeYearLevel;
          return (
            <button
              key={mod.id}
              id={`btn-year-${mod.yearLevel}`}
              onClick={() => onSelectYearLevel(mod.yearLevel)}
              className={`p-3.5 rounded-xl border text-left transition ${
                isActive
                  ? 'bg-white border-blue-600 shadow-sm ring-1 ring-blue-600'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    isActive ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Year {mod.yearLevel}
                </span>
                {mod.yearLevel === 4 ? (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono font-semibold">
                    Capstone
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">Core Track</span>
                )}
              </div>
              <h4 className={`text-xs font-bold mt-2 line-clamp-1 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                {mod.badge}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{mod.theme}</p>
            </button>
          );
        })}
      </div>

      {/* Module Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase text-blue-600">Active Syllabus Module</span>
              <span className="text-slate-400 text-xs">&bull;</span>
              <span className="text-xs font-mono text-slate-500">{currentModule.id}</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{currentModule.title}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">{currentModule.summary}</p>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 self-start sm:self-auto shrink-0 font-medium">
            Version: Git-Tracked
          </span>
        </div>
      </div>

      {/* Units & Milestones List */}
      <div className="space-y-4">
        {currentModule.units.map((unit) => (
          <div key={unit.id} className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 px-1">
              {unit.title}
            </div>

            {unit.projects.map((project) => (
              <div key={project.id} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold border border-slate-200">
                      Project {project.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{project.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{project.brief}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {project.toolsUsed.map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Milestones in this Project */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  {project.milestones.map((m) => {
                    const isSelected = selectedMilestone?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        id={`milestone-item-${m.id}`}
                        onClick={() => onSelectMilestone(m)}
                        className={`p-3.5 rounded-lg border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-blue-50/40 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-0.5">
                            {m.status === 'passed' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : m.status === 'in_progress' ? (
                              <Circle className="w-4 h-4 text-amber-500 fill-amber-100" />
                            ) : m.status === 'ready_for_review' ? (
                              <Sparkles className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-900">{m.title}</span>
                              {m.humanSignoffRequired && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono font-semibold">
                                  Teacher Gate
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{m.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-xs self-end sm:self-auto shrink-0">
                          <div className="text-[11px] font-mono text-slate-500 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{m.avgCompletionHoursExpected}h</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                              m.status === 'passed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : m.status === 'ready_for_review'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : m.status === 'in_progress'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {m.status.replace('_', ' ')}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
