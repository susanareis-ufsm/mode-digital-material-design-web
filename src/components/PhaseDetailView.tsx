import React, { useState, useRef, useEffect } from 'react';
import { 
  PhaseId, 
  PhaseInfo, 
  MaterialProject, 
  PhaseChecklistItem 
} from '../types';
import { VoiceDictationButton } from './VoiceDictationButton';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Gamepad2, 
  FileText, 
  Trash2, 
  RefreshCw, 
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Edit3,
  MessageSquare,
  Search,
  Filter,
  Check,
  ArrowUp,
  ArrowDown,
  GripVertical
} from 'lucide-react';

interface PhaseDetailViewProps {
  phase: PhaseInfo;
  project: MaterialProject;
  onToggleItem: (phaseId: PhaseId, itemId: string) => void;
  onUpdateItemAnswer: (phaseId: PhaseId, itemId: string, answer: string) => void;
  onUpdateItemQuestionText?: (phaseId: PhaseId, itemId: string, text: string) => void;
  onMoveItem?: (phaseId: PhaseId, itemId: string, direction: 'up' | 'down') => void;
  onReorderItems?: (phaseId: PhaseId, reorderedItems: PhaseChecklistItem[]) => void;
  onAddCustomItem: (phaseId: PhaseId, text: string) => void;
  onDeleteItem: (phaseId: PhaseId, itemId: string) => void;
  onAddNote: (phaseId: PhaseId, title: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
  onRestartCycle: () => void;
  onNextPhase: () => void;
  uiLanguage: 'pt' | 'en';
}

export const PhaseDetailView: React.FC<PhaseDetailViewProps> = ({
  phase,
  project,
  onToggleItem,
  onUpdateItemAnswer,
  onUpdateItemQuestionText,
  onMoveItem,
  onReorderItems,
  onAddCustomItem,
  onDeleteItem,
  onAddNote,
  onDeleteNote,
  onRestartCycle,
  onNextPhase,
  uiLanguage,
}) => {
  const isPt = uiLanguage === 'pt';
  const [newItemText, setNewItemText] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  
  // Question text editing state
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState('');

  // Drag and drop state for reordering questions
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);
  
  // Filter & Search
  const [filterMode, setFilterMode] = useState<'all' | 'unanswered' | 'answered' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active editing item states (to track text changes smoothly)
  const [editingAnswers, setEditingAnswers] = useState<Record<string, string>>({});

  const checklist = project.checklists[phase.id] || [];
  const completedCount = checklist.filter((i) => i.completed).length;
  const answeredCount = checklist.filter((i) => i.answer && i.answer.trim().length > 0).length;
  
  const completionPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;
  const answeredPercent = checklist.length > 0 ? Math.round((answeredCount / checklist.length) * 100) : 0;

  // Gamification strategies registered for this phase
  const phaseGamification = project.gamificationStrategies.filter(g => g.targetPhase === phase.id);

