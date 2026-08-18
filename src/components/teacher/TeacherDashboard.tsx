import React, { useState } from 'react';
import {
  StudentProfile,
  Module,
  Milestone,
  DeviceRegistration,
  GuardianConsent,
  AssessmentRecord
} from '../../types';
import {
  Users,
  Award,
  ClipboardList,
  Printer,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { RubricGradingStudio } from './RubricGradingStudio';
import { DeviceFleetManager } from './DeviceFleetManager';
import { GuardianPrivacyPanel } from './GuardianPrivacyPanel';

interface TeacherDashboardProps {
  students: StudentProfile[];
  modules: Module[];
  devices: DeviceRegistration[];
  consents: GuardianConsent[];
  onSaveAssessment: (record: any) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  modules,
  devices,
  consents,
  onSaveAssessment
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'grading' | 'devices' | 'privacy'>('matrix');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile>(students[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');

  // Find a ready-for-review milestone or default to year 3 milestone
  const allMilestones = modules.flatMap((m) => m.units.flatMap((u) => u.projects.flatMap((p) => p.milestones)));
  const reviewMilestone = allMilestones.find((m) => m.status === 'ready_for_review') || allMilestones[0];
  const [currentGradingMilestone, setCurrentGradingMilestone] = useState<Milestone>(reviewMilestone);

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.cohort.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = yearFilter === 'all' || s.yearLevel === yearFilter;
    return matchesSearch && matchesYear;
  });

  const avgCohortScore = Math.round(students.reduce((a, b) => a + b.goalFulfillmentScore, 0) / (students.length || 1));
  const activePrintersCount = devices.filter((d) => d.status === 'printing').length;

  return (
    <div className="space-y-6">
      {/* Top Level Metric Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Enrolled Scholars</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{students.length} Students</div>
          <div className="text-[11px] text-blue-600 mt-1 font-mono font-medium">4 Active Year Cohorts</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Avg Goal-Fulfillment</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{avgCohortScore}%</div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">Weighted Rubric + Telemetry</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Teacher Sign-offs</span>
            <ClipboardList className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">2 Pending</div>
          <div className="text-[11px] text-amber-800 mt-1 font-mono">Pre-flight tolerance gates</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Classroom Local Agents</span>
            <Printer className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-1">6 Active</div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">{activePrintersCount} Live Print Jobs</div>
        </div>
      </div>

      {/* Teacher Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          id="tab-teacher-matrix"
          onClick={() => setActiveTab('matrix')}
          className={`pb-2.5 px-3 text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'matrix' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span>Cohort Progress & Goal Matrix</span>
        </button>

        <button
          id="tab-teacher-grading"
          onClick={() => setActiveTab('grading')}
          className={`pb-2.5 px-3 text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'grading' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4 text-blue-600" />
          <span>Rubric Grading Studio</span>
        </button>

        <button
          id="tab-teacher-devices"
          onClick={() => setActiveTab('devices')}
          className={`pb-2.5 px-3 text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'devices' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Printer className="w-4 h-4 text-blue-600" />
          <span>Workshop Devices & LAN Relay</span>
        </button>

        <button
          id="tab-teacher-privacy"
          onClick={() => setActiveTab('privacy')}
          className={`pb-2.5 px-3 text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'privacy' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Guardian Consent & Privacy</span>
        </button>
      </div>

      {/* Tab 1: Cohort Progress & Goal Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scholars or cohorts..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value) as any)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Year Levels (1-4)</option>
                <option value="1">Year 1 (Foundations)</option>
                <option value="2">Year 2 (Applied Gen)</option>
                <option value="3">Year 3 (Precision & Systems)</option>
                <option value="4">Year 4 (Capstone)</option>
              </select>
            </div>

            <span className="text-xs text-slate-500 font-mono font-medium">
              Showing {filteredStudents.length} Scholars
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600 text-[11px]">
                    <th className="p-3.5">Student Scholar</th>
                    <th className="p-3.5">Cohort & Track</th>
                    <th className="p-3.5">Active Project</th>
                    <th className="p-3.5">Milestone Completion</th>
                    <th className="p-3.5">Goal Fulfillment</th>
                    <th className="p-3.5">Safety Cert</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={s.avatar}
                            alt={s.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{s.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">ID: {s.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-700 font-mono">{s.cohort}</td>
                      <td className="p-3.5 text-slate-800 font-medium max-w-[220px] truncate">{s.activeProject}</td>
                      <td className="p-3.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-semibold text-slate-800">
                            {s.completedMilestones}/{s.totalMilestones}
                          </span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-full rounded-full"
                              style={{ width: `${(s.completedMilestones / s.totalMilestones) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold font-mono text-emerald-700">{s.goalFulfillmentScore}%</span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-semibold border border-emerald-200">
                          CERTIFIED
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedStudent(s);
                            setActiveTab('grading');
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold border border-slate-300 transition"
                        >
                          Open Rubric
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Rubric Grading Studio */}
      {activeTab === 'grading' && (
        <RubricGradingStudio
          milestone={currentGradingMilestone}
          student={selectedStudent}
          onSaveAssessment={onSaveAssessment}
        />
      )}

      {/* Tab 3: Devices & Local Agent */}
      {activeTab === 'devices' && <DeviceFleetManager devices={devices} />}

      {/* Tab 4: Guardian Privacy & Minor Compliance */}
      {activeTab === 'privacy' && <GuardianPrivacyPanel consents={consents} students={students} />}
    </div>
  );
};
