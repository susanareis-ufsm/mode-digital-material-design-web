import React, { useState } from 'react';
import { MaterialProject, PhaseId } from '../types';
import { MODE_PHASES } from '../data/modePhasesData';
import { X, RefreshCw, History, Plus, ArrowRight, Clock, User } from 'lucide-react';

interface IterationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: MaterialProject;
  onAddIterationLog: (fromPhase: PhaseId, toPhase: PhaseId, reason: string) => void;
  uiLanguage: 'pt' | 'en';
}

export const IterationHistoryModal: React.FC<IterationHistoryModalProps> = ({
  isOpen,
  onClose,
  project,
  onAddIterationLog,
  uiLanguage,
}) => {
  const isPt = uiLanguage === 'pt';

  const [fromPhase, setFromPhase] = useState<PhaseId>(project.currentPhase);
  const [toPhase, setToPhase] = useState<PhaseId>('redesign');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onAddIterationLog(fromPhase, toPhase, reason.trim());
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-yellow-500 via-amber-600 to-amber-700 p-6 text-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold">
              <RefreshCw className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-black">
                {isPt ? 'Registrar Re-iteração MoDE' : 'Record MoDE Iteration'}
              </h3>
              <p className="text-xs font-medium text-slate-900/90">
                {isPt ? 'O modelo MoDE é cíclico: você pode reiniciar ou voltar fases a qualquer momento.' : 'MoDE is cyclic: loop back to any phase whenever required.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-950 hover:bg-black/10 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* From Phase */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isPt ? 'Fase de Origem *' : 'Origin Phase *'}
              </label>
              <select
                value={fromPhase}
                onChange={(e) => setFromPhase(e.target.value as PhaseId)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
              >
                {MODE_PHASES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.stepNumber}. {isPt ? p.namePt : p.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* To Phase */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isPt ? 'Fase de Destino (Para onde iterar) *' : 'Target Phase (Loop To) *'}
              </label>
              <select
                value={toPhase}
                onChange={(e) => setToPhase(e.target.value as PhaseId)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
              >
                {MODE_PHASES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.stepNumber}. {isPt ? p.namePt : p.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {isPt ? 'Justificativa / Motivo da Re-iteração *' : 'Reason / Rationale for Re-iteration *'}
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={isPt ? 'Ex: Durante a testagem com alunos, identificamos que as instruções do áudio precisavam ser desaceleradas. Retornando ao (Re)Design.' : 'E.g., Pilot feedback showed speaking audio was too fast. Returning to (Re)Design.'}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs text-slate-900"
            />
          </div>

          {/* Iteration History List */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <History className="w-4 h-4 text-slate-500" />
              <span>{isPt ? 'Histórico de Iterações do Projeto:' : 'Project Iteration History:'}</span>
            </h4>

            {project.iterationLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                {isPt ? 'Nenhuma re-iteração gravada.' : 'No iteration logs recorded yet.'}
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {project.iterationLogs.map((log) => {
                  const pFrom = MODE_PHASES.find((p) => p.id === log.fromPhase);
                  const pTo = MODE_PHASES.find((p) => p.id === log.toPhase);
                  return (
                    <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <div className="flex items-center space-x-1">
                          <span className="text-sky-700">{pFrom ? pFrom.stepNumber : ''}. {pFrom ? (isPt ? pFrom.namePt.split('/')[0] : pFrom.nameEn) : ''}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="text-amber-700">{pTo ? pTo.stepNumber : ''}. {pTo ? (isPt ? pTo.namePt.split('/')[0] : pTo.nameEn) : ''}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 italic">"{log.reason}"</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {isPt ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-950 rounded-lg text-xs font-extrabold shadow-xs transition cursor-pointer"
            >
              {isPt ? 'Salvar Iteração & Alternar Fase' : 'Save Iteration & Switch Phase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
