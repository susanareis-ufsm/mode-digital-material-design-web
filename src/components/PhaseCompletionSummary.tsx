import React, { useState } from 'react';
import { MaterialProject, PhaseId } from '../types';
import { MODE_PHASES } from '../data/modePhasesData';
import { PhaseCompletionChart } from './PhaseCompletionChart';
import { 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  ArrowRight, 
  FolderKanban, 
  CheckSquare, 
  MessageSquare, 
  Filter,
  Sparkles,
  Award
} from 'lucide-react';

interface PhaseCompletionSummaryProps {
  projects: MaterialProject[];
  currentProjectId: string;
  onSelectPhase: (phaseId: PhaseId) => void;
  uiLanguage: 'pt' | 'en';
}

export const PhaseCompletionSummary: React.FC<PhaseCompletionSummaryProps> = ({
  projects,
  currentProjectId,
  onSelectPhase,
  uiLanguage,
}) => {
  const isPt = uiLanguage === 'pt';
  const [viewScope, setViewScope] = useState<'all' | 'current'>('all');
  const [metricType, setMetricType] = useState<'tasks' | 'decisions'>('tasks');

  const selectedProjects = viewScope === 'current'
    ? projects.filter(p => p.id === currentProjectId)
    : projects;

  // Calculate phase-by-phase completion metrics across selected projects
  const phaseMetrics = MODE_PHASES.map((phase) => {
    let totalItems = 0;
    let completedItems = 0;
    let answeredDecisions = 0;

    const projectBreakdown = selectedProjects.map((proj) => {
      const list = proj.checklists[phase.id] || [];
      const projTotal = list.length;
      const projCompleted = list.filter(i => i.completed).length;
      const projAnswered = list.filter(i => i.answer && i.answer.trim().length > 0).length;

      const projTaskPct = projTotal > 0 ? Math.round((projCompleted / projTotal) * 100) : 0;
      const projDecisionPct = projTotal > 0 ? Math.round((projAnswered / projTotal) * 100) : 0;

      totalItems += projTotal;
      completedItems += projCompleted;
      answeredDecisions += projAnswered;

      return {
        projectId: proj.id,
        projectTitle: proj.title,
        total: projTotal,
        completed: projCompleted,
        answered: projAnswered,
        taskPct: projTaskPct,
        decisionPct: projDecisionPct,
      };
    });

    const taskPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    const decisionPct = totalItems > 0 ? Math.round((answeredDecisions / totalItems) * 100) : 0;

    return {
      phase,
      totalItems,
      completedItems,
      answeredDecisions,
      taskPct,
      decisionPct,
      projectBreakdown,
    };
  });

  // Calculate global overall statistics
  const totalAllItems = phaseMetrics.reduce((acc, pm) => acc + pm.totalItems, 0);
  const totalAllCompleted = phaseMetrics.reduce((acc, pm) => acc + pm.completedItems, 0);
  const totalAllAnswered = phaseMetrics.reduce((acc, pm) => acc + pm.answeredDecisions, 0);

  const overallTaskPct = totalAllItems > 0 ? Math.round((totalAllCompleted / totalAllItems) * 100) : 0;
  const overallDecisionPct = totalAllItems > 0 ? Math.round((totalAllAnswered / totalAllItems) * 100) : 0;

  // Top performing phase & Phase needing attention
  const sortedByMetric = [...phaseMetrics].sort((a, b) => 
    metricType === 'tasks' ? b.taskPct - a.taskPct : b.decisionPct - a.decisionPct
  );
  const highestPhase = sortedByMetric[0];
  const lowestPhase = sortedByMetric[sortedByMetric.length - 1];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
      
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
                {isPt ? 'Dashboard de Métricas' : 'Metrics Dashboard'}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                MoDE Cycle Analytics
              </span>
            </div>
            
            <h3 className="text-xl font-black flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-sky-400" />
              <span>
                {isPt ? 'Resumo de Conclusão das 8 Fases MoDE' : '8 MoDE Phases Completion Summary'}
              </span>
            </h3>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {isPt 
                ? 'Acompanhe visualmente o progresso das tarefas concluídas e o percentual de decisões pedagógicas registradas em cada fase do modelo MoDE.' 
                : 'Visually monitor task completion percentages and registered pedagogical decisions across all 8 MoDE framework phases.'}
            </p>
          </div>

          {/* Controls: Scope Filter & Metric Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-start md:self-center">
            
            {/* Scope Selector: All Projects vs Current */}
            <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex items-center text-xs font-bold text-slate-300">
              <button
                onClick={() => setViewScope('all')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer ${
                  viewScope === 'all' ? 'bg-sky-500 text-slate-950 shadow-xs' : 'hover:text-white'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>{isPt ? `Todos (${projects.length})` : `All Projects (${projects.length})`}</span>
              </button>
              <button
                onClick={() => setViewScope('current')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer ${
                  viewScope === 'current' ? 'bg-sky-500 text-slate-950 shadow-xs' : 'hover:text-white'
                }`}
              >
                <span>{isPt ? 'Projeto Atual' : 'Current Project'}</span>
              </button>
            </div>

            {/* Metric Mode Toggle */}
            <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex items-center text-xs font-bold text-slate-300">
              <button
                onClick={() => setMetricType('tasks')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer ${
                  metricType === 'tasks' ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'hover:text-white'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{isPt ? 'Tarefas' : 'Tasks'}</span>
              </button>
              <button
                onClick={() => setMetricType('decisions')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer ${
                  metricType === 'decisions' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isPt ? 'Decisões' : 'Decisions'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Top KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {isPt ? 'Conclusão Global' : 'Overall Completion'}
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-xl font-extrabold text-white">
                {metricType === 'tasks' ? `${overallTaskPct}%` : `${overallDecisionPct}%`}
              </span>
              <span className="text-[11px] text-slate-400">
                {metricType === 'tasks' ? `${totalAllCompleted}/${totalAllItems}` : `${totalAllAnswered}/${totalAllItems}`}
              </span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${metricType === 'tasks' ? 'bg-emerald-400' : 'bg-amber-400'}`}
                style={{ width: `${metricType === 'tasks' ? overallTaskPct : overallDecisionPct}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {isPt ? 'Fase Mais Avançada' : 'Top Performing Phase'}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span 
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: highestPhase?.phase.colorHex }}
              />
              <span className="font-bold text-white truncate text-xs">
                {highestPhase ? (isPt ? highestPhase.phase.namePt : highestPhase.phase.nameEn) : '-'}
              </span>
              <span className="text-emerald-400 font-extrabold text-xs ml-auto">
                {highestPhase ? (metricType === 'tasks' ? `${highestPhase.taskPct}%` : `${highestPhase.decisionPct}%`) : '0%'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              {isPt ? 'Maior progresso registrado' : 'Highest completion percentage'}
            </span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {isPt ? 'Fase para Foco' : 'Phase Needing Focus'}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span 
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: lowestPhase?.phase.colorHex }}
              />
              <span className="font-bold text-white truncate text-xs">
                {lowestPhase ? (isPt ? lowestPhase.phase.namePt : lowestPhase.phase.nameEn) : '-'}
              </span>
              <span className="text-amber-400 font-extrabold text-xs ml-auto">
                {lowestPhase ? (metricType === 'tasks' ? `${lowestPhase.taskPct}%` : `${lowestPhase.decisionPct}%`) : '0%'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              {isPt ? 'Menor progresso acumulado' : 'Lowest completion percentage'}
            </span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {isPt ? 'Projetos Analisados' : 'Analyzed Projects'}
            </span>
            <div className="text-xl font-extrabold text-sky-400 mt-1">
              {selectedProjects.length}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {viewScope === 'all' 
                ? (isPt ? 'Consolidado de todo o sistema' : 'System-wide aggregate')
                : (isPt ? 'Foco no projeto selecionado' : 'Selected project scope')}
            </span>
          </div>

        </div>
      </div>

      {/* Recharts Bar Chart: 8 MoDE Phases Completion Visualization */}
      <div className="p-6 pb-0">
        <PhaseCompletionChart
          phaseMetrics={phaseMetrics}
          onSelectPhase={onSelectPhase}
          uiLanguage={uiLanguage}
        />
      </div>

      {/* 8 MoDE Phases Visual Completion Grid */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>{isPt ? 'Progresso por Fase do Ciclo MoDE' : 'Phase-by-Phase Progress Grid'}</span>
          </h4>
          <span className="text-xs text-slate-500 font-medium">
            {isPt ? 'Clique em uma fase para abrir os detalhes' : 'Click any phase card to jump to its workspace'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {phaseMetrics.map((pm) => {
            const { phase, taskPct, decisionPct, totalItems, completedItems, answeredDecisions, projectBreakdown } = pm;
            const currentMetricPct = metricType === 'tasks' ? taskPct : decisionPct;

            return (
              <div
                key={phase.id}
                onClick={() => onSelectPhase(phase.id)}
                className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-sky-300 rounded-2xl p-4 transition duration-200 shadow-2xs hover:shadow-md cursor-pointer group flex flex-col justify-between space-y-3"
              >
                {/* Top Card Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="w-7 h-7 rounded-xl text-xs font-black text-white flex items-center justify-center shadow-2xs"
                      style={{ backgroundColor: phase.colorHex }}
                    >
                      {phase.stepNumber}
                    </span>

                    <span 
                      className="text-xs font-black px-2.5 py-1 rounded-full border"
                      style={{ 
                        color: phase.colorHex,
                        borderColor: `${phase.colorHex}40`,
                        backgroundColor: `${phase.colorHex}10`
                      }}
                    >
                      {currentMetricPct}%
                    </span>
                  </div>

                  <h5 className="font-extrabold text-slate-900 text-sm group-hover:text-sky-700 transition">
                    {isPt ? phase.namePt : phase.nameEn}
                  </h5>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {isPt ? phase.mainActionsPt : phase.mainActionsEn}
                  </p>
                </div>

                {/* Main Progress Bar & Counters */}
                <div className="space-y-2 pt-2 border-t border-slate-200/80">
                  
                  {/* Task Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span className="flex items-center space-x-1">
                        <CheckSquare className="w-3 h-3 text-emerald-600" />
                        <span>{isPt ? 'Tarefas Concluídas' : 'Tasks Done'}</span>
                      </span>
                      <span className="text-slate-900 font-black">{taskPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-500" 
                        style={{ width: `${taskPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {completedItems} / {totalItems} {isPt ? 'tarefas' : 'tasks'}
                    </span>
                  </div>

                  {/* Decision Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3 text-amber-500" />
                        <span>{isPt ? 'Decisões Registradas' : 'Decisions Logged'}</span>
                      </span>
                      <span className="text-slate-900 font-black">{decisionPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-400 h-full transition-all duration-500" 
                        style={{ width: `${decisionPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {answeredDecisions} / {totalItems} {isPt ? 'decisões' : 'decisions'}
                    </span>
                  </div>

                  {/* Multi-project breakdown mini indicators */}
                  {viewScope === 'all' && projects.length > 1 && (
                    <div className="pt-2 border-t border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {isPt ? 'Por Projeto:' : 'By Project:'}
                      </span>
                      <div className="space-y-1">
                        {projectBreakdown.map((pb) => (
                          <div key={pb.projectId} className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-600 truncate max-w-[120px] font-medium" title={pb.projectTitle}>
                              {pb.projectTitle}
                            </span>
                            <span className="font-bold text-slate-800">
                              {metricType === 'tasks' ? `${pb.taskPct}%` : `${pb.decisionPct}%`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Link Footer */}
                  <div className="pt-2 text-right">
                    <span className="text-[11px] font-extrabold text-sky-600 group-hover:text-sky-800 inline-flex items-center space-x-1">
                      <span>{isPt ? 'Abrir Fase' : 'Open Phase'}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
