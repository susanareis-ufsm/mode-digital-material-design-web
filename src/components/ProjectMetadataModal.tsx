import React, { useState } from 'react';
import { MaterialProject } from '../types';
import { X, Save, Layers, User, Target, BookOpen, Monitor, Globe } from 'lucide-react';

interface ProjectMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: MaterialProject;
  onSave: (updated: Partial<MaterialProject>) => void;
  uiLanguage: 'pt' | 'en';
}

const COMMON_PLATFORMS = [
  'H5P / Moodle',
  'Genially',
  'Canvas LMS',
  'Google Classroom / Forms',
  'Padlet',
  'Kahoot / Quizizz',
  'Duolingo Stories',
  'BookCreator',
  'Edpuzzle',
  'Wordwall',
  'Web App Customizada'
];

export const ProjectMetadataModal: React.FC<ProjectMetadataModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave,
  uiLanguage,
}) => {
  const isPt = uiLanguage === 'pt';

  const [title, setTitle] = useState(project.title);
  const [audience, setAudience] = useState(project.audience);
  const [purpose, setPurpose] = useState(project.purpose);
  const [content, setContent] = useState(project.content);
  const [author, setAuthor] = useState(project.author);
  const [platform, setPlatform] = useState(project.platform);
  const [targetLanguage, setTargetLanguage] = useState(project.targetLanguage || 'Inglês');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      audience,
      purpose,
      content,
      author,
      platform,
      targetLanguage,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-700 via-teal-700 to-indigo-800 p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-sky-200">
              {isPt ? 'Registro do Artefato Digital' : 'Digital Artifact Registration'}
            </span>
            <h2 className="text-xl font-bold mt-1">
              {isPt ? 'Registrar Artefato Digital' : 'Register Digital Artifact'}
            </h2>
            <p className="text-xs text-sky-100/90 mt-1">
              {isPt ? 'Preencha os dados de identificação pedagógica recomendados pelo MoDE' : 'Specify pedagogical and technical metadata for MoDE framework'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-sky-100 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isPt ? 'Título do Material Digital *' : 'Material Title *'}
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isPt ? 'Ex: Quest de Vocabulário sobre Sustentabilidade' : 'E.g., Interactive Sustainability Vocabulary Quest'}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Language */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isPt ? 'Língua Alvo *' : 'Target Language *'}
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  placeholder={isPt ? 'Ex: Inglês, Espanhol, Francês...' : 'E.g., English, Spanish, French...'}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isPt ? 'Autor / Autorres do Material *' : 'Author(s) *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={isPt ? 'Ex: Prof. Susana Reis e Equipe' : 'E.g., Prof. Susana Reis & Dept Team'}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Platform of Development */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isPt ? 'Plataforma de Desenvolvimento *' : 'Development Platform *'}
            </label>
            <div className="relative">
              <Monitor className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                list="platforms-list"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder={isPt ? 'Selecione ou digite (Ex: H5P, Genially, Canvas LMS, Moodle...)' : 'Select or type (E.g., H5P, Genially, Canvas LMS...)'}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <datalist id="platforms-list">
                {COMMON_PLATFORMS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isPt ? 'Público-Alvo (Audience) *' : 'Target Audience *'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder={isPt ? 'Ex: Estudantes do Ensino Médio, Nível B1 Intermediário' : 'E.g., B1 Intermediate High School Students'}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isPt ? 'Propósito / Objetivos Pedagógicos *' : 'Pedagogical Purpose / Goals *'}
            </label>
            <div className="relative">
              <Target className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                required
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder={isPt ? 'Ex: Desenvolver a fluência oral e compreensão auditiva através de resolução de problemas sustentáveis.' : 'E.g., Develop speaking fluency and listening comprehension via real-world task resolution.'}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isPt ? 'Conteúdo Linguístico & Tópico *' : 'Linguistic & Topic Content *'}
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                required
                rows={2}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={isPt ? 'Ex: Vocabulário de meio ambiente, Passado Contínuo, Conectores gramaticais' : 'E.g., Climate vocabulary, Past Continuous, Cause and Effect Connectors'}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              {isPt ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-sm font-bold shadow-sm transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isPt ? 'Salvar Alterações' : 'Save Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
