import { Send, Download, Plus, QrCode } from 'lucide-react';
import { useState } from 'react';
import SendMoneyModal from './modals/SendMoneyModal';
import RequestMoneyModal from './modals/RequestMoneyModal';
import AddMoneyModal from './modals/AddMoneyModal';
import ScanModal from './modals/ScanModal';

interface QuickActionsProps {
  onTransactionComplete: () => void;
}

const QuickActions = ({ onTransactionComplete }: QuickActionsProps) => {
  const [sendOpen, setSendOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);

  const actions = [
    { id: 'send', label: 'Send', icon: Send, onClick: () => setSendOpen(true), color: 'bg-accent' },
    { id: 'request', label: 'Request', icon: Download, onClick: () => setRequestOpen(true), color: 'bg-success' },
    { id: 'add', label: 'Add Money', icon: Plus, onClick: () => setAddOpen(true), color: 'bg-warning' },
    { id: 'scan', label: 'Scan', icon: QrCode, onClick: () => setScanOpen(true), color: 'bg-primary' },
  ];

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className="quick-action group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground">{action.label}</span>
            </button>
          );
        })}
      </div>

      <SendMoneyModal 
        open={sendOpen} 
        onOpenChange={setSendOpen} 
        onSuccess={onTransactionComplete}
      />
      <RequestMoneyModal 
        open={requestOpen} 
        onOpenChange={setRequestOpen}
        onSuccess={onTransactionComplete}
      />
      <AddMoneyModal 
        open={addOpen} 
        onOpenChange={setAddOpen}
        onSuccess={onTransactionComplete}
      />
      <ScanModal 
        open={scanOpen} 
        onOpenChange={setScanOpen}
      />
    </>
  );
};

export default QuickActions;
