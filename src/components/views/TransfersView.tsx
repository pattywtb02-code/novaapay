import { useState } from 'react';
import TransactionList from '@/components/TransactionList';
import { useBanking } from '@/hooks/useBanking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const TransfersView = () => {
  const { transactions } = useBanking();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'CR' | 'DR'>('all');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || t.type === filter;
    return matchesSearch && matchesFilter;
  });

  const credits = transactions.filter(t => t.type === 'CR');
  const debits = transactions.filter(t => t.type === 'DR');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Transfers & History</h2>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Statement
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stats-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold">{transactions.length}</p>
          </div>
        </div>
        <div className="stats-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <ArrowDownLeft className="w-6 h-6 text-credit" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Credits</p>
            <p className="text-2xl font-bold text-credit">{credits.length}</p>
          </div>
        </div>
        <div className="stats-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-debit" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Debits</p>
            <p className="text-2xl font-bold text-debit">{debits.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="stats-card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="CR">Credits</TabsTrigger>
              <TabsTrigger value="DR">Debits</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Transaction List */}
        <TransactionList transactions={filteredTransactions} />

        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransfersView;
