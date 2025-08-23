'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Calendar, Megaphone, MousePointer, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold">Marketing AD</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Entrar
              </Link>
              <Link
                href="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Começar Grátis
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Sua Equipe de Marketing Digital
            <span className="text-primary-600"> Completa em Uma Plataforma</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Gerencie anúncios, redes sociais, landing pages e muito mais com a ajuda de agentes de IA especializados
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition flex items-center"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/demo"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition"
            >
              Ver Demonstração
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Tudo que você precisa em um só lugar</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Megaphone className="h-10 w-10 text-primary-600" />}
            title="Gestão de Anúncios"
            description="Crie e gerencie campanhas no Facebook, Instagram e Google Ads com análises em tempo real"
          />
          <FeatureCard
            icon={<Calendar className="h-10 w-10 text-primary-600" />}
            title="Redes Sociais"
            description="Agende posts, monitore engajamento e gerencie múltiplas contas em uma interface"
          />
          <FeatureCard
            icon={<MousePointer className="h-10 w-10 text-primary-600" />}
            title="Landing Pages"
            description="Editor drag-and-drop com templates otimizados e teste A/B automático"
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary-600" />}
            title="CRM Integrado"
            description="Gerencie leads, pipeline de vendas e automações em um sistema completo"
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-primary-600" />}
            title="WhatsApp Automation"
            description="Chatbot inteligente, disparo em massa e atendimento automatizado"
          />
          <FeatureCard
            icon={<BarChart3 className="h-10 w-10 text-primary-600" />}
            title="Analytics Inteligente"
            description="Dashboards personalizados com insights e sugestões de otimização por IA"
          />
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">6 Agentes de IA Trabalhando para Você</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Nossa equipe de inteligência artificial analisa, cria e otimiza suas campanhas 24/7
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <AIAgentCard
              title="Analista de Tráfego"
              description="Monitora métricas e sugere otimizações em tempo real"
            />
            <AIAgentCard
              title="Copywriter"
              description="Cria textos persuasivos para anúncios e posts"
            />
            <AIAgentCard
              title="Designer Criativo"
              description="Sugere layouts e composições visuais"
            />
            <AIAgentCard
              title="Consultor Estratégico"
              description="Planeja estratégias baseadas em dados"
            />
            <AIAgentCard
              title="Atendente Virtual"
              description="Responde clientes no WhatsApp automaticamente"
            />
            <AIAgentCard
              title="Analista de Concorrência"
              description="Monitora competidores e identifica oportunidades"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para Revolucionar seu Marketing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Comece gratuitamente e escale conforme cresce
          </p>
          <Link
            href="/register"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-flex items-center"
          >
            Criar Conta Grátis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-primary-600" />
              <span className="font-semibold">Marketing AD</span>
            </div>
            <p className="text-gray-600">© 2025 Marketing AD. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function AIAgentCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
        <Zap className="h-6 w-6 text-primary-600" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}