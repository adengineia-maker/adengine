import React, { useEffect, useState } from 'react';
import { Facebook } from 'lucide-react';

interface AdAccount {
  id: string;
  name: string;
  account_id: string;
}

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface MetaConnectProps {
  compact?: boolean;
}

export const MetaConnect: React.FC<MetaConnectProps> = ({ compact = false }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Facebook SDK
    if (!window.FB) {
      // @ts-ignore
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: 'YOUR_APP_ID', // Reemplaza con tu App ID de Meta
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });

        // Check login status
        window.FB.getLoginStatus(function (response: any) {
          if (response.status === 'connected') {
            setIsConnected(true);
            fetchAdAccounts();
          }
        });
      };

      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        if (fjs && fjs.parentNode) {
          fjs.parentNode.insertBefore(js, fjs);
        }
      }(document, 'script', 'facebook-jssdk'));
    } else {
      // If SDK is already loaded, just check status
      window.FB.getLoginStatus(function (response: any) {
        if (response.status === 'connected') {
          setIsConnected(true);
          fetchAdAccounts();
        }
      });
    }
  }, []);

  const handleLogin = () => {
    setLoading(true);
    if (!window.FB) return;

    window.FB.login(function (response: any) {
      if (response.authResponse) {
        setIsConnected(true);
        fetchAdAccounts();
      } else {
        console.log('User cancelled login or did not fully authorize.');
        setLoading(false);
      }
    }, { scope: 'ads_read,read_insights,business_management' });
  };

  const fetchAdAccounts = () => {
    window.FB.api('/me/adaccounts', { fields: 'name,account_id' }, function (response: any) {
      setLoading(false);
      if (response && !response.error) {
        setAdAccounts(response.data);
        // Auto-select first account if none selected
        if (response.data.length > 0 && !selectedAccount) {
          setSelectedAccount(response.data[0].id);
        }
      } else {
        console.error('Error fetching ad accounts', response.error);
      }
    });
  };

  const handleAccountSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(e.target.value);
    console.log('Selected Account:', e.target.value);
  };

  if (isConnected && adAccounts.length > 0) {
    if (compact) {
      return (
        <div className="flex flex-col items-center justify-center p-2 rounded-xl w-16 h-16 bg-[#1877F2]/10 text-[#1877F2]">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse mb-1"></div>
          <span className="text-[9px] font-bold">ON</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full border border-white/10 bg-white/5">
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
        <select
          value={selectedAccount}
          onChange={handleAccountSelect}
          className="bg-transparent text-sm text-slate-200 focus:outline-none [&>option]:text-black cursor-pointer font-medium min-w-[150px]"
        >
          {adAccounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.name} ({account.account_id})
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (compact) {
    return (
      <a
        href="/login"
        className="flex flex-col items-center justify-center p-2 rounded-xl transition-all gap-1 w-16 h-16 text-slate-400 hover:text-[#1877F2] hover:bg-[#1877F2]/10 no-underline"
        title="Conectar con Meta"
      >
        <Facebook size={20} />
        <span className="text-[9px] font-medium leading-none text-center">Meta</span>
      </a>
    );
  }

  return (
    <a
      href="/login"
      className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white px-4 py-2 rounded-full font-medium transition-all shadow-lg hover:shadow-blue-500/20 text-sm no-underline"
    >
      <Facebook size={16} />
      Conectar Business
    </a>
  );
};
