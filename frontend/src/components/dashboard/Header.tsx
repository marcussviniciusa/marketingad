'use client';

import { Bell, Search, Plus, Calendar, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500"
              placeholder="Buscar campanhas, contatos, relatórios..."
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition">
              <Calendar className="h-4 w-4 mr-2" />
              Hoje
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition">
              <Plus className="h-4 w-4 mr-2" />
              Criar
            </button>
          </div>

          {/* Help Button */}
          <button className="p-2 text-gray-400 hover:text-gray-500 transition">
            <HelpCircle className="h-6 w-6" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-500 transition">
              <Bell className="h-6 w-6" />
            </button>
            {/* Notification Badge */}
            <div className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Campanhas Ativas</p>
              <p className="text-lg font-semibold text-gray-900">12</p>
            </div>
            <div className="text-green-500 text-sm font-medium">+2</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gasto Hoje</p>
              <p className="text-lg font-semibold text-gray-900">R$ 1.240</p>
            </div>
            <div className="text-blue-500 text-sm font-medium">-8%</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversões</p>
              <p className="text-lg font-semibold text-gray-900">24</p>
            </div>
            <div className="text-green-500 text-sm font-medium">+15%</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">ROI</p>
              <p className="text-lg font-semibold text-gray-900">3.2x</p>
            </div>
            <div className="text-green-500 text-sm font-medium">+0.4x</div>
          </div>
        </div>
      </div>
    </header>
  );
}