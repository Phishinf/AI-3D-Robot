import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  ShieldAlert,
  ArrowRight,
  FileCheck,
  Award,
  Download,
  Eye,
  UserCheck,
  Printer,
  Compass,
  Cpu,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CapstoneWorkflowStep } from '../../types';
import { MeshViewer3D } from '../common/MeshViewer3D';

export const CapstoneWorkflow: React.FC = () => {
  const [steps, setSteps] = useState<CapstoneWorkflowStep[]>([
    {
      stepNumber: 1,
      name: 'Anatomical Optical 3D Scan',
      description: 'Capture limb wrist geometry with MetroX scanner; verify point density > 120 pts/mm².',
      status: 'completed',
      completedAt: '2026-11-20',
      signoffRequired: false
    },
    {
      stepNumber: 2,
      name: 'AI Generative Lattice Synthesis & FEA',
      description: 'Run TRELLIS.2 local GPU adapter for internal voronoi lattice infill; achieve 42% mass reduction under 180N load.',
      status: 'completed',
      completedAt: '2026-11-23',
      signoffRequired: false
    },
    {
      stepNumber: 3,
      name: 'MANDATORY Human Teacher Sign-off Gate',
      description: 'Pre-flight tolerance check (&plusmn;0.15mm) & pinch-hazard clearance inspection by Curriculum Lead / Teacher.',
      status: 'in_progress',
      signoffRequired: true,
      signoffRole: 'Curriculum Lead / Safety Master'
    },
    {
      stepNumber: 4,
      name: 'Multi-Material Composite 3D Fabrication',
      description: 'Dual-extrusion print: Carbon-PETG structural chassis + TPU 95A ergonomic flex cuffs on Bambu X1-Carbon.',
      status: 'blocked',
      signoffRequired: false
    },
    {
      stepNumber: 5,
      name: 'Hardware Assembly & ROS2 Telemetry Verification',
      description: 'Fasten titanium hardware, connect Teensy 4.1 CAN-bus servo, and log actuator range-of-motion telemetry.',
      status: 'blocked',
      signoffRequired: true,
      signoffRole: 'Teacher & Industry Mentor'
    }
  ]);

  const [teacherSigned, setTeacherSigned] = useState<boolean>(false);
  const [showMentorReview, setShowMentorReview] = useState<boolean>(false);
  const [careerSurveySubmitted, setCareerSurveySubmitted] = useState<boolean>(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Robotics Hardware Engineering',
    'Generative CAD Systems'
  ]);

  const handleTeacherSignoff = () => {
    setTeacherSigned(true);
    setSteps((prev) =>
      prev.map((s) => {
        if (s.stepNumber === 3) {
          return {
            ...s,
            status: 'completed',
            completedAt: new Date().toISOString().substring(0, 10),
            signoffBy: 'Dr. Evelyn Vance (Curriculum Lead)',
            notes: 'Verified clearance gap 2.4mm. FEA safety factor 2.15 exceeds medical bench spec. Fabrication unlocked.'
          };
        }
        if (s.stepNumber === 4) {
          return { ...s, status: 'in_progress' };
        }
        return s;
      })
    );
  };

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-semibold">
                YEAR 4 CAPSTONE ORCHESTRATION
              </span>
              <span className="text-slate-500 text-xs font-mono">End-to-End Orchestrated Pipeline</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              5-Stage Fabrication Pipeline & Mandatory Human Gate
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              The platform strictly enforces the human sign-off gate: 3D printing is software-locked until the Curriculum Lead approves pre-flight tolerance and safety clearances.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-toggle-mentor-review"
              onClick={() => setShowMentorReview(!showMentorReview)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>{showMentorReview ? 'Hide Mentor Review' : 'Industry Mentor Panel'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Stage Orchestration Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {steps.map((step) => {
          const isCurrent = step.status === 'in_progress';
          const isDone = step.status === 'completed';

          return (
            <div
              key={step.stepNumber}
              id={`capstone-step-${step.stepNumber}`}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition ${
                isCurrent
                  ? 'bg-amber-50/40 border-amber-500 ring-1 ring-amber-500 shadow-xs'
                  : isDone
                  ? 'bg-emerald-50/30 border-emerald-300 shadow-2xs'
                  : 'bg-white border-slate-200 opacity-70 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-slate-500">STAGE {step.stepNumber}</span>
                  {isDone ? (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>PASS</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                      ACTIVE GATE
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug">{step.name}</h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 text-[10px]">
                {step.signoffRequired && (
                  <div className="flex items-center space-x-1 text-amber-800 font-semibold">
                    <ShieldAlert className="w-3 h-3 shrink-0 text-amber-600" />
                    <span>Human Gate: {step.signoffRole}</span>
                  </div>
                )}
                {step.completedAt && (
                  <div className="text-slate-500 font-mono mt-0.5 font-medium">Approved: {step.completedAt}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Split: Gate Sign-off Station + 3D FEA Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3D FEA Model View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Capstone Bio-Robotic Exoskeleton Assembly
                </h3>
                <p className="text-xs text-slate-500">
                  TRELLIS.2 organic lattice with FEA stress load distribution and joint clearances.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 text-blue-700 font-semibold rounded border border-slate-200">
                Mass: 312g (-42.4%)
              </span>
            </div>

            <div className="bg-slate-900 rounded-xl p-2">
              <MeshViewer3D
                modelType="prosthetic_lattice"
                title="Exoskeleton FEA Stress Distribution (180N Load)"
                polyCount={284000}
                toleranceDeltaMm={0.03}
                colorScheme="stress"
              />
            </div>
          </div>
        </div>

        {/* Right: Human Verification Gate Action Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center space-x-2 text-amber-700 mb-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Pre-Flight Teacher Sign-off Gate (Stage 3)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Before the G-code can be dispatched to the Bambu Lab X1-Carbon, the Curriculum Lead or Workshop Master must verify physical clearance margins and sign the digital credential.
            </p>

            <div className="mt-4 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Minimum Wall Thickness:</span>
                <span className="text-emerald-700 font-semibold">2.4mm (Spec &ge; 2.0mm)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Hinge Pinch Clearance:</span>
                <span className="text-emerald-700 font-semibold">3.2mm (Zero Binding)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Anatomical Scan Fit Delta:</span>
                <span className="text-emerald-700 font-semibold">+0.04mm (Compliant)</span>
              </div>
            </div>

            {/* Teacher Sign-off Button Simulation */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              {teacherSigned ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                    <UserCheck className="w-4 h-4" />
                    <span>GATE PASSED: Signed by Dr. Evelyn Vance</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono">
                    Digital Seal: <code className="text-emerald-700">0x8F9C...2D1A</code> &bull; Fabrication Unlocked
                  </p>
                </div>
              ) : (
                <button
                  id="btn-execute-teacher-signoff"
                  onClick={handleTeacherSignoff}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Execute Curriculum Lead Sign-off & Unlock 3D Print</span>
                </button>
              )}
            </div>
          </div>

          {/* Career Pathway Interest Module */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-1">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Year 4 Career Pathway Exploration</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Self-reported engineering interest survey feeding into the stakeholder dashboard (non-scored).
            </p>

            <div className="space-y-1.5">
              {[
                'Robotics Hardware Engineering',
                'Generative CAD Systems',
                'Advanced Composite 3D Printing',
                'Biomechatronics & Medical Devices',
                'Embedded Firmware & ROS2'
              ].map((field) => (
                <button
                  key={field}
                  onClick={() => handleToggleInterest(field)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-between transition ${
                    selectedInterests.includes(field)
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{field}</span>
                  {selectedInterests.includes(field) && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
              <button
                id="btn-submit-career-survey"
                onClick={() => setCareerSurveySubmitted(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition shadow-xs"
              >
                {careerSurveySubmitted ? 'Preferences Synchronized' : 'Save Career Pathway Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Mentor Review Modal / Panel */}
      {showMentorReview && (
        <div className="bg-white border border-amber-300 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-xs font-mono text-amber-700 font-bold uppercase">
                Scoped External Read-Only Review
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Industry Mentor Evaluation: Dr. Hiroshi Tanaka (Boston Dynamics Robotics Fellow)
              </h3>
            </div>
            <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono rounded font-semibold">
              Capstone Score: 96/100
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-800">Mentor Commendation:</span>
              <p className="text-slate-600 mt-1 leading-relaxed">
                "Maya and Alexandre's exoskeleton shows rare mastery of organic lattice topology optimization and physical clearance tolerances. The inclusion of lead-in chamfers for PETG-CF shrinkage demonstrates professional-grade manufacturing consciousness."
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-800">Industry Next Steps:</span>
              <p className="text-slate-600 mt-1 leading-relaxed">
                "Recommend testing dynamic fatigue cycling on the TPU compliant joints across 10,000 flexion repetitions. Strong candidate for MIT/Stanford Maker Portfolio submission."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
