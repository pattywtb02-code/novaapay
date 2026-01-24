import { useState } from 'react';
import BankCard from '@/components/BankCard';
import { useBanking } from '@/hooks/useBanking';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Eye, EyeOff, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/transactions';
import { cn } from '@/lib/utils';

const CardsView = () => {
  const { cards, profile } = useBanking();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);

  const displayCards = cards.length > 0 ? cards : [{
    id: '1',
    card_number: '**** **** **** 7842',
    card_type: 'Visa Platinum',
    expiry_date: '12/28',
    card_holder: profile?.full_name ?? 'Robert Stork',
    is_active: true,
    credit_limit: 500000,
  }];

  const currentCard = displayCards[selectedCard];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">My Cards</h2>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Card
        </Button>
      </div>

      {/* Card Carousel */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {displayCards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => setSelectedCard(index)}
            className={cn(
              "transition-all duration-300 flex-shrink-0",
              selectedCard === index ? 'scale-100' : 'scale-95 opacity-70'
            )}
          >
            <BankCard 
              card={card} 
              variant={index % 2 === 0 ? 'primary' : 'premium'} 
            />
          </button>
        ))}
      </div>

      {/* Card Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stats-card">
          <h3 className="font-semibold text-foreground mb-4">Card Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Card Number</span>
              <span className="font-mono">
                {showDetails ? '4532 1234 5678 7842' : currentCard.card_number}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">CVV</span>
              <span className="font-mono">{showDetails ? '123' : '***'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Expiry</span>
              <span className="font-mono">{currentCard.expiry_date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Card Holder</span>
              <span>{currentCard.card_holder}</span>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 gap-2"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>

        <div className="stats-card">
          <h3 className="font-semibold text-foreground mb-4">Card Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-xl">
              <div>
                <p className="font-medium">Card Status</p>
                <p className="text-sm text-muted-foreground">
                  {currentCard.is_active ? 'Active and ready to use' : 'Card is frozen'}
                </p>
              </div>
              <Button variant={currentCard.is_active ? 'outline' : 'default'} size="sm" className="gap-2">
                {currentCard.is_active ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Freeze
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Unfreeze
                  </>
                )}
              </Button>
            </div>

            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-xl">
              <div>
                <p className="font-medium">Credit Limit</p>
                <p className="text-sm text-muted-foreground">Current spending limit</p>
              </div>
              <p className="font-semibold">{formatCurrency(currentCard.credit_limit)}</p>
            </div>

            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-xl">
              <div>
                <p className="font-medium">Card Type</p>
                <p className="text-sm text-muted-foreground">{currentCard.card_type}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsView;
