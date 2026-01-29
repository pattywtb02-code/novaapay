import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, AlertCircle } from 'lucide-react';
import { useBanking } from '@/hooks/useBanking';

interface PinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode: 'verify' | 'setup';
}

const PinModal = ({ open, onOpenChange, onSuccess, mode }: PinModalProps) => {
  const { profile, updatePin, verifyPin } = useBanking();
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setStep('enter');
      setError('');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  const handlePinChange = (index: number, value: string, isConfirm = false) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = isConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value.slice(-1);
    
    if (isConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);
    }
    
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      const refs = isConfirm ? confirmInputRefs : inputRefs;
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm = false) => {
    if (e.key === 'Backspace') {
      const currentPin = isConfirm ? confirmPin : pin;
      if (!currentPin[index] && index > 0) {
        const refs = isConfirm ? confirmInputRefs : inputRefs;
        refs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const pinString = pin.join('');
    
    if (pinString.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'setup') {
        if (step === 'enter') {
          setStep('confirm');
          setConfirmPin(['', '', '', '']);
          setTimeout(() => confirmInputRefs.current[0]?.focus(), 100);
          setLoading(false);
          return;
        }

        const confirmPinString = confirmPin.join('');
        if (pinString !== confirmPinString) {
          setError('PINs do not match');
          setLoading(false);
          return;
        }

        await updatePin(pinString);
        onSuccess();
        onOpenChange(false);
      } else {
        const isValid = await verifyPin(pinString);
        if (isValid) {
          onSuccess();
          onOpenChange(false);
        } else {
          setError('Invalid PIN');
        }
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderPinInputs = (values: string[], refs: React.MutableRefObject<(HTMLInputElement | null)[]>, isConfirm = false) => (
    <div className="flex gap-3 justify-center">
      {values.map((digit, index) => (
        <Input
          key={index}
          ref={el => refs.current[index] = el}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handlePinChange(index, e.target.value, isConfirm)}
          onKeyDown={(e) => handleKeyDown(index, e, isConfirm)}
          className="w-14 h-14 text-center text-2xl font-bold"
        />
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" />
            {mode === 'setup' ? 'Set Up Transfer PIN' : 'Enter Transfer PIN'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <p className="text-sm text-muted-foreground text-center">
            {mode === 'setup' 
              ? step === 'enter' 
                ? 'Create a 4-digit PIN to secure your transfers'
                : 'Confirm your 4-digit PIN'
              : 'Enter your 4-digit PIN to authorize this transfer'}
          </p>

          {step === 'enter' && renderPinInputs(pin, inputRefs)}
          {step === 'confirm' && renderPinInputs(confirmPin, confirmInputRefs, true)}

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm justify-center">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={loading || (step === 'enter' ? pin.some(d => !d) : confirmPin.some(d => !d))}
          >
            {loading ? 'Processing...' : step === 'enter' && mode === 'setup' ? 'Continue' : 'Confirm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinModal;
