'use client';

import React, { useEffect, useState } from 'react';
import { Facebook, CheckCircle, Loader2, AlertCircle, ChevronDown } from 'lucide-react';

export default function FacebookConnect() {
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [accountData, setAccountData] = useState<any[] | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');

    const APP_ID = '25475032508800810';

    // 1. Inicialización Robusta del SDK
    useEffect(() => {
        const initFacebookSdk = () => {
            if ((window as any).FB) {
                (window as any).FB.init({
                    appId: APP_ID,
                    cookie: true,
                    xfbml: true,
                    version: 'v19.0'
                });
                console.log("✅ SDK de Facebook inicializado (Existente)");
                setIsSdkLoaded(true);
            }
        };

        // Si ya existe window.FB, inicializar directamente
        if ((window as any).FB) {
            initFacebookSdk();
        } else {
            // Si no, esperar a la carga asíncrona
            (window as any).fbAsyncInit = function () {
                initFacebookSdk();
                console.log("✅ SDK de Facebook inicializado (Async)");
            };

            // Inyectar script si no existe
            if (!document.getElementById('facebook-jssdk')) {
                const js = document.createElement('script');
                js.id = 'facebook-jssdk';
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                document.body.appendChild(js);
            }
        }
    }, []);

    // 2. Función para manejar el login
    const handleLogin = () => {
        if (!isSdkLoaded || !(window as any).FB) {
            setErrorMsg("El SDK no está listo. Recarga la página.");
            return;
        }

        setIsProcessing(true);
        setErrorMsg('');

        // Timeout de seguridad por si el popup se bloquea
        const safetyTimeout = setTimeout(() => {
            if (isProcessing) {
                console.warn("⚠️ Timeout de seguridad activado (Popup posiblemente bloqueado)");
                setIsProcessing(false);
            }
        }, 15000); // 15 segundos

        // Llamada directa al SDK oficial
        (window as any).FB.login((response: any) => {
            clearTimeout(safetyTimeout);
            console.log("📡 Respuesta FB:", response);

            if (response.authResponse) {
                console.log('✅ Token obtenido, buscando cuentas...');
                fetchAccounts(response.authResponse.accessToken);
            } else {
                console.log('❌ Usuario canceló el login o falló.');
                setIsProcessing(false);
            }
        }, { scope: 'public_profile,email,ads_read,read_insights' });
    };

    // 3. Buscar cuentas publicitarias
    const fetchAccounts = async (token: string) => {
        try {
            const res = await fetch(
                `https://graph.facebook.com/v19.0/me/adaccounts?fields=name,account_id,currency&access_token=${token}`
            );
            const data = await res.json();
            setAccountData(data.data);
        } catch (err) {
            console.error(err);
            setErrorMsg("Error conectando a la API.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const accountId = e.target.value;
        setSelectedAccountId(accountId);

        const account = accountData?.find((acc: any) => acc.id === accountId);
        if (account) {
            console.log("Seleccionado:", account);
        }
    };

    // RENDERIZADO
    if (accountData) {
        return (
            <div className="p-6 bg-[#131314] border border-white/10 rounded-xl max-w-md">
                <div className="flex items-center gap-2 text-green-500 mb-4">
                    <CheckCircle size={18} />
                    <span className="text-sm font-medium">Conectado correctamente</span>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider text-slate-500 font-medium">
                        Selecciona una cuenta
                    </label>
                    <div className="relative">
                        <select
                            value={selectedAccountId}
                            onChange={handleSelection}
                            className="w-full appearance-none bg-[#0a0a0b] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
                        >
                            <option value="" disabled>-- Elige Cuenta --</option>
                            {accountData.map((acc: any) => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.name} ({acc.account_id}) {acc.currency ? `- ${acc.currency}` : ''}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <button
                onClick={handleLogin}
                disabled={isProcessing}
                className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-lg font-medium transition-all shadow-lg hover:bg-gray-900 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed border border-white/10"
            >
                {isProcessing ? (
                    <>
                        <Loader2 size={20} className="animate-spin text-white" />
                        <span>Conectando...</span>
                    </>
                ) : (
                    <>
                        <Facebook size={20} className="fill-white" />
                        <span>Conectar Business Manager</span>
                    </>
                )}
            </button>

            {errorMsg && (
                <p className="flex items-center gap-2 text-red-400 text-sm mt-3 bg-red-900/10 p-2 rounded border border-red-500/10">
                    <AlertCircle size={14} />
                    {errorMsg}
                </p>
            )}
        </div>
    );
}
