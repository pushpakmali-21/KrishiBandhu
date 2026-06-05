'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  CalendarDays,
  Handshake,
  Loader2,
  Star,
  Truck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter } from 'next/navigation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';
import { VoiceProvider } from '../context/VoiceContext';
import { VoiceAssistant } from '../components/VoiceAssistant';

import { useDashboardData } from '../hooks/useDashboardData';
import { CropId, TabId, TransportMode, FarmerInputs, Buyer } from '../types/dashboard';
import { cropGroups, buyers, liveTrades, TRANSPORT_RATE_PER_QTL_KM, BUYER_PICKUP_PRICE_FACTOR } from './constants';

import InsightsTab from '../components/InsightsTab';
import MarketplaceTab from '../components/MarketplaceTab';
import MandiTab from '../components/MandiTab';
import FarmerInputModal from '../components/FarmerInputModal';
import ProfitCalculatorModal from '../components/ProfitCalculatorModal';
import ConnectBuyerModal from '../components/ConnectBuyerModal';
import PlannerModal from '../components/PlannerModal';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

const isTabId = (value: string | null): value is TabId =>
  value === 'marketplace' || value === 'mandi' || value === 'insights';

const isCropId = (value: string | null): value is CropId =>
  cropGroups.some((group) => group.items.includes(value as CropId));

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

