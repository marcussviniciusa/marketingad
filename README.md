# Marketing AD Platform

Plataforma completa de marketing digital com IA que funciona como uma equipe de marketing profissional.

## 🚀 Funcionalidades Principais

- **Gestão de Anúncios**: Facebook, Instagram e Google Ads
- **Redes Sociais**: Agendamento e analytics
- **Landing Pages**: Editor drag-and-drop com A/B testing
- **CRM Completo**: Pipeline de vendas e automações
- **WhatsApp Automation**: Chatbot e disparo em massa
- **6 Agentes de IA**: Analista de Tráfego, Copywriter, Designer, Consultor, Atendente e Analista de Concorrência

## 🛠️ Stack Tecnológico

- **Backend**: Node.js, Express, PostgreSQL, Redis
- **Frontend**: Next.js, React, TypeScript
- **IA/ML**: Python, TensorFlow, OpenAI
- **Infra**: Docker, Kubernetes

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- PostgreSQL 15+
- Redis 7+

### Configuração

1. Clone o repositório:
```bash
git clone https://github.com/your-org/marketingad.git
cd marketingad
```

2. Copie o arquivo de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` com suas configurações

4. Inicie os serviços Docker:
```bash
docker-compose up -d
```

5. Instale as dependências:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

6. Execute as migrations:
```bash
cd backend
npm run migrate
```

7. Inicie o servidor de desenvolvimento:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia todos os serviços em modo dev

# Produção
npm run build        # Build de produção
npm run start        # Inicia em produção

# Testes
npm run test         # Executa testes
npm run test:watch   # Testes em modo watch

# Linting
npm run lint         # Verifica código
npm run lint:fix     # Corrige problemas
```

## 📝 Variáveis de Ambiente

Principais variáveis no `.env`:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marketingad
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
```

## 🏗️ Estrutura do Projeto

```
marketingad/
├── backend/            # API Node.js
│   ├── src/
│   │   ├── config/     # Configurações
│   │   ├── controllers/# Controladores
│   │   ├── models/     # Modelos Sequelize
│   │   ├── routes/     # Rotas Express
│   │   ├── services/   # Lógica de negócio
│   │   └── middlewares/# Middlewares
├── frontend/           # Next.js App
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── pages/      # Páginas Next.js
│   │   ├── services/   # Chamadas API
│   │   └── styles/     # Estilos
├── services/           # Microsserviços
│   ├── ai-agents/      # Agentes de IA
│   └── workers/        # Background jobs
├── docker/             # Configurações Docker
└── docs/               # Documentação
```

## 🔐 Níveis de Acesso

1. **SuperAdmin**: Controle total do sistema
2. **Admin**: Gerenciamento da empresa
3. **Usuário**: Permissões específicas

## 📊 Status do Desenvolvimento

- [x] Estrutura base do projeto
- [x] Sistema de autenticação
- [x] Multi-tenancy
- [ ] Gestão de anúncios
- [ ] Landing pages
- [ ] CRM
- [ ] WhatsApp automation
- [ ] Agentes de IA

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Proprietary - Todos os direitos reservados

## 📞 Suporte

Para suporte, envie um email para support@marketingad.com