import React, { useState } from 'react';
import { 
  MaterialProject, 
  GamificationStrategy, 
  GamificationCategory, 
  PhaseId 
} from '../types';
import { MODE_PHASES } from '../data/modePhasesData';
import { 
  Gamepad2, 
  Plus, 
  Trophy, 
  CheckCircle, 
  Trash2, 
  Filter, 
  Award, 
  HelpCircle,
  Zap,
  Target
} from 'lucide-react';

interface GamificationHubProps {
  project: MaterialProject;
  onAddStrategy: (strategy: Omit<GamificationStrategy, 'id' | 'registeredAt'>) => void;
  onDeleteStrategy: (id: string) => void;
  uiLanguage: 'pt' | 'en';
}

const CATEGORIES: GamificationCategory[] = [
  'Points/XP',
  'Badges & Achievements',
  'Quests & Story',
  'Leaderboard',
  'Immediate Feedback',
  'Time Challenge',
  'Peer Collaboration',
  'Mystery & Unlocks'
];

const SKILLS = [
  'Speaking / Fala',
  'Listening / Escuta',
  'Reading / Leitura',
  'Writing / Escrita',
  'Vocabulary / Vocabulário',
  'Grammar / Gramática',
  'Pronunciation / Pronúncia'
];

export const GamificationHub: React.FC<GamificationHubProps> = ({
  project,
  onAddStrategy,
  onDeleteStrategy,
  uiLanguage,
}) => {
  const isPt = uiLanguage === 'pt';

  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPhase, setFilterPhase] = useState<string>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GamificationCategory>('Quests & Story');
  const [description, setDescription] = useState('');
  const [targetSkill, setTargetSkill] = useState('Vocabulary / Vocabulário');
  const [targetPhase, setTargetPhase] = useState<PhaseId>('design');
  const [platformTip, setPlatformTip] = useState('');
  const [xpPoints, setXpPoints] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAddStrategy({
      title: title.trim(),
      category,
      description: description.trim(),
      targetSkill,
      targetPhase,
      platformTip: platformTip.trim() || (isPt ? 'Configurar no editor da plataforma.' : 'Configure in platform authoring tools.'),
      status: 'planned',
      xpPoints,
    });

    // Reset
    setTitle('');
    setDescription('');
    setPlatformTip('');
    setShowForm(false);
  };

  // Filter strategies
  const filteredStrategies = project.gamificationStrategies.filter((s) => {
    if (filterCategory !== 'all' && s.category !== filterCategory) return false;
    if (filterPhase !== 'all' && s.targetPhase !== filterPhase) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 text-white">
              {isPt ? 'Módulo de Engajamento' : 'Engagement Module'}
            </span>
            <span className="text-xs text-emerald-200 font-semibold">
              MoDE Framework
            </span>
          </div>

          <h2 className="text-2xl font-black mt-1 flex items-center space-x-2">
            <Gamepad2 className="w-6 h-6 text-emerald-400" />
            <span>{isPt ? 'Registro de Estratégias de Gamificação' : 'Gamification Strategy Registry'}</span>
          </h2>

          <p className="text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
            {isPt
              ? 'Planeje, cadastre e vincule mecânicas gamificadas (pontos, missões, selos, feedback imediato) ao seu material digital de línguas.'
              : 'Design, register, and link gamified mechanics (XP, quests, badges, instant feedback) to your digital language learning material.'}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>{isPt ? 'Cadastrar Estratégia' : 'Register Strategy'}</span>
          </button>
        </div>
      </div>

      {/* Registration Form Modal/Card */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-emerald-500 p-6 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-emerald-600" />
              <span>{isPt ? 'Cadastrar Nova Estratégia Gamificada' : 'Register New Gamified Strategy'}</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              {isPt ? 'Fechar' : 'Close'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isPt ? 'Nome da Estratégia / Desafio *' : 'Strategy Title *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isPt ? 'Ex: Desafio do Eco-Detetive Auditivo' : 'E.g., Listening Eco-Detective Quest'}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isPt ? 'Categoria de Gamificação *' : 'Gamification Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GamificationCategory)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Target Skill */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isPt ? 'Habilidade de Língua Alvo *' : 'Target Language Skill *'}
              </label>
              <select
                value={targetSkill}
                onChange={(e) => setTargetSkill(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {SKILLS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Target Phase */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isPt ? 'Fase do Ciclo MoDE Vinculada *' : 'Linked MoDE Phase *'}
              </label>
              <select
                value={targetPhase}
                onChange={(e) => setTargetPhase(e.target.value as PhaseId)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {MODE_PHASES.map((p) => (
                  <option key={p.id} value={p.id}>
                    Fase {p.stepNumber}: {isPt ? p.namePt : p.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {isPt ? 'Descrição das Regras & Mecânica *' : 'Rules & Mechanic Description *'}
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isPt ? 'Descreva detalhadamente como os alunos interagem e ganham pontos/selos...' : 'Describe how learners interact, unlock achievements, or gain XP...'}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Platform Tip */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {isPt ? 'Dica de Implementação na Plataforma' : 'Platform Implementation Tip'}
            </label>
            <input
              type="text"
              value={platformTip}
              onChange={(e) => setPlatformTip(e.target.value)}
              placeholder={isPt ? 'Ex: Configurar módulo H5P Hotspots com recurso Badgr no Moodle' : 'E.g., Configure H5P Hotspot presentation with Moodle Badges'}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50"
            >
              {isPt ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              {isPt ? 'Salvar Estratégia' : 'Save Strategy'}
            </button>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">
            {isPt ? 'Filtrar Estratégias:' : 'Filter Strategies:'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 font-medium text-slate-800"
          >
            <option value="all">{isPt ? 'Todas as Categorias' : 'All Categories'}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Phase Filter */}
          <select
            value={filterPhase}
            onChange={(e) => setFilterPhase(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 font-medium text-slate-800"
          >
            <option value="all">{isPt ? 'Todas as Fases' : 'All Phases'}</option>
            {MODE_PHASES.map((p) => (
              <option key={p.id} value={p.id}>
                Fase {p.stepNumber}: {isPt ? p.namePt.split('/')[0] : p.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Registered Gamification List Grid */}
      {filteredStrategies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Gamepad2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 text-base">
            {isPt ? 'Nenhuma estratégia de gamificação cadastrada' : 'No gamification strategies registered'}
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {isPt
              ? 'Clique em "Cadastrar Estratégia" para registrar mecânicas envolventes para seus alunos.'
              : 'Click "Register Strategy" to create engaging mechanics for your learners.'}
          </p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {isPt ? 'Cadastrar Estratégia' : 'Register Strategy'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStrategies.map((s) => {
            const phaseObj = MODE_PHASES.find((p) => p.id === s.targetPhase);
            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {s.category}
                    </span>

                    {phaseObj && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white`} style={{ backgroundColor: phaseObj.colorHex }}>
                        {phaseObj.stepNumber}. {isPt ? phaseObj.namePt.split('/')[0] : phaseObj.nameEn}
                      </span>
                    )}
                  </div>

                  <h4 className="font-black text-slate-900 text-base mb-1">
                    {s.title}
                  </h4>

                  <div className="flex items-center space-x-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center space-x-1 font-semibold text-slate-700">
                      <Target className="w-3.5 h-3.5 text-sky-600" />
                      <span>{s.targetSkill}</span>
                    </span>
                    {s.xpPoints && (
                      <span className="flex items-center space-x-1 font-bold text-amber-600">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{s.xpPoints} XP</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {s.description}
                  </p>

                  {s.platformTip && (
                    <div className="text-[11px] text-teal-800 bg-teal-50 border border-teal-200 p-2.5 rounded-lg flex items-start space-x-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span><strong>{isPt ? 'Dica da Plataforma:' : 'Platform Tip:'}</strong> {s.platformTip}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{isPt ? 'Cadastrado em:' : 'Registered on:'} {new Date(s.registeredAt).toLocaleDateString()}</span>
                  
                  <button
                    onClick={() => onDeleteStrategy(s.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition opacity-0 group-hover:opacity-100 cursor-pointer"
                    title={isPt ? 'Excluir estratégia' : 'Delete strategy'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
