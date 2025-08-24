'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MetaAccount {
  id: string;
  metaAdAccountId: string;
  accountName: string;
  currency: string;
  status: string;
  lastSyncAt: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'error';
  errorMessage?: string;
}

interface DashboardData {
  summary: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalSpend: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    averageCtr: string;
    averageCpc: string;
  };
  topCampaigns: Array<{
    id: string;
    name: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
  }>;
  recentCampaigns: Array<{
    id: string;
    name: string;
    status: string;
    objective: string;
    spend: number;
    impressions: number;
    clicks: number;
    createdAt: string;
  }>;
}

export default function MetaAdsDashboard() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<MetaAccount[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const companyId = localStorage.getItem('companyId');
      
      if (!token || !companyId) {
        router.push('/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'X-Company-Id': companyId
      };

      // Buscar contas Meta
      const accountsResponse = await fetch('/api/meta-ads/accounts', { headers });
      const accountsData = await accountsResponse.json();

      if (accountsData.success) {
        setAccounts(accountsData.data);

        // Se tem contas, buscar dados do dashboard
        if (accountsData.data.length > 0) {
          const dashboardResponse = await fetch('/api/meta-ads/dashboard', { headers });
          const dashboardResult = await dashboardResponse.json();
          
          if (dashboardResult.success) {
            setDashboardData(dashboardResult.data);
          }
        }
      }

    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const syncAccount = async (accountId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const companyId = localStorage.getItem('companyId');

      const response = await fetch(`/api/meta-ads/accounts/${accountId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Company-Id': companyId || ''
        }
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchData(); // Recarregar dados
      } else {
        setError(data.error || 'Erro ao sincronizar');
      }
    } catch (err) {
      setError('Erro ao sincronizar conta');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se não há contas conectadas
  if (accounts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Conecte sua conta Meta Ads
          </h1>
          <p className="text-gray-600 mb-6">
            Para começar a gerenciar suas campanhas do Facebook e Instagram
          </p>
          <Link
            href="/dashboard/meta-ads/setup"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Conectar Conta Meta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meta Ads Dashboard</h1>
          <p className="text-gray-600">Gerencie suas campanhas do Facebook e Instagram</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/meta-ads/campaigns"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Gerenciar Campanhas
          </Link>
          <Link
            href="/dashboard/meta-ads/setup"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            + Nova Conta
          </Link>
        </div>
      </div>

      {/* Contas Conectadas */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Contas Conectadas</h2>
        <div className="grid gap-4">
          {accounts.map((account) => (
            <div key={account.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{account.accountName}</h3>
                <p className="text-sm text-gray-600">ID: {account.metaAdAccountId}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    account.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {account.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    account.syncStatus === 'synced' 
                      ? 'bg-green-100 text-green-800'
                      : account.syncStatus === 'syncing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : account.syncStatus === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {account.syncStatus}
                  </span>
                </div>
              </div>
              <button
                onClick={() => syncAccount(account.id)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Sincronizar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas Gerais */}
      {dashboardData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Campanhas</h3>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.summary.totalCampaigns}</p>
              <p className="text-sm text-gray-600">
                {dashboardData.summary.activeCampaigns} ativas
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Investimento Total</h3>
              <p className="text-3xl font-bold text-gray-900">
                R$ {dashboardData.summary.totalSpend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-600">
                CPC: R$ {dashboardData.summary.averageCpc}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Impressões</h3>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.summary.totalImpressions.toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-600">
                CTR: {dashboardData.summary.averageCtr}%
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Cliques</h3>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.summary.totalClicks.toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-600">
                {dashboardData.summary.totalConversions} conversões
              </p>
            </div>
          </div>

          {/* Top Campanhas */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Top Campanhas por Investimento</h2>
            {dashboardData.topCampaigns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-2">Nome</th>
                      <th className="pb-2">Investimento</th>
                      <th className="pb-2">Impressões</th>
                      <th className="pb-2">Cliques</th>
                      <th className="pb-2">CTR</th>
                      <th className="pb-2">Conversões</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.topCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b last:border-b-0">
                        <td className="py-2 font-medium">{campaign.name}</td>
                        <td className="py-2">R$ {campaign.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td className="py-2">{campaign.impressions.toLocaleString('pt-BR')}</td>
                        <td className="py-2">{campaign.clicks.toLocaleString('pt-BR')}</td>
                        <td className="py-2">{campaign.ctr.toFixed(2)}%</td>
                        <td className="py-2">{campaign.conversions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma campanha ativa com dados</p>
            )}
          </div>

          {/* Campanhas Recentes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Campanhas Recentes</h2>
            {dashboardData.recentCampaigns.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex justify-between items-center border-b last:border-b-0 pb-3 last:pb-0">
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          campaign.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800'
                            : campaign.status === 'PAUSED'
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                        <span className="text-xs text-gray-500">{campaign.objective}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">R$ {campaign.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <p className="text-gray-500">{campaign.impressions.toLocaleString('pt-BR')} impressões</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma campanha encontrada</p>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}