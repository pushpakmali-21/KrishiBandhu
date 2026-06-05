import React from 'react';
import { useTranslation } from 'react-i18next';
import { FarmerInputs, TransportMode } from '../types/dashboard';

interface FarmerInputModalProps {
  farmerInputs: FarmerInputs;
  setFarmerInputs: (inputs: FarmerInputs) => void;
  setShowInputModal: (v: boolean) => void;
}

export default function FarmerInputModal({
  farmerInputs,
  setFarmerInputs,
  setShowInputModal
}: FarmerInputModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-transparent dark:border-gray-700">
        <div className="p-8">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">{t('farmer_form.title')}</h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('farmer_form.quantity_label')}</label>
              <input
                type="number"
                placeholder={t('farmer_form.quantity_placeholder')}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={farmerInputs.quantity}
                onChange={(e) => setFarmerInputs({ ...farmerInputs, quantity: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('farmer_form.distance_label')}</label>
              <input
                type="number"
                placeholder={t('farmer_form.distance_placeholder')}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={farmerInputs.distance}
                onChange={(e) => setFarmerInputs({ ...farmerInputs, distance: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('farmer_form.transport_label')}</label>
              <div className="grid grid-cols-2 gap-2">
                {(['self', 'buyer'] as TransportMode[]).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setFarmerInputs({ ...farmerInputs, transportMode: mode })}
                    className={`py-3 rounded-xl text-xs font-black transition-all ${farmerInputs.transportMode === mode
                      ? 'bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-green-900/40'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                  >
                    {mode === 'self' ? t('farmer_form.transport_self') : t('farmer_form.transport_buyer')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('farmer_form.quality_label')}</label>
                <select
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
                  value={farmerInputs.quality}
                  onChange={(e) => setFarmerInputs({ ...farmerInputs, quality: e.target.value })}
                >
                  <option value="A">{t('farmer_form.quality_a')}</option>
                  <option value="B">{t('farmer_form.quality_b')}</option>
                  <option value="C">{t('farmer_form.quality_c')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('farmer_form.storage_label')}</label>
                <select
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
                  value={farmerInputs.storage}
                  onChange={(e) => setFarmerInputs({ ...farmerInputs, storage: e.target.value })}
                >
                  <option value="Fresh">{t('farmer_form.storage_fresh')}</option>
                  <option value="Stored">{t('farmer_form.storage_stored')}</option>
                </select>
              </div>
            </div>

            {farmerInputs.storage === 'Stored' && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('farmer_form.days_label')}</label>
                <input
                  type="number"
                  placeholder={t('farmer_form.days_placeholder')}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={farmerInputs.daysInStorage}
                  onChange={(e) => setFarmerInputs({ ...farmerInputs, daysInStorage: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('farmer_form.urgency_label')}</label>
              <div className="grid grid-cols-3 gap-2">
                {['Immediate', '3Days', 'Flexible'].map((u) => (
                  <button
                    key={u}
                    onClick={() => setFarmerInputs({ ...farmerInputs, urgency: u })}
                    className={`py-3 rounded-xl text-xs font-black transition-all ${farmerInputs.urgency === u
                      ? 'bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-green-900/40'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                  >
                    {t(`farmer_form.urgency_${u.toLowerCase()}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-10">
            <button
              onClick={() => setShowInputModal(false)}
              className="flex-1 py-4 rounded-2xl font-black text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              {t('farmer_form.cancel')}
            </button>
            <button
              onClick={() => setShowInputModal(false)}
              className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-green-200 dark:shadow-green-900/40 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-all"
            >
              {t('farmer_form.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
