/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { StudentWorkshop } from './components/student/StudentWorkshop';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { MilestoneAdaptationLoop } from './components/analytics/MilestoneAdaptationLoop';
import { StakeholderPortal } from './components/stakeholder/StakeholderPortal';
import { ArchitectureBlueprintView } from './components/architecture/ArchitectureBlueprintView';

import {
  INITIAL_MODULES,
  CURRENT_CURRICULUM_VERSION
} from './data/curriculumData';
import {
  INITIAL_STUDENTS,
  INITIAL_DEVICES,
  INITIAL_PROPOSALS,
  INITIAL_GUARDIAN_CONSENTS,
  INITIAL_ITERATIONS,
  INITIAL_ARTIFACTS
} from './data/mockData';
import {
  StudentProfile,
  IterationLog,
  Artifact,
  MilestoneChangeProposal,
  CurriculumVersion
} from './types';

export default function App() {
  const [activeRole, setActiveRole] = useState<'student' | 'teacher' | 'adaptation_loop' | 'stakeholder' | 'architecture'>('student');
  const [curriculumVersion, setCurriculumVersion] = useState<CurriculumVersion>(CURRENT_CURRICULUM_VERSION);
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(INITIAL_STUDENTS[0]);
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [proposals, setProposals] = useState<MilestoneChangeProposal[]>(INITIAL_PROPOSALS);
  const [consents, setConsents] = useState(INITIAL_GUARDIAN_CONSENTS);
  const [iterations, setIterations] = useState<IterationLog[]>(INITIAL_ITERATIONS);
  const [artifacts, setArtifacts] = useState<Artifact[]>(INITIAL_ARTIFACTS);
  const [assessments, setAssessments] = useState<any[]>([]);

  // Handler for when a student logs a new generative or fabrication iteration
  const handleLogIteration = (newLog: IterationLog) => {
    setIterations((prev) => [newLog, ...prev]);
    // Boost current student's goal fulfillment and milestone stats
    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentStudent.id
          ? {
              ...s,
              goalFulfillmentScore: Math.min(100, s.goalFulfillmentScore + 2),
              completedMilestones: Math.min(s.totalMilestones, s.completedMilestones + 1)
            }
          : s
      )
    );
    setCurrentStudent((prev) => ({
      ...prev,
      goalFulfillmentScore: Math.min(100, prev.goalFulfillmentScore + 2),
      completedMilestones: Math.min(prev.totalMilestones, prev.completedMilestones + 1)
    }));
  };

  // Handler for saving teacher rubric assessment
  const handleSaveAssessment = (assessment: any) => {
    setAssessments((prev) => [assessment, ...prev]);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === assessment.studentId
          ? { ...s, goalFulfillmentScore: assessment.finalScore }
          : s
      )
    );
  };

  // Handler for Curriculum Lead approving a proposal in the Adaptation Loop
  const handleApproveProposal = (proposalId: string, leadName: string, rationale: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              status: 'approved',
              approvalRecord: {
                curriculumLeadId: 'lead-dr-vance',
                curriculumLeadName: leadName,
                decision: 'approved',
                decisionRationale: rationale,
                decidedAt: new Date().toISOString().substring(0, 10)
              }
            }
          : p
      )
    );

    // Update curriculum version for the staged next cohort
    const targetVersion = proposals.find((p) => p.id === proposalId)?.targetCurriculumVersion || 'v2.5.0';
    setCurriculumVersion((prev) => ({
      ...prev,
      version: `${targetVersion}-staged`,
      updatedAt: new Date().toISOString().substring(0, 10),
      changelog: `Incorporated approved adaptation ${proposalId}: ${rationale}`
    }));
  };

  // Handler for Curriculum Lead rejecting a proposal
  const handleRejectProposal = (proposalId: string, rationale: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              status: 'rejected',
              approvalRecord: {
                curriculumLeadId: 'lead-dr-vance',
                curriculumLeadName: 'Dr. Evelyn Vance (Chief Curriculum Lead)',
                decision: 'rejected',
                decisionRationale: rationale,
                decidedAt: new Date().toISOString().substring(0, 10)
              }
            }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        currentRole={activeRole}
        onChangeRole={setActiveRole}
        students={students}
        currentStudent={currentStudent}
        onChangeStudent={setCurrentStudent}
        curriculumVersion={curriculumVersion.version}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeRole === 'student' && (
          <StudentWorkshop
            student={currentStudent}
            modules={modules}
            devices={devices}
            iterations={iterations.filter((i) => i.studentId === currentStudent.id || i.studentId === 'std-01' || i.studentId === 'std-02')}
            artifacts={artifacts.filter((a) => a.studentId === currentStudent.id || a.studentId === 'std-01' || a.studentId === 'std-02')}
            onLogIteration={handleLogIteration}
          />
        )}

        {activeRole === 'teacher' && (
          <TeacherDashboard
            students={students}
            modules={modules}
            devices={devices}
            consents={consents}
            onSaveAssessment={handleSaveAssessment}
          />
        )}

        {activeRole === 'adaptation_loop' && (
          <MilestoneAdaptationLoop
            proposals={proposals}
            currentVersion={curriculumVersion}
            onApproveProposal={handleApproveProposal}
            onRejectProposal={handleRejectProposal}
          />
        )}

        {activeRole === 'stakeholder' && (
          <StakeholderPortal
            students={students}
            devices={devices}
            modules={modules}
          />
        )}

        {activeRole === 'architecture' && (
          <ArchitectureBlueprintView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-12 text-xs text-slate-500 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-slate-700 font-medium">Future Makers Pathway &bull; Section 2-8 Architecture Blueprint</span>
          </div>
          <div className="text-slate-500 text-center sm:text-right">
            Privacy Standard: Minor Data Minimization (FERPA/GDPR) &bull; Human-in-the-Loop Intent Gate
          </div>
        </div>
      </footer>
    </div>
  );
}
