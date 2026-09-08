import React from 'react';
import { MaterialProject } from '../types';
import { 
  Save,
  CheckCircle2,
  Loader2,
  FolderKanban, 
  Plus, 
  Edit3, 
  FileText, 
  Printer, 
  Gamepad2, 
  Globe, 
  Download, 
  Upload,
  BookOpen,
  BarChart3,
  Info,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  currentProject: MaterialProject;
  projects: MaterialProject[];
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onEditMetadata: () => void;
  onOpenTemplates: () => void;
  onOpenGamification: () => void;
  onOpenPrintView: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenAboutMode?: () => void;
  onOpenAuthor?: () => void;
  activeTab: 'dashboard' | 'cycle' | 'gamification' | 'history';
  setActiveTab: (tab: 'dashboard' | 'cycle' | 'gamification' | 'history') => void;
  uiLanguage: 'pt' | 'en';
  onToggleLanguage: () => void;
  saveStatus?: 'saved' | 'saving';
  lastSavedAt?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onNewProject,
  onEditMetadata,
  onOpenTemplates,
  onOpenGamification,
  onOpenPrintView,
  onExportJson,
  onImportJson,
  onOpenAboutMode,
  onOpenAuthor,
  activeTab,
  setActiveTab,
  uiLanguage,
  onToggleLanguage,
  saveStatus = 'saved',
  lastSavedAt = null,
}) => {
  const isPt = uiLanguage === 'pt';
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs" role="banner">
      {/* Skip to Content for Keyboard Accessibility */}
      <a href="#main-content" className="skip-link">
        {isPt ? 'Pular para o conteúdo principal' : 'Skip to main content'}
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Brand, Active Project Workspace & Knowledge Hub */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 gap-3">
          
          {/* Brand & Identity */}
          <div className="flex items-center justify-between sm:justify-start space-x-3">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-teal-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-xs flex-shrink-0 select-none"
                aria-hidden="true"
              >
                M
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">MoDE</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200/80">
                    {isPt ? 'Design de Artefatos Digitais' : 'Digital Material Design'}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-600 hidden sm:block">
                  {isPt ? 'Modelo Cíclico de 8 Fases para Ensino-Aprendizagem de Línguas' : '8-Phase Iterative Cycle for Language Teachers'}
                </p>
              </div>
            </div>

            {/* Mobile Auto-Save & Language */}
            <div className="flex items-center space-x-1 sm:hidden">
              <button
                onClick={onToggleLanguage}
                className="p-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200"
                aria-label={isPt ? 'Alternar idioma para Inglês' : 'Switch language to Portuguese'}
              >
                {uiLanguage.toUpperCase()}
              </button>
            </div>
          </div>

          {/* Right Action Bar: Project Workspace, Reference Hub & Tools */}
          <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2">
            
            {/* Project Picker & Creator */}
            <div className="flex items-center bg-slate-100/90 rounded-lg p-1 border border-slate-200">
              <FolderKanban className="w-4 h-4 text-slate-600 ml-1.5 mr-1 flex-shrink-0" aria-hidden="true" />
              <label htmlFor="project-picker-select" className="sr-only">
                {isPt ? 'Selecionar projeto ativo' : 'Select active project'}
              </label>
              <select
                id="project-picker-select"
                value={currentProject.id}
                onChange={(e) => onSelectProject(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 pr-5 py-1 focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title || (isPt ? 'Sem título' : 'Untitled')}
                  </option>
                ))}
              </select>

              <button
                onClick={onNewProject}
                className="ml-1 p-1 bg-white hover:bg-slate-50 text-slate-700 rounded-md border border-slate-200 hover:border-slate-300 transition cursor-pointer"
                title={isPt ? 'Criar novo projeto de material digital' : 'Create new digital material project'}
                aria-label={isPt ? 'Criar novo projeto' : 'Create new project'}
              >
                <Plus className="w-3.5 h-3.5 text-sky-600" />
              </button>

              <button
                onClick={onEditMetadata}
                className="ml-1 p-1 bg-white hover:bg-slate-50 text-slate-700 rounded-md border border-slate-200 hover:border-slate-300 transition cursor-pointer"
                title={isPt ? 'Editar especificações do artefato (Título, Público, Plataforma)' : 'Edit artifact specifications (Title, Audience, Platform)'}
                aria-label={isPt ? 'Editar especificações do artefato' : 'Edit artifact specifications'}
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>

            {/* Educational Framework & Authorship Reference Hub */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAboutMode}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-sky-900 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition cursor-pointer shadow-2xs"
                title={isPt ? 'Conhecer as 8 fases do Modelo Cíclico MoDE' : 'Learn about the 8 phases of the MoDE Cyclic Model'}
                aria-label={isPt ? 'Sobre o Modelo MoDE' : 'About the MoDE Framework'}
              >
                <Info className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                <span>{isPt ? 'Sobre o MoDE' : 'About MoDE'}</span>
              </button>

              <button
                onClick={onOpenAuthor}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition cursor-pointer shadow-2xs"
                title={isPt ? 'Quem é o responsável por este app • Autoria: Profª. Dra. Susana Cristina dos Reis (UFSM)' : 'Who is responsible for this app • Main Author: Prof. Dr. Susana Cristina dos Reis (UFSM)'}
                aria-label={isPt ? 'Quem é o responsável / Autoria' : 'Authorship & Responsibility'}
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                <span className="hidden sm:inline">{isPt ? 'Autoria (Profª Susana)' : 'Author (Dr. Susana)'}</span>
                <span className="sm:hidden">{isPt ? 'Autoria' : 'Author'}</span>
              </button>

              <button
                onClick={onOpenTemplates}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title={isPt ? 'Modelos de materiais prontos para clonar' : 'Prebuilt material templates'}
                aria-label={isPt ? 'Modelos de materiais prontos' : 'Prebuilt material templates'}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden md:inline">{isPt ? 'Modelos' : 'Templates'}</span>
              </button>
            </div>

            {/* Auto-Save Status Badge */}
            <div 
              className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-50 text-slate-600 border border-slate-200"
              title={
                isPt 
                  ? `Salvo automaticamente no navegador via localStorage. ${lastSavedAt ? `Último salvamento: ${lastSavedAt}` : ''}` 
                  : `Auto-saved to localStorage. ${lastSavedAt ? `Last saved at: ${lastSavedAt}` : ''}`
              }
              aria-live="polite"
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-3 h-3 text-amber-500 animate-spin" aria-hidden="true" />
                  <span className="text-amber-800">{isPt ? 'Salvando...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                  <span className="text-slate-600">{isPt ? 'Salvo' : 'Saved'}</span>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200 cursor-pointer"
              title={isPt ? 'Alternar idioma (PT/EN)' : 'Toggle language (PT/EN)'}
              aria-label={isPt ? 'Alternar idioma para Inglês' : 'Switch language to Portuguese'}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>{uiLanguage.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Bottom Tier: Semantic Tab Navigation Bar & Output Controls */}
        <nav 
          className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-200/80 py-2 gap-2"
          role="navigation"
          aria-label={isPt ? 'Navegação de Módulos do MoDE' : 'MoDE Modules Navigation'}
        >
          {/* Main Navigation Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto custom-scrollbar pb-1 sm:pb-0" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'dashboard'}
              id="tab-dashboard"
              aria-controls="panel-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
              <span>{isPt ? '1. Dashboard das 8 Fases' : '1. 8 Phases Dashboard'}</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'cycle'}
              id="tab-cycle"
              aria-controls="panel-cycle"
              onClick={() => setActiveTab('cycle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'cycle'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isPt ? '2. Ciclo MoDE & Checklists' : '2. MoDE Cycle & Checklists'}</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'gamification'}
              id="tab-gamification"
              aria-controls="panel-gamification"
              onClick={() => setActiveTab('gamification')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'gamification'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isPt ? '3. Gamificação' : '3. Gamification'}</span>
              {currentProject.gamificationStrategies.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-900 font-extrabold">
                  {currentProject.gamificationStrategies.length}
                </span>
              )}
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'history'}
              id="tab-history"
              aria-controls="panel-history"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400" aria-hidden="true" />
              <span>{isPt ? '4. Histórico de Redesign' : '4. Iteration Logs'}</span>
              {currentProject.iterationLogs && currentProject.iterationLogs.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-900 font-extrabold">
                  {currentProject.iterationLogs.length}
                </span>
              )}
            </button>
          </div>

          {/* Export & Report Controls */}
          <div className="flex items-center space-x-1.5 self-end sm:self-center">
            <button
              onClick={onOpenPrintView}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition cursor-pointer border border-transparent hover:border-slate-200"
              title={isPt ? 'Visualizar e imprimir relatório pedagógico formatado (PDF)' : 'Preview and print formatted pedagogical report (PDF)'}
              aria-label={isPt ? 'Visualizar e imprimir relatório pedagógico' : 'Print pedagogical report'}
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
              <span>{isPt ? 'Relatório PDF' : 'PDF Report'}</span>
            </button>

            <button
              onClick={onExportJson}
              className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition cursor-pointer border border-transparent hover:border-slate-200"
              title={isPt ? 'Exportar dados deste projeto em formato JSON' : 'Export project in JSON format'}
              aria-label={isPt ? 'Exportar projeto em JSON' : 'Export project JSON'}
            >
              <Download className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            <label 
              className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition cursor-pointer border border-transparent hover:border-slate-200"
              title={isPt ? 'Importar projeto a partir de arquivo JSON' : 'Import project from JSON file'}
              aria-label={isPt ? 'Importar projeto JSON' : 'Import project JSON'}
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
              <span className="hidden sm:inline">{isPt ? 'Importar' : 'Import'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={onImportJson}
                className="hidden"
                aria-label={isPt ? 'Selecionar arquivo JSON para importar' : 'Select JSON file to import'}
              />
            </label>
          </div>
        </nav>
      </div>
    </header>
  );
};
