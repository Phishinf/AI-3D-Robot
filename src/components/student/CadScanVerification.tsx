import React, { useState } from 'react';
import { Compass, CheckCircle2, AlertTriangle, FileCheck, Layers, Upload, Ruler, RefreshCw, Shield, Check } from 'lucide-react';
import { MeshViewer3D } from '../common/MeshViewer3D';

export const CadScanVerification: React.FC = () => {
  const [tolerancePassed, setTolerancePassed] = useState<boolean>(true);
  const [measurements, setMeasurements] = useState([
    { point: 'Pin 1 - Outer Diameter', nominal: 6.00, measured: 6.04, tolerance: 0.15, pass: true },
    { point: 'Pin 2 - Outer Diameter', nominal: 6.00, measured: 6.03, tolerance: 0.15, pass: true },
    { point: 'Pin Pitch (Hole Center-to-Center)', nominal: 31.00, measured: 31.06, tolerance: 0.15, pass: true },
    { point: 'Keyway Depth Clearance', nominal: 2.50, measured: 2.58, tolerance: 0.15, pass: true },
    { point: 'Flange Counterbore Concentricity', nominal: 12.00, measured: 12.08, tolerance: 0.15, pass: true }
  ]);
  const [uploadedScanFile, setUploadedScanFile] = useState<string>('NEMA17_Flange_MetroX_Scan.ply');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [signoffSubmitted, setSignoffSubmitted] = useState<boolean>(false);

  const handleUpdateMeasured = (index: number, val: number) => {
    setMeasurements((prev) => {
      const updated = [...prev];
      const delta = Math.abs(val - updated[index].nominal);
      updated[index] = {
        ...updated[index],
        measured: val,
        pass: delta <= updated[index].tolerance
      };
      setTolerancePassed(updated.every((m) => m.pass));
      return updated;
    });
  };

  const handleRecomputeTolerance = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setTolerancePassed(measurements.every((m) => m.pass));
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold">
                MODULE 3 / YEAR 3 CORE STANDARD
              </span>
              <span className="text-slate-500 text-xs font-mono">Precision Metrology & CAD Mating Fit</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              3D Scan Ingestion & Quantitative Tolerance Verification
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Ingest optical scan point clouds, align reference CAD geometry, and record physical digital caliper tolerances (&plusmn;0.15mm) with automated signal hashing.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center space-x-1.5 ${
                tolerancePassed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {tolerancePassed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
              <span>{tolerancePassed ? 'TOLERANCE SPEC: VERIFIED PASS' : 'OUT OF TOLERANCE (>0.15mm)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3D CAD / Scan Mating Inspection */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">CAD Interference & Alignment View</h3>
                <p className="text-xs text-slate-500">Point cloud registered against reverse-engineered CAD solid.</p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded border border-slate-200">
                Drift: 0.038mm
              </span>
            </div>

            <div className="bg-slate-900 rounded-xl p-2">
              <MeshViewer3D
                modelType="cad_mating_fit"
                title="NEMA17 Servo Flange vs End-Effector Bracket"
                polyCount={112400}
                toleranceDeltaMm={0.06}
                highlightDefect={!tolerancePassed}
                colorScheme={tolerancePassed ? 'emerald' : 'amber'}
              />
            </div>

            {/* Scan Ingestion File Drop Info */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <Upload className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-semibold text-slate-800">{uploadedScanFile}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    24.8 MB &bull; Revopoint MetroX Laser Scanner &bull; 1.42M Points
                  </div>
                </div>
              </div>
              <button
                id="btn-reupload-scan"
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-mono font-medium shadow-2xs"
              >
                Re-ingest
              </button>
            </div>
          </div>
        </div>

        {/* Right: Quantitative Tolerance Measurement Table */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Ruler className="w-4 h-4 text-blue-600" />
                  <span>Physical Digital Caliper Measurements</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter physical vernier/micrometer readings to verify compliance with ISO 2768-m tolerance.
                </p>
              </div>

              <button
                id="btn-recompute-tolerance"
                onClick={handleRecomputeTolerance}
                disabled={isVerifying}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>Verify Spec</span>
              </button>
            </div>

            {/* Table */}
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200 font-mono text-[11px]">
                    <th className="pb-2">Datum Feature</th>
                    <th className="pb-2">Nominal</th>
                    <th className="pb-2">Physical Measured</th>
                    <th className="pb-2">Delta</th>
                    <th className="pb-2 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {measurements.map((m, idx) => {
                    const delta = Number((m.measured - m.nominal).toFixed(3));
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 text-slate-800 font-sans text-xs font-medium">{m.point}</td>
                        <td className="py-2.5 text-slate-500">{m.nominal.toFixed(2)}mm</td>
                        <td className="py-2.5">
                          <input
                            type="number"
                            step="0.01"
                            value={m.measured}
                            onChange={(e) => handleUpdateMeasured(idx, parseFloat(e.target.value) || 0)}
                            className="w-20 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 text-xs font-mono focus:border-blue-500 focus:outline-none focus:bg-white transition"
                          />
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`${
                              Math.abs(delta) <= m.tolerance ? 'text-slate-700 font-semibold' : 'text-rose-600 font-bold'
                            }`}
                          >
                            {delta > 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)}mm
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                              m.pass
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {m.pass ? 'PASS' : 'FAIL'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Reflection and Anisotropic Shrinkage Factor */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-800">
                <span className="font-semibold">Material Compensation Note:</span>
                <span className="text-blue-700 font-mono font-semibold">PETG-CF Shrinkage: 0.6%</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Applying anisotropic scaling factor of 1.006 in slicer compensated for radial pin shrinkage, bringing center pitch from 30.82mm to 31.06mm (delta +0.06mm, within &plusmn;0.15mm spec).
              </p>
            </div>

            {/* Submission Button */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                id="btn-submit-tolerance-signoff"
                onClick={() => setSignoffSubmitted(true)}
                disabled={!tolerancePassed}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition shadow-xs ${
                  signoffSubmitted
                    ? 'bg-emerald-600 text-white'
                    : tolerancePassed
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                {signoffSubmitted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Submitted to Teacher Rubric Queue</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>Submit Verified Tolerances for Milestone Sign-off</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
