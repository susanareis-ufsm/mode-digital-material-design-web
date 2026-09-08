import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
  ReferenceLine,
} from 'recharts';
import { PhaseId, PhaseInfo } from '../types';
import { BarChart3, CheckSquare, MessageSquare, ArrowUpRight } from 'lucide-react';

export interface PhaseChartMetricItem {
  phase: PhaseInfo;
  totalItems: number;
  completedItems: number;
  answeredDecisions: number;
  taskPct: number;
  decisionPct: number;
}

interface PhaseCompletionChartProps {
  phaseMetrics: PhaseChartMetricItem[];
  onSelectPhase: (phaseId: PhaseId) => void;
  uiLanguage: 'pt' | 'en';
}

type ChartDisplayMode = 'grouped' | 'tasks' | 'decisions';

export const PhaseCompletionChart: React.FC<PhaseCompletionChartProps> = ({
  phaseMetrics,
  onSelectPhase,
  uiLanguage,
}) => {
  const isPt = uiLanguage === 'pt';
  const [displayMode, setDisplayMode] = useState<ChartDisplayMode>('grouped');

  // Prepare data formatted for Recharts
  const chartData = phaseMetrics.map((pm) => {
    const phaseName = isPt ? pm.phase.namePt : pm.phase.nameEn;
    // Short label for X-axis e.g. "1. Análise"
    const shortLabel = `${pm.phase.stepNumber}. ${phaseName.split(' ')[0]}`;

    return {
      phaseId: pm.phase.id,
      stepNumber: pm.phase.stepNumber,
      fullName: phaseName,
      name: shortLabel,
      color: pm.phase.colorHex,
      taskPct: pm.taskPct,
      decisionPct: pm.decisionPct,
      completedItems: pm.completedItems,
      answeredDecisions: pm.answeredDecisions,
      totalItems: pm.totalItems,
    };
  });

  const handleBarClick = (data: { phaseId?: PhaseId } | null) => {
    if (data?.phaseId) {
      onSelectPhase(data.phaseId);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
      {/* Chart Header & Display Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-sky-600" />
            <span>
              {isPt ? 'Gráfico de Conclusão das 8 Fases MoDE' : '8 MoDE Phases Completion Progress Chart'}
            </span>
          </h4>
          <p className="text-xs text-slate-500">
            {isPt
              ? 'Visualize e compare o percentual de tarefas concluídas e decisões registradas em cada fase.'
              : 'Visualize and compare completion percentages for tasks and decisions across all 8 phases.'}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-center">
          <button
            type="button"
            onClick={() => setDisplayMode('grouped')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              displayMode === 'grouped'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isPt ? 'Ambos (Comparativo)' : 'Both (Comparison)'}
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('tasks')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
              displayMode === 'tasks'
                ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3 h-3" />
            <span>{isPt ? 'Tarefas (%)' : 'Tasks (%)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('decisions')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
              displayMode === 'decisions'
                ? 'bg-amber-500 text-slate-950 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            <span>{isPt ? 'Decisões (%)' : 'Decisions (%)'}</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 15, left: -15, bottom: 25 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                const payload = state.activePayload[0].payload;
                handleBarClick(payload);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="name"
              stroke="#64748B"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              unit="%"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-4}
            />
            <Tooltip
              cursor={{ fill: '#F1F5F9', opacity: 0.7 }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-2 min-w-[210px]">
                    <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: data.color }}
                      />
                      <span className="font-extrabold text-sm text-white">
                        {data.fullName}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 flex items-center space-x-1">
                          <CheckSquare className="w-3 h-3 text-emerald-400" />
                          <span>{isPt ? 'Tarefas Concluídas:' : 'Tasks Done:'}</span>
                        </span>
                        <span className="font-black text-emerald-400">
                          {data.taskPct}% ({data.completedItems}/{data.totalItems})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3 text-amber-400" />
                          <span>{isPt ? 'Decisões Registradas:' : 'Decisions Logged:'}</span>
                        </span>
                        <span className="font-black text-amber-400">
                          {data.decisionPct}% ({data.answeredDecisions}/{data.totalItems})
                        </span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-sky-300 font-semibold flex items-center justify-end space-x-0.5">
                      <span>{isPt ? 'Clique para abrir esta fase' : 'Click to jump to phase'}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 12, fontSize: '12px' }}
              formatter={(value) => {
                if (value === 'taskPct') return isPt ? 'Tarefas Concluídas (%)' : 'Tasks Completed (%)';
                if (value === 'decisionPct') return isPt ? 'Decisões Registradas (%)' : 'Decisions Logged (%)';
                return value;
              }}
            />
            <ReferenceLine
              y={100}
              stroke="#94A3B8"
              strokeDasharray="4 4"
              label={{
                value: '100% Meta',
                position: 'top',
                fill: '#94A3B8',
                fontSize: 10,
                fontWeight: 700,
              }}
            />

            {/* Grouped mode: Both bars side by side */}
            {displayMode === 'grouped' && (
              <>
                <Bar
                  dataKey="taskPct"
                  name="taskPct"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                  className="cursor-pointer transition-opacity hover:opacity-85"
                />
                <Bar
                  dataKey="decisionPct"
                  name="decisionPct"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                  className="cursor-pointer transition-opacity hover:opacity-85"
                />
              </>
            )}

            {/* Tasks only: colored by each phase's distinct brand color */}
            {displayMode === 'tasks' && (
              <Bar
                dataKey="taskPct"
                name="taskPct"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                className="cursor-pointer transition-opacity hover:opacity-85"
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-task-${entry.phaseId}`} fill={entry.color} />
                ))}
              </Bar>
            )}

            {/* Decisions only: colored with phase accent */}
            {displayMode === 'decisions' && (
              <Bar
                dataKey="decisionPct"
                name="decisionPct"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                className="cursor-pointer transition-opacity hover:opacity-85"
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-decision-${entry.phaseId}`} fill={entry.color} />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer with Quick Action Hint & Legend of Phases */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-slate-700">
            {isPt ? 'Tarefas: Itens de checklist marcados' : 'Tasks: Checked action items'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
          <span className="font-semibold text-slate-700">
            {isPt ? 'Decisões: Respostas e anotações registradas' : 'Decisions: Pedagogical notes registered'}
          </span>
        </div>
        <span className="text-[11px] text-sky-700 font-medium">
          {isPt ? '💡 Dica: Clique nas barras do gráfico para ir direto à fase' : '💡 Tip: Click any bar to navigate to that phase'}
        </span>
      </div>
    </div>
  );
};
