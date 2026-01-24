import { Wifi } from 'lucide-react';
import { Card } from '@/hooks/useBanking';
import { cn } from '@/lib/utils';

interface BankCardProps {
  card?: Card;
  variant?: 'primary' | 'premium';
  className?: string;
}

const BankCard = ({ card, variant = 'primary', className }: BankCardProps) => {
  const cardNumber = card?.card_number ?? '**** **** **** 7842';
  const cardHolder = card?.card_holder ?? 'Robert Stork';
  const expiryDate = card?.expiry_date ?? '12/28';
  const cardType = card?.card_type ?? 'Visa Platinum';

  return (
    <div className={cn(
      variant === 'primary' ? 'bank-card' : 'bank-card-premium',
      'text-white min-w-[320px] aspect-[1.586/1]',
      className
    )}>
      {/* Card pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 250">
          <circle cx="350" cy="-50" r="200" fill="white" />
          <circle cx="400" cy="300" r="150" fill="white" />
        </svg>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs opacity-80 mb-1">{cardType}</p>
            <Wifi className="w-6 h-6 rotate-90" />
          </div>
          <div className="text-right">
            <p className="font-bold text-lg tracking-wide">VAULT</p>
          </div>
        </div>

        <div>
          <p className="font-mono text-xl tracking-[0.2em] mb-4">{cardNumber}</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] opacity-60 uppercase mb-1">Card Holder</p>
              <p className="font-medium text-sm uppercase tracking-wide">{cardHolder}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] opacity-60 uppercase mb-1">Expires</p>
              <p className="font-medium text-sm">{expiryDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankCard;
