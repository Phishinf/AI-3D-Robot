import React, { useState } from 'react';
import { Sparkles, Cpu, Layers, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Sliders, Play, Code, FileText, Check } from 'lucide-react';
import { MeshViewer3D } from '../common/MeshViewer3D';
import { IterationLog } from '../../types';

interface AiGenerationComparatorProps {
  onLogIteration: (log: IterationLog) => void;
}

export const AiGenerationComparator: React.FC<AiGenerationComparatorProps> = ({ onLogIteration }) => {
  const [prompt, setPrompt] = useState<string>(
    'Parametric bio-mechanical exoskeleton arm bracket with organic stress-relief voronoi lattice, ergonomic wrist cuff curvature'
  );
  const [targetPolycount, setTargetPolycount] = useState<number>(150000);
  const [supportlessOptimization, setSupportlessOptimization] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<'meshy' | 'tripo' | 'trellis' | 'hunyuan'>('trellis');
  const [activeRepairScript, setActiveRepairScript] = useState<boolean>(false);
  const [loggedSuccess, setLoggedSuccess] = useState<boolean>(false);

  const [providerResults, setProviderResults] = useState([
    {
      id: 'trellis',
      name: 'TRELLIS.2 (Local GPU Node)',
      tier: 'Advanced / Self-Hosted',
      polycount: 142800,
      watertightness: 99.4,
      nonManifoldEdges: 0,
      inferenceTimeSec: 28,
      status: 'ready',
      defects: ['Minor over-density near hinge pocket'],
      recommendation: 'Best for engineering lattice & low-stress structural infill'
    },
    {
      id: 'meshy',
      name: 'Meshy AI Cloud v2',
      tier: 'Cloud API',
      polycount: 185200,
      watertightness: 92.1,
      nonManifoldEdges: 14,
      inferenceTimeSec: 14,
      status: 'ready',
      defects: ['14 non-manifold edges', '2 floating micro-islands'],
      recommendation: 'Fast organic ideation; requires Python mesh repair before slicing'
    },
    {
      id: 'tripo',
      name: 'Tripo AI v2.0',
      tier: 'Cloud API',
      polycount: 162400,
      watertightness: 95.8,
      nonManifoldEdges: 6,
      inferenceTimeSec: 19,
      status: 'ready',
      defects: ['6 inverted face normals at inner groove'],
      recommendation: 'Balanced topology; smooth curvature interpolation'
    },
    {
      id: 'hunyuan',
      name: 'Hunyuan3D 2.1 (Edge Cluster)',
      tier: 'Advanced / Local Cluster',
      polycount: 210000,
      watertightness: 98.7,
      nonManifoldEdges: 2,
      inferenceTimeSec: 42,
      status: 'ready',
      defects: ['High quad density on planar surfaces'],
      recommendation: 'Exceptional visual fidelity; decimate by 25% for 0.4mm nozzle slicing'
    }
  ]);

  const handleSimulateGeneration = () => {
    setIsGenerating(true);
    setLoggedSuccess(false);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1200);
  };

  const handleApplyPythonRepair = () => {
    setActiveRepairScript(true);
    setTimeout(() => {
      setProviderResults((prev) =>
        prev.map((p) =>
          p.id === selectedProvider
            ? { ...p, watertightness: 100, nonManifoldEdges: 0, defects: ['Repaired: 0 non-manifold edges remaining'] }
            : p
        )
      );
      setActiveRepairScript(false);
    }, 800);
  };

  const handleSaveToPortfolio = () => {
    const current = providerResults.find((p) => p.id === selectedProvider);
    const newLog: IterationLog = {
      id: `iter-${Date.now()}`,
      studentId: 'std-02',
      milestoneId: 'm-401-1',
      attemptNumber: Math.floor(Math.random() * 3) + 2,
      provider:
        selectedProvider === 'trellis'
          ? 'TRELLIS.2 (Local GPU)'
          : selectedProvider === 'meshy'
          ? 'Meshy AI'
          : 'Tripo AI',
      promptOrInput: prompt,
      settingsUsed: `Polycount Cap: ${targetPolycount.toLocaleString()}, Supportless: ${supportlessOptimization}`,
      outputDescription: `Generated mesh with ${current?.polycount.toLocaleString()} tris. Watertightness: ${current?.watertightness}%.`,
      studentReflection: `Compared model outputs across cloud and local GPU adapters. Local TRELLIS.2 achieved superior manifold boundary compliance for direct CAD boolean operations.`,
      aiIdentifiedDefects: current?.defects || [],
      repairActionsTaken: ['Executed Python scipy vertex welding', 'Normalized coordinate bounding box'],
      durationMinutes: 35,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      passedVerification: (current?.watertightness ?? 0) >= 95
    };
    onLogIteration(newLog);
    setLoggedSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Multi-Provider Gateway Architecture */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold">
                INTEGRATION GATEWAY: AI ADAPTER
              </span>
              <span className="text-slate-500 text-xs font-mono">Module 2 / 4 Standard</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Multi-Provider Generative 3D Studio & Defect Taxonomy
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Formulate design intent, query parallel AI generation adapters (Cloud & Local GPU), and benchmark geometric manifoldness before physical slicing.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-run-all-providers"
              onClick={handleSimulateGeneration}
              disabled={isGenerating}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center space-x-2 shadow-xs transition"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isGenerating ? 'Querying Adapters...' : 'Execute Multi-Provider Run'}</span>
            </button>
          </div>
        </div>

        {/* Prompt & Generation Parameters */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Parametric Design Intent Prompt</span>
              <span className="text-slate-500 font-mono text-[11px]">Human Intent Input</span>
            </label>
            <textarea
              id="input-prompt-text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono resize-none focus:bg-white transition"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Target Polycount Cap:</span>
              <span className="font-mono text-blue-600 font-semibold">{targetPolycount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="300000"
              step="10000"
              value={targetPolycount}
              onChange={(e) => setTargetPolycount(Number(e.target.value))}
              className="w-full accent-blue-600"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-600">Supportless Overhang Guard:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={supportlessOptimization}
                  onChange={(e) => setSupportlessOptimization(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Comparative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 3D Interactive Inspection View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <span>Inspection Canvas:</span>
                  <span className="text-blue-600 font-mono">
                    {providerResults.find((p) => p.id === selectedProvider)?.name}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect geometric normals, point cloud distribution, and potential non-manifold seams.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="btn-run-python-repair"
                  onClick={handleApplyPythonRepair}
                  disabled={activeRepairScript}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Code className="w-3.5 h-3.5 text-blue-600" />
                  <span>{activeRepairScript ? 'Repairing Mesh...' : 'Run Python Mesh Repair'}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-2">
              <MeshViewer3D
                modelType="prosthetic_lattice"
                title={providerResults.find((p) => p.id === selectedProvider)?.name}
                polyCount={providerResults.find((p) => p.id === selectedProvider)?.polycount}
                toleranceDeltaMm={0.04}
                highlightDefect={
                  (providerResults.find((p) => p.id === selectedProvider)?.nonManifoldEdges ?? 0) > 0
                }
                colorScheme="teal"
              />
            </div>

            {/* Mesh Repair Sandbox Callout */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-3">
              <Code className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-xs space-y-1">
                <div className="font-semibold text-slate-800">Sandboxed Python Mesh Repair Log:</div>
                <div className="font-mono text-[11px] text-slate-600">
                  <code>
                    import trimesh; mesh = trimesh.load('output.stl'); trimesh.repair.fix_normals(mesh);
                    trimesh.repair.fill_holes(mesh)
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Provider Comparison Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-bold uppercase tracking-wider text-slate-600">Provider Benchmark Matrix</span>
            <span>Click to inspect 3D mesh</span>
          </div>

          <div className="space-y-2.5">
            {providerResults.map((provider) => {
              const isSelected = selectedProvider === provider.id;
              return (
                <div
                  key={provider.id}
                  id={`card-provider-${provider.id}`}
                  onClick={() => setSelectedProvider(provider.id as any)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/40 border-blue-600 ring-1 ring-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          provider.watertightness >= 98 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      <span className="font-semibold text-sm text-slate-900">{provider.name}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-medium">
                      {provider.tier}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Watertight</div>
                      <div
                        className={`font-mono font-bold ${
                          provider.watertightness >= 98 ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {provider.watertightness}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Triangles</div>
                      <div className="font-mono font-semibold text-slate-700">{provider.polycount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Latency</div>
                      <div className="font-mono font-semibold text-slate-700">{provider.inferenceTimeSec}s</div>
                    </div>
                  </div>

                  <div className="mt-2.5 text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-slate-800 font-semibold">Defect Audit: </span>
                    {provider.defects.join('; ')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action to log into student portfolio */}
          <div className="pt-2">
            <button
              id="btn-log-iteration-portfolio"
              onClick={handleSaveToPortfolio}
              className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-xs ${
                loggedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loggedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Logged to Student Portfolio Record!</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Log Benchmark Attempt to Portfolio & Rubric Record</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
