'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MetaAdsSetup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    accessToken: '',
    adAccountId: '',
    accountName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/meta-ads/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'X-Company-Id': localStorage.getItem('companyId') || ''
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao conectar conta Meta');
      }

      setSuccess('Conta Meta conectada com sucesso! Sincronizando campanhas...');
      
      setTimeout(() => {
        router.push('/dashboard/meta-ads');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Conectar Meta Ads
          </h1>
          <p className="text-gray-600">
            Conecte sua conta do Facebook/Instagram Ads para gerenciar campanhas
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Como obter as informações necessárias:
          </h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>Acesse <a href="https://developers.facebook.com/tools/explorer/" target="_blank" className="underline">Facebook Graph API Explorer</a></li>
            <li>Selecione seu App e gere um token com permissões: ads_management, ads_read</li>
            <li>Acesse <a href="https://www.facebook.com/ads/manager/accounts" target="_blank" className="underline">Gerenciador de Anúncios</a></li>
            <li>Copie o ID da conta (formato: act_XXXXXXXXXX)</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Token *
            </label>
            <input
              type="text"
              name="accessToken"
              value={formData.accessToken}
              onChange={handleInputChange}
              required
              placeholder="EAAG..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Token de acesso do Facebook Graph API com permissões de anúncios
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID da Conta de Anúncios *
            </label>
            <input
              type="text"
              name="adAccountId"
              value={formData.adAccountId}
              onChange={handleInputChange}
              required
              placeholder="act_123456789"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              ID da conta de anúncios do Facebook (inicia com 'act_')
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Conta *
            </label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleInputChange}
              required
              placeholder="Minha Empresa - Meta Ads"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Nome identificador para esta conta
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Conectando...' : 'Conectar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}