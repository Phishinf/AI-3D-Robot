import React, { useState } from 'react';
import { DeviceRegistration } from '../../types';
import {
  Printer,
  Cpu,
  Radio,
  Wifi,
  RefreshCw,
  Power,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';

interface DeviceFleetManagerProps {
  devices: DeviceRegistration[];
  onRefreshDevices?: () => void;
}

export const DeviceFleetManager: React.FC<DeviceFleetManagerProps> = ({ devices, onRefreshDevices }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isRestartingAgent, setIsRestartingAgent] = useState<boolean>(false);
  const [localAgentLog, setLocalAgentLog] = useState<string[]>([
    '[17:10:02] Local Agent Daemon started on 192.168.10.1',
    '[17:10:04] Bambu MQTT Bridge connected: 2 printers online',
    '[17:10:07] Moonraker Voron 2.4 WebSocket subscribed (192.168.10.51:7125)',
    '[17:10:10] Revopoint MetroX Scanner USB HID endpoint listening on /dev/bus/usb/001/004',
    '[17:10:14] Local GPU Node (RTX 4090 × 2) healthy - VRAM: 48GB allocated'
  ]);

  const handleRestartAgent = () => {
    setIsRestartingAgent(true);
    setTimeout(() => {
      setLocalAgentLog((prev) => [
        `[${new Date().toTimeString().substring(0, 8)}] Local Agent Daemon reloaded - All 6 adapters active`,
        ...prev
      ]);
      setIsRestartingAgent(false);
    }, 900);
  };

  const filteredDevices = filterType === 'all' ? devices : devices.filter((d) => d.type === filterType);

  return (
    <div className="space-y-6">
      {/* Fleet Overview Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold">
                LOCAL AGENT & DEVICE GATEWAY
              </span>
              <span className="text-slate-500 text-xs font-mono">Classroom LAN Relay (Section 7.5)</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Workshop Hardware Fleet & Local LAN Agent Relay
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Bridges LAN-only classroom devices (3D printers, optical scanners, local GPU inference nodes, robotics micro-controllers) to cloud services.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-restart-local-agent"
              onClick={handleRestartAgent}
              disabled={isRestartingAgent}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isRestartingAgent ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isRestartingAgent ? 'Reloading Relay...' : 'Restart Local Agent'}</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Hardware ({devices.length})
          </button>
          <button
            onClick={() => setFilterType('3d_printer')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterType === '3d_printer'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            3D Printers (3)
          </button>
          <button
            onClick={() => setFilterType('3d_scanner')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterType === '3d_scanner'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            3D Scanners (1)
          </button>
          <button
            onClick={() => setFilterType('local_gpu_workstation')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterType === 'local_gpu_workstation'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Local GPU Nodes (1)
          </button>
          <button
            onClick={() => setFilterType('robotics_hub')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterType === 'robotics_hub'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Robotics Hubs (1)
          </button>
        </div>
      </div>

      {/* Hardware Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((dev) => (
          <div
            key={dev.id}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {dev.type === '3d_printer' ? (
                    <Printer className="w-4 h-4 text-blue-600" />
                  ) : dev.type === 'local_gpu_workstation' ? (
                    <Cpu className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Radio className="w-4 h-4 text-amber-600" />
                  )}
                  <h3 className="font-bold text-xs text-slate-900">{dev.name}</h3>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                    dev.status === 'printing' || dev.status === 'computing'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : dev.status === 'idle'
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {dev.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 font-mono mt-2 space-y-0.5">
                <div>Model: <span className="text-slate-800 font-sans">{dev.vendorModel}</span></div>
                <div>Location: <span className="text-slate-800 font-sans">{dev.classroom}</span></div>
                <div>LAN IP: <code className="text-blue-700">{dev.ipAddress}</code></div>
              </div>

              {dev.currentJob && (
                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-800 truncate max-w-[160px] font-medium">
                      {dev.currentJob.jobName}
                    </span>
                    <span className="text-blue-600 font-mono font-bold">{dev.currentJob.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${dev.currentJob.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Student: {dev.currentJob.studentName}</span>
                    <span>ETA: {dev.currentJob.timeLeftMinutes} min</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="flex items-center space-x-1 text-emerald-700 font-medium">
                <Wifi className="w-3 h-3" />
                <span>Local Relay Active</span>
              </span>
              <span className="text-slate-500 font-mono text-[10px]">Port 7125/MQTT</span>
            </div>
          </div>
        ))}
      </div>

      {/* Local Agent Console Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-slate-300 shadow-xs">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
          <span className="flex items-center space-x-2 text-teal-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>Classroom Local Agent Bridge Console (LAN Daemon)</span>
          </span>
          <span>Status: 6 Endpoints Polling &bull; Latency: 2.1ms</span>
        </div>

        <div className="font-mono text-[11px] text-slate-400 space-y-1 max-h-32 overflow-y-auto">
          {localAgentLog.map((log, i) => (
            <div key={i} className="leading-tight">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
