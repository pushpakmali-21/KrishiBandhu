import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Buyer, CropGroup, CropId } from '../types/dashboard';

interface ConnectBuyerModalProps {
  connectBuyer: Buyer;
  setConnectBuyer: (b: Buyer | null) => void;
  connectStatus: 'idle' | 'sending' | 'sent';
  setConnectStatus: (s: 'idle' | 'sending' | 'sent') => void;
  connectForm: { crop: CropId; quantity: string; message: string };
  setConnectForm: React.Dispatch<React.SetStateAction<{ crop: CropId; quantity: string; message: string }>>;
  cropGroups: CropGroup[];
  isLoggedIn: boolean;
  API_BASE: string;
}

export default function ConnectBuyerModal({
  connectBuyer,
  setConnectBuyer,
  connectStatus,
  setConnectStatus,
  connectForm,
  setConnectForm,
  cropGroups,
  isLoggedIn,
  API_BASE
}: ConnectBuyerModalProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const isCropId = (value: string | null): value is CropId =>
    cropGroups.some((group) => group.items.includes(value as CropId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-transparent dark:border-gray-700">
        {connectStatus === 'sent' ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-700 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-black text-green-800 dark:text-green-300 mb-2">{t('connect_modal.success_title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-8">
              {t('connect_modal.success_desc').replace('{{name}}', connectBuyer.name)}
            </p>
            <button
              onClick={() => {
                setConnectBuyer(null);
                setConnectStatus('idle');
                setConnectForm({ crop: 'wheat', quantity: '', message: '' });
              }}
              className="w-full bg-green-600 dark:bg-green-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-green-200 dark:shadow-green-900/40 hover:bg-green-700 dark:hover:bg-green-600 transition-all"
            >
              {t('connect_modal.done')}
            </button>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-700 pb-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{t('connect_modal.title')}</h3>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{connectBuyer.name}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${connectBuyer.trust > 90 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'}`}>
                Trust: {connectBuyer.trust}%
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('connect_modal.crop_label')}</label>
                  <select
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
                    value={connectForm.crop}
                    onChange={(e) => {
                      if (isCropId(e.target.value)) {
                        setConnectForm({ ...connectForm, crop: e.target.value });
                      }
                    }}
                  >
                    {cropGroups.flatMap(group => group.items).map(c => (
                      <option key={c} value={c}>{t(`dashboard.crops.${c}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('connect_modal.qty_label')}</label>
                  <input
                    type="number"
                    placeholder={t('connect_modal.qty_placeholder')}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    value={connectForm.quantity}
                    onChange={(e) => setConnectForm({ ...connectForm, quantity: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('connect_modal.msg_label')}</label>
                <textarea
                  placeholder={t('connect_modal.msg_placeholder')}
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                  value={connectForm.message}
                  onChange={(e) => setConnectForm({ ...connectForm, message: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setConnectBuyer(null)}
                className="flex-1 py-4 rounded-2xl font-black text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                disabled={connectStatus === 'sending'}
              >
                {t('connect_modal.cancel')}
              </button>
              <button
                onClick={async () => {
                  if (!connectForm.quantity) return; // Simple validation
                  if (!isLoggedIn) {
                    router.push('/login?redirect=/dashboard&tab=marketplace');
                    return;
                  }
                  setConnectStatus('sending');
                  try {
                    await axios.post(`${API_BASE}/marketplace/connect`, {
                      buyerName: connectBuyer.name,
                      crop: connectForm.crop,
                      quantity: connectForm.quantity,
                      message: connectForm.message
                    }, { withCredentials: true });
                    setConnectStatus('sent');
                  } catch (err) {
                    console.error('Failed to connect:', err);
                    setConnectStatus('idle');
                  }
                }}
                disabled={connectStatus === 'sending' || !connectForm.quantity}
                className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-green-200 dark:shadow-green-900/40 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {connectStatus === 'sending' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('connect_modal.sending')}
                  </>
                ) : (
                  t('connect_modal.send')
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
