'use client';

import { useAuthStore } from '@/stores/authStore';
import { BarChart3, Users, Target, TrendingUp, DollarSign, MousePointer } from 'lucide-react';

const stats = [
  {
    name: 'Campanhas Ativas',
    value: '12',
    change: '+4.75%',
    changeType: 'positive',
    icon: Target,
  },
  {
    name: 'Investimento Total',
    value: 'R$ 45.240',
    change: '+54.02%',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    name: 'Impressões',
    value: '892.4K',
    change: '-1.39%',
    changeType: 'negative',
    icon: Users,
  },
  {
    name: 'Taxa de Conversão',
    value: '3.24%',
    change: '+10.18%',
    changeType: 'positive',
    icon: MousePointer,
  },
];

const recentCampaigns = [
  {
    name: 'Campanha Black Friday 2024',
    status: 'Ativa',
    budget: 'R$ 5.000',
    spent: 'R$ 2.340',
    impressions: '45.2K',
    conversions: 124,
  },
  {
    name: 'Promoção Natal - Produtos',
    status: 'Ativa',
    budget: 'R$ 3.500',
    spent: 'R$ 1.890',
    impressions: '32.1K',
    conversions: 89,
  },
  {
    name: 'Lançamento Nova Linha',
    status: 'Pausada',
    budget: 'R$ 8.000',
    spent: 'R$ 4.120',
    impressions: '67.8K',
    conversions: 156,
  },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bem-vindo, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Aqui está um resumo do desempenho das suas campanhas
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
              Nova Campanha
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              Relatórios
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Performance das Campanhas
            </h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Ver Detalhes
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Gráfico de performance será implementado</p>
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Funil de Conversão
            </h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Ver Detalhes
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Funil de conversão será implementado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Campanhas Recentes
            </h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Ver Todas
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campanha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orçamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gasto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impressões
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversões
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCampaigns.map((campaign, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {campaign.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        campaign.status === 'Ativa'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.budget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.spent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.impressions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.conversions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}