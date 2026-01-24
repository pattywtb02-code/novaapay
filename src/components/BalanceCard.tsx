import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency, getGreeting } from '@/lib/transactions';
import { Profile } from '@/hooks/useBanking';

interface BalanceCardProps {
  profile: Profile | null;
}

const BalanceCard = ({ profile }: BalanceCardProps) => {
  const [showBalance, setShowBalance] = useState(true);
  const greeting = getGreeting();
  const balance = profile?.balance ?? 3400000;
  const name = profile?.full_name ?? 'Robert Stork';

  return (
    <div className="stats-card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-muted-foreground text-sm">{greeting},</p>
          <h2 className="text-2xl font-bold text-foreground">{name}</h2>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
        >
          {showBalance ? (
            <Eye className="w-5 h-5 text-muted-foreground" />
          ) : (
            <EyeOff className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
        <p className="balance-text">
          {showBalance ? formatCurrency(balance) : '••••••••'}
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-border flex gap-8">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Account</p>
          <p className="font-mono text-sm text-foreground">{profile?.account_number ?? '****7842'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Routing</p>
          <p className="font-mono text-sm text-foreground">{profile?.routing_number ?? '****1234'}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
