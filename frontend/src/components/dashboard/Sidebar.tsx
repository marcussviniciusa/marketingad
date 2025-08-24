'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Target, 
  Share2, 
  FileText, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Bot,
  Settings,
  LogOut,
  Zap,
  ChevronDown,
  Building2,
  Facebook
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'Meta Ads', 
    icon: Facebook,
    children: [
      { name: 'Dashboard', href: '/dashboard/meta-ads' },
      { name: 'Campanhas', href: '/dashboard/meta-ads/campaigns' },
      { name: 'Conectar Conta', href: '/dashboard/meta-ads/setup' },
    ]
  },
  { 
    name: 'Anúncios', 
    icon: Target,
    children: [
      { name: 'Campanhas', href: '/dashboard/campaigns' },
      { name: 'Criar Campanha', href: '/dashboard/campaigns/create' },
      { name: 'Relatórios', href: '/dashboard/campaigns/reports' },
    ]
  },
  { 
    name: 'Redes Sociais', 
    icon: Share2,
    children: [
      { name: 'Posts', href: '/dashboard/social/posts' },
      { name: 'Calendário', href: '/dashboard/social/calendar' },
      { name: 'Analytics', href: '/dashboard/social/analytics' },
    ]
  },
  { 
    name: 'Landing Pages', 
    icon: FileText,
    children: [
      { name: 'Páginas', href: '/dashboard/landing-pages' },
      { name: 'Templates', href: '/dashboard/landing-pages/templates' },
      { name: 'Editor', href: '/dashboard/landing-pages/editor' },
    ]
  },
  { name: 'CRM', href: '/dashboard/crm', icon: Users },
  { name: 'WhatsApp', href: '/dashboard/whatsapp', icon: MessageSquare },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { 
    name: 'Agentes IA', 
    icon: Bot,
    children: [
      { name: 'Analista de Tráfego', href: '/dashboard/ai/traffic-analyst' },
      { name: 'Copywriter', href: '/dashboard/ai/copywriter' },
      { name: 'Designer', href: '/dashboard/ai/designer' },
      { name: 'Consultor', href: '/dashboard/ai/consultant' },
      { name: 'Atendente', href: '/dashboard/ai/assistant' },
      { name: 'Analista Concorrência', href: '/dashboard/ai/competitor' },
    ]
  },
];

const bottomNavigation = [
  { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (children: { href: string }[]) => 
    children.some(child => pathname === child.href);

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center">
          <Zap className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Marketing AD</span>
        </Link>
      </div>

      {/* Company Selector */}
      <div className="p-4 border-b border-gray-200">
        <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-gray-500 mr-3" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Minha Empresa</p>
              <p className="text-xs text-gray-500">Plano Professional</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          if (item.children) {
            const isExpanded = expandedItems.includes(item.name);
            const hasActiveChild = isParentActive(item.children);
            
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    hasActiveChild
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${
                      isExpanded ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>
                {isExpanded && (
                  <div className="mt-1 ml-8 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive(child.href)
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 p-4 space-y-1">
        {bottomNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
        
        {/* User Profile & Logout */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center px-3 py-2 mb-2">
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}