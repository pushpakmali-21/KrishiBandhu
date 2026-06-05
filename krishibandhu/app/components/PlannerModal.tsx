import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PlannerModalProps {
  setShowPlannerModal: (v: boolean) => void;
}

export default function PlannerModal({ setShowPlannerModal }: PlannerModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-transparent dark:border-gray-700">
        <div className="p-8">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 mb-2">{t('planner.badge')}</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{t('planner.title')}</h3>
            </div>
            <button onClick={() => setShowPlannerModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close next season planner">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{t('planner.description')}</p>
          <div className="grid grid-cols-2 gap-3 text-xs font-bold text-gray-600 dark:text-gray-300 mb-8">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4">{t('planner.soil')}</div>
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 rounded-2xl p-4">{t('planner.water')}</div>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4">{t('planner.market')}</div>
            <div className="bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 rounded-2xl p-4">{t('planner.credit')}</div>
          </div>
          <button
            onClick={() => setShowPlannerModal(false)}
            className="w-full bg-gray-900 dark:bg-gray-700 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-black dark:hover:bg-gray-600 transition-all"
          >
            {t('planner.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
