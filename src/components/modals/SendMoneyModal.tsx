import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useBanking } from '@/hooks/useBanking';
import { z } from 'zod';
import PinModal from './PinModal';

const sendSchema = z.object({
  accountNumber: z.string().min(8, 'Account number must be at least 8 digits').max(17, 'Account number too long'),
  routingNumber: z.string().length(9, 'Routing number must be 9 digits'),
  amount: z.number().positive('Amount must be greater than 0'),
  recipientName: z.string().min(2, 'Recipient name is required'),
});

interface SendMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const SendMoneyModal = ({ open, onOpenChange, onSuccess }: SendMoneyModalProps) => {
  const { createTransaction, profile, hasPin } = useBanking();
  const [step, setStep] = useState<'form' | 'pin' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    accountNumber: '',
    routingNumber: '',
    amount: '',
    recipientName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinMode, setPinMode] = useState<'verify' | 'setup'>('verify');

  const validateForm = () => {
    setErrors({});
    const amount = parseFloat(formData.amount);
    
    try {
      sendSchema.parse({
        ...formData,
        amount,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        return false;
      }
    }

    if (profile && amount > profile.balance) {
      setErrors({ amount: 'Insufficient balance' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Check if user has PIN set up
    if (!hasPin()) {
      setPinMode('setup');
      setShowPinModal(true);
    } else {
      setPinMode('verify');
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = async () => {
    setShowPinModal(false);
    await processTransfer();
  };

  const processTransfer = async () => {
    setStep('processing');

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const amount = parseFloat(formData.amount);
    const { error } = await createTransaction(
      `Transfer to ${formData.recipientName}`,
      amount,
      'DR'
    );

    if (error) {
      setStep('form');
      setErrors({ submit: error.message });
      return;
    }

    setStep('success');
    onSuccess();

    // Reset after showing success
    setTimeout(() => {
      setStep('form');
      setFormData({ accountNumber: '', routingNumber: '', amount: '', recipientName: '' });
      onOpenChange(false);
    }, 2000);
  };

  const handleClose = () => {
    if (step !== 'processing') {
      setStep('form');
      setFormData({ accountNumber: '', routingNumber: '', amount: '', recipientName: '' });
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          {step === 'form' && (
            <>
              <DialogHeader>
                <DialogTitle>Send Money</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input
                    id="recipientName"
                    placeholder="John Doe"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  />
                  {errors.recipientName && <p className="text-sm text-destructive">{errors.recipientName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  />
                  {errors.accountNumber && <p className="text-sm text-destructive">{errors.accountNumber}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    placeholder="9 digit routing number"
                    maxLength={9}
                    value={formData.routingNumber}
                    onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                  />
                  {errors.routingNumber && <p className="text-sm text-destructive">{errors.routingNumber}</p>}
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
                <Button type="submit" className="w-full">Continue</Button>
              </form>
            </>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <p className="text-lg font-medium">Processing Transfer...</p>
              <p className="text-sm text-muted-foreground">Please wait while we process your transaction</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-credit" />
              </div>
              <p className="text-lg font-medium">Transfer Successful!</p>
              <p className="text-sm text-muted-foreground">
                ${parseFloat(formData.amount).toLocaleString()} sent to {formData.recipientName}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PinModal
        open={showPinModal}
        onOpenChange={setShowPinModal}
        onSuccess={handlePinSuccess}
        mode={pinMode}
      />
    </>
  );
};

export default SendMoneyModal;
