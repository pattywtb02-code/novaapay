import { TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const initialStocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 2.34, changePercent: 1.33 },
  { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: -1.23, changePercent: -0.32 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 141.80, change: 3.45, changePercent: 2.49 },
  { symbol: 'AMZN', name: 'Amazon', price: 178.25, change: 1.89, changePercent: 1.07 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 495.22, change: 12.45, changePercent: 2.58 },
  { symbol: 'TSLA', name: 'Tesla', price: 248.48, change: -4.32, changePercent: -1.71 },
  { symbol: 'META', name: 'Meta', price: 505.35, change: 8.92, changePercent: 1.80 },
  { symbol: 'JPM', name: 'JPMorgan', price: 195.42, change: 0.87, changePercent: 0.45 },
];

const StockTicker = () => {
  const [stocks, setStocks] = useState(initialStocks);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const changeAmount = (Math.random() - 0.5) * 2;
        const newPrice = Math.max(0.01, stock.price + changeAmount);
        const changePercent = (changeAmount / stock.price) * 100;
        return {
          ...stock,
          price: Number(newPrice.toFixed(2)),
          change: Number(changeAmount.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stats-card overflow-hidden">
      <h3 className="font-semibold text-foreground mb-4">Market Watch</h3>
      <div className="relative overflow-hidden">
        <div className="flex gap-6 ticker-animate" style={{ width: 'max-content' }}>
          {[...stocks, ...stocks].map((stock, index) => (
            <div 
              key={`${stock.symbol}-${index}`}
              className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg min-w-[180px]"
            >
              <div>
                <p className="font-bold text-foreground text-sm">{stock.symbol}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[80px]">{stock.name}</p>
              </div>
              <div className="text-right ml-auto">
                <p className="font-semibold text-foreground text-sm">${stock.price.toFixed(2)}</p>
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  stock.change >= 0 ? 'text-credit' : 'text-debit'
                )}>
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockTicker;
