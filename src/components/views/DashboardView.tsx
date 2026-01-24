import BalanceCard from '@/components/BalanceCard';
import QuickActions from '@/components/QuickActions';
import TransactionList from '@/components/TransactionList';
import StockTicker from '@/components/StockTicker';
import BankCard from '@/components/BankCard';
import StatsSummary from '@/components/StatsSummary';
import { useBanking } from '@/hooks/useBanking';

const DashboardView = () => {
  const { profile, cards, transactions, refreshData } = useBanking();

  return (
    <div className="space-y-6 stagger-children">
      {/* Top row: Balance + Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BalanceCard profile={profile} />
        </div>
        <div className="flex items-center justify-center">
          <BankCard card={cards[0]} />
        </div>
      </div>

      {/* Stock Ticker */}
      <StockTicker />

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <QuickActions onTransactionComplete={refreshData} />
      </div>

      {/* Stats Summary */}
      <StatsSummary transactions={transactions} />

      {/* Recent Transactions */}
      <div className="stats-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <span className="text-sm text-muted-foreground">3-Month History</span>
        </div>
        <TransactionList transactions={transactions} limit={10} />
      </div>
    </div>
  );
};

export default DashboardView;