  // Notes written for this phase
  const phaseNotes = project.notes.filter(n => n.phaseId === phase.id);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddCustomItem(phase.id, newItemText.trim());
    setNewItemText('');
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    onAddNote(phase.id, newNoteTitle.trim(), newNoteContent.trim());
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowAddNote(false);
  };

  // Debounce timers for answer typing
  const answerDebounceMap = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      Object.values(answerDebounceMap.current).forEach(clearTimeout);
    };
  }, []);

  const handleDrop = (targetItemId: string) => {
    if (!draggedItemId || draggedItemId === targetItemId || !onReorderItems) {
      setDraggedItemId(null);
      setDragOverItemId(null);
      return;
    }

    const fromIndex = checklist.findIndex(item => item.id === draggedItemId);
    const toIndex = checklist.findIndex(item => item.id === targetItemId);

    if (fromIndex !== -1 && toIndex !== -1) {
      const reordered = [...checklist];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);
      onReorderItems(phase.id, reordered);
    }

    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  const handleAnswerChange = (itemId: string, value: string) => {
    setEditingAnswers(prev => ({ ...prev, [itemId]: value }));

    // Cancel previous debounce timer for this question
    if (answerDebounceMap.current[itemId]) {
      clearTimeout(answerDebounceMap.current[itemId]);
    }

    // Debounce save by 400ms after last keypress
    answerDebounceMap.current[itemId] = setTimeout(() => {
      onUpdateItemAnswer(phase.id, itemId, value);
      delete answerDebounceMap.current[itemId];
    }, 400);
  };

  const handleSaveAnswer = (itemId: string) => {
    if (answerDebounceMap.current[itemId]) {
      clearTimeout(answerDebounceMap.current[itemId]);
      delete answerDebounceMap.current[itemId];
    }
    const value = editingAnswers[itemId];
    if (value !== undefined) {
      onUpdateItemAnswer(phase.id, itemId, value);
    }
  };

  // Filter items
  const filteredChecklist = checklist.filter(item => {
    const text = isPt ? item.textPt : item.textEn;
    const matchesSearch = searchQuery === '' || text.toLowerCase().includes(searchQuery.toLowerCase()) || (item.answer && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterMode === 'completed') return item.completed;
    if (filterMode === 'answered') return item.answer && item.answer.trim().length > 0;
    if (filterMode === 'unanswered') return !item.answer || item.answer.trim().length === 0;

    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Phase Banner Header */}
      <div 
        className="p-6 text-white relative overflow-hidden"
        style={{ backgroundColor: phase.colorHex }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white">
                {isPt ? `Fase ${phase.stepNumber} de 8` : `Step ${phase.stepNumber} of 8`}
              </span>
              <span className="text-xs font-semibold opacity-90">
                MoDE Framework
              </span>
            </div>
            
            <h2 className="text-2xl font-black mt-1">
              {isPt ? phase.namePt : phase.nameEn}
            </h2>

            <p className="text-sm opacity-95 mt-1 max-w-2xl leading-relaxed">
              {isPt ? phase.mainActionsPt : phase.mainActionsEn}
            </p>
          </div>

          {/* Dual Progress Gauges: Answered Decisions & Task Completion */}
          <div className="flex items-center gap-3 self-start md:self-center">
            {/* Registered Answers Gauge */}
            <div className="bg-black/30 backdrop-blur-xs rounded-xl p-3 border border-white/20 min-w-[140px] text-center">
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider block">
                {isPt ? 'Decisões Registradas' : 'Registered Decisions'}
              </span>
              <span className="text-xl font-extrabold text-amber-300 mt-0.5 block">
                {answeredCount} / {checklist.length}
              </span>
              <div className="w-full bg-white/30 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-amber-300 h-full transition-all duration-300" 
                  style={{ width: `${answeredPercent}%` }}
                />
              </div>
            </div>

            {/* Completed Tasks Gauge */}
            <div className="bg-black/30 backdrop-blur-xs rounded-xl p-3 border border-white/20 min-w-[140px] text-center">
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider block">
                {isPt ? 'Tarefas Concluídas' : 'Tasks Completed'}
              </span>
              <span className="text-xl font-extrabold text-emerald-300 mt-0.5 block">
                {completedCount} / {checklist.length}
              </span>
              <div className="w-full bg-white/30 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-300 h-full transition-all duration-300" 
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Interactive Questions & Answer Registration */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header & Filter Bar */}
          <div className="space-y-3 pb-2 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-sky-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {isPt ? 'Checklist de Perguntas & Registro de Decisões' : 'Questions Checklist & Decision Registry'}
                </h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 self-start sm:self-auto">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg transition ${filterMode === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
                >
                  {isPt ? 'Todas' : 'All'} ({checklist.length})
                </button>
                <button
                  onClick={() => setFilterMode('unanswered')}
                  className={`px-2.5 py-1 rounded-lg transition ${filterMode === 'unanswered' ? 'bg-white text-amber-800 shadow-2xs' : 'hover:text-slate-900'}`}
                >
                  {isPt ? 'Sem Resposta' : 'Pending'} ({checklist.length - answeredCount})
                </button>
                <button
                  onClick={() => setFilterMode('answered')}
                  className={`px-2.5 py-1 rounded-lg transition ${filterMode === 'answered' ? 'bg-white text-emerald-800 shadow-2xs' : 'hover:text-slate-900'}`}
                >
                  {isPt ? 'Respondidas' : 'Answered'} ({answeredCount})
                </button>
                <button
                  onClick={() => setFilterMode('completed')}
                  className={`px-2.5 py-1 rounded-lg transition ${filterMode === 'completed' ? 'bg-white text-sky-800 shadow-2xs' : 'hover:text-slate-900'}`}
                >
                  {isPt ? 'Concluídas' : 'Completed'} ({completedCount})
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isPt ? 'Filtrar perguntas ou respostas tomadas...' : 'Search questions or decisions...'}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Interactive Checklist & Decision Registration Cards */}
          <div className="space-y-4">
            {filteredChecklist.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-xs text-slate-500 font-medium">
                  {isPt ? 'Nenhuma pergunta encontrada com o filtro selecionado.' : 'No questions found for the selected filter.'}
                </p>
              </div>
            ) : (
              filteredChecklist.map((item, idx) => {
                const questionText = isPt ? item.textPt : item.textEn;
                const currentAnswerText = editingAnswers[item.id] !== undefined ? editingAnswers[item.id] : (item.answer || '');
                const hasRegisteredAnswer = item.answer && item.answer.trim().length > 0;
                const fullIndex = checklist.findIndex(c => c.id === item.id);
                const isDragOver = dragOverItemId === item.id;
                const isBeingDragged = draggedItemId === item.id;

                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', item.id);
                      setDraggedItemId(item.id);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggedItemId !== item.id) {
                        setDragOverItemId(item.id);
                      }
                    }}
                    onDragLeave={() => {
                      if (dragOverItemId === item.id) {
                        setDragOverItemId(null);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop(item.id);
                    }}
                    className={`p-4 rounded-2xl border transition duration-200 space-y-3 ${
                      isBeingDragged ? 'opacity-40 border-dashed border-sky-400 bg-sky-50' : ''
                    } ${
                      isDragOver ? 'ring-2 ring-sky-500 border-sky-400 bg-sky-50/50' : ''
                    } ${
                      !isBeingDragged && !isDragOver
                        ? item.completed
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : hasRegisteredAnswer
                          ? 'bg-white border-sky-300 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                        : ''
                    }`}
                  >
                    {/* Top Question Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-2 flex-1">
                        {/* Drag Handle */}
                        <div
                          className="mt-0.5 p-0.5 text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing flex-shrink-0"
                          title={isPt ? 'Arraste para reordenar a pergunta' : 'Drag to reorder question'}
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleItem(phase.id, item.id)}
                          className="mt-0.5 text-sky-600 focus:outline-none cursor-pointer flex-shrink-0"
                          aria-label={item.completed 
                            ? (isPt ? `Marcar pergunta ${idx + 1} como pendente` : `Mark question ${idx + 1} as pending`) 
                            : (isPt ? `Marcar pergunta ${idx + 1} como concluída` : `Mark question ${idx + 1} as completed`)
                          }
                          title={isPt ? 'Marcar como concluída' : 'Mark as completed'}
                        >
                          {item.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400 hover:text-sky-600 transition" />
                          )}
                        </button>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              {isPt ? `Pergunta ${idx + 1}` : `Question ${idx + 1}`}
                            </span>

                            {hasRegisteredAnswer ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center space-x-1">
                                <Check className="w-3 h-3 text-emerald-700" />
                                <span>{isPt ? 'Decisão Registrada' : 'Decision Registered'}</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                {isPt ? 'Aguardando Decisão' : 'Awaiting Decision'}
                              </span>
                            )}
                          </div>

                          {/* Question Text or Editable Field */}
                          {editingQuestionId === item.id ? (
                            <div className="space-y-2 pt-1">
                              <label htmlFor={`edit-question-${item.id}`} className="sr-only">
                                {isPt ? 'Editar enunciado da pergunta' : 'Edit question text'}
                              </label>
                              <textarea
                                id={`edit-question-${item.id}`}
                                rows={2}
                                value={editingQuestionText}
                                onChange={(e) => setEditingQuestionText(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-sky-400 rounded-xl focus:ring-2 focus:ring-sky-500"
                                autoFocus
                              />
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (editingQuestionText.trim() && onUpdateItemQuestionText) {
                                      onUpdateItemQuestionText(phase.id, item.id, editingQuestionText.trim());
                                    }
                                    setEditingQuestionId(null);
                                  }}
                                  className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold cursor-pointer transition flex items-center space-x-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{isPt ? 'Salvar Pergunta' : 'Save Question'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingQuestionId(null)}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer transition"
                                >
                                  {isPt ? 'Cancelar' : 'Cancel'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-2 group/q">
                              <h4 className={`text-sm font-bold text-slate-900 leading-snug flex-1 ${item.completed ? 'line-through text-slate-500' : ''}`}>
                                {questionText}
                              </h4>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingQuestionId(item.id);
                                  setEditingQuestionText(questionText);
                                }}
                                aria-label={isPt ? `Editar enunciado da pergunta ${idx + 1}` : `Edit question ${idx + 1} text`}
                                className="opacity-80 group-hover/q:opacity-100 p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition cursor-pointer flex-shrink-0"
                                title={isPt ? 'Editar texto da pergunta' : 'Edit question text'}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Controls: Move Up, Move Down, Delete */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => onMoveItem && onMoveItem(phase.id, item.id, 'up')}
                          disabled={fullIndex === 0}
                          aria-label={isPt ? `Mover pergunta ${idx + 1} para cima` : `Move question ${idx + 1} up`}
                          className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-100/70 disabled:opacity-20 disabled:hover:text-slate-400 disabled:hover:bg-transparent rounded-lg transition cursor-pointer"
                          title={isPt ? 'Mover pergunta para cima' : 'Move question up'}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onMoveItem && onMoveItem(phase.id, item.id, 'down')}
                          disabled={fullIndex === checklist.length - 1}
                          aria-label={isPt ? `Mover pergunta ${idx + 1} para baixo` : `Move question ${idx + 1} down`}
                          className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-100/70 disabled:opacity-20 disabled:hover:text-slate-400 disabled:hover:bg-transparent rounded-lg transition cursor-pointer"
                          title={isPt ? 'Mover pergunta para baixo' : 'Move question down'}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteItem(phase.id, item.id)}
                          aria-label={isPt ? `Excluir pergunta ${idx + 1}` : `Delete question ${idx + 1}`}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title={isPt ? 'Excluir esta pergunta' : 'Delete this question'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Answer Registration Box */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <label 
                          htmlFor={`answer-textarea-${item.id}`}
                          className="text-xs font-extrabold text-slate-700 flex items-center space-x-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                          <span>{isPt ? 'Decisão / Resposta Pedagógica Tomada:' : 'Pedagogical Decision / Answer:'}</span>
                        </label>

                        <div className="flex items-center space-x-1.5">
                          {/* Voice Dictation Button */}
                          <VoiceDictationButton
                            uiLanguage={uiLanguage}
                            onTranscript={(text) => {
                              const newText = currentAnswerText ? `${currentAnswerText} ${text}` : text;
                              handleAnswerChange(item.id, newText);
                              handleSaveAnswer(item.id);
                            }}
                          />
                        </div>
                      </div>

                      <textarea
                        id={`answer-textarea-${item.id}`}
                        aria-label={`${isPt ? 'Decisão pedagógica para pergunta' : 'Pedagogical decision for question'} ${idx + 1}: ${questionText}`}
                        rows={2}
                        value={currentAnswerText}
                        onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                        onBlur={() => handleSaveAnswer(item.id)}
                        placeholder={isPt 
                          ? 'Registre aqui a decisão pedagógica tomada para esta pergunta (ex: "Definimos o público como A2, com suporte multimodal em H5P...").' 
                          : 'Record your pedagogical decision answer for this question here...'}
                        className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white transition leading-relaxed"
                      />

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>
                          {item.answeredAt ? `${isPt ? 'Última atualização:' : 'Last saved:'} ${new Date(item.answeredAt).toLocaleString()}` : ''}
                        </span>
                        
                        {currentAnswerText !== (item.answer || '') && (
                          <button
                            type="button"
                            onClick={() => handleSaveAnswer(item.id)}
                            className="px-2 py-0.5 bg-slate-900 text-white font-bold rounded text-[10px] cursor-pointer"
                          >
                            {isPt ? 'Salvar Decisão' : 'Save Decision'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Add Custom Question Form */}
          <form onSubmit={handleCreateItem} className="flex items-center space-x-2 pt-2">
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder={isPt ? 'Adicionar nova pergunta ou diretriz customizada...' : 'Add a custom question or guideline for this phase...'}
                className="w-full pl-3.5 pr-28 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <div className="absolute right-2">
                <VoiceDictationButton
                  uiLanguage={uiLanguage}
                  onTranscript={(text) => setNewItemText((prev) => (prev ? `${prev} ${text}` : text))}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!newItemText.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isPt ? 'Adicionar Pergunta' : 'Add Question'}</span>
            </button>
          </form>

          {/* Phase Notes & Evidence Log Section */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  {isPt ? 'Registro de Evidências e Notas da Fase' : 'Phase Notes & Evidence Log'}
                </h4>
              </div>
              <button
                onClick={() => setShowAddNote(!showAddNote)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isPt ? 'Nova Nota' : 'New Note'}</span>
              </button>
            </div>

            {/* Form for adding note */}
            {showAddNote && (
              <form onSubmit={handleCreateNote} className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200 mb-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-indigo-900">
                    {isPt ? 'Nova Nota ou Evidência:' : 'New Note or Evidence:'}
                  </span>
                  <VoiceDictationButton
                    uiLanguage={uiLanguage}
                    onTranscript={(text) => setNewNoteContent((prev) => (prev ? `${prev} ${text}` : text))}
                    title={isPt ? 'Ditar conteúdo da nota' : 'Dictate note content'}
                  />
                </div>

                <input
                  type="text"
                  required
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder={isPt ? 'Título da Nota (Ex: Resultado da Entrevista com Alunos)' : 'Note Title (E.g. Student Interview Findings)'}
                  className="w-full px-3 py-1.5 text-xs font-bold border border-indigo-300 rounded-lg bg-white"
                />
                <textarea
                  required
                  rows={3}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder={isPt ? 'Descreva os achados, observações ou links para protótipos nesta fase...' : 'Record findings, observations, or prototype links...'}
                  className="w-full px-3 py-2 text-xs border border-indigo-300 rounded-lg bg-white"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNote(false)}
                    className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    {isPt ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    {isPt ? 'Salvar Nota' : 'Save Note'}
                  </button>
                </div>
              </form>
            )}

            {/* Existing Notes list */}
            {phaseNotes.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                {isPt ? 'Nenhuma nota gravada para esta fase ainda.' : 'No notes recorded for this phase yet.'}
              </p>
            ) : (
              <div className="space-y-3">
                {phaseNotes.map((note) => (
                  <div key={note.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl relative group">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-xs text-slate-900">{note.title}</h5>
                      <span className="text-[10px] text-slate-400">
                        {new Date(note.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{note.content}</p>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title={isPt ? 'Excluir nota' : 'Delete note'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Guidelines, Gamification Link & Phase Navigation */}
        <div className="space-y-6">
          
          {/* Key Guidelines Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="w-4 h-4 text-sky-700" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                {isPt ? 'Recomendações Práticas' : 'Best Practice Guidelines'}
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {(isPt ? phase.keyGuidelinesPt : phase.keyGuidelinesEn).map((g, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 flex-shrink-0" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gamification Strategies Linked to this Phase */}
          <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Gamepad2 className="w-4 h-4 text-emerald-700" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                  {isPt ? 'Gamificação nesta Fase' : 'Phase Gamification'}
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                {phaseGamification.length}
              </span>
            </div>

            {phaseGamification.length === 0 ? (
              <p className="text-xs text-emerald-800/80 italic">
                {isPt ? 'Nenhuma estratégia cadastrada nesta fase.' : 'No gamification strategy linked to this phase yet.'}
              </p>
            ) : (
              <div className="space-y-2">
                {phaseGamification.map((g) => (
                  <div key={g.id} className="p-2.5 bg-white rounded-lg border border-emerald-200 text-xs shadow-2xs">
                    <span className="font-bold text-slate-900 block">{g.title}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">{g.category} • Skill: {g.targetSkill}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Iterative Navigation Actions */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
              {isPt ? 'Controle Cíclico MoDE' : 'MoDE Cycle Navigation'}
            </span>

            <button
              onClick={onNextPhase}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
            >
              <span>{isPt ? 'Avançar para Próxima Fase' : 'Advance to Next Phase'}</span>
              <ChevronRight className="w-4 h-4 text-sky-400" />
            </button>

            <button
              onClick={onRestartCycle}
              className="w-full py-2 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border border-yellow-300 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-yellow-800" />
              <span>{isPt ? 'Reiniciar / Voltar Fase (Iterar)' : 'Loop Back / Re-iterate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
