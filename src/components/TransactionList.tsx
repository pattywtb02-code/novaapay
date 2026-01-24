import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction, formatCurrency } from '@/lib/transactions';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

const TransactionList = ({ transactions, limit }: TransactionListProps) => {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="space-y-1">
      {displayTransactions.map((transaction, index) => (
        <div 
          key={transaction.id} 
          className="transaction-row animate-fade-in"
          style={{ animationDelay: `${index * 0.03}s` }}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              transaction.type === 'CR' ? 'bg-success/10' : 'bg-destructive/10'
            )}>
              {transaction.type === 'CR' ? (
                <ArrowDownLeft className="w-5 h-5 text-credit" />
              ) : (
                <ArrowUpRight className="w-5 h-5 text-debit" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.date} • {transaction.time}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={cn(
              "font-semibold",
              transaction.type === 'CR' ? 'text-credit' : 'text-debit'
            )}>
              {transaction.type === 'CR' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
            <p className="text-xs text-muted-foreground">{transaction.type}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
