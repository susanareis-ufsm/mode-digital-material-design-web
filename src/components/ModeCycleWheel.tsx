import React from 'react';
import { PhaseId, PhaseInfo, MaterialProject } from '../types';
import { MODE_PHASES } from '../data/modePhasesData';
import { 
  Lightbulb, 
  Compass, 
  PenTool, 
  TestTube, 
  BarChart2, 
  RotateCcw, 
  Rocket, 
  Star,
  CheckCircle2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

interface ModeCycleWheelProps {
  currentPhaseId: PhaseId;
  onSelectPhase: (id: PhaseId) => void;
  project: MaterialProject;
  uiLanguage: 'pt' | 'en';
  onRestartCycleTrigger: () => void;
}

export const ModeCycleWheel: React.FC<ModeCycleWheelProps> = ({
  currentPhaseId,
  onSelectPhase,
  project,
  uiLanguage,
  onRestartCycleTrigger,
}) => {
  const isPt = uiLanguage === 'pt';

  // Calculate overall checklist completion percentage
  let totalTasks = 0;
  let completedTasks = 0;

  MODE_PHASES.forEach(phase => {
    const list = project.checklists[phase.id] || [];
    totalTasks += list.length;
    completedTasks += list.filter(item => item.completed).length;
  });

  const overallPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Icon mapping helper
  const renderIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'Lightbulb': return <Lightbulb className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'PenTool': return <PenTool className={className} />;
      case 'TestTube': return <TestTube className={className} />;
      case 'BarChart2': return <BarChart2 className={className} />;
      case 'RotateCcw': return <RotateCcw className={className} />;
      case 'Rocket': return <Rocket className={className} />;
      case 'Star': return <Star className={className} />;
      default: return <Lightbulb className={className} />;
    }
  };

  // Helper to construct circular SVG wedge paths for 8 phases
  // 8 segments = 45 deg each. Standard top start angle offset = -90 deg.
  const size = 520;
  const center = size / 2;
  const outerRadius = 220;
  const innerRadius = 135;
  const numPhases = 8;
  const angleStep = 360 / numPhases;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
      
      {/* Header section */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">
            {isPt ? 'Modelo Cíclico de Design de Artefatos Digitais (MoDE)' : 'MoDE Iterative Design Cycle'}
          </h3>
          <p className="text-xs text-slate-500">
            {isPt 
              ? 'Clique em qualquer fase do círculo para visualizar suas diretrizes e checklists.' 
              : 'Click any phase segment in the wheel to view guidelines & checklist.'}
          </p>
        </div>
        
        {/* Progress badge & Restart trigger */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{completedTasks}/{totalTasks} ({overallPercent}%)</span>
          </div>

          <button
            onClick={onRestartCycleTrigger}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border border-yellow-300 rounded-lg text-xs font-bold transition cursor-pointer"
            title={isPt ? 'Reiniciar iteração / Mudar fase atual' : 'Restart iteration / Switch active phase'}
          >
            <RefreshCw className="w-3.5 h-3.5 text-yellow-700" />
            <span>{isPt ? 'Re-iterar' : 'Re-iterate'}</span>
          </button>
        </div>
      </div>

      {/* SVG Circular Wheel Diagram */}
      <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center my-2">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full drop-shadow-sm select-none"
        >
          <defs>
            {/* Filter for subtle glow on active segment */}
            <filter id="active-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0288D1" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Outer Directional Arrows Ring */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius + 18}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* Render 8 Phase Wedges */}
          {MODE_PHASES.map((phase, index) => {
            const startAngle = index * angleStep - 90;
            const endAngle = (index + 1) * angleStep - 90;
            const midAngle = (startAngle + endAngle) / 2;

            // Convert polar to cartesian
            const toRad = (angle: number) => (angle * Math.PI) / 180;
            const x1Outer = center + outerRadius * Math.cos(toRad(startAngle));
            const y1Outer = center + outerRadius * Math.sin(toRad(startAngle));
            const x2Outer = center + outerRadius * Math.cos(toRad(endAngle));
            const y2Outer = center + outerRadius * Math.sin(toRad(endAngle));

            const x1Inner = center + innerRadius * Math.cos(toRad(startAngle));
            const y1Inner = center + innerRadius * Math.sin(toRad(startAngle));
            const x2Inner = center + innerRadius * Math.cos(toRad(endAngle));
            const y2Inner = center + innerRadius * Math.sin(toRad(endAngle));

            // Arc path d string
            const pathData = [
              `M ${x1Inner} ${y1Inner}`,
              `L ${x1Outer} ${y1Outer}`,
              `A ${outerRadius} ${outerRadius} 0 0 1 ${x2Outer} ${y2Outer}`,
              `L ${x2Inner} ${y2Inner}`,
              `A ${innerRadius} ${innerRadius} 0 0 0 ${x1Inner} ${y1Inner}`,
              'Z'
            ].join(' ');

            const isActive = currentPhaseId === phase.id;

            // Icon position (mid-radius polar)
            const iconRadius = (outerRadius + innerRadius) / 2;
            const iconX = center + iconRadius * Math.cos(toRad(midAngle));
            const iconY = center + iconRadius * Math.sin(toRad(midAngle));

            // Task completion count for this phase
            const phaseTasks = project.checklists[phase.id] || [];
            const phaseDone = phaseTasks.filter(t => t.completed).length;

            return (
              <g
                key={phase.id}
                role="button"
                tabIndex={0}
                aria-label={`${phase.stepNumber}. ${isPt ? phase.namePt : phase.nameEn}: ${phaseDone} de ${phaseTasks.length} concluídas`}
                aria-pressed={isActive}
                onClick={() => onSelectPhase(phase.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPhase(phase.id);
                  }
                }}
                className="cursor-pointer group transition-all duration-200 focus-visible:outline-none"
              >
                {/* Wedge Path */}
                <path
                  d={pathData}
                  fill={phase.colorHex}
                  opacity={isActive ? 1 : 0.82}
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  className={`transition-all duration-200 hover:opacity-100 ${
                    isActive ? 'scale-[1.03] origin-center shadow-lg' : ''
                  }`}
                  style={{ transformOrigin: `${center}px ${center}px` }}
                />

                {/* Text Label & Icon embedded into SVG segment */}
                <g transform={`translate(${iconX}, ${iconY})`}>
                  <foreignObject
                    x="-45"
                    y="-35"
                    width="90"
                    height="70"
                    className="pointer-events-none"
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center text-center text-white p-1">
                      <div className={`p-1.5 rounded-full ${isActive ? 'bg-white/30 ring-2 ring-white' : 'bg-black/15'}`}>
                        {renderIcon(phase.iconName, 'w-4 h-4 text-white')}
                      </div>
                      <span className="text-[10px] font-extrabold leading-tight mt-0.5 drop-shadow-sm truncate max-w-full">
                        {isPt ? phase.namePt.split('/')[0] : phase.nameEn}
                      </span>
                      <span className="text-[9px] font-semibold opacity-90">
                        {phaseDone}/{phaseTasks.length}
                      </span>
                    </div>
                  </foreignObject>
                </g>

                {/* Curved Arrow connector on outer edge pointing clockwise */}
                <g transform={`translate(${center + (outerRadius + 18) * Math.cos(toRad(midAngle))}, ${center + (outerRadius + 18) * Math.sin(toRad(midAngle))}) rotate(${midAngle + 90})`}>
                  <polygon
                    points="-4,-3 4,-3 0,5"
                    fill={phase.colorHex}
                  />
                </g>
              </g>
            );
          })}

          {/* Center Hub Circle */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius - 6}
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="4"
            className="shadow-inner"
          />

          {/* Center Content */}
          <foreignObject
            x={center - innerRadius + 12}
            y={center - innerRadius + 12}
            width={(innerRadius - 12) * 2}
            height={(innerRadius - 12) * 2}
          >
            <div className="w-full h-full rounded-full flex flex-col items-center justify-center text-center p-3 bg-slate-50/90">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                {isPt ? 'Fase Atual' : 'Active Phase'}
              </span>
              
              {/* Find Active Phase Details */}
              {(() => {
                const activePhaseObj = MODE_PHASES.find(p => p.id === currentPhaseId)!;
                return (
                  <>
                    <div className="flex items-center space-x-1 my-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${activePhaseObj.badgeBgClass}`} />
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {activePhaseObj.stepNumber}. {isPt ? activePhaseObj.namePt : activePhaseObj.nameEn}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug px-1 mb-2">
                      {isPt ? activePhaseObj.mainActionsPt : activePhaseObj.mainActionsEn}
                    </p>
                  </>
                );
              })()}

              <button
                onClick={onRestartCycleTrigger}
                className="mt-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-full transition shadow-xs flex items-center space-x-1 cursor-pointer"
              >
                <span>{isPt ? 'Mudar / Re-iterar' : 'Switch / Loop'}</span>
                <ArrowRight className="w-3 h-3 text-sky-400" />
              </button>
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Quick Phase Selection Pill List */}
      <div 
        className="w-full mt-4 flex flex-wrap justify-center gap-1.5 pt-4 border-t border-slate-100"
        role="navigation"
        aria-label={isPt ? 'Seleção rápida de fases' : 'Quick phase selection'}
      >
        {MODE_PHASES.map((p) => {
          const isActive = currentPhaseId === p.id;
          const tasks = project.checklists[p.id] || [];
          const done = tasks.filter(t => t.completed).length;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPhase(p.id)}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${p.stepNumber}. ${isPt ? p.namePt : p.nameEn}, ${done} de ${tasks.length} concluídas`}
              className={`px-3 py-1.2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: p.colorHex }} aria-hidden="true" />
              <span>{p.stepNumber}. {isPt ? p.namePt.split('/')[0] : p.nameEn}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                {done}/{tasks.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
