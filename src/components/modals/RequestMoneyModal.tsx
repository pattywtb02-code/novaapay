import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Copy } from 'lucide-react';
import { useBanking } from '@/hooks/useBanking';
import { toast } from 'sonner';
import { z } from 'zod';

const requestSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  note: z.string().optional(),
});

interface RequestMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const RequestMoneyModal = ({ open, onOpenChange, onSuccess }: RequestMoneyModalProps) => {
  const { profile, createTransaction } = useBanking();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({ amount: '', note: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestLink, setRequestLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const amount = parseFloat(formData.amount);

    try {
      requestSchema.parse({ amount, note: formData.note });
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

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create a mock request link
    const requestId = Math.random().toString(36).substring(7);
    setRequestLink(`https://vault.bank/pay/${requestId}`);

    // For demo purposes, we'll auto-fulfill the request after a delay
    setTimeout(async () => {
      await createTransaction(
        `Money Request Fulfilled${formData.note ? `: ${formData.note}` : ''}`,
        amount,
        'CR'
      );
      onSuccess();
    }, 3000);

    setStep('success');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(requestLink);
    toast.success('Link copied to clipboard!');
  };

  const handleClose = () => {
    if (step !== 'processing') {
      setStep('form');
      setFormData({ amount: '', note: '' });
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
              <DialogTitle>Request Money</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Input
                  id="note"
                  placeholder="What's this for?"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Generate Request Link</Button>
            </form>
          </>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
            <p className="text-lg font-medium">Generating Request...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-credit" />
            </div>
            <p className="text-lg font-medium">Request Created!</p>
            <p className="text-sm text-muted-foreground text-center">
              Share this link to receive ${parseFloat(formData.amount).toLocaleString()}
            </p>
            <div className="w-full flex gap-2 mt-2">
              <Input value={requestLink} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={copyLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestMoneyModal;
