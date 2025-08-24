interface SyncStatusIndicatorProps {
  status: 'pending' | 'syncing' | 'synced' | 'error';
  lastSyncAt?: string;
  errorMessage?: string;
  onSync?: () => void;
  size?: 'sm' | 'md';
}

export default function SyncStatusIndicator({ 
  status, 
  lastSyncAt, 
  errorMessage, 
  onSync,
  size = 'sm'
}: SyncStatusIndicatorProps) {
  const statusConfig = {
    pending: {
      label: 'Pendente',
      color: 'bg-gray-100 text-gray-800',
      icon: 'clock',
      description: 'Aguardando sincronização'
    },
    syncing: {
      label: 'Sincronizando',
      color: 'bg-blue-100 text-blue-800',
      icon: 'sync',
      description: 'Sincronizando com Meta API'
    },
    synced: {
      label: 'Sincronizado',
      color: 'bg-green-100 text-green-800',
      icon: 'check',
      description: lastSyncAt ? `Último sync: ${new Date(lastSyncAt).toLocaleString('pt-BR')}` : 'Sincronizado'
    },
    error: {
      label: 'Erro',
      color: 'bg-red-100 text-red-800',
      icon: 'error',
      description: errorMessage || 'Erro na sincronização'
    }
  };

  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1';

  const renderIcon = () => {
    const iconClasses = `w-4 h-4 ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`;
    
    switch (config.icon) {
      case 'clock':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'sync':
        return (
          <svg className={`${iconClasses} animate-spin`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'check':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.102 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`
        inline-flex items-center gap-1 font-medium rounded-full
        ${config.color}
        ${sizeClasses}
      `}>
        {renderIcon()}
        {config.label}
      </span>
      
      {onSync && (status === 'error' || status === 'pending') && (
        <button
          onClick={onSync}
          className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
          title="Tentar sincronizar novamente"
        >
          Sync
        </button>
      )}
      
      {(status === 'error' && errorMessage) && (
        <div className="relative group">
          <svg className="w-4 h-4 text-red-500 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
}