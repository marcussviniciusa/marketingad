interface CampaignStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig = {
  'ACTIVE': {
    label: 'Ativa',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  'PAUSED': {
    label: 'Pausada',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  'DELETED': {
    label: 'Excluída',
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  'ARCHIVED': {
    label: 'Arquivada',
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  },
  'PENDING_REVIEW': {
    label: 'Em análise',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  'DISAPPROVED': {
    label: 'Reprovada',
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  'PREAPPROVED': {
    label: 'Pré-aprovada',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  'PENDING_BILLING_INFO': {
    label: 'Aguardando pagamento',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  'CAMPAIGN_PAUSED': {
    label: 'Campanha pausada',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  'ADSET_PAUSED': {
    label: 'Conjunto pausado',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }
};

export default function CampaignStatusBadge({ status, size = 'sm' }: CampaignStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full border
      ${config.color}
      ${sizeClasses[size]}
    `}>
      {config.label}
    </span>
  );
}