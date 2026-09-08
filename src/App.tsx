import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  MaterialProject, 
  PhaseId, 
  PhaseChecklistItem,
  GamificationStrategy, 
  PrebuiltTemplate
} from './types';
import { MODE_PHASES } from './data/modePhasesData';
import { 
  loadProjectsFromStorage, 
  saveProjectsToStorage, 
  loadActiveProjectId, 
  saveActiveProjectId, 
  createNewProject,
  exportProjectToJson
} from './utils/storage';

// Components
import { Navbar } from './components/Navbar';
import { ProjectMetadataModal } from './components/ProjectMetadataModal';
import { ModeCycleWheel } from './components/ModeCycleWheel';
import { PhaseDetailView } from './components/PhaseDetailView';
import { GamificationHub } from './components/GamificationHub';
import { IterationHistoryModal } from './components/IterationHistoryModal';
import { PrebuiltTemplatesModal } from './components/PrebuiltTemplatesModal';
import { PrintReportView } from './components/PrintReportView';
import { PhaseCompletionSummary } from './components/PhaseCompletionSummary';
import { AboutModeModal } from './components/AboutModeModal';

// Icons for overall project dashboard summary
import { 
  BookOpen, 
  User, 
  Target, 
  Monitor, 
  RefreshCw, 
  CheckCircle2, 
  Globe, 
  Gamepad2,
  ChevronRight,
  Info,
  GraduationCap,
  Compass,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<MaterialProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  // UI Tabs & Language
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cycle' | 'gamification' | 'history'>('dashboard');
  const [uiLanguage, setUiLanguage] = useState<'pt' | 'en'>('pt');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Modals
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isIterationModalOpen, setIsIterationModalOpen] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [aboutModalInitialTab, setAboutModalInitialTab] = useState<'about' | 'author'>('about');

  // Auto-Save status & debounced persistence
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const isInitialLoadRef = useRef(true);

  // Initialize from localStorage
  useEffect(() => {
    const loadedProjects = loadProjectsFromStorage();
    setProjects(loadedProjects);

    const savedActiveId = loadActiveProjectId();
    if (savedActiveId && loadedProjects.some(p => p.id === savedActiveId)) {
      setActiveProjectId(savedActiveId);
    } else if (loadedProjects.length > 0) {
      setActiveProjectId(loadedProjects[0].id);
    }
  }, []);

  // Debounced Auto-Save mechanism for projects state
  useEffect(() => {
    if (isInitialLoadRef.current) {
      if (projects.length > 0) {
        isInitialLoadRef.current = false;
      }
      return;
    }

    if (projects.length === 0) return;

    setSaveStatus('saving');

    const saveTimer = setTimeout(() => {
      saveProjectsToStorage(projects);
      setSaveStatus('saved');
      setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 400);

    return () => {
      clearTimeout(saveTimer);
    };
  }, [projects]);

  // Flush pending changes to localStorage on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (projects.length > 0) {
        saveProjectsToStorage(projects);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [projects]);

  // Sync state helper
  const updateProjectsState = (updatedList: MaterialProject[]) => {
    setProjects(updatedList);
  };

  // Active Project object
  const currentProject = projects.find(p => p.id === activeProjectId) || projects[0];

  if (!currentProject) {
    return <div className="p-8 text-center text-slate-500">Carregando o aplicativo MoDE...</div>;
  }

  const isPt = uiLanguage === 'pt';

  // Current Phase object
  const activePhaseObj = MODE_PHASES.find(p => p.id === currentProject.currentPhase) || MODE_PHASES[0];

  // Helper to update current project properties
  const updateCurrentProject = (patch: Partial<MaterialProject>) => {
    const updated = {
      ...currentProject,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    const newProjects = projects.map(p => p.id === updated.id ? updated : p);
    updateProjectsState(newProjects);
  };

  // 1. Select active phase
  const handleSelectPhase = (phaseId: PhaseId) => {
    updateCurrentProject({ currentPhase: phaseId });
  };

  // 2. Toggle item completed in checklist
  const handleToggleChecklistItem = (phaseId: PhaseId, itemId: string) => {
    const phaseChecklist = currentProject.checklists[phaseId] || [];
    const updatedChecklist = phaseChecklist.map(item => {
      if (item.id === itemId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    // Check if phase was just completed (100%)
    const prevDone = phaseChecklist.filter(i => i.completed).length;
    const newDone = updatedChecklist.filter(i => i.completed).length;
    if (newDone === updatedChecklist.length && prevDone < updatedChecklist.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    updateCurrentProject({
      checklists: {
        ...currentProject.checklists,
        [phaseId]: updatedChecklist,
      }
    });
  };

  // 2b. Update answer for a checklist question
  const handleUpdateChecklistAnswer = (phaseId: PhaseId, itemId: string, answer: string) => {
    const phaseChecklist = currentProject.checklists[phaseId] || [];
    const updatedChecklist = phaseChecklist.map(item => {
      if (item.id === itemId) {
        return { 
          ...item, 
          answer, 
          answeredAt: new Date().toISOString() 
        };
      }
      return item;
    });

    updateCurrentProject({
      checklists: {
        ...currentProject.checklists,
        [phaseId]: updatedChecklist,
      }
    });
  };

  // 2c. Update text for a checklist question
  const handleUpdateChecklistQuestionText = (phaseId: PhaseId, itemId: string, text: string) => {
    const phaseChecklist = currentProject.checklists[phaseId] || [];
    const updatedChecklist = phaseChecklist.map(item => {
      if (item.id === itemId) {
        return { 
          ...item, 
          textPt: isPt ? text : (item.textPt === item.textEn ? text : item.textPt),
          textEn: !isPt ? text : (item.textPt === item.textEn ? text : item.textEn),
        };
      }
      return item;
    });

    updateCurrentProject({
      checklists: {
        ...currentProject.checklists,
        [phaseId]: updatedChecklist,
      }
    });
  };

  // 2d. Move checklist question position (up/down)
  const handleMoveChecklistItem = (phaseId: PhaseId, itemId: string, direction: 'up' | 'down') => {
    const phaseChecklist = currentProject.checklists[phaseId] || [];
    const index = phaseChecklist.findIndex(item => item.id === itemId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= phaseChecklist.length) return;

    const updatedChecklist = [...phaseChecklist];
    const [movedItem] = updatedChecklist.splice(index, 1);
    updatedChecklist.splice(targetIndex, 0, movedItem);

    updateCurrentProject({
      checklists: {
        ...currentProject.checklists,
        [phaseId]: updatedChecklist,
      }
    });
  };

  // 2e. Reorder complete checklist array
  const handleReorderChecklistItems = (phaseId: PhaseId, reorderedItems: PhaseChecklistItem[]) => {
    updateCurrentProject({
      checklists: {
        ...currentProject.checklists,
        [phaseId]: reorderedItems,
      }
    });
  };

  // 3. Add custom checklist item
  const handleAddCustomItem = (phaseId: PhaseId, text: string) => {
    const phaseChecklist = currentProject.checklists[phaseId] || [];
    const newItem = {
      id: `custom_${Date.now()}`,
      textPt: text,
      textEn: text,
      completed: false,
      isCustom: true,
    };
    updateCurrentProject({
      checklists: {
        ...currentProject.checklists,
        [phaseId]: [...phaseChecklist, newItem],
      }
    });
  };

  // 4. Delete custom item
  const handleDeleteItem = (phaseId: PhaseId, itemId: string) => {
    const phaseChecklist = currentProject.checklists[phaseId] || [];
    updateCurrentProject({
      checklists: {
        ...currentProject.checklists,
        [phaseId]: phaseChecklist.filter(i => i.id !== itemId),
      }
    });
  };

  // 5. Add note to phase
  const handleAddNote = (phaseId: PhaseId, title: string, content: string) => {
    const newNote = {
      id: `note_${Date.now()}`,
      phaseId,
      date: new Date().toISOString(),
      title,
      content,
    };
    updateCurrentProject({
      notes: [newNote, ...currentProject.notes],
    });
  };

  // 6. Delete note
  const handleDeleteNote = (noteId: string) => {
    updateCurrentProject({
      notes: currentProject.notes.filter(n => n.id !== noteId),
    });
  };

  // 7. Add Gamification Strategy
  const handleAddGamificationStrategy = (strategy: Omit<GamificationStrategy, 'id' | 'registeredAt'>) => {
    const newStrategy: GamificationStrategy = {
      ...strategy,
      id: `game_${Date.now()}`,
      registeredAt: new Date().toISOString(),
    };
    updateCurrentProject({
      gamificationStrategies: [newStrategy, ...currentProject.gamificationStrategies],
    });
  };

  // 8. Delete Gamification Strategy
  const handleDeleteGamificationStrategy = (id: string) => {
    updateCurrentProject({
      gamificationStrategies: currentProject.gamificationStrategies.filter(g => g.id !== id),
    });
  };

  // 9. Add Iteration Log & Shift Phase
  const handleAddIterationLog = (fromPhase: PhaseId, toPhase: PhaseId, reason: string) => {
    const newLog = {
      id: `iter_${Date.now()}`,
      timestamp: new Date().toISOString(),
      fromPhase,
      toPhase,
      reason,
      author: currentProject.author || 'Professor(a)',
    };
    updateCurrentProject({
      currentPhase: toPhase,
      iterationLogs: [newLog, ...currentProject.iterationLogs],
    });
  };

  // 10. Create New Project
  const handleNewProject = () => {
    const newProj = createNewProject(
      isPt ? 'Novo Artefato Digital de Linguagem' : 'New Language Digital Material',
      isPt ? 'Estudantes de Línguas' : 'Language Learners',
      isPt ? 'Promover autonomia e comunicação em ambiente digital' : 'Promote autonomous digital communication',
      isPt ? 'Vocabulário e Expressão Oral' : 'Vocabulary & Oral Speaking',
      currentProject.author || 'Prof. Linguagens',
      'H5P / Moodle',
      'Inglês',
      undefined,
      uiLanguage
    );
    const newList = [newProj, ...projects];
    updateProjectsState(newList);
    setActiveProjectId(newProj.id);
    saveActiveProjectId(newProj.id);
  };

  // 11. Select Template
  const handleSelectTemplate = (template: PrebuiltTemplate) => {
    const templProj = createNewProject(
      '',
      '',
      '',
      '',
      currentProject.author || 'Prof. Linguagens',
      '',
      '',
      template,
      uiLanguage
    );
    const newList = [templProj, ...projects];
    updateProjectsState(newList);
    setActiveProjectId(templProj.id);
    saveActiveProjectId(templProj.id);
  };

  // 12. Advance to next phase sequentially
  const handleNextPhase = () => {
    const currentIndex = MODE_PHASES.findIndex(p => p.id === currentProject.currentPhase);
    const nextIndex = (currentIndex + 1) % MODE_PHASES.length;
    const nextPhaseId = MODE_PHASES[nextIndex].id;
    updateCurrentProject({ currentPhase: nextPhaseId });
  };

  // 13. Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed: MaterialProject = JSON.parse(event.target?.result as string);
        if (parsed && parsed.id && parsed.title) {
          // Check if already exists
          const exists = projects.some(p => p.id === parsed.id);
          const newId = exists ? `proj_${Date.now()}` : parsed.id;
          const importedProj = { ...parsed, id: newId };
          const newList = [importedProj, ...projects];
          updateProjectsState(newList);
          setActiveProjectId(importedProj.id);
          saveActiveProjectId(importedProj.id);
        }
      } catch (err) {
        alert(isPt ? 'Arquivo JSON inválido.' : 'Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentProject={currentProject}
        projects={projects}
        onSelectProject={(id) => {
          setActiveProjectId(id);
          saveActiveProjectId(id);
        }}
        onNewProject={handleNewProject}
        onEditMetadata={() => setIsMetadataOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenGamification={() => setActiveTab('gamification')}
        onOpenPrintView={() => setIsPrintViewOpen(true)}
        onExportJson={() => exportProjectToJson(currentProject)}
        onImportJson={handleImportJson}
        onOpenAboutMode={() => {
          setAboutModalInitialTab('about');
          setIsAboutModalOpen(true);
        }}
        onOpenAuthor={() => {
          setAboutModalInitialTab('author');
          setIsAboutModalOpen(true);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        uiLanguage={uiLanguage}
        onToggleLanguage={() => setUiLanguage(uiLanguage === 'pt' ? 'en' : 'pt')}
      />

      {/* Material Quick Info Bar & Specifications Passport */}
      <div className="no-print bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl font-bold flex-shrink-0" aria-hidden="true">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-lg leading-tight">
                  {currentProject.title}
                </h1>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {currentProject.targetLanguage}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500" aria-hidden="true" />
                  <span>{isPt ? `Fase Ativa: ${activePhaseObj.stepNumber}. ${activePhaseObj.namePt.split('/')[0]}` : `Active: ${activePhaseObj.stepNumber}. ${activePhaseObj.nameEn}`}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span><strong>{isPt ? 'Público:' : 'Audience:'}</strong> {currentProject.audience}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Monitor className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span><strong>{isPt ? 'Plataforma:' : 'Platform:'}</strong> {currentProject.platform}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span><strong>{isPt ? 'Autoria:' : 'Author:'}</strong> {currentProject.author}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-center flex-shrink-0">
            {/* Quick Guide Toggle */}
            <button
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold border border-amber-200 transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
              title={isPt ? 'Ver passo a passo de como usar o MoDE' : 'View quick guide on how to use MoDE'}
              aria-expanded={isGuideOpen}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              <span>{isPt ? 'Guia Rápido MoDE' : 'MoDE Quick Guide'}</span>
              {isGuideOpen ? (
                <ChevronUp className="w-3 h-3 text-amber-700" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-3 h-3 text-amber-700" aria-hidden="true" />
              )}
            </button>

            <button
              onClick={() => setIsMetadataOpen(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition cursor-pointer"
              title={isPt ? 'Editar título, público-alvo, idioma e plataforma do artefato' : 'Edit artifact specifications'}
            >
              {isPt ? 'Registrar Artefato Digital' : 'Register Digital Artifact'}
            </button>
          </div>
        </div>

        {/* Collapsible Guided Onboarding Banner */}
        {isGuideOpen && (
          <div className="max-w-7xl mx-auto mt-3 p-4 bg-gradient-to-r from-amber-50/90 via-sky-50/80 to-indigo-50/90 border border-amber-200/80 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-200/60">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-amber-700" aria-hidden="true" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {isPt ? 'Fluxo Pedagógico Recomendado no MoDE' : 'Recommended MoDE Pedagogical Flow'}
                </h2>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                {isPt ? 'Ocultar Guia' : 'Dismiss Guide'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white/80 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-extrabold flex items-center justify-center text-[10px]">1</span>
                <h3 className="font-bold text-slate-900">{isPt ? '1. Especifique o Artefato' : '1. Define the Artifact'}</h3>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {isPt 
                    ? 'Identifique o idioma-alvo, público, nível CEFR e ferramenta digital (ex: H5P, Quizlet, Canvas).'
                    : 'Set target language, audience level, and digital authoring platform.'}
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-extrabold flex items-center justify-center text-[10px]">2</span>
                <h3 className="font-bold text-slate-900">{isPt ? '2. Percorra as 8 Fases' : '2. Walk the 8 Phases'}</h3>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {isPt 
                    ? 'Responda às perguntas diagnósticas registrando as decisões pedagógicas e usando ditado por voz se desejar.'
                    : 'Answer diagnostic questions recording pedagogical decisions and using voice dictation if desired.'}
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-[10px]">3</span>
                <h3 className="font-bold text-slate-900">{isPt ? '3. Gamifique o Material' : '3. Gamify Learning'}</h3>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {isPt 
                    ? 'Vincule badges, desafios e feedback imediato a habilidades reais (Fala, Escuta, Leitura, Escrita).'
                    : 'Link XP, quests, and real-time feedback directly to language competencies.'}
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-extrabold flex items-center justify-center text-[10px]">4</span>
                <h3 className="font-bold text-slate-900">{isPt ? '4. Itere & Exporte' : '4. Iterate & Report'}</h3>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {isPt 
                    ? 'Teste com estudantes, registre re-iterações no histórico e gere relatórios científicos prontos em PDF.'
                    : 'Pilot with learners, record redesign loops, and export complete scientific PDF reports.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 focus:outline-none">
        
        {/* TAB 0: 8 MoDE Phases Completion Dashboard Summary */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6" role="tabpanel" id="panel-dashboard" aria-labelledby="tab-dashboard">
            <PhaseCompletionSummary
              projects={projects}
              currentProjectId={currentProject.id}
              onSelectPhase={(phaseId) => {
                handleSelectPhase(phaseId);
                setActiveTab('cycle');
              }}
              uiLanguage={uiLanguage}
            />
          </div>
        )}

        {/* TAB 1: MoDE Interactive Cycle & Checklist */}
        {activeTab === 'cycle' && (
          <div className="space-y-6" role="tabpanel" id="panel-cycle" aria-labelledby="tab-cycle">
            
            {/* Interactive 8-Phase Quick Navigation Steps Bar */}
            <div 
              className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs overflow-x-auto custom-scrollbar"
              role="navigation"
              aria-label={isPt ? 'Navegador rápido das 8 fases' : '8-Phase Quick Navigator'}
            >
              <div className="flex items-center min-w-max gap-1.5">
                {MODE_PHASES.map((phase) => {
                  const isSelected = phase.id === currentProject.currentPhase;
                  const list = currentProject.checklists[phase.id] || [];
                  const answered = list.filter(i => i.answer && i.answer.trim().length > 0).length;
                  const completed = list.filter(i => i.completed).length;

                  return (
                    <button
                      key={phase.id}
                      onClick={() => handleSelectPhase(phase.id)}
                      aria-current={isSelected ? 'step' : undefined}
                      aria-label={`${phase.stepNumber}. ${isPt ? phase.namePt : phase.nameEn}: ${answered} de ${list.length} decisões registradas`}
                      className={`px-3 py-2 rounded-xl text-left transition flex items-center space-x-2 cursor-pointer border ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span 
                        className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-sky-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                        }`}
                        aria-hidden="true"
                      >
                        {phase.stepNumber}
                      </span>

                      <div className="flex flex-col">
                        <span className="text-xs font-bold whitespace-nowrap">
                          {isPt ? phase.namePt : phase.nameEn}
                        </span>
                        <span className={`text-[10px] font-semibold ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {answered}/{list.length} {isPt ? 'decisões' : 'decisions'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top Interactive Wheel Diagram */}
            <ModeCycleWheel
              currentPhaseId={currentProject.currentPhase}
              onSelectPhase={handleSelectPhase}
              project={currentProject}
              uiLanguage={uiLanguage}
              onRestartCycleTrigger={() => setIsIterationModalOpen(true)}
            />

            {/* Bottom Phase Detail Workspace */}
            <PhaseDetailView
              phase={activePhaseObj}
              project={currentProject}
              onToggleItem={handleToggleChecklistItem}
              onUpdateItemAnswer={handleUpdateChecklistAnswer}
              onUpdateItemQuestionText={handleUpdateChecklistQuestionText}
              onMoveItem={handleMoveChecklistItem}
              onReorderItems={handleReorderChecklistItems}
              onAddCustomItem={handleAddCustomItem}
              onDeleteItem={handleDeleteItem}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onRestartCycle={() => setIsIterationModalOpen(true)}
              onNextPhase={handleNextPhase}
              uiLanguage={uiLanguage}
            />
          </div>
        )}

        {/* TAB 2: Gamification Strategies Register */}
        {activeTab === 'gamification' && (
          <GamificationHub
            project={currentProject}
            onAddStrategy={handleAddGamificationStrategy}
            onDeleteStrategy={handleDeleteGamificationStrategy}
            uiLanguage={uiLanguage}
          />
        )}

        {/* TAB 3: Iteration History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-yellow-600" />
                  <span>{isPt ? 'Histórico de Iterações e Re-desenho' : 'Iteration & Redesign History Logs'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isPt ? 'No modelo MoDE, re-iterar é parte natural do processo de design de materiais.' : 'In MoDE, looping back to earlier phases is a core design feature.'}
                </p>
              </div>

              <button
                onClick={() => setIsIterationModalOpen(true)}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isPt ? 'Registrar Nova Iteração' : 'Record Iteration'}</span>
              </button>
            </div>

            {currentProject.iterationLogs.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-6 text-center">
                {isPt ? 'Nenhuma re-iteração gravada neste projeto.' : 'No iteration logs recorded for this project yet.'}
              </p>
            ) : (
              <div className="space-y-3">
                {currentProject.iterationLogs.map((log) => {
                  const pFrom = MODE_PHASES.find(p => p.id === log.fromPhase);
                  const pTo = MODE_PHASES.find(p => p.id === log.toPhase);

                  return (
                    <div key={log.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-900 border border-sky-200">
                            {pFrom ? pFrom.stepNumber : ''}. {pFrom ? (isPt ? pFrom.namePt : pFrom.nameEn) : ''}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                          <span className="px-2.5 py-1 rounded-md bg-yellow-100 text-yellow-900 border border-yellow-300">
                            {pTo ? pTo.stepNumber : ''}. {pTo ? (isPt ? pTo.namePt : pTo.nameEn) : ''}
                          </span>
                        </div>
                        <span className="text-slate-400 font-normal">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed italic">
                        "{log.reason}"
                      </p>

                      <div className="text-[10px] text-slate-400">
                        {isPt ? 'Registrado por:' : 'Recorded by:'} <strong>{log.author}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          
          {/* Quick Informational Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => {
                setAboutModalInitialTab('about');
                setIsAboutModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 rounded-lg transition font-semibold cursor-pointer shadow-2xs"
            >
              <Info className="w-3.5 h-3.5 text-sky-600" />
              <span>{isPt ? 'Sobre o MoDE' : 'About MoDE'}</span>
            </button>

            <button
              onClick={() => {
                setAboutModalInitialTab('author');
                setIsAboutModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition font-semibold cursor-pointer shadow-2xs"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {isPt 
                  ? 'Quem é o responsável / Autoria: Profª. Dra. Susana Cristina dos Reis' 
                  : 'Who is responsible for this app: Prof. Dr. Susana Cristina dos Reis'}
              </span>
            </button>
          </div>

          <p className="font-bold text-slate-700">
            MoDE - Modelo Cíclico de Design de Artefatos Digitais para o Ensino de Línguas
          </p>
          <p className="text-[11px] text-slate-400">
            {isPt 
              ? 'Idealizado e concebido pela Profª. Dra. Susana Cristina dos Reis (Universidade Federal de Santa Maria - UFSM • DLEM • CAL • LabEon • NUPEAD)'
              : 'Conceived and authored by Prof. Dr. Susana Cristina dos Reis (Federal University of Santa Maria - UFSM • DLEM • CAL • LabEon • NUPEAD)'}
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AboutModeModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        uiLanguage={uiLanguage}
        initialTab={aboutModalInitialTab}
      />

      <ProjectMetadataModal
        isOpen={isMetadataOpen}
        onClose={() => setIsMetadataOpen(false)}
        project={currentProject}
        onSave={(updated) => updateCurrentProject(updated)}
        uiLanguage={uiLanguage}
      />

      <PrebuiltTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        uiLanguage={uiLanguage}
      />

      <IterationHistoryModal
        isOpen={isIterationModalOpen}
        onClose={() => setIsIterationModalOpen(false)}
        project={currentProject}
        onAddIterationLog={handleAddIterationLog}
        uiLanguage={uiLanguage}
      />

      {isPrintViewOpen && (
        <PrintReportView
          project={currentProject}
          onClose={() => setIsPrintViewOpen(false)}
          uiLanguage={uiLanguage}
        />
      )}
    </div>
  );
}
