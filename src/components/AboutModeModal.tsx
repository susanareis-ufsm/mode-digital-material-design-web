import React, { useState } from 'react';
import { 
  BookOpen, 
  User, 
  X, 
  GraduationCap, 
  Award, 
  ExternalLink, 
  Mail, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Globe, 
  Building2,
  Compass,
  FileCheck2,
  Share2
} from 'lucide-react';
import { MODE_PHASES } from '../data/modePhasesData';

interface AboutModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  uiLanguage: 'pt' | 'en';
  initialTab?: 'about' | 'author';
}

export const AboutModeModal: React.FC<AboutModeModalProps> = ({
  isOpen,
  onClose,
  uiLanguage,
  initialTab = 'about',
}) => {
  const isPt = uiLanguage === 'pt';
  const [activeTab, setActiveTab] = useState<'about' | 'author'>(initialTab);

  // Sync initialTab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header with Gradient */}
        <div className="bg-gradient-to-r from-sky-800 via-indigo-900 to-slate-950 p-6 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white font-black text-2xl shadow-sm">
              M
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black tracking-tight">MoDE</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-200 border border-sky-400/30">
                  {isPt ? 'Modelo Cíclico de Design de Artefatos Digitais' : 'Cyclic Digital Material Design Model'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isPt 
                  ? 'Ensino e Aprendizagem de Línguas • Linguística Aplicada • Design Instrucional' 
                  : 'Language Teaching & Learning • Applied Linguistics • Instructional Design'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
            title={isPt ? 'Fechar' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 flex-shrink-0">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'about'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isPt ? 'Sobre o MoDE' : 'About MoDE'}</span>
          </button>

          <button
            onClick={() => setActiveTab('author')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'author'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{isPt ? 'Quem é o Responsável (Autoria)' : 'Who is Responsible (Authorship)'}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 leading-relaxed text-sm">
          
          {/* TAB 1: SOBRE O MODE */}
          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Introduction Card */}
              <div className="bg-gradient-to-br from-sky-50 to-indigo-50/50 p-5 rounded-2xl border border-sky-100">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-sky-600 text-white flex-shrink-0 mt-0.5">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {isPt 
                        ? 'O que é o MoDE?' 
                        : 'What is the MoDE Framework?'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700">
                      {isPt ? (
                        <>
                          O <strong>MoDE (Modelo Cíclico de Design de Artefatos Digitais para Ensino-Aprendizagem de Línguas)</strong> é uma metodologia orientada à criação, testagem e avaliação contínua de materiais didáticos digitais. Concebido para apoiar professores de línguas, designers instrucionais e pesquisadores, o MoDE estrutura a produção pedagógica em <strong>8 fases iterativas</strong> interligadas, promovendo intencionalidade pedagógica, autonomia do aprendiz e refinamento contínuo.
                        </>
                      ) : (
                        <>
                          The <strong>MoDE (Cyclic Digital Material Design Model for Language Teaching and Learning)</strong> is a comprehensive instructional framework dedicated to the creation, evaluation, and iterative refinement of digital language learning artifacts. It guides educators, researchers, and learning designers through <strong>8 interrelated iterative phases</strong> to ensure authentic pedagogy, learner autonomy, and continuous quality improvement.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Theoretical & Pedagogical Foundations */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{isPt ? 'Fundamentos Pedagógicos e Científicos' : 'Pedagogical & Scientific Foundations'}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
                    <span className="font-bold text-sky-800 block text-xs">
                      {isPt ? 'Design de Artefatos Digitais' : 'Digital Artifact Design'}
                    </span>
                    <p className="text-slate-600">
                      {isPt 
                        ? 'Superação da mera transposição de apostilas estáticas para criar artefatos interativos com propósito comunicativo claro.' 
                        : 'Moving beyond static textbooks to create authentic interactive artifacts with clear communicative goals.'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
                    <span className="font-bold text-indigo-800 block text-xs">
                      {isPt ? 'Pedagogia dos Multiletramentos' : 'Multiliteracies & Design'}
                    </span>
                    <p className="text-slate-600">
                      {isPt 
                        ? 'Apoio em Learning by Design (Cope & Kalantzis) e multimodalidade (áudio, texto, imagem, vídeo e hipertexto).' 
                        : 'Grounded in Learning by Design and multimodality (audio, visuals, text, interactive media, and hypertext).'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
                    <span className="font-bold text-emerald-800 block text-xs">
                      {isPt ? 'Ciclo Iterativo & Redesign' : 'Iterative Cycle & Redesign'}
                    </span>
                    <p className="text-slate-600">
                      {isPt 
                        ? 'Avaliação formativa com estudantes reais gerando evidências empíricas para o aprimoramento contínuo (Redesign).' 
                        : 'Empirical formative evaluation with real learners feeding back into continuous improvement (Redesign).'}
                    </p>
                  </div>
                </div>
              </div>

              {/* The 8 Phases Summary */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>{isPt ? 'As 8 Fases do Ciclo MoDE' : 'The 8 Phases of the MoDE Cycle'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  {MODE_PHASES.map((phase) => (
                    <div 
                      key={phase.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl hover:border-sky-300 transition shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`w-6 h-6 rounded-lg ${phase.badgeBgClass} text-white flex items-center justify-center font-bold text-xs`}>
                          {phase.stepNumber}
                        </span>
                        <h5 className="font-bold text-xs text-slate-900 truncate">
                          {isPt ? phase.namePt : phase.nameEn}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-3 leading-snug">
                        {isPt ? phase.mainActionsPt : phase.mainActionsEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purpose & Target Educators */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                <span className="font-bold text-slate-800 block">
                  {isPt ? 'Para quem é este aplicativo?' : 'Who is this app for?'}
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {isPt 
                    ? 'Professores de línguas (estrangeiras, adicionais e materna), pesquisadores de Linguística Aplicada, pós-graduandos em tecnologias educacionais, designers instrucionais e criadores de cursos em ambientes como Moodle, H5P, Genially, Google Classroom e plataformas abertas.' 
                    : 'Language educators (EFL, ESL, additional, and native languages), Applied Linguistics researchers, graduate students in educational technology, instructional designers, and content creators working on Moodle, H5P, Genially, and open LMS environments.'}
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: QUEM É O RESPONSÁVEL / AUTORIA */}
          {activeTab === 'author' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Author Highlight Banner */}
              <div className="bg-gradient-to-br from-indigo-900 via-sky-900 to-slate-950 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center gap-5">
                
                {/* Author Avatar / Badge */}
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xs border-2 border-white/30 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                  <GraduationCap className="w-10 h-10 text-amber-300" />
                </div>

                <div className="space-y-1 flex-1">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[11px] font-extrabold tracking-wide uppercase">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isPt ? 'Autora Principal & Idealizadora' : 'Main Author & Creator'}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Profª. Dra. Susana Cristina dos Reis
                  </h3>

                  <p className="text-xs sm:text-sm text-sky-200 font-medium">
                    {isPt 
                      ? 'Universidade Federal de Santa Maria (UFSM) • Centro de Artes e Letras (CAL)' 
                      : 'Federal University of Santa Maria (UFSM) • Center of Arts & Letters'}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <a
                      href="mailto:susana.reis@ufsm.br"
                      className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 hover:bg-white/25 rounded-lg transition text-slate-100 font-semibold"
                    >
                      <Mail className="w-3.5 h-3.5 text-sky-300" />
                      <span>susana.reis@ufsm.br</span>
                    </a>
                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-lg text-slate-300">
                      <Building2 className="w-3.5 h-3.5 text-indigo-300" />
                      <span>UFSM / DLEM / LabEon</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Academic Credentials */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>{isPt ? 'Perfil Acadêmico e Trajetória' : 'Academic Profile & Background'}</span>
                </h4>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <p>
                    {isPt ? (
                      <>
                        A <strong>Professora Dra. Susana Cristina dos Reis</strong> é docente associada da <strong>Universidade Federal de Santa Maria (UFSM)</strong>, vinculada ao Departamento de Línguas Estrangeiras e Modernas (DLEM) e ao Centro de Artes e Letras (CAL).
                      </>
                    ) : (
                      <>
                        <strong>Professor Dr. Susana Cristina dos Reis</strong> is an Associate Professor at the <strong>Federal University of Santa Maria (UFSM)</strong>, affiliated with the Department of Foreign and Modern Languages (DLEM) and the Center of Arts and Letters (CAL).
                      </>
                    )}
                  </p>

                  <p>
                    {isPt ? (
                      <>
                        Atua como docente permanente e orientadora no <strong>Mestrado Profissional em Tecnologias Educacionais em Rede (MPTR)</strong> e no <strong>Programa de Pós-Graduação em Letras (PPGL - Estudos Linguísticos)</strong> da UFSM, liderando pesquisas dedicadas à inovação pedagógica na cultura digital.
                      </>
                    ) : (
                      <>
                        She serves as permanent faculty and advisor in the <strong>Professional Master's Program in Network Technologies (MPTR)</strong> and the <strong>Postgraduate Program in Letters (PPGL)</strong> at UFSM, leading research dedicated to pedagogical innovation in digital culture.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Research Groups & Labs Bento */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>{isPt ? 'Laboratórios e Grupos de Pesquisa' : 'Laboratories & Research Groups'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* LabEon */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                        LE
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900">LabEon - UFSM</h5>
                        <span className="text-[11px] text-slate-500">
                          {isPt ? 'Laboratório de Ensino e Aprendizagem de Línguas Online' : 'Online Language Teaching & Learning Laboratory'}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-snug">
                      {isPt 
                        ? 'Espaço de formação, criação e avaliação de artefatos digitais, cursos online e recursos educacionais abertos para o ensino de línguas.' 
                        : 'Hub for training, design, and empirical evaluation of digital artifacts, online courses, and open language resources.'}
                    </p>
                  </div>

                  {/* NUPEAD */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                        NP
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900">NUPEAD (GRPesq / CNPq)</h5>
                        <span className="text-[11px] text-slate-500">
                          {isPt ? 'Líder do Grupo de Pesquisa CNPq' : 'CNPq Research Group Leader'}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-snug">
                      {isPt 
                        ? 'Núcleo de Pesquisa e Ensino-Aprendizagem de Línguas a Distância, investigando multiletramentos, CALL e design educacional.' 
                        : 'Research core dedicated to distance language learning, multiliteracies, CALL, and educational material design.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* App Dedication & Academic Impact */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center space-x-1.5 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isPt ? 'Propósito do Aplicativo MoDE' : 'Purpose of the MoDE App'}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {isPt ? (
                    <>
                      Este aplicativo foi concebido para viabilizar a aplicação prática do modelo MoDE proposto pela Profª. Dra. Susana Cristina dos Reis, permitindo que professores e pesquisadores organizem seus projetos, respondam aos checklists diagnósticos de cada fase, planejem estratégias de gamificação, conduzam análises de público e mantenham o histórico reflexivo de redesign de seus artefatos digitais.
                    </>
                  ) : (
                    <>
                      This application implements the operational workflow of the MoDE model created by Prof. Dr. Susana Cristina dos Reis, empowering educators and designers to plan artifacts, complete diagnostic checklists across all 8 phases, apply gamification strategies, analyze audience data, and track iterative redesign history.
                    </>
                  )}
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            {isPt 
              ? 'MoDE • Autoria: Profª. Dra. Susana Cristina dos Reis (UFSM)' 
              : 'MoDE • Authorship: Prof. Dr. Susana Cristina dos Reis (UFSM)'}
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab(activeTab === 'about' ? 'author' : 'about')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              {activeTab === 'about' 
                ? (isPt ? 'Ver Autoria & Responsável →' : 'View Authorship & Team →') 
                : (isPt ? '← Ver Sobre o MoDE' : '← View About MoDE')}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              {isPt ? 'Fechar' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
