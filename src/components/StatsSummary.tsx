import { TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
import { Transaction, calculateTotals, formatCurrency } from '@/lib/transactions';

interface StatsSummaryProps {
  transactions: Transaction[];
}

const StatsSummary = ({ transactions }: StatsSummaryProps) => {
  const { totalCredits, totalDebits, netMovement } = calculateTotals(transactions);

  const stats = [
    {
      label: 'Total Credits',
      value: totalCredits,
      icon: TrendingUp,
      color: 'text-credit',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Total Debits',
      value: totalDebits,
      icon: TrendingDown,
      color: 'text-debit',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Net Movement',
      value: netMovement,
      icon: ArrowRightLeft,
      color: netMovement >= 0 ? 'text-credit' : 'text-debit',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="stats-card">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.label === 'Net Movement' && stat.value >= 0 ? '+' : ''}
              {formatCurrency(stat.value)}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsSummary;