function DashboardContent() {
  const [selectedCrop, setSelectedCrop] = useState<CropId>('wheat');
  const [currentTab, setCurrentTab] = useState<TabId>('insights');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pinnedCrop, setPinnedCrop] = useState<CropId | null>(null);

  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { priceData, recommendation, weatherData, loading, error, refetch } = useDashboardData(selectedCrop);

  // Modal states
  const [showInputModal, setShowInputModal] = useState(false);
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [showPlannerModal, setShowPlannerModal] = useState(false);

  // Form states
  const [farmerInputs, setFarmerInputs] = useState<FarmerInputs>({
    quantity: '',
    quality: 'A',
    storage: 'Fresh',
    daysInStorage: '',
    urgency: 'Flexible',
    distance: '',
    transportMode: 'self',
  });

  const [calcYield, setCalcYield] = useState('');
  const [calcDistance, setCalcDistance] = useState('');
  const [calcTransportMode, setCalcTransportMode] = useState<TransportMode>('self');

  // Marketplace states
  const [locationFilter, setLocationFilter] = useState('all');
  const [trustFilter, setTrustFilter] = useState('all');
  const [connectBuyer, setConnectBuyer] = useState<Buyer | null>(null);
  const [connectForm, setConnectForm] = useState<{ crop: CropId; quantity: string; message: string }>({
    crop: 'wheat',
    quantity: '',
    message: '',
  });
  const [connectStatus, setConnectStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const tabs: { id: TabId; label: string; Icon: typeof BarChart3 }[] = [
    { id: 'insights', label: t('tabs.insights'), Icon: BarChart3 },
    { id: 'marketplace', label: t('tabs.marketplace'), Icon: Handshake },
    { id: 'mandi', label: t('tabs.mandi'), Icon: Truck },
  ];

  useEffect(() => {
    if (!API_BASE) {
      setIsLoggedIn(false);
      return;
    }

    // Use an async IIFE to avoid direct setState
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/check`, { credentials: 'include' });
        const data = await res.json();
        setIsLoggedIn(!!data.authenticated);
      } catch {
        setIsLoggedIn(false);
      }

      const savedCrop = localStorage.getItem('kb_pinned_crop');
      if (isCropId(savedCrop)) {
        setPinnedCrop(savedCrop);
        setSelectedCrop(savedCrop);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const tab = searchParams.get('tab');
      if (isTabId(tab)) {
        setCurrentTab(tab);
      }
    })();
  }, [searchParams]);

  // Synchronize calculator inputs with farmer inputs when the calculator modal opens
  useEffect(() => {
    (async () => {
      if (showCalcModal) {
        if (farmerInputs.quantity) setCalcYield(farmerInputs.quantity);
        if (farmerInputs.distance) setCalcDistance(farmerInputs.distance);
        if (farmerInputs.transportMode) setCalcTransportMode(farmerInputs.transportMode);
      }
    })();
  }, [showCalcModal, farmerInputs]);

  const quantityNum = parseFloat(farmerInputs.quantity) || 0;
  const distanceNum = parseFloat(farmerInputs.distance) || 0;
  const dashboardTransportCost = farmerInputs.transportMode === 'self' ? quantityNum * distanceNum * TRANSPORT_RATE_PER_QTL_KM : 0;
  const dashboardGross = (priceData?.current || 0) * quantityNum * (farmerInputs.transportMode === 'buyer' ? BUYER_PICKUP_PRICE_FACTOR : 1);
  const dashboardNetProfit = Math.max(0, dashboardGross - dashboardTransportCost);

  const togglePinnedCrop = () => {
    if (pinnedCrop === selectedCrop) {
      localStorage.removeItem('kb_pinned_crop');
      setPinnedCrop(null);
      return;
    }
    localStorage.setItem('kb_pinned_crop', selectedCrop);
    setPinnedCrop(selectedCrop);
  };

  const handleVoiceAction = useCallback((action: string, data?: unknown) => {
    console.log('🎙️ Voice Action matched:', action, data);
    const payload = data as Record<string, unknown> | undefined;
    
    if (action === 'select-crop' && payload && typeof payload.cropId === 'string') {
      if (isCropId(payload.cropId)) setSelectedCrop(payload.cropId);
    } else if (action === 'switch-tab' && payload && typeof payload.tabId === 'string') {
      if (isTabId(payload.tabId)) setCurrentTab(payload.tabId);
    } else if (action === 'open-calculator') {
      setShowCalcModal(true);
    } else if (action === 'scroll-heatmap') {
      setCurrentTab('insights');
      setTimeout(() => {
        const el = document.getElementById('demand-heatmap');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (action === 'highlight-price' || action === 'highlight-recommendation' || action === 'highlight-weather') {
      setCurrentTab('insights');
    }
  }, []);

  return (
    <VoiceProvider selectedCrop={selectedCrop} priceData={priceData} recommendation={recommendation} weatherData={weatherData} onAction={handleVoiceAction}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-30 shadow-sm dark:shadow-gray-950/40 border-b border-green-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-green-800 dark:text-green-400 tracking-tight" suppressHydrationWarning>{t('nav.brand')}</h1>
              <p className="text-xs font-bold text-green-600 dark:text-green-500 uppercase tracking-widest" suppressHydrationWarning>{t('dashboard.subtitle')}</p>
            </div>
            <div className="hidden md:flex gap-3 items-center">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full" suppressHydrationWarning>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {t('nav.live_mandi')}
              </span>
              <button onClick={() => setShowPlannerModal(true)} className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors" suppressHydrationWarning>
                <CalendarDays className="w-4 h-4" />
                {t('planner.button')}
              </button>
              <button className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md" suppressHydrationWarning>{t('nav.nashik_hub')}</button>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-8 bg-white/50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-green-100 dark:border-gray-700 max-w-fit mx-auto shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${currentTab === tab.id
                  ? 'bg-green-600 text-white shadow-xl shadow-green-200 dark:shadow-green-900/40'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400'
                  }`}
              >
                <tab.Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {currentTab === 'insights' && (
            <>
              {/* Crop Selection Header */}
              <div className="mb-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white" suppressHydrationWarning>{t('dashboard.crop_analysis')}</h2>
                        <button
                          type="button"
                          onClick={togglePinnedCrop}
                          className={`p-2 rounded-full border transition-colors ${pinnedCrop === selectedCrop ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-500 border-amber-200 dark:border-amber-800' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:text-amber-500'}`}
                          aria-label={pinnedCrop === selectedCrop ? 'Remove pinned crop' : 'Pin crop to watchlist'}
                        >
                          <Star className="w-4 h-4" fill={pinnedCrop === selectedCrop ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {pinnedCrop ? `${t('watchlist.pinned')}: ${t(`dashboard.crops.${pinnedCrop}`)}` : t('watchlist.empty')}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowInputModal(true)}
                      className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                      suppressHydrationWarning
                    >
                      {t('dashboard.edit_inputs')}
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-inner border border-gray-100 dark:border-gray-700 relative min-w-[220px] shadow-sm hover:shadow-md transition-shadow">
                    <select
                      value={selectedCrop}
                      onChange={(e) => {
                        if (isCropId(e.target.value)) setSelectedCrop(e.target.value);
                      }}
                      className="w-full bg-transparent px-4 py-2.5 rounded-lg font-black text-sm text-green-800 dark:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer z-10 relative"
                    >
                      {cropGroups.map((group) => (
                        <optgroup key={group.key} label={t(`dashboard.crop_groups.${group.key}`)}>
                          {group.items.map((crop) => (
                            <option key={crop} value={crop}>
                              {t(`dashboard.crops.${crop}`)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-green-600 pointer-events-none text-xs font-black">v</div>
                  </div>
                </div>
              </div>

              <InsightsTab
                loading={loading}
                error={error}
                priceData={priceData}
                recommendation={recommendation}
                weatherData={weatherData}
                farmerInputs={farmerInputs}
                dashboardNetProfit={dashboardNetProfit}
                setShowCalcModal={setShowCalcModal}
                formatCurrency={formatCurrency}
                fetchDashboardData={refetch}
              />
            </>
          )}

          {currentTab === 'marketplace' && (
            <MarketplaceTab
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              trustFilter={trustFilter}
              setTrustFilter={setTrustFilter}
              buyers={buyers}
              isLoggedIn={isLoggedIn}
              onConnectClick={(buyer) => {
                if (isLoggedIn) {
                  setConnectBuyer(buyer);
                } else {
                  router.push('/login?redirect=/dashboard&tab=marketplace');
                }
              }}
            />
          )}

          {currentTab === 'mandi' && (
            <MandiTab
              liveTrades={liveTrades}
              formatCurrency={formatCurrency}
            />
          )}
        </div>

        {/* Modals */}
        {showInputModal && (
          <FarmerInputModal
            farmerInputs={farmerInputs}
            setFarmerInputs={setFarmerInputs}
            setShowInputModal={setShowInputModal}
          />
        )}

        {showCalcModal && (
          <ProfitCalculatorModal
            calcYield={calcYield}
            setCalcYield={setCalcYield}
            calcDistance={calcDistance}
            setCalcDistance={setCalcDistance}
            calcTransportMode={calcTransportMode}
            setCalcTransportMode={setCalcTransportMode}
            priceData={priceData}
            setShowCalcModal={setShowCalcModal}
            formatCurrency={formatCurrency}
            TRANSPORT_RATE_PER_QTL_KM={TRANSPORT_RATE_PER_QTL_KM}
            BUYER_PICKUP_PRICE_FACTOR={BUYER_PICKUP_PRICE_FACTOR}
          />
        )}

        {connectBuyer && (
          <ConnectBuyerModal
            connectBuyer={connectBuyer}
            setConnectBuyer={setConnectBuyer}
            connectStatus={connectStatus}
            setConnectStatus={setConnectStatus}
            connectForm={connectForm}
            setConnectForm={setConnectForm}
            cropGroups={cropGroups}
            isLoggedIn={isLoggedIn}
            API_BASE={API_BASE}
          />
        )}

        {showPlannerModal && (
          <PlannerModal setShowPlannerModal={setShowPlannerModal} />
        )}

        <VoiceAssistant />
      </div>
    </VoiceProvider>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen bg-green-50 dark:bg-gray-900">
          <Loader2 className="w-12 h-12 text-green-600 dark:text-green-400 animate-spin mb-4" />
          <p className="text-green-800 dark:text-green-300 font-semibold text-lg">Loading dashboard...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
