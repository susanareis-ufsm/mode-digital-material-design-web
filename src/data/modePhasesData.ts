import { PhaseInfo, PhaseId, PrebuiltTemplate } from '../types';

export const MODE_PHASES: PhaseInfo[] = [
  {
    id: 'analyze',
    stepNumber: 1,
    namePt: 'Análise (Analyze)',
    nameEn: 'Analyze',
    colorHex: '#0288D1',
    badgeBgClass: 'bg-sky-500',
    badgeTextClass: 'text-sky-950',
    borderClass: 'border-sky-400',
    lightBgClass: 'bg-sky-50',
    iconName: 'Lightbulb',
    mainActionsPt: 'Conheça o público; Aplique questionários; Faça entrevistas; Tabule os dados; Analise os dados.',
    mainActionsEn: 'Know the audience; Apply questionnaires; Conduct interviews; Tabulate data; Analyze data.',
    defaultQuestionsPt: [
      'Quem é o público-alvo de aprendizes (idade, nível de proficiência, contexto)?',
      'Quais necessidades de linguagem ou habilidades (fala, escrita, escuta, leitura) devem ser priorizadas?',
      'Quais ferramentas de diagnóstico serão utilizadas (questionários, entrevistas, testes)?',
      'Como os dados coletados foram tabulados e sintetizados para orientar a produção?'
    ],
    defaultQuestionsEn: [
      'Who is the target learner audience (age, proficiency level, learning context)?',
      'Which language skills or competencies (speaking, writing, listening, reading) need focus?',
      'Which diagnostic instruments will be applied (surveys, interviews, pre-tests)?',
      'How have the collected learner data been tabulated and analyzed?'
    ],
    keyGuidelinesPt: [
      'Mapeie o letramento digital prévio dos estudantes para escolher a plataforma ideal.',
      'Identifique os principais obstáculos linguísticos enfrentados pelos alunos.',
      'Documente os requisitos mínimos tecnológicos (celular, computador, acesso à internet).'
    ],
    keyGuidelinesEn: [
      'Map students prior digital literacy to select the best platform.',
      'Identify key linguistic challenges faced by the learners.',
      'Document minimum technological requirements (mobile, desktop, connectivity).'
    ]
  },
  {
    id: 'plan',
    stepNumber: 2,
    namePt: 'Planejar (Plan)',
    nameEn: 'Plan',
    colorHex: '#00838F',
    badgeBgClass: 'bg-teal-600',
    badgeTextClass: 'text-teal-950',
    borderClass: 'border-teal-500',
    lightBgClass: 'bg-teal-50',
    iconName: 'Compass',
    mainActionsPt: 'Sintetize e Discuta os dados coletados com a Equipe; Planeje a interface; Planeje o design da Interface, as atividades, as interações.',
    mainActionsEn: 'Synthesize & discuss team data; Plan interface layout; Plan UI design, activities, and interactions.',
    defaultQuestionsPt: [
      'Os dados da análise foram discutidos com a equipe docente ou de design?',
      'Quais objetivos pedagógicos e resultados esperados definem cada atividade?',
      'Como será a estrutura de navegação e fluxo de interação do estudante?',
      'Quais recursos multimodais (áudios, vídeos, textos, quizzes) serão integrados?'
    ],
    defaultQuestionsEn: [
      'Have analysis findings been discussed with your teaching team or instructional designers?',
      'What core pedagogical learning outcomes guide each planned task?',
      'How will navigation structure and student interaction flows be designed?',
      'What multimodal resources (audio, videos, text, interactive widgets) are required?'
    ],
    keyGuidelinesPt: [
      'Crie um mapa de conteúdo ou storyboard antes da produção visual.',
      'Planeje o encadeamento das atividades (do simples ao complexo com scaffolding).',
      'Defina os elementos de gamificação preliminares que farão parte da jornada.'
    ],
    keyGuidelinesEn: [
      'Draft a storyboard or content map before starting visual creation.',
      'Sequence task complexity gradually with pedagogical scaffolding.',
      'Outline preliminary gamification elements integrated into the learning arc.'
    ]
  },
  {
    id: 'design',
    stepNumber: 3,
    namePt: 'Design / Desenho',
    nameEn: 'Design',
    colorHex: '#1A237E',
    badgeBgClass: 'bg-indigo-700',
    badgeTextClass: 'text-indigo-100',
    borderClass: 'border-indigo-600',
    lightBgClass: 'bg-indigo-50',
    iconName: 'PenTool',
    mainActionsPt: 'Desenhe; Crie; Elabore e Desenvolva o protótipo.',
    mainActionsEn: 'Sketch; Create; Elaborate and Develop the prototype.',
    defaultQuestionsPt: [
      'O protótipo digital foi criado na plataforma de desenvolvimento escolhida?',
      'Os textos, áudios e imagens estão adequados ao nível linguístico dos alunos?',
      'As instruções das atividades de linguagem estão claras, concisas e acessíveis?',
      'As mecânicas de gamificação (pontos, feedbacks, desafios) foram implementadas?'
    ],
    defaultQuestionsEn: [
      'Has the digital prototype been constructed on the chosen authoring platform?',
      'Are text, audio, and visual assets aligned with student proficiency levels?',
      'Are activity instructions concise, clear, and pedagogically accessible?',
      'Have gamification mechanics (points, feedback loops, quests) been built in?'
    ],
    keyGuidelinesPt: [
      'Garanta alto contraste visual e legibilidade em telas de celulares e computadores.',
      'Forneça feedback imediato e construtivo para respostas corretas e incorretas.',
      'Integre áudios nativos ou recursos de escuta com controle de reprodução.'
    ],
    keyGuidelinesEn: [
      'Ensure clear visual contrast and legibility across mobile and desktop displays.',
      'Provide immediate, encouraging feedback for both correct and incorrect attempts.',
      'Embed authentic target language audio with accessible playback speed controls.'
    ]
  },
  {
    id: 'testing',
    stepNumber: 4,
    namePt: 'Testagem / Aplicar Protótipo',
    nameEn: 'Apply Prototype / Test Interface',
    colorHex: '#F57F17',
    badgeBgClass: 'bg-amber-500',
    badgeTextClass: 'text-amber-950',
    borderClass: 'border-amber-400',
    lightBgClass: 'bg-amber-50',
    iconName: 'TestTube',
    mainActionsPt: 'Aplique o protótipo; Faça a Testagem; Verifique a interface.',
    mainActionsEn: 'Apply prototype; Conduct interface testing; Verify usability.',
    defaultQuestionsPt: [
      'O protótipo foi testado em diferentes dispositivos (celular, tablet, notebook)?',
      'Todos os links, botões de áudio, formulários e exercícios funcionam sem erros?',
      'Um grupo piloto de alunos ou professores realizou o teste navegacional?',
      'Em quais etapas os usuários encontraram travamentos, dúvidas ou falhas de UX?'
    ],
    defaultQuestionsEn: [
      'Was the prototype tested across multiple devices (mobile, tablet, desktop browsers)?',
      'Do all links, audio triggers, submission forms, and quizzes function smoothly?',
      'Did a pilot sample of students or peer educators perform usability testing?',
      'Where did testers experience friction, ambiguous prompts, or technical bugs?'
    ],
    keyGuidelinesPt: [
      'Realize testes de usabilidade observando o aluno interagir em tempo real.',
      'Verifique o tempo médio de resposta e carregamento das mídias digitais.',
      'Anote todas as inconsistências técnicas e linguísticas encontradas.'
    ],
    keyGuidelinesEn: [
      'Conduct usability walkthroughs observing pilot learners in real-time.',
      'Verify media load speeds and activity completion durations.',
      'Log all technical, typographical, and instructional bugs.'
    ]
  },
  {
    id: 'evaluation',
    stepNumber: 5,
    namePt: 'Avaliação do Protótipo',
    nameEn: 'Prototype Evaluation',
    colorHex: '#E65100',
    badgeBgClass: 'bg-orange-600',
    badgeTextClass: 'text-orange-950',
    borderClass: 'border-orange-500',
    lightBgClass: 'bg-orange-50',
    iconName: 'BarChart2',
    mainActionsPt: 'Avalie o Protótipo; Sintetize as avaliações feitas pelos usuários potenciais.',
    mainActionsEn: 'Evaluate Prototype; Synthesize evaluations made by potential users.',
    defaultQuestionsPt: [
      'Qual foi a reação e percepção geral dos aprendizes sobre o protótipo?',
      'Os objetivos de aprendizagem linguística foram alcançados no teste piloto?',
      'Quais elementos de gamificação geraram maior engajamento e motivação?',
      'Quais críticas ou sugestões foram trazidas pelos usuários potenciais?'
    ],
    defaultQuestionsEn: [
      'What was the learners overall perception and satisfaction with the prototype?',
      'Were core communicative objectives achieved during pilot execution?',
      'Which gamification strategies drove the highest student motivation and focus?',
      'What specific recommendations were highlighted by potential users?'
    ],
    keyGuidelinesPt: [
      'Classifique os feedbacks entre técnicos, pedagógicos e visuais/estéticos.',
      'Priorize alterações que afetam diretamente a compreensão linguística.',
      'Calcule a taxa de satisfação e de conclusão das tarefas no protótipo.'
    ],
    keyGuidelinesEn: [
      'Categorize feedback into technical, pedagogical, and aesthetic categories.',
      'Prioritize fixes that directly enhance target language comprehension.',
      'Measure learner satisfaction scores and activity completion rates.'
    ]
  },
  {
    id: 'redesign',
    stepNumber: 6,
    namePt: '(Re) Design / Redesenho',
    nameEn: '(Re) Design',
    colorHex: '#FBC02D',
    badgeBgClass: 'bg-yellow-400',
    badgeTextClass: 'text-yellow-950',
    borderClass: 'border-yellow-500',
    lightBgClass: 'bg-yellow-50',
    iconName: 'RotateCcw',
    mainActionsPt: 'Redesenhe; Reorganize o protótipo; Revise as iterações.',
    mainActionsEn: 'Redesign; Reorganize prototype; Revise iterations.',
    defaultQuestionsPt: [
      'Quais ajustes estruturais ou linguísticos precisam ser feitos após a avaliação?',
      'As instruções, layout ou recursos visuais foram reorganizados para maior clareza?',
      'As iterações foram registradas e documentadas no histórico do projeto?',
      'É necessário um novo ciclo de testagem rápida antes do lançamento final?'
    ],
    defaultQuestionsEn: [
      'What structural or linguistic modifications are required based on evaluation?',
      'Have instructions, layout, or visual elements been reorganized for clarity?',
      'Have all iteration decisions been documented in the project history log?',
      'Is a mini-retest required before final publication to students?'
    ],
    keyGuidelinesPt: [
      'Aproveite a natureza cíclica do MoDE para reiniciar iterações sempre que necessário.',
      'Refine a clareza das rubricas, dicas (hints) e mensagens de erro no material.',
      'Re-valide os elementos gamificados modificados.'
    ],
    keyGuidelinesEn: [
      'Leverage the iterative MoDE cycle to loop back to planning/design whenever needed.',
      'Refine rubrics, hints, and error guidance for target language exercises.',
      'Re-validate modified gamification dynamics.'
    ]
  },
  {
    id: 'apply',
    stepNumber: 7,
    namePt: 'Aplicação (Apply)',
    nameEn: 'Apply Digital Artifact',
    colorHex: '#2E7D32',
    badgeBgClass: 'bg-emerald-600',
    badgeTextClass: 'text-emerald-950',
    borderClass: 'border-emerald-500',
    lightBgClass: 'bg-emerald-50',
    iconName: 'Rocket',
    mainActionsPt: 'Aplique o Artefato Digital no contexto real de aprendizagem.',
    mainActionsEn: 'Apply the Digital Artifact in authentic learning environment.',
    defaultQuestionsPt: [
      'O material digital está finalizado e publicado na plataforma oficial?',
      'Os estudantes receberam orientações claras de acesso e navegação no material?',
      'As notas do professor (guias pedagógicos e suporte) estão disponíveis?',
      'O acompanhamento em tempo real do progresso dos alunos está ativo?'
    ],
    defaultQuestionsEn: [
      'Is the digital material fully deployed on the target platform (Moodle, Canvas, H5P)?',
      'Are learners onboarded with access instructions and navigation guides?',
      'Are teacher support notes and pedagogical facilitate guides ready?',
      'Is active tracking or student submission monitoring live?'
    ],
    keyGuidelinesPt: [
      'Acompanhe o engajamento inicial dos alunos nos primeiros dias de aplicação.',
      'Esteja disponível para sanar dúvidas de navegação ou acesso à plataforma.',
      'Registre observações qualitativas do comportamento dos alunos em aula.'
    ],
    keyGuidelinesEn: [
      'Monitor early learner participation during initial roll-out.',
      'Provide tech support for students encountering platform access issues.',
      'Record qualitative observations of student engagement in class.'
    ]
  },
  {
    id: 'final_eval',
    stepNumber: 8,
    namePt: 'Avaliação / Avaliar Artefato (Evaluate)',
    nameEn: 'Evaluate Artifact & UX',
    colorHex: '#1565C0',
    badgeBgClass: 'bg-blue-800',
    badgeTextClass: 'text-blue-100',
    borderClass: 'border-blue-600',
    lightBgClass: 'bg-blue-50',
    iconName: 'Star',
    mainActionsPt: 'Avalie o Artefato e a experiência do usuário; Compartilhe os dados com a comunidade.',
    mainActionsEn: 'Evaluate Artifact & user experience; Share findings with educational community.',
    defaultQuestionsPt: [
      'Qual foi o impacto do material na aquisição de linguagem e motivação dos alunos?',
      'Como foi a experiência geral do usuário (UX), acessibilidade e usabilidade?',
      'Os dados e aprendizados do ciclo MoDE foram compartilhados com a comunidade docente?',
      'Quais recomendações de futuras iterações ou novos materiais foram formuladas?'
    ],
    defaultQuestionsEn: [
      'What was the overall impact on student language acquisition and engagement?',
      'How was end-to-end user experience, accessibility, and learner autonomy?',
      'Have MoDE cycle data and insights been shared with peers or academic community?',
      'What recommendations exist for future project cycles or complementary materials?'
    ],
    keyGuidelinesPt: [
      'Tabule notas finais, ganho de vocabulário e resultados de aprendizado.',
      'Apresente o artefato em encontros pedagógicos, feiras ou artigos acadêmicos.',
      'Alimente o ciclo de melhoria contínua para os próximos semestres.'
    ],
    keyGuidelinesEn: [
      'Analyze student scores, vocabulary acquisition metrics, and oral gains.',
      'Share artifact results in teaching workshops, conferences, or publications.',
      'Feed continuous improvement insights into future course design cycles.'
    ]
  }
];

