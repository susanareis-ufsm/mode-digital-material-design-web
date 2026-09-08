import { MaterialProject, PhaseId, PhaseChecklistItem, GamificationStrategy, PrebuiltTemplate } from '../types';
import { MODE_PHASES } from '../data/modePhasesData';

const LOCAL_STORAGE_KEY = 'mode_digital_material_projects_v1';
const ACTIVE_PROJECT_ID_KEY = 'mode_active_project_id_v1';

export function createDefaultChecklists(uiLang: 'pt' | 'en' = 'pt'): Record<PhaseId, PhaseChecklistItem[]> {
  const checklists: Record<PhaseId, PhaseChecklistItem[]> = {
    analyze: [],
    plan: [],
    design: [],
    testing: [],
    evaluation: [],
    redesign: [],
    apply: [],
    final_eval: []
  };

  MODE_PHASES.forEach(phase => {
    const questionsPt = phase.defaultQuestionsPt;
    const questionsEn = phase.defaultQuestionsEn;
    
    checklists[phase.id] = questionsPt.map((qPt, idx) => ({
      id: `${phase.id}_default_${idx + 1}`,
      textPt: qPt,
      textEn: questionsEn[idx] || qPt,
      completed: false,
      isCustom: false
    }));
  });

  return checklists;
}

export function createNewProject(
  title: string = 'Novo Artefato Digital de Linguagem',
  audience: string = 'Estudantes de Línguas',
  purpose: string = 'Promover autonomia e comunicação oral/escrita em ambiente digital',
  content: string = 'Vocabulário, Gramática, Leitura e Fala Interativa',
  author: string = 'Prof. Linguagens',
  platform: string = 'H5P / Moodle',
  targetLanguage: string = 'Inglês',
  template?: PrebuiltTemplate,
  uiLanguage: 'pt' | 'en' = 'pt'
): MaterialProject {
  const now = new Date().toISOString();
  const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  let gamificationStrategies: GamificationStrategy[] = [];
  if (template && template.gamificationSample) {
    gamificationStrategies = template.gamificationSample.map((sample, idx) => ({
      ...sample,
      id: `game_${Date.now()}_${idx}`,
      registeredAt: now,
    }));
  }

  return {
    id: projectId,
    title: template ? (uiLanguage === 'pt' ? template.titlePt : template.titleEn) : title,
    audience: template ? template.audience : audience,
    purpose: template ? (uiLanguage === 'pt' ? template.purposePt : template.purposeEn) : purpose,
    content: template ? (uiLanguage === 'pt' ? template.contentPt : template.contentEn) : content,
    author: author,
    platform: template ? template.platform : platform,
    targetLanguage: template ? template.targetLanguage : targetLanguage,
    currentPhase: 'analyze',
    createdAt: now,
    updatedAt: now,
    checklists: createDefaultChecklists(uiLanguage),
    gamificationStrategies,
    iterationLogs: [
      {
        id: `iter_${Date.now()}`,
        timestamp: now,
        fromPhase: 'analyze',
        toPhase: 'analyze',
        reason: uiLanguage === 'pt' ? 'Início do projeto no ciclo MoDE' : 'Project initiated in MoDE cycle',
        author
      }
    ],
    notes: [],
    uiLanguage
  };
}

export function loadProjectsFromStorage(): MaterialProject[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const initialProj = createNewProject();
      saveProjectsToStorage([initialProj]);
      saveActiveProjectId(initialProj.id);
      return [initialProj];
    }
    const projects: MaterialProject[] = JSON.parse(raw);
    if (!projects || projects.length === 0) {
      const initialProj = createNewProject();
      saveProjectsToStorage([initialProj]);
      saveActiveProjectId(initialProj.id);
      return [initialProj];
    }
    return projects;
  } catch (err) {
    console.error('Failed to load projects from localStorage:', err);
    const fallback = [createNewProject()];
    return fallback;
  }
}

export function saveProjectsToStorage(projects: MaterialProject[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to localStorage:', err);
  }
}

export function loadActiveProjectId(): string | null {
  return localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
}

export function saveActiveProjectId(id: string): void {
  localStorage.setItem(ACTIVE_PROJECT_ID_KEY, id);
}

export function exportProjectToJson(project: MaterialProject): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const safeTitle = project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  downloadAnchor.setAttribute('download', `MoDE_${safeTitle}_${project.id}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
