import React from 'react';
import {
  Sparkles,
  BookOpen,
  Users,
  Compass,
  Cpu,
  Layers,
  ShieldCheck,
  Building2,
  GitPullRequest,
  FolderTree,
  Wifi,
  ChevronDown
} from 'lucide-react';
import { StudentProfile } from '../../types';

interface HeaderProps {
  currentRole: 'student' | 'teacher' | 'adaptation_loop' | 'stakeholder' | 'architecture';
  onChangeRole: (role: 'student' | 'teacher' | 'adaptation_loop' | 'stakeholder' | 'architecture') => void;
  students: StudentProfile[];
  currentStudent: StudentProfile;
  onChangeStudent: (student: StudentProfile) => void;
  curriculumVersion: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onChangeRole,
  students,
  currentStudent,
  onChangeStudent,
  curriculumVersion
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs text-white font-bold text-lg">
              <Compass className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                  Future Makers Pathway
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono font-semibold">
                  {curriculumVersion}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono hidden md:block">
                4-Year Curriculum &bull; Workshop LAN Gateway &bull; Adaptive Feedback Loop
              </p>
            </div>
          </div>

          {/* Role Navigation Pills */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              id="role-btn-student"
              onClick={() => onChangeRole('student')}
              className={`px-3 py-1.5 rounded-md transition flex items-center space-x-1.5 ${
                currentRole === 'student'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Student Studio</span>
            </button>

            <button
              id="role-btn-teacher"
              onClick={() => onChangeRole('teacher')}
              className={`px-3 py-1.5 rounded-md transition flex items-center space-x-1.5 ${
                currentRole === 'teacher'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Teacher Console</span>
            </button>

            <button
              id="role-btn-adaptation-loop"
              onClick={() => onChangeRole('adaptation_loop')}
              className={`px-3 py-1.5 rounded-md transition flex items-center space-x-1.5 ${
                currentRole === 'adaptation_loop'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>Adaptation Engine</span>
            </button>

            <button
              id="role-btn-stakeholder"
              onClick={() => onChangeRole('stakeholder')}
              className={`px-3 py-1.5 rounded-md transition flex items-center space-x-1.5 ${
                currentRole === 'stakeholder'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>District Reports</span>
            </button>

            <button
              id="role-btn-architecture"
              onClick={() => onChangeRole('architecture')}
              className={`px-3 py-1.5 rounded-md transition flex items-center space-x-1.5 ${
                currentRole === 'architecture'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>System Blueprint</span>
            </button>
          </div>

          {/* Right: Active Student Selector & Status Badge */}
          <div className="flex items-center space-x-3">
            {currentRole === 'student' && (
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
                <span className="text-slate-500 hidden sm:inline text-[11px]">Scholar:</span>
                <select
                  value={currentStudent.id}
                  onChange={(e) => {
                    const found = students.find((s) => s.id === e.target.value);
                    if (found) onChangeStudent(found);
                  }}
                  className="bg-transparent text-slate-800 font-semibold font-sans focus:outline-none cursor-pointer"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id} className="bg-white text-slate-800">
                      {s.name} (Year {s.yearLevel})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Local Agent Status Indicator */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LAN Relay Online</span>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto pb-2 text-xs font-semibold">
          <button
            onClick={() => onChangeRole('student')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentRole === 'student' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Student Studio
          </button>
          <button
            onClick={() => onChangeRole('teacher')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentRole === 'teacher' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Teacher Console
          </button>
          <button
            onClick={() => onChangeRole('adaptation_loop')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentRole === 'adaptation_loop' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Adaptation Loop
          </button>
          <button
            onClick={() => onChangeRole('stakeholder')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentRole === 'stakeholder' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            District Reports
          </button>
          <button
            onClick={() => onChangeRole('architecture')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              currentRole === 'architecture' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Blueprint Explorer
          </button>
        </div>
      </div>
    </header>
  );
};
