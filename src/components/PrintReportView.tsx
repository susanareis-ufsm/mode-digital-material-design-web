import React, { useState } from 'react';
import { MaterialProject } from '../types';
import { MODE_PHASES } from '../data/modePhasesData';
import { 
  Printer, 
  X, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Download, 
  Share2, 
  Sparkles,
  CloudUpload,
  Copy,
  Check
} from 'lucide-react';

interface PrintReportViewProps {
  project: MaterialProject;
  onClose: () => void;
  uiLanguage: 'pt' | 'en';
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  project,
  onClose,
  uiLanguage,
}) => {
  const isPt = uiLanguage === 'pt';
  const [copied, setCopied] = useState(false);
  const [driveSaving, setDriveSaving] = useState(false);
  const [driveMessage, setDriveMessage] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  // Overall Completion stats
  let totalQuestions = 0;
  let answeredQuestions = 0;
  let completedTasks = 0;

  MODE_PHASES.forEach((p) => {
    const list = project.checklists[p.id] || [];
    totalQuestions += list.length;
    answeredQuestions += list.filter((t) => t.answer && t.answer.trim().length > 0).length;
    completedTasks += list.filter((t) => t.completed).length;
  });

  const overallAnsweredPercent = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  const overallTaskPercent = totalQuestions > 0 ? Math.round((completedTasks / totalQuestions) * 100) : 0;

  // Format decision report text for download / Drive / copy
  const generateTextReport = (): string => {
    let report = `==========================================================\n`;
    report += `RELATÓRIO DE DECISÕES PEDAGÓGICAS - MODELO MoDE\n`;
    report += `==========================================================\n\n`;
    report += `Título do Artefato: ${project.title}\n`;
    report += `Autor(a): ${project.author || 'N/A'}\n`;
    report += `Língua Alvo: ${project.targetLanguage || 'N/A'}\n`;
    report += `Público-Alvo: ${project.audience || 'N/A'}\n`;
    report += `Plataforma: ${project.platform || 'N/A'}\n`;
    report += `Propósito Pedagógico: ${project.purpose || 'N/A'}\n`;
    report += `Conteúdo Linguístico: ${project.content || 'N/A'}\n`;
    report += `Data de Emissão: ${new Date().toLocaleDateString()}\n`;
    report += `Progresso de Decisões Registradas: ${answeredQuestions}/${totalQuestions} (${overallAnsweredPercent}%)\n\n`;

    report += `----------------------------------------------------------\n`;
    report += `REGISTRO DE DECISÕES TOMADAS POR FASE DO CICLO MoDE\n`;
    report += `----------------------------------------------------------\n\n`;

    MODE_PHASES.forEach((phase) => {
      const list = project.checklists[phase.id] || [];
      const phaseAnswered = list.filter((i) => i.answer && i.answer.trim().length > 0).length;

      report += `=== FASE ${phase.stepNumber}: ${phase.namePt.toUpperCase()} (${phaseAnswered}/${list.length} Decisões) ===\n`;
      report += `Ações Principais: ${phase.mainActionsPt}\n\n`;

      list.forEach((item, idx) => {
        report += `[Pergunta ${idx + 1}] ${item.textPt}\n`;
        if (item.answer && item.answer.trim().length > 0) {
          report += `   >>> DECISÃO REGISTRADA: ${item.answer.trim()}\n`;
        } else {
          report += `   >>> DECISÃO REGISTRADA: [Aguardando registro de decisão]\n`;
        }
        report += `   Status da Tarefa: ${item.completed ? 'CONCLUÍDA ✓' : 'EM ANDAMENTO ○'}\n\n`;
      });

      const phaseNotes = project.notes.filter((n) => n.phaseId === phase.id);
      if (phaseNotes.length > 0) {
        report += `   Notas e Evidências da Fase:\n`;
        phaseNotes.forEach((note) => {
          report += `   - ${note.title}: ${note.content}\n`;
        });
        report += `\n`;
      }

      if (phase.id === 'analyze' && (project.audienceFiles?.length || project.audienceAnalysis)) {
        report += `   >>> FONTES DE DADOS E DIAGNÓSTICO DO PÚBLICO:\n`;
        if (project.audienceFiles?.length) {
          report += `   Arquivos de Pesquisa: ${project.audienceFiles.map((f) => f.name).join(', ')}\n`;
        }
        if (project.audienceAnalysis) {
          report += `   Nível de Proficiência Estimado: ${project.audienceAnalysis.proficiencyLevel}\n`;
          report += `   Síntese do Perfil: ${project.audienceAnalysis.overallProfile}\n`;
          report += `   Necessidades Linguísticas: ${project.audienceAnalysis.learningNeeds.join('; ')}\n`;
          report += `   Perfil Tecnológico: ${project.audienceAnalysis.technologicalProfile}\n`;
          report += `   Obstáculos & Filtro Afetivo: ${project.audienceAnalysis.painPointsAndBarriers.join('; ')}\n`;
        }
        report += `\n`;
      }

      report += `----------------------------------------------------------\n\n`;
    });

    if (project.gamificationStrategies.length > 0) {
      report += `==========================================================\n`;
      report += `ESTRATÉGIAS DE GAMIFICAÇÃO INTEGRADAS\n`;
      report += `==========================================================\n\n`;
      project.gamificationStrategies.forEach((g) => {
        report += `- ${g.title} (${g.category})\n`;
        report += `  Habilidade: ${g.targetSkill} | Fase: ${g.targetPhase}\n`;
        report += `  Regras: ${g.description}\n`;
        if (g.platformTip) report += `  Dica de Plataforma: ${g.platformTip}\n`;
        report += `\n`;
      });
    }

    return report;
  };

  const handleDownloadDoc = () => {
    const text = generateTextReport();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `MoDE_Relatorio_Decisoes_${safeTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    const text = generateTextReport();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExportToDrive = async () => {
    setDriveSaving(true);
    setDriveMessage(null);

    // Prompt download as document & offer Drive upload guidance
    try {
      handleDownloadDoc();
      setDriveMessage(
        isPt
          ? 'O relatório de decisões foi baixado como documento formatado. Para salvar no Google Drive, faça o upload direto no seu armazenamento Google Drive.'
          : 'Decision report downloaded as document. You can now upload it directly to your Google Drive folder.'
      );
    } catch (err: any) {
      setDriveMessage(isPt ? 'Erro ao gerar o arquivo para o Google Drive.' : 'Error generating file for Google Drive.');
    } finally {
      setDriveSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex justify-center p-4 overflow-y-auto">
      
      {/* Floating Action Bar */}
      <div className="no-print fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white p-2 rounded-2xl shadow-2xl border border-slate-700">
        <button
          onClick={handleCopyToClipboard}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
          title={isPt ? 'Copiar relatório completo' : 'Copy report'}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
          <span>{copied ? (isPt ? 'Copiado!' : 'Copied!') : (isPt ? 'Copiar Texto' : 'Copy Text')}</span>
        </button>

        <button
          onClick={handleDownloadDoc}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
          title={isPt ? 'Baixar documento em texto' : 'Download document'}
        >
          <Download className="w-4 h-4 text-slate-300" />
          <span>{isPt ? 'Baixar .TXT' : 'Download TXT'}</span>
        </button>

        <button
          onClick={handleExportToDrive}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
          title={isPt ? 'Exportar para o Google Drive' : 'Export to Google Drive'}
        >
          <CloudUpload className="w-4 h-4 text-white" />
          <span>{isPt ? 'Google Drive' : 'Google Drive'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{isPt ? 'Imprimir / PDF' : 'Print / Save PDF'}</span>
        </button>

        <button
          onClick={onClose}
          className="p-2 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white text-slate-900 rounded-none sm:rounded-2xl shadow-2xl max-w-4xl w-full p-8 my-8 print:my-0 print:p-0 print:shadow-none print:max-w-none border border-slate-200">
        
        {driveMessage && (
          <div className="no-print mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CloudUpload className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{driveMessage}</span>
            </div>
            <button onClick={() => setDriveMessage(null)} className="text-emerald-700 font-bold ml-2 cursor-pointer">
              OK
            </button>
          </div>
        )}

        {/* Header Document */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <span className="text-xs font-black tracking-widest uppercase text-sky-800">
              {isPt ? 'Modelo Cíclico de Design de Artefatos Digitais (MoDE)' : 'MoDE Framework Report'}
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              {project.title}
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              {isPt ? 'Relatório de Decisões Pedagógicas e Registro de Diretrizes' : 'Pedagogical Decision Log & Guidelines Report'}
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 self-end sm:self-auto space-y-1">
            <div><strong>{isPt ? 'Data de Emissão:' : 'Date:'}</strong> {new Date().toLocaleDateString()}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
                {isPt ? 'Decisões:' : 'Decisions:'} {answeredQuestions}/{totalQuestions} ({overallAnsweredPercent}%)
              </span>
              <span className="font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                {isPt ? 'Tarefas:' : 'Tasks:'} {completedTasks}/{totalQuestions} ({overallTaskPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Project Metadata Box */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block">{isPt ? 'Autor(es):' : 'Author(s):'}</span>
            <span className="font-bold text-slate-800">{project.author || '-'}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block">{isPt ? 'Plataforma de Dev:' : 'Development Platform:'}</span>
            <span className="font-bold text-slate-800">{project.platform || '-'}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block">{isPt ? 'Língua Alvo:' : 'Target Language:'}</span>
            <span className="font-bold text-slate-800">{project.targetLanguage || '-'}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block">{isPt ? 'Público-Alvo:' : 'Target Audience:'}</span>
            <span className="font-medium text-slate-800">{project.audience || '-'}</span>
          </div>

          <div className="col-span-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">{isPt ? 'Propósito Pedagógico:' : 'Pedagogical Purpose:'}</span>
            <span className="font-medium text-slate-800">{project.purpose || '-'}</span>
          </div>

          <div className="col-span-3">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">{isPt ? 'Conteúdo Linguístico:' : 'Linguistic Content:'}</span>
            <span className="font-medium text-slate-800">{project.content || '-'}</span>
          </div>
        </div>

        {/* 8 MoDE Phases - Registered Decisions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-slate-900">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
              {isPt ? 'Registro de Decisões por Fase do Ciclo MoDE' : 'Phase-by-Phase Pedagogical Decision Register'}
            </h2>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              {answeredQuestions} {isPt ? 'Decisões Registradas' : 'Registered Decisions'}
            </span>
          </div>

          <div className="space-y-6">
            {MODE_PHASES.map((phase) => {
              const list = project.checklists[phase.id] || [];
              const phaseAnswered = list.filter((i) => i.answer && i.answer.trim().length > 0).length;
              const phaseCompleted = list.filter((i) => i.completed).length;

              return (
                <div key={phase.id} className="border border-slate-200 rounded-xl overflow-hidden print-break-inside-avoid shadow-2xs">
                  {/* Phase Bar */}
                  <div className="p-3 text-white flex justify-between items-center text-xs font-bold" style={{ backgroundColor: phase.colorHex }}>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-black/20 text-white font-black text-[10px] uppercase">
                        Fase {phase.stepNumber}
                      </span>
                      <span className="text-sm font-extrabold">
                        {isPt ? phase.namePt : phase.nameEn}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px]">
                      <span>{isPt ? 'Decisões:' : 'Decisions:'} {phaseAnswered}/{list.length}</span>
                      <span>•</span>
                      <span>{isPt ? 'Concluídas:' : 'Done:'} {phaseCompleted}/{list.length}</span>
                    </div>
                  </div>

                  {/* Questions & Registered Decisions */}
                  <div className="p-4 bg-white text-xs space-y-4">
                    {list.map((item, idx) => {
                      const questionText = isPt ? item.textPt : item.textEn;
                      const hasAnswer = item.answer && item.answer.trim().length > 0;

                      return (
                        <div key={item.id} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2 flex-1">
                              <span className={`font-bold mt-0.5 ${item.completed ? 'text-emerald-600' : 'text-slate-300'}`}>
                                {item.completed ? '✓' : '○'}
                              </span>
                              <span className="font-extrabold text-slate-900 leading-snug">
                                [{idx + 1}] {questionText}
                              </span>
                            </div>

                            {hasAnswer ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex-shrink-0">
                                {isPt ? 'Decisão Registrada' : 'Answered'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex-shrink-0">
                                {isPt ? 'Pendente' : 'Pending'}
                              </span>
                            )}
                          </div>

                          {/* Registered Decision Box */}
                          <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                            hasAnswer ? 'bg-sky-50/50 border-sky-200 text-slate-800' : 'bg-white border-dashed border-slate-300 text-slate-400 italic'
                          }`}>
                            <span className="font-bold text-sky-900 block text-[11px] mb-0.5">
                              {isPt ? 'Decisão Pedagógica Tomada:' : 'Registered Pedagogical Decision:'}
                            </span>
                            <p className="whitespace-pre-line font-medium">
                              {hasAnswer ? item.answer : (isPt ? 'Nenhuma decisão cadastrada para esta pergunta até o momento.' : 'No decision registered for this question yet.')}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Phase 1 Audience Diagnostic Profile Box */}
                    {phase.id === 'analyze' && (project.audienceFiles?.length || project.audienceAnalysis) && (
                      <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2 print-break-inside-avoid">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-900 text-xs uppercase tracking-wider">
                            {isPt ? 'Diagnóstico do Público-Alvo (Fontes & Perfil):' : 'Audience Profile Diagnostic (Sources & Profile):'}
                          </span>
                          {project.audienceAnalysis?.proficiencyLevel && (
                            <span className="px-2 py-0.5 rounded bg-sky-200 text-sky-900 font-bold text-[10px]">
                              {project.audienceAnalysis.proficiencyLevel}
                            </span>
                          )}
                        </div>

                        {project.audienceFiles && project.audienceFiles.length > 0 && (
                          <p className="text-[11px] text-slate-600">
                            <strong>{isPt ? 'Fontes Analisadas:' : 'Analyzed Sources:'}</strong>{' '}
                            {project.audienceFiles.map((f) => f.name).join(', ')}
                          </p>
                        )}

                        {project.audienceAnalysis && (
                          <div className="text-[11px] text-slate-700 space-y-1 bg-white p-2.5 rounded-lg border border-sky-100 leading-relaxed">
                            <p><strong>{isPt ? 'Síntese do Perfil:' : 'Profile Synthesis:'}</strong> {project.audienceAnalysis.overallProfile}</p>
                            <p><strong>{isPt ? 'Necessidades Linguísticas:' : 'Language Needs:'}</strong> {project.audienceAnalysis.learningNeeds.join('; ')}</p>
                            <p><strong>{isPt ? 'Perfil Tecnológico:' : 'Tech Profile:'}</strong> {project.audienceAnalysis.technologicalProfile}</p>
                            <p><strong>{isPt ? 'Obstáculos & Filtro Afetivo:' : 'Barriers & Affective Filter:'}</strong> {project.audienceAnalysis.painPointsAndBarriers.join('; ')}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Phase Notes */}
                    {project.notes.filter((n) => n.phaseId === phase.id).length > 0 && (
                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <span className="font-bold text-xs text-indigo-900 uppercase tracking-wider block">
                          {isPt ? 'Evidências & Observações da Fase:' : 'Phase Notes & Findings:'}
                        </span>
                        {project.notes.filter((n) => n.phaseId === phase.id).map((note) => (
                          <div key={note.id} className="p-2.5 bg-indigo-50/50 border border-indigo-200 rounded-lg text-xs">
                            <span className="font-bold text-slate-900 block">{note.title}</span>
                            <p className="text-slate-700 whitespace-pre-line mt-1">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gamification Strategies Table */}
        <div className="mb-8 print-break-inside-avoid">
          <h2 className="text-base font-black text-slate-900 mb-4 pb-1 border-b-2 border-slate-900 uppercase tracking-wider">
            {isPt ? 'Estratégias de Gamificação Registradas' : 'Registered Gamification Strategies'}
          </h2>

          {project.gamificationStrategies.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              {isPt ? 'Nenhuma estratégia de gamificação cadastrada para este artefato.' : 'No gamification strategies registered for this artifact.'}
            </p>
          ) : (
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">{isPt ? 'Título' : 'Title'}</th>
                  <th className="p-2.5">{isPt ? 'Categoria' : 'Category'}</th>
                  <th className="p-2.5">{isPt ? 'Habilidade' : 'Skill'}</th>
                  <th className="p-2.5">{isPt ? 'Descrição & Regras' : 'Rules & Description'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {project.gamificationStrategies.map((g) => (
                  <tr key={g.id}>
                    <td className="p-2.5 font-bold text-slate-900">{g.title}</td>
                    <td className="p-2.5">{g.category}</td>
                    <td className="p-2.5">{g.targetSkill}</td>
                    <td className="p-2.5 text-slate-700">{g.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Iteration History */}
        {project.iterationLogs.length > 0 && (
          <div className="print-break-inside-avoid">
            <h2 className="text-base font-black text-slate-900 mb-3 pb-1 border-b-2 border-slate-900 uppercase tracking-wider">
              {isPt ? 'Histórico de Iterações Cíclicas MoDE' : 'Cyclic Iteration Logs'}
            </h2>
            <div className="space-y-2 text-xs">
              {project.iterationLogs.map((log) => {
                const pFrom = MODE_PHASES.find((p) => p.id === log.fromPhase);
                const pTo = MODE_PHASES.find((p) => p.id === log.toPhase);
                return (
                  <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-bold text-slate-800">
                      {pFrom ? (isPt ? pFrom.namePt : pFrom.nameEn) : ''} → {pTo ? (isPt ? pTo.namePt : pTo.nameEn) : ''}
                    </div>
                    <div className="text-slate-600 italic mt-0.5">"{log.reason}"</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Academic Authorship & Framework Attribution Footer */}
        <div className="mt-8 pt-4 border-t border-slate-300 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 print-break-inside-avoid">
          <div>
            <strong>MoDE</strong> — {isPt ? 'Modelo Cíclico de Design de Artefatos Digitais para o Ensino de Línguas' : 'Cyclic Digital Material Design Model for Language Teaching'}
          </div>
          <div>
            {isPt ? 'Autoria & Concepção:' : 'Authorship & Framework Creation:'}{' '}
            <strong>Profª. Dra. Susana Cristina dos Reis (UFSM • LabEon • NUPEAD)</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
