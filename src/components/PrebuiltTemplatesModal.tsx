import React from 'react';
import { PrebuiltTemplate } from '../types';
import { PREBUILT_TEMPLATES } from '../data/modePhasesData';
import { BookOpen, X, ArrowRight, Gamepad2, Sparkles, FileEdit } from 'lucide-react';

interface PrebuiltTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PrebuiltTemplate) => void;
  uiLanguage: 'pt' | 'en';
}

export const PrebuiltTemplatesModal: React.FC<PrebuiltTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  uiLanguage,
}) => {
  const isPt = uiLanguage === 'pt';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-indigo-800 via-sky-800 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">
                {isPt ? 'Modelos de Materiais Prontos (Templates)' : 'Prebuilt Material Templates'}
              </h3>
              <p className="text-xs text-sky-100/90">
                {isPt ? 'Escolha um modelo inicial com diretrizes ou comece com um template em branco' : 'Select a starter template or begin with a customizable blank template.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {PREBUILT_TEMPLATES.map((tmpl) => {
            const isBlank = tmpl.id === 'blank-custom-template';

            return (
              <div
                key={tmpl.id}
                className={`rounded-2xl p-5 flex flex-col justify-between transition group hover:shadow-md cursor-pointer border ${
                  isBlank
                    ? 'bg-gradient-to-br from-indigo-50/80 via-sky-50/50 to-white border-indigo-300 hover:border-indigo-600 ring-1 ring-indigo-200'
                    : 'bg-slate-50 border-slate-200 hover:border-sky-500'
                }`}
                onClick={() => {
                  onSelectTemplate(tmpl);
                  onClose();
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isBlank
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                      }`}
                    >
                      {isBlank ? (isPt ? '✨ Personalizável' : '✨ Customizable') : tmpl.platform}
                    </span>
                    <span className="text-xs font-bold text-sky-700">
                      {tmpl.targetLanguage}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition flex items-center space-x-1.5">
                    {isBlank && <FileEdit className="w-4 h-4 text-indigo-600 inline" />}
                    <span>{isPt ? tmpl.titlePt : tmpl.titleEn}</span>
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {isPt ? tmpl.descriptionPt : tmpl.descriptionEn}
                  </p>

                  <div className="space-y-1.5 text-[11px] text-slate-700 bg-white/90 p-3 rounded-xl border border-slate-200">
                    <div><strong>{isPt ? 'Público:' : 'Audience:'}</strong> {tmpl.audience}</div>
                    <div><strong>{isPt ? 'Propósito:' : 'Purpose:'}</strong> {isPt ? tmpl.purposePt : tmpl.purposeEn}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  {isBlank ? (
                    <span className="text-[11px] font-semibold text-indigo-700 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{isPt ? 'Livre para Customizar' : 'Free to Customize'}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center space-x-1">
                      <Gamepad2 className="w-3.5 h-3.5" />
                      <span>{tmpl.gamificationSample.length} {isPt ? 'Mecânicas de Gamificação' : 'Gamification Items'}</span>
                    </span>
                  )}

                  <span className={`text-xs font-bold group-hover:translate-x-1 transition flex items-center space-x-1 ${isBlank ? 'text-indigo-700' : 'text-sky-600'}`}>
                    <span>{isPt ? 'Usar Modelo' : 'Use Template'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            {isPt ? 'Fechar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
