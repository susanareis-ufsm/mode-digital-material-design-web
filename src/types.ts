export type PhaseId = 
  | 'analyze' 
  | 'plan' 
  | 'design' 
  | 'testing' 
  | 'evaluation' 
  | 'redesign' 
  | 'apply' 
  | 'final_eval';

export interface PhaseInfo {
  id: PhaseId;
  stepNumber: number;
  namePt: string;
  nameEn: string;
  colorHex: string;
  badgeBgClass: string;
  badgeTextClass: string;
  borderClass: string;
  lightBgClass: string;
  iconName: string;
  mainActionsPt: string;
  mainActionsEn: string;
  defaultQuestionsPt: string[];
  defaultQuestionsEn: string[];
  keyGuidelinesPt: string[];
  keyGuidelinesEn: string[];
}

export interface PhaseChecklistItem {
  id: string;
  textPt: string;
  textEn: string;
  completed: boolean;
  isCustom?: boolean;
  notes?: string;
  answer?: string;
  answeredAt?: string;
}

export type GamificationCategory = 
  | 'Points/XP' 
  | 'Badges & Achievements' 
  | 'Quests & Story' 
  | 'Leaderboard' 
  | 'Immediate Feedback' 
  | 'Time Challenge' 
  | 'Peer Collaboration' 
  | 'Mystery & Unlocks';

export interface GamificationStrategy {
  id: string;
  title: string;
  category: GamificationCategory;
  description: string;
  targetSkill: string;
  targetPhase: PhaseId;
  platformTip: string;
  registeredAt: string;
  status: 'planned' | 'in_progress' | 'implemented' | 'evaluated';
  xpPoints?: number;
}

export interface ProjectIterationLog {
  id: string;
  timestamp: string;
  fromPhase: PhaseId;
  toPhase: PhaseId;
  reason: string;
  author: string;
}

export interface ProjectNote {
  id: string;
  phaseId: PhaseId;
  date: string;
  title: string;
  content: string;
}

export type AudienceFileType = 'spreadsheet' | 'document' | 'survey' | 'text';

export interface AudienceSourceFile {
  id: string;
  name: string;
  size: number;
  type: AudienceFileType;
  uploadedAt: string;
  content: string;
  rowCount?: number;
  previewRows?: string[][];
  summary?: string;
}

export interface SuggestedPhase1Answer {
  questionMatchSnippet: string;
  suggestedAnswer: string;
}

export interface AudienceProfileAnalysis {
  analyzedAt: string;
  sourceFileNames: string[];
  overallProfile: string;
  proficiencyLevel: string;
  demographics: string;
  learningNeeds: string[];
  technologicalProfile: string;
  painPointsAndBarriers: string[];
  pedagogicalRecommendations: string[];
  suggestedAudienceText: string;
  suggestedPhase1Answers?: SuggestedPhase1Answer[];
}

export interface MaterialProject {
  id: string;
  title: string;
  audience: string;
  purpose: string;
  content: string;
  author: string;
  platform: string;
  targetLanguage: string;
  currentPhase: PhaseId;
  createdAt: string;
  updatedAt: string;
  checklists: Record<PhaseId, PhaseChecklistItem[]>;
  gamificationStrategies: GamificationStrategy[];
  iterationLogs: ProjectIterationLog[];
  notes: ProjectNote[];
  audienceFiles?: AudienceSourceFile[];
  audienceAnalysis?: AudienceProfileAnalysis;
  uiLanguage: 'pt' | 'en';
}

export interface PrebuiltTemplate {
  id: string;
  titlePt: string;
  titleEn: string;
  descriptionPt: string;
  descriptionEn: string;
  platform: string;
  targetLanguage: string;
  audience: string;
  purposePt: string;
  purposeEn: string;
  contentPt: string;
  contentEn: string;
  gamificationSample: Omit<GamificationStrategy, 'id' | 'registeredAt'>[];
}
