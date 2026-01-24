import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Building, CreditCard } from 'lucide-react';
import { useBanking } from '@/hooks/useBanking';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const addMoneySchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  source: z.enum(['bank', 'card']),
});

interface AddMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddMoneyModal = ({ open, onOpenChange, onSuccess }: AddMoneyModalProps) => {
  const { createTransaction } = useBanking();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({ amount: '', source: 'bank' as 'bank' | 'card' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const amount = parseFloat(formData.amount);

    try {
      addMoneySchema.parse({ amount, source: formData.source });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setStep('processing');

    await new Promise(resolve => setTimeout(resolve, 2000));

    const { error } = await createTransaction(
      `Deposit from ${formData.source === 'bank' ? 'External Bank' : 'Debit Card'}`,
      amount,
      'CR'
    );

    if (error) {
      setStep('form');
      setErrors({ submit: error.message });
      return;
    }

    setStep('success');
    onSuccess();

    setTimeout(() => {
      setStep('form');
      setFormData({ amount: '', source: 'bank' });
      onOpenChange(false);
    }, 2000);
  };

  const handleClose = () => {
    if (step !== 'processing') {
      setStep('form');
      setFormData({ amount: '', source: 'bank' });
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle>Add Money</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Source</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, source: 'bank' })}
                    className={cn(
                      "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                      formData.source === 'bank' 
                        ? 'border-accent bg-accent/5' 
                        : 'border-border hover:border-accent/50'
                    )}
                  >
                    <Building className="w-6 h-6" />
                    <span className="text-sm font-medium">Bank Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, source: 'card' })}
                    className={cn(
                      "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                      formData.source === 'card' 
                        ? 'border-accent bg-accent/5' 
                        : 'border-border hover:border-accent/50'
                    )}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-sm font-medium">Debit Card</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
                {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
              </div>
              {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}
              <Button type="submit" className="w-full">Add Funds</Button>
            </form>
          </>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
            <p className="text-lg font-medium">Processing Deposit...</p>
            <p className="text-sm text-muted-foreground">
              {formData.source === 'bank' ? 'Connecting to your bank...' : 'Verifying card details...'}
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-12 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-credit" />
            </div>
            <p className="text-lg font-medium">Funds Added!</p>
            <p className="text-sm text-muted-foreground">
              ${parseFloat(formData.amount).toLocaleString()} added to your account
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddMoneyModal;
