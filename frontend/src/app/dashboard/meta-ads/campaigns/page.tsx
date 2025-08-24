'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: string;
  impressions: number;
  clicks: number;
  spend: number;
  cpm: number;
  cpc: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  costPerConversion: number;
  reach: number;
  frequency: number;
  createdAt: string;
  metaAccount: {
    id: string;
    accountName: string;
    currency: string;
  };
}

interface CreateCampaignData {
  metaAccountId: string;
  name: string;
  objective: string;
  status: string;
  spendCap?: number;
}

export default function MetaAdsCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metaAccounts, setMetaAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    objective: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [createForm, setCreateForm] = useState<CreateCampaignData>({
    metaAccountId: '',
    name: '',
    objective: 'OUTCOME_TRAFFIC',
    status: 'PAUSED'
  });

  const objectiveOptions = [
    { value: 'OUTCOME_AWARENESS', label: 'Reconhecimento da marca' },
    { value: 'OUTCOME_TRAFFIC', label: 'Tráfego' },
    { value: 'OUTCOME_ENGAGEMENT', label: 'Engajamento' },
    { value: 'OUTCOME_LEADS', label: 'Geração de leads' },
    { value: 'OUTCOME_APP_PROMOTION', label: 'Promoção de app' },
    { value: 'OUTCOME_SALES', label: 'Vendas' }
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: 'Ativa', color: 'bg-green-100 text-green-800' },
    { value: 'PAUSED', label: 'Pausada', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'DELETED', label: 'Excluída', color: 'bg-red-100 text-red-800' }
  ];

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const companyId = localStorage.getItem('companyId');
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });

      const response = await fetch(`/api/meta-ads/campaigns?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Company-Id': companyId || ''
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
        }));
      } else {
        setError(data.error || 'Erro ao carregar campanhas');
      }
    } catch (err) {
      setError('Erro ao carregar campanhas');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetaAccounts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const companyId = localStorage.getItem('companyId');

      const response = await fetch('/api/meta-ads/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Company-Id': companyId || ''
        }
      });

      const data = await response.json();
      if (data.success) {
        setMetaAccounts(data.data);
      }
    } catch (err) {
      console.error('Erro ao carregar contas Meta:', err);
    }
  };

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('accessToken');
      const companyId = localStorage.getItem('companyId');

      const response = await fetch('/api/meta-ads/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Company-Id': companyId || ''
        },
        body: JSON.stringify(createForm)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowCreateForm(false);
        setCreateForm({
          metaAccountId: '',
          name: '',
          objective: 'OUTCOME_TRAFFIC',
          status: 'PAUSED'
        });
        await fetchCampaigns();
      } else {
        setError(data.error || 'Erro ao criar campanha');
      }
    } catch (err) {
      setError('Erro ao criar campanha');
    }
  };

  const updateCampaignStatus = async (campaignId: string, status: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const companyId = localStorage.getItem('companyId');

      const response = await fetch(`/api/meta-ads/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Company-Id': companyId || ''
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchCampaigns();
      } else {
        setError(data.error || 'Erro ao atualizar campanha');
      }
    } catch (err) {
      setError('Erro ao atualizar campanha');
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchMetaAccounts();
  }, [pagination.page, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (isLoading && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campanhas Meta Ads</h1>
          <p className="text-gray-600">Gerencie suas campanhas do Facebook e Instagram</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/meta-ads"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Dashboard
          </Link>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nova Campanha
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Buscar campanhas..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.objective}
            onChange={(e) => handleFilterChange('objective', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os objetivos</option>
            {objectiveOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setFilters({ status: '', objective: '', search: '' });
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Lista de Campanhas */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma campanha encontrada</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar primeira campanha
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Objetivo</th>
                  <th className="px-4 py-3 font-medium">Investimento</th>
                  <th className="px-4 py-3 font-medium">Impressões</th>
                  <th className="px-4 py-3 font-medium">Cliques</th>
                  <th className="px-4 py-3 font-medium">CTR</th>
                  <th className="px-4 py-3 font-medium">Conversões</th>
                  <th className="px-4 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => {
                  const statusOption = statusOptions.find(s => s.value === campaign.status);
                  const objectiveOption = objectiveOptions.find(o => o.value === campaign.objective);
                  
                  return (
                    <tr key={campaign.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-xs text-gray-500">{campaign.metaAccount.accountName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusOption?.color}`}>
                          {statusOption?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {objectiveOption?.label}
                      </td>
                      <td className="px-4 py-3">
                        R$ {campaign.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3">
                        {campaign.impressions.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        {campaign.clicks.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        {campaign.ctr.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3">
                        {campaign.conversions}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {campaign.status === 'ACTIVE' ? (
                            <button
                              onClick={() => updateCampaignStatus(campaign.id, 'PAUSED')}
                              className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                            >
                              Pausar
                            </button>
                          ) : (
                            <button
                              onClick={() => updateCampaignStatus(campaign.id, 'ACTIVE')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                            >
                              Ativar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Mostrando {campaigns.length} de {pagination.total} campanhas
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm">
                {pagination.page} de {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Criar Campanha */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Campanha</h2>
            
            <form onSubmit={createCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Conta Meta Ads</label>
                <select
                  value={createForm.metaAccountId}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, metaAccountId: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma conta</option>
                  {metaAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.accountName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nome da Campanha</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Campanha Black Friday 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Objetivo</label>
                <select
                  value={createForm.objective}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, objective: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {objectiveOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status Inicial</label>
                <select
                  value={createForm.status}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PAUSED">Pausada</option>
                  <option value="ACTIVE">Ativa</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Criar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}