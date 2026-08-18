import React, { useState } from 'react';
import {
  StudentProfile,
  Module,
  Milestone,
  DeviceRegistration,
  IterationLog,
  Artifact
} from '../../types';
import {
  BookOpen,
  Sparkles,
  Printer,
  Compass,
  Award,
  Layers,
  CheckCircle2,
  Lock,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CurriculumNavigator } from './CurriculumNavigator';
import { AiGenerationComparator } from './AiGenerationComparator';
import { FabricationQueue } from './FabricationQueue';
import { CadScanVerification } from './CadScanVerification';
import { CapstoneWorkflow } from './CapstoneWorkflow';
import { IterationPortfolio } from './IterationPortfolio';

interface StudentWorkshopProps {
  student: StudentProfile;
  modules: Module[];
  devices: DeviceRegistration[];
  iterations: IterationLog[];
  artifacts: Artifact[];
  onLogIteration: (log: IterationLog) => void;
}

export const StudentWorkshop: React.FC<StudentWorkshopProps> = ({
  student,
  modules,
  devices,
  iterations,
  artifacts,
  onLogIteration
}) => {
  const [activeYearLevel, setActiveYearLevel] = useState<1 | 2 | 3 | 4>(student.yearLevel);
  const [activeView, setActiveView] = useState<'pathway' | 'ai_gen' | 'fabrication' | 'metrology' | 'capstone' | 'portfolio'>('pathway');

  const currentModule = modules.find((m) => m.yearLevel === activeYearLevel) || modules[0];
  const initialMilestone = currentModule.units[0]?.projects[0]?.milestones[0] || null;
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(initialMilestone);

  const handleSelectMilestone = (m: Milestone) => {
    setSelectedMilestone(m);
    // Route to appropriate workshop tool based on milestone requirements
    if (m.requiredProviderType === 'multi_ai' || m.requiredProviderType === 'cloud_ai') {
      setActiveView('ai_gen');
    } else if (m.requiredProviderType === 'printer') {
      setActiveView('fabrication');
    } else if (m.requiredProviderType === 'scanner' || m.requiredProviderType === 'cad_signoff') {
      if (m.yearLevel === 4) {
        setActiveView('capstone');
      } else {
        setActiveView('metrology');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Workshop Top Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">{student.name}</h2>
                <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-medium">
                  Year {student.yearLevel} Pathway Scholar
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Active Project: <strong className="text-slate-800 font-semibold">{student.activeProject}</strong>
              </p>
            </div>
          </div>

          {/* Quick Tool Switcher Pills */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs font-medium">
            <button
              id="subtab-pathway"
              onClick={() => setActiveView('pathway')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                activeView === 'pathway'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum Graph</span>
            </button>

            <button
              id="subtab-ai-gen"
              onClick={() => setActiveView('ai_gen')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                activeView === 'ai_gen'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D AI Studio</span>
            </button>

            <button
              id="subtab-fabrication"
              onClick={() => setActiveView('fabrication')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                activeView === 'fabrication'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Fabrication Bridge</span>
            </button>

            <button
              id="subtab-metrology"
              onClick={() => setActiveView('metrology')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                activeView === 'metrology'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Scan & Tolerance</span>
            </button>

            <button
              id="subtab-capstone"
              onClick={() => setActiveView('capstone')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                activeView === 'capstone'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:text-amber-900 border border-amber-200 hover:bg-amber-100/80'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Capstone Gate</span>
            </button>

            <button
              id="subtab-portfolio"
              onClick={() => setActiveView('portfolio')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                activeView === 'portfolio'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Portfolio ({iterations.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Active Surface */}
      {activeView === 'pathway' && (
        <CurriculumNavigator
          modules={modules}
          selectedMilestone={selectedMilestone}
          onSelectMilestone={handleSelectMilestone}
          activeYearLevel={activeYearLevel}
          onSelectYearLevel={setActiveYearLevel}
        />
      )}

      {activeView === 'ai_gen' && (
        <AiGenerationComparator onLogIteration={onLogIteration} />
      )}

      {activeView === 'fabrication' && (
        <FabricationQueue devices={devices} />
      )}

      {activeView === 'metrology' && (
        <CadScanVerification />
      )}

      {activeView === 'capstone' && (
        <CapstoneWorkflow />
      )}

      {activeView === 'portfolio' && (
        <IterationPortfolio
          student={student}
          iterations={iterations}
          artifacts={artifacts}
        />
      )}
    </div>
  );
};
