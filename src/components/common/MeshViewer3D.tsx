import React, { useRef, useEffect, useState } from 'react';
import { Box, Eye, Layers, RotateCw, ZoomIn, ZoomOut, Compass, Sparkles, CheckCircle2, AlertTriangle, Maximize2 } from 'lucide-react';

interface MeshViewer3DProps {
  modelType?: 'generated_artifact' | 'cad_mating_fit' | 'scan_pointcloud' | 'prosthetic_lattice' | 'calibration_cube';
  title?: string;
  polyCount?: number;
  toleranceDeltaMm?: number;
  highlightDefect?: boolean;
  colorScheme?: 'teal' | 'amber' | 'emerald' | 'indigo' | 'stress';
}

export const MeshViewer3D: React.FC<MeshViewer3DProps> = ({
  modelType = 'generated_artifact',
  title = '3D Geometric Artifact View',
  polyCount = 142800,
  toleranceDeltaMm = 0.04,
  highlightDefect = false,
  colorScheme = 'teal'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotX, setRotX] = useState<number>(25);
  const [rotY, setRotY] = useState<number>(45);
  const [zoom, setZoom] = useState<number>(1.1);
  const [renderMode, setRenderMode] = useState<'solid' | 'wireframe' | 'points' | 'stress'>('solid');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Mouse & Touch handling for 3D rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setAutoRotate(false);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setRotY((prev) => prev + dx * 0.7);
    setRotX((prev) => Math.max(-85, Math.min(85, prev - dy * 0.7)));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Canvas drawing loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentRotY = rotY;

    const render = () => {
      if (autoRotate && !isDragging) {
        currentRotY += 0.4;
        setRotY(currentRotY);
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3D Projection math
      const radX = (rotX * Math.PI) / 180;
      const radY = (rotY * Math.PI) / 180;
      const cx = width / 2;
      const cy = height / 2;
      const scale = 110 * zoom;

      const project = (x: number, y: number, z: number) => {
        // Rotate around Y
        const x1 = x * Math.cos(radY) + z * Math.sin(radY);
        const z1 = -x * Math.sin(radY) + z * Math.cos(radY);
        // Rotate around X
        const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
        const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

        const fov = 400 / (400 + z2);
        return {
          x: cx + x1 * scale * fov,
          y: cy - y2 * scale * fov,
          z: z2
        };
      };

      // Generate 3D nodes based on modelType
      const nodes: { x: number; y: number; z: number }[] = [];
      const edges: [number, number][] = [];
      const faces: [number, number, number, string][] = [];

      if (modelType === 'calibration_cube') {
        // Simple Cube
        const s = 0.7;
        const pts = [
          [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
          [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
        ];
        pts.forEach(p => nodes.push({ x: p[0], y: p[1], z: p[2] }));

        const cubeFaces: [number, number, number, number][] = [
          [0, 1, 2, 3],
          [4, 5, 6, 7],
          [0, 1, 5, 4],
          [2, 3, 7, 6],
          [0, 3, 7, 4],
          [1, 2, 6, 5]
        ];
        cubeFaces.forEach(face => {
          edges.push([face[0], face[1]], [face[1], face[2]], [face[2], face[3]], [face[3], face[0]]);
        });
      } else if (modelType === 'prosthetic_lattice' || modelType === 'generated_artifact') {
        // Torus / Bio-Lattice shape
        const uSteps = 16;
        const vSteps = 12;
        const R = 0.75;
        const r = 0.35;

        for (let i = 0; i < uSteps; i++) {
          const u = (i / uSteps) * Math.PI * 2;
          for (let j = 0; j < vSteps; j++) {
            const v = (j / vSteps) * Math.PI * 2;
            const x = (R + r * Math.cos(v)) * Math.cos(u);
            const y = (R + r * Math.cos(v)) * Math.sin(u) * 0.85;
            const z = r * Math.sin(v) + Math.sin(u * 3) * 0.1;
            nodes.push({ x, y, z });

            const curr = i * vSteps + j;
            const nextV = i * vSteps + ((j + 1) % vSteps);
            const nextU = ((i + 1) % uSteps) * vSteps + j;
            edges.push([curr, nextV], [curr, nextU]);
          }
        }
      } else {
        // CAD Mating Flange / Scan model with cylinder + flange holes
        const segments = 20;
        const radius = 0.8;
        const heightM = 0.9;
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          nodes.push({ x, y: -heightM / 2, z });
          nodes.push({ x, y: heightM / 2, z });
          // Inner bore
          const xi = Math.cos(angle) * (radius * 0.45);
          const zi = Math.sin(angle) * (radius * 0.45);
          nodes.push({ x: xi, y: -heightM / 2, z: zi });
          nodes.push({ x: xi, y: heightM / 2, z: zi });

          const idx = i * 4;
          const nextIdx = ((i + 1) % segments) * 4;
          edges.push([idx, idx + 1], [idx, nextIdx], [idx + 1, nextIdx + 1]);
          edges.push([idx + 2, idx + 3], [idx + 2, nextIdx + 2], [idx + 3, nextIdx + 3]);
        }
      }

      // Draw Edges or Nodes
      if (renderMode === 'solid' || renderMode === 'wireframe' || renderMode === 'stress') {
        edges.forEach(([i1, i2]) => {
          const p1 = project(nodes[i1].x, nodes[i1].y, nodes[i1].z);
          const p2 = project(nodes[i2].x, nodes[i2].y, nodes[i2].z);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          if (renderMode === 'stress') {
            const stressVal = Math.abs(nodes[i1].y + nodes[i2].y) * 0.8;
            ctx.strokeStyle = stressVal > 0.4 ? '#ef4444' : stressVal > 0.2 ? '#f59e0b' : '#10b981';
            ctx.lineWidth = 1.6;
          } else {
            ctx.strokeStyle = colorScheme === 'amber' ? '#f59e0b' : colorScheme === 'emerald' ? '#10b981' : '#06b6d4';
            ctx.lineWidth = renderMode === 'solid' ? 1.4 : 1.0;
          }
          ctx.stroke();
        });
      }

      if (renderMode === 'points' || renderMode === 'solid') {
        nodes.forEach((node, i) => {
          const p = project(node.x, node.y, node.z);
          ctx.beginPath();
          ctx.arc(p.x, p.y, renderMode === 'points' ? 2.5 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = highlightDefect && i % 15 === 0 ? '#f43f5e' : '#38bdf8';
          ctx.fill();
        });
      }

      // Highlight defect callout if applicable
      if (highlightDefect) {
        const pDefect = project(0.4, 0.3, 0.4);
        ctx.beginPath();
        ctx.arc(pDefect.x, pDefect.y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffe4e6';
        ctx.font = '11px sans-serif';
        ctx.fillText('Non-manifold island', pDefect.x + 12, pDefect.y - 4);
      }

      // Draw Floor Platform
      const floorSize = 1.2;
      const fp1 = project(-floorSize, -0.9, -floorSize);
      const fp2 = project(floorSize, -0.9, -floorSize);
      const fp3 = project(floorSize, -0.9, floorSize);
      const fp4 = project(-floorSize, -0.9, floorSize);

      ctx.beginPath();
      ctx.moveTo(fp1.x, fp1.y);
      ctx.lineTo(fp2.x, fp2.y);
      ctx.lineTo(fp3.x, fp3.y);
      ctx.lineTo(fp4.x, fp4.y);
      ctx.closePath();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (autoRotate && !isDragging) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [rotX, rotY, zoom, renderMode, autoRotate, isDragging, modelType, highlightDefect, colorScheme]);

  return (
    <div id="mesh-viewer-container" className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Top Bar with metadata and controls */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 backdrop-blur border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Box className="w-4 h-4 text-teal-400" />
          <span className="font-semibold text-slate-200">{title}</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
            {polyCount.toLocaleString()} tris
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              id="btn-mode-solid"
              onClick={() => setRenderMode('solid')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                renderMode === 'solid' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Solid
            </button>
            <button
              id="btn-mode-wireframe"
              onClick={() => setRenderMode('wireframe')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                renderMode === 'wireframe' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Wireframe
            </button>
            <button
              id="btn-mode-points"
              onClick={() => setRenderMode('points')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                renderMode === 'points' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Point Cloud
            </button>
            <button
              id="btn-mode-stress"
              onClick={() => setRenderMode('stress')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                renderMode === 'stress' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FEA Stress
            </button>
          </div>

          <button
            id="btn-toggle-autorotate"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg border transition ${
              autoRotate
                ? 'bg-teal-950/70 border-teal-500/50 text-teal-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas */}
      <div className="relative h-64 sm:h-72 w-full cursor-grab active:cursor-grabbing flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={320}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full block"
        />

        {/* Floating Calibration & Tolerance HUD Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur border border-slate-800/80 rounded-lg p-2 text-[11px] font-mono text-slate-300 space-y-1 shadow-md pointer-events-none">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">TOLERANCE DELTA:</span>
            <span className={`font-semibold ${toleranceDeltaMm <= 0.15 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {toleranceDeltaMm > 0 ? `+${toleranceDeltaMm}` : toleranceDeltaMm} mm
            </span>
            {toleranceDeltaMm <= 0.15 ? (
              <span className="inline-flex items-center px-1 rounded bg-emerald-950 text-emerald-300 text-[10px]">
                PASS (&plusmn;0.15mm)
              </span>
            ) : (
              <span className="inline-flex items-center px-1 rounded bg-rose-950 text-rose-300 text-[10px]">
                OUT OF SPEC
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3 text-slate-400 text-[10px]">
            <span>Rot: {Math.round(rotX)}&deg;, {Math.round(rotY)}&deg;</span>
            <span>Zoom: {Math.round(zoom * 100)}%</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col space-y-1">
          <button
            id="btn-zoom-in"
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 shadow"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-zoom-out"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 shadow"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
