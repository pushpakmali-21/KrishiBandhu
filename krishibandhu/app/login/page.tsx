'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Phone, Lock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';

function LoginPageContent() {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP

    const handleGetOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length === 10) {
            setStep(2);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('kb_auth', 'true');
        const redirectTo = searchParams.get('redirect') || '/dashboard';
        const tab = searchParams.get('tab');
        if (tab) {
            router.push(`${redirectTo}?tab=${tab}`);
        } else {
            router.push(redirectTo);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-950 dark:to-gray-900 flex flex-col">
            {/* Navigation */}
            <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-green-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/">
                        <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                            <span>🌾</span> {t('nav.brand')}
                        </h1>
                    </Link>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* Login Card */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white dark:bg-gray-800/80 rounded-3xl shadow-2xl shadow-green-900/10 dark:shadow-black/30 border border-green-50 dark:border-gray-700 overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-2xl mb-4">
                                <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                                {t('login.title')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('login.subtitle')}
                            </p>
                        </div>

                        {step === 1 ? (
                            <form onSubmit={handleGetOtp} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {t('login.phone_label')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <input
                                            type="tel"
                                            maxLength={10}
                                            required
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                            className="block w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-lg tracking-wider text-black dark:text-white"
                                            placeholder={t('login.phone_placeholder')}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={phoneNumber.length !== 10}
                                    className="w-full bg-green-600 text-white py-4 rounded-2xl text-lg font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200/50 dark:hover:shadow-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 dark:bg-green-700 dark:hover:bg-green-600"
                                >
                                    {t('login.get_otp')} <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
                                        Enter 4-digit OTP sent to {phoneNumber}
                                    </label>
                                    <div className="flex justify-center gap-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                maxLength={1}
                                                className="w-14 h-16 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-black dark:text-white"
                                                defaultValue={i === 1 ? "1" : i === 2 ? "2" : i === 3 ? "3" : "4"}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-4 rounded-2xl text-lg font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200/50 dark:hover:shadow-green-900/50 flex items-center justify-center gap-2 dark:bg-green-700 dark:hover:bg-green-600"
                                >
                                    {t('login.start_now')} <ArrowRight className="w-5 h-5" />
                                </button>

                                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                    Didn&apos;t receive OTP? <button type="button" onClick={() => setStep(1)} className="text-green-600 dark:text-green-400 font-semibold hover:underline">Resend</button>
                                </p>
                            </form>
                        )}

                        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                                <span>Secure login for verified farmers &amp; buyers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                <p>© 2026 KrishiBandhu. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-green-50 dark:bg-gray-950 flex items-center justify-center">
                    <p className="text-green-800 dark:text-green-300 font-semibold">Loading login...</p>
                </div>
            }
        >
            <LoginPageContent />
        </Suspense>
    );
}
