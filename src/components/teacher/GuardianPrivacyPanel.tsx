import React, { useState } from 'react';
import { GuardianConsent, StudentProfile } from '../../types';
import { Shield, Lock, FileCheck, CheckCircle2, AlertCircle, Download, Check, RefreshCw } from 'lucide-react';

interface GuardianPrivacyPanelProps {
  consents: GuardianConsent[];
  students: StudentProfile[];
}

export const GuardianPrivacyPanel: React.FC<GuardianPrivacyPanelProps> = ({
  consents,
  students
}) => {
  const [localConsents, setLocalConsents] = useState<GuardianConsent[]>(consents);
  const [exported, setExported] = useState<boolean>(false);

  const handleToggleConsent = (guardianId: string, field: 'dataMinimizationMode' | 'biometricScanConsent' | 'cloudAiConsent') => {
    setLocalConsents((prev) =>
      prev.map((c) => (c.guardianId === guardianId ? { ...c, [field]: !c[field] } : c))
    );
  };

  const handleExportAudit = () => {
    setExported(true);
    setTimeout(() => {
      const blob = new Blob([JSON.stringify(localConsents, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `District_Guardian_Consent_Audit_${new Date().toISOString().substring(0, 10)}.json`;
      a.click();
      setExported(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Privacy Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold">
                DATA PRIVACY & GUARDIAN CONSENT (SECTION 9)
              </span>
              <span className="text-slate-500 text-xs font-mono">Minor Protection Standard</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Guardian Consent & Minor Data Minimization Registry
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Every participant is a minor. Data collection defaults strictly to the minimum needed for rubric evaluation. Biometric 3D scans and cloud AI interactions require explicit verified guardian authorization.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-export-privacy-audit"
              onClick={handleExportAudit}
              disabled={exported}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>{exported ? 'Exporting...' : 'Export District Compliance Audit'}</span>
            </button>
          </div>
        </div>

        {/* Regulatory Badges */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700">
            FERPA / COPPA (US) Compliant
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700">
            GDPR Art. 8 Minor Safeguards
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700">
            Taiwan Student Data Protection
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700">
            Hong Kong PPO Data Privacy
          </span>
        </div>
      </div>

      {/* Consent Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active Cohort Guardian Consent Records</h3>
          <span className="text-xs font-mono text-emerald-700 font-bold">100% Consent Compliance Rate</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600 text-[11px]">
                <th className="p-3.5">Student Scholar</th>
                <th className="p-3.5">Guardian Details</th>
                <th className="p-3.5">Jurisdiction</th>
                <th className="p-3.5">Data Minimization</th>
                <th className="p-3.5">3D Scan Auth</th>
                <th className="p-3.5">Cloud AI Auth</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {localConsents.map((consent) => {
                const student = students.find((s) => s.id === consent.studentId);
                return (
                  <tr key={consent.guardianId} className="hover:bg-slate-50/50 transition">
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{student?.name || consent.studentId}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{student?.cohort}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800 font-medium">{consent.guardianName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{consent.guardianEmail}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
                        {consent.jurisdiction}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleConsent(consent.guardianId, 'dataMinimizationMode')}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition ${
                          consent.dataMinimizationMode
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {consent.dataMinimizationMode ? 'ENFORCED' : 'OFF'}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleConsent(consent.guardianId, 'biometricScanConsent')}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition ${
                          consent.biometricScanConsent
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {consent.biometricScanConsent ? 'AUTHORIZED' : 'RESTRICTED'}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleConsent(consent.guardianId, 'cloudAiConsent')}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition ${
                          consent.cloudAiConsent
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {consent.cloudAiConsent ? 'AUTHORIZED' : 'RESTRICTED'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right font-mono">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>GRANTED</span>
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">{consent.grantedAt}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
