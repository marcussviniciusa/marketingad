'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '@/services/api';

const campaignSchema = z.object({
  metaAccountId: z.string().min(1, 'Conta Meta é obrigatória'),
  name: z.string().min(1, 'Nome da campanha é obrigatório').max(255, 'Nome muito longo'),
  objective: z.enum([
    'OUTCOME_AWARENESS',
    'OUTCOME_TRAFFIC', 
    'OUTCOME_ENGAGEMENT',
    'OUTCOME_LEADS',
    'OUTCOME_APP_PROMOTION',
    'OUTCOME_SALES'
  ], { errorMap: () => ({ message: 'Objetivo é obrigatório' }) }),
  status: z.enum(['ACTIVE', 'PAUSED']).default('PAUSED'),
  spendCap: z.number().optional(),
  startTime: z.string().optional(),
  stopTime: z.string().optional(),
  specialAdCategories: z.array(z.string()).default([]),
});

type CampaignForm = z.infer<typeof campaignSchema>;

interface MetaAccount {
  id: string;
  accountName: string;
  metaAdAccountId: string;
  currency: string;
  status: string;
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const [metaAccounts, setMetaAccounts] = useState<MetaAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      status: 'PAUSED',
      specialAdCategories: [],
    }
  });

  useEffect(() => {
    fetchMetaAccounts();
  }, []);

  const fetchMetaAccounts = async () => {
    try {
      const response = await api.get('/meta-ads/accounts');
      if (response.data.success) {
        const activeAccounts = response.data.data.filter(
          (account: MetaAccount) => account.status === 'active'
        );
        setMetaAccounts(activeAccounts);
        
        // Se há apenas uma conta, seleciona automaticamente
        if (activeAccounts.length === 1) {
          setValue('metaAccountId', activeAccounts[0].id);
        }
      }
    } catch (error: any) {
      toast.error('Erro ao carregar contas Meta');
      console.error('Error fetching meta accounts:', error);
    } finally {
      setAccountsLoading(false);
    }
  };

  const onSubmit = async (data: CampaignForm) => {
    try {
      setLoading(true);
      
      const payload = {
        ...data,
        spendCap: data.spendCap || undefined,
        startTime: data.startTime || undefined,
        stopTime: data.stopTime || undefined,
      };

      const response = await api.post('/meta-ads/campaigns', payload);
      
      if (response.data.success) {
        toast.success('Campanha criada com sucesso!');
        router.push('/dashboard/campaigns');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Erro ao criar campanha';
      toast.error(errorMessage);
      console.error('Error creating campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const objectiveOptions = [
    { value: 'OUTCOME_AWARENESS', label: 'Reconhecimento da Marca', description: 'Alcançar pessoas com maior probabilidade de se lembrar dos seus anúncios' },
    { value: 'OUTCOME_TRAFFIC', label: 'Tráfego', description: 'Enviar pessoas para um destino, como seu site ou aplicativo' },
    { value: 'OUTCOME_ENGAGEMENT', label: 'Engajamento', description: 'Conseguir mais mensagens, curtidas, comentários ou compartilhamentos' },
    { value: 'OUTCOME_LEADS', label: 'Geração de Leads', description: 'Coletar leads para seu negócio ou marca' },
    { value: 'OUTCOME_APP_PROMOTION', label: 'Promoção de Aplicativo', description: 'Encontrar pessoas para instalar ou realizar ações no seu aplicativo' },
    { value: 'OUTCOME_SALES', label: 'Vendas', description: 'Encontrar pessoas com maior probabilidade de comprar seu produto ou serviço' },
  ];

  const specialCategoryOptions = [
    { value: 'CREDIT', label: 'Crédito' },
    { value: 'EMPLOYMENT', label: 'Emprego' },
    { value: 'HOUSING', label: 'Habitação' },
    { value: 'SOCIAL_ISSUES_ELECTIONS_POLITICS', label: 'Questões Sociais, Eleições ou Política' },
  ];

  if (accountsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (metaAccounts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Nenhuma Conta Meta Conectada
          </h2>
          <p className="text-yellow-700 mb-4">
            Você precisa conectar uma conta do Meta Ads antes de criar campanhas.
          </p>
          <button
            onClick={() => router.push('/dashboard/settings')}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
          >
            Conectar Conta Meta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Campanha</h1>
          <p className="text-gray-600 mt-1">Crie uma nova campanha no Meta Ads</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Configurações Básicas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="metaAccountId" className="block text-sm font-medium text-gray-700 mb-2">
                Conta Meta Ads
              </label>
              <select
                {...register('metaAccountId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Selecione uma conta</option>
                {metaAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountName} ({account.metaAdAccountId})
                  </option>
                ))}
              </select>
              {errors.metaAccountId && (
                <p className="text-red-500 text-sm mt-1">{errors.metaAccountId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Campanha
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Digite o nome da campanha"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivo da Campanha
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {objectiveOptions.map((option) => (
                <label key={option.value} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    {...register('objective')}
                    type="radio"
                    value={option.value}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.objective && (
              <p className="text-red-500 text-sm mt-1">{errors.objective.message}</p>
            )}
          </div>
        </div>

        {/* Orçamento e Cronograma */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Orçamento e Cronograma</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="spendCap" className="block text-sm font-medium text-gray-700 mb-2">
                Limite de Gastos (opcional)
              </label>
              <input
                {...register('spendCap', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
              />
              <p className="text-sm text-gray-500 mt-1">Deixe em branco para sem limite</p>
            </div>

            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início (opcional)
              </label>
              <input
                {...register('startTime')}
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="stopTime" className="block text-sm font-medium text-gray-700 mb-2">
                Data de Fim (opcional)
              </label>
              <input
                {...register('stopTime')}
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Configurações Avançadas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações Avançadas</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Inicial
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    {...register('status')}
                    type="radio"
                    value="PAUSED"
                    className="mr-2"
                  />
                  <span>Pausada (recomendado)</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('status')}
                    type="radio"
                    value="ACTIVE"
                    className="mr-2"
                  />
                  <span>Ativa</span>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Recomendamos criar a campanha pausada e ativá-la após configurar os conjuntos de anúncios
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorias Especiais de Anúncios (se aplicável)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialCategoryOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      value={option.value}
                      {...register('specialAdCategories')}
                      className="mr-2"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Selecione se seu anúncio se enquadra em alguma dessas categorias especiais
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Criando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Criar Campanha
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}