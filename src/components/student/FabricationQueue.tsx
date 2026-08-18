import React, { useState, useEffect } from 'react';
import { Printer, Gauge, Flame, Clock, CheckCircle2, AlertTriangle, ShieldCheck, Play, Pause, RefreshCw, Cpu, Wifi } from 'lucide-react';
import { DeviceRegistration } from '../../types';

interface FabricationQueueProps {
  devices: DeviceRegistration[];
  onDispatchJob?: (deviceId: string, jobName: string) => void;
}

export const FabricationQueue: React.FC<FabricationQueueProps> = ({ devices }) => {
  const [selectedDevice, setSelectedDevice] = useState<string>(devices[0]?.id || 'dev-prt-01');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [nozzleTemp, setNozzleTemp] = useState<number>(245);
  const [bedTemp, setBedTemp] = useState<number>(60);
  const [layerProgress, setLayerProgress] = useState<{ current: number; total: number }>({ current: 184, total: 270 });
  const [selectedMaterial, setSelectedMaterial] = useState<string>('PETG-CF (Carbon Fiber)');

  const activeDev = devices.find((d) => d.id === selectedDevice) || devices[0];

  // Minor telemetry jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeDev?.status === 'printing' && !isPaused) {
        setNozzleTemp((t) => 245 + (Math.random() * 1.6 - 0.8));
        setBedTemp((b) => 60 + (Math.random() * 0.4 - 0.2));
        setLayerProgress((prev) => ({
          ...prev,
          current: Math.min(prev.total, prev.current + (Math.random() > 0.7 ? 1 : 0))
        }));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [activeDev, isPaused]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold">
                DEVICE ADAPTER GATEWAY (LAN LOCAL AGENT)
              </span>
              <span className="text-slate-500 text-xs font-mono">Bambu Cloud & OctoPrint Relay</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Fabrication Bridge & Real-Time Telemetry Stream
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Live hardware execution bridge across lab 3D printers with automated nozzle thermals, layer counts, and pre-flight tolerance validation.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-emerald-700 font-semibold">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>Local Agent: ONLINE (192.168.10.x)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Hardware Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Device Selection & Status List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Registered Lab Printers
          </div>

          <div className="space-y-2.5">
            {devices.filter((d) => d.type === '3d_printer').map((dev) => {
              const isSelected = dev.id === selectedDevice;
              return (
                <div
                  key={dev.id}
                  id={`device-card-${dev.id}`}
                  onClick={() => setSelectedDevice(dev.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/40 border-blue-600 ring-1 ring-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Printer className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-sm text-slate-900">{dev.name}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold ${
                        dev.status === 'printing'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {dev.status}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-500 font-mono flex items-center justify-between">
                    <span>{dev.classroom}</span>
                    <span>{dev.vendorModel}</span>
                  </div>

                  {dev.currentJob && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-700 font-medium truncate max-w-[170px]">
                          {dev.currentJob.jobName}
                        </span>
                        <span className="text-blue-600 font-mono font-bold">
                          {dev.currentJob.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${dev.currentJob.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Telemetry & Control Bay */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <span>{activeDev?.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-normal">
                    IP: {activeDev?.ipAddress}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned Student: <strong className="text-slate-800">{activeDev?.currentJob?.studentName || 'Unassigned'}</strong> &bull; Active G-code: <code className="text-blue-600 font-mono">{activeDev?.currentJob?.jobName || 'idle'}</code>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="btn-pause-print"
                  onClick={() => setIsPaused(!isPaused)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center space-x-1.5 transition ${
                    isPaused
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 fill-amber-700 text-amber-700" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isPaused ? 'Resume Print' : 'Pause Job'}</span>
                </button>
              </div>
            </div>

            {/* Gauges & Telemetry Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
                  <span>Nozzle Temp</span>
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {nozzleTemp.toFixed(1)}&deg;C
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Target: 245.0&deg;C</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
                  <span>Bed Temp</span>
                  <Gauge className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {bedTemp.toFixed(1)}&deg;C
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Target: 60.0&deg;C</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
                  <span>Layer Count</span>
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {layerProgress.current} / {layerProgress.total}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">0.16mm Layer Height</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
                  <span>Live Tolerance</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-lg font-bold font-mono text-emerald-700">
                  +0.04 mm
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Spec: &plusmn;0.15mm</div>
              </div>
            </div>

            {/* Chamber Camera Simulator & Toolpath Visualizer */}
            <div className="mt-4 bg-slate-900 rounded-xl border border-slate-800 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-mono text-slate-200 font-semibold">LIVE CHAMBER TELEMETRY FEED (OCTOPRINT BRIDGE)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">FPS: 30 &bull; Bitrate: 4.2 Mbps</span>
              </div>

              {/* Graphical Toolpath Simulation */}
              <div className="h-44 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden">
                <svg className="w-full h-full p-4" viewBox="0 0 400 160">
                  <defs>
                    <pattern id="print-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#print-grid)" />

                  {/* Printed Layers */}
                  <path
                    d="M 120 120 L 160 80 L 240 80 L 280 120 Z"
                    fill="#1e3a8a"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <path
                    d="M 140 100 L 170 70 L 230 70 L 260 100 Z"
                    fill="#1d4ed8"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                  />
                  {/* Extruder Head */}
                  <circle cx="210" cy="70" r="5" fill="#f43f5e" />
                  <line x1="210" y1="20" x2="210" y2="70" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
                  <text x="220" y="65" fill="#f43f5e" fontSize="10" fontFamily="monospace">NOZZLE (245°C)</text>
                </svg>

                <div className="absolute bottom-2 right-2 bg-slate-900/90 px-2 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-700">
                  Toolpath Delta: 0.02mm &bull; Infill: 45% Gyroid
                </div>
              </div>
            </div>

            {/* Slicer Material Settings */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-slate-600 font-medium">Filament Profile:</span>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-800 rounded px-2.5 py-1 text-xs font-mono focus:border-blue-500 focus:outline-none"
                >
                  <option value="PETG-CF (Carbon Fiber)">PETG-CF (Carbon Fiber Reinforced)</option>
                  <option value="PLA Basic">Bambu PLA Basic (Prototype)</option>
                  <option value="TPU 95A">TPU 95A Flexible (Compliant Joint)</option>
                  <option value="PA-CF (Nylon Carbon)">PAHT-CF High-Temp Nylon</option>
                </select>
              </div>

              <div className="text-slate-600 text-xs">
                Shrinkage Compensation Factor: <strong className="text-blue-600 font-mono font-bold">1.006 (X/Y)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
