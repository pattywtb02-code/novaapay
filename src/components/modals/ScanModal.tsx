import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QrCode, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ScanModal = ({ open, onOpenChange }: ScanModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan to Pay</DialogTitle>
        </DialogHeader>
        <div className="py-8 flex flex-col items-center gap-6">
          {/* QR Code Scanner Placeholder */}
          <div className="w-64 h-64 rounded-2xl bg-muted flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border">
            <div className="relative">
              <QrCode className="w-16 h-16 text-muted-foreground" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-2 border-accent rounded-lg animate-pulse" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center px-4">
              Position QR code within the frame to scan
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Scan merchant or personal QR codes to send payments instantly
            </p>
            <Button variant="outline" className="gap-2">
              <Camera className="w-4 h-4" />
              Open Camera
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScanModal;