export const PREBUILT_TEMPLATES: PrebuiltTemplate[] = [
  {
    id: 'blank-custom-template',
    titlePt: 'Template em Branco (Personalizável para Professor Designer)',
    titleEn: 'Blank Template (Customizable for Teacher-Designer)',
    descriptionPt: 'Estrutura 100% em branco para o professor designer definir seus próprios objetivos, plataforma, público-alvo e conteúdo do zero no ciclo MoDE.',
    descriptionEn: 'Clean blank structure for the teacher-designer to customize objectives, platform, target audience, and content from scratch in the MoDE framework.',
    platform: 'Plataforma a Escolher',
    targetLanguage: 'Língua a Definir',
    audience: 'Público-Alvo Personalizado',
    purposePt: 'Defina o propósito pedagógico e comunicativo do seu artefato digital.',
    purposeEn: 'Define the pedagogical and communicative purpose of your digital artifact.',
    contentPt: 'Insira o conteúdo linguístico, vocabulário ou habilidades a trabalhar.',
    contentEn: 'Specify the linguistic content, vocabulary, or targeted skills.',
    gamificationSample: []
  },
  {
    id: 'h5p-esl-vocab-quest',
    titlePt: 'H5P - Quest de Vocabulário Interativo (Inglês)',
    titleEn: 'H5P - Interactive Vocabulary Quest (ESL)',
    descriptionPt: 'Material digital gamificado focado no desenvolvimento de vocabulário e expressão oral para alunos de nível B1 em plataforma H5P / Moodle.',
    descriptionEn: 'Gamified digital material focused on vocabulary acquisition and speaking for B1 ESL learners on H5P / Moodle.',
    platform: 'H5P / Moodle',
    targetLanguage: 'Inglês / English',
    audience: 'Estudantes do Ensino Médio / Nível B1 Intermediário',
    purposePt: 'Expandir vocabulário sobre sustentabilidade e promover debates em inglês com autonomia.',
    purposeEn: 'Expand vocabulary on sustainability and encourage autonomous speaking debates.',
    contentPt: 'Vocabulário de meio ambiente, conectores de causa e efeito, expressões de opinião oral.',
    contentEn: 'Environmental vocabulary, cause and effect connectors, spoken opinion phrases.',
    gamificationSample: [
      {
        title: 'Desafio do Eco-Detetive (Audio Quest)',
        category: 'Quests & Story',
        description: 'Os alunos resolvem enigmas auditivos em inglês encontrando pistas escondidas no material interativo.',
        targetSkill: 'Escuta & Vocabulário',
        targetPhase: 'design',
        platformTip: 'Utilize o componente H5P Course Presentation com pontos quentes (Hotspots) e áudios gravados.',
        status: 'planned',
        xpPoints: 100
      },
      {
        title: 'Medalhas de Proficiência Oral',
        category: 'Badges & Achievements',
        description: 'Desbloqueio de insígnias digitais ao enviar gravações de voz com pronunciamento claro das palavras-chave.',
        targetSkill: 'Fala & Pronúncia',
        targetPhase: 'apply',
        platformTip: 'Configure o módulo de Conclusão de Atividade do Moodle integrado ao acervo de Badges.',
        status: 'planned',
        xpPoints: 150
      }
    ]
  },
  {
    id: 'genially-french-escape-room',
    titlePt: 'Genially - Escape Room Gamificado de Francês',
    titleEn: 'Genially - Gamified French Language Escape Room',
    descriptionPt: 'Jogo de fuga virtual interativo para praticar tempos verbais no passado (Passé Composé vs Imparfait) e compreensão leitora.',
    descriptionEn: 'Interactive virtual escape game to practice past tenses (Passé Composé vs Imparfait) and reading comprehension in French.',
    platform: 'Genially',
    targetLanguage: 'Francês / French',
    audience: 'Estudantes Universitários de Letras / Francês A2-B1',
    purposePt: 'Dominar a diferença de uso entre Passé Composé e Imparfait através de enigmas narrativos.',
    purposeEn: 'Master the contrast between Passé Composé and Imparfait through narrative puzzles.',
    contentPt: 'Narrativas no passado, concordância dos particípios passados, conectores temporais.',
    contentEn: 'Past narratives, past participle agreement, temporal connectors.',
    gamificationSample: [
      {
        title: 'Código Secreto da Bastilha',
        category: 'Mystery & Unlocks',
        description: 'Cada resposta correta nos exercícios de gramática revela um dígito do código para abrir a porta virtual.',
        targetSkill: 'Gramática & Leitura',
        targetPhase: 'design',
        platformTip: 'Utilize a funcionalidade de Cadeado por Senha nas páginas do Genially.',
        status: 'planned',
        xpPoints: 200
      }
    ]
  },
  {
    id: 'canvas-spanish-roleplay',
    titlePt: 'Canvas LMS - Simulation & Roleplay em Espanhol',
    titleEn: 'Canvas LMS - Spanish Oral Roleplay & Gamified Rubric',
    descriptionPt: 'Módulo interativo de simulação de situações do cotidiano (viagens, restaurantes, entrevistas) em espanhol com avaliação por pares.',
    descriptionEn: 'Interactive simulation module of daily life scenarios in Spanish featuring peer evaluation and leaderboard badges.',
    platform: 'Canvas LMS',
    targetLanguage: 'Espanhol / Spanish',
    audience: 'Alunos do Ensino Fundamental II / Espanhol A1-A2',
    purposePt: 'Desenvolver fluência comunicativa oral inicial em situações reais de uso da língua espanhola.',
    purposeEn: 'Develop initial oral fluency in authentic communicative Spanish scenarios.',
    contentPt: 'Fórmulas de cortesia, pedidos em restaurantes, vocabulário de transporte e direções.',
    contentEn: 'Polite expressions, restaurant orders, transportation & direction vocabulary.',
    gamificationSample: [
      {
        title: 'Passaporte Hispânico (XP Tracker)',
        category: 'Points/XP',
        description: 'Estudantes colecionam carimbos no passaporte digital ao concluir cada missão oral.',
        targetSkill: 'Fala & Interação',
        targetPhase: 'apply',
        platformTip: 'Crie uma página com tabela personalizada e badges do Canvas Badgr.',
        status: 'planned',
        xpPoints: 250
      }
    ]
  }
];
