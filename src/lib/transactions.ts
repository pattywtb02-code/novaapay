// Pre-populated transaction data
export interface Transaction {
  id: string;
  date: string;
  time: string;
  description: string;
  type: 'CR' | 'DR';
  amount: number;
}

export const initialTransactions: Transaction[] = [
  { id: '1', date: '01 Oct', time: '10:14', description: 'Investment Inflow', type: 'CR', amount: 750000 },
  { id: '2', date: '03 Oct', time: '14:02', description: 'Equipment Purchase', type: 'DR', amount: 820000 },
  { id: '3', date: '05 Oct', time: '11:36', description: 'Partner Transfer', type: 'CR', amount: 620000 },
  { id: '4', date: '07 Oct', time: '15:18', description: 'Offshore Services', type: 'DR', amount: 760000 },
  { id: '5', date: '09 Oct', time: '09:47', description: 'Investment Return', type: 'CR', amount: 580000 },
  { id: '6', date: '11 Oct', time: '16:05', description: 'Engineering Fees', type: 'DR', amount: 700000 },
  { id: '7', date: '14 Oct', time: '10:21', description: 'Contract Settlement', type: 'CR', amount: 500000 },
  { id: '8', date: '16 Oct', time: '13:44', description: 'Logistics Charges', type: 'DR', amount: 650000 },
  { id: '9', date: '18 Oct', time: '09:33', description: 'Intl Transfer Received', type: 'CR', amount: 480000 },
  { id: '10', date: '20 Oct', time: '12:59', description: 'Business Proceeds', type: 'CR', amount: 450000 },
  { id: '11', date: '23 Oct', time: '10:08', description: 'Construction Services', type: 'DR', amount: 600000 },
  { id: '12', date: '25 Oct', time: '15:41', description: 'Profit Distribution', type: 'CR', amount: 420000 },
  { id: '13', date: '28 Oct', time: '09:56', description: 'Customs & Duties', type: 'DR', amount: 350000 },
  { id: '14', date: '30 Oct', time: '14:22', description: 'FX Funding Inflow', type: 'CR', amount: 380000 },
  { id: '15', date: '02 Nov', time: '11:17', description: 'Marine Services', type: 'DR', amount: 300000 },
  { id: '16', date: '04 Nov', time: '16:09', description: 'Dividend Credit', type: 'CR', amount: 350000 },
  { id: '17', date: '06 Nov', time: '10:43', description: 'Environmental Assessment', type: 'DR', amount: 280000 },
  { id: '18', date: '08 Nov', time: '13:55', description: 'Strategic Partner Transfer', type: 'CR', amount: 300000 },
  { id: '19', date: '10 Nov', time: '09:29', description: 'Infrastructure Development', type: 'DR', amount: 260000 },
  { id: '20', date: '12 Nov', time: '15:02', description: 'Investment Support', type: 'CR', amount: 280000 },
  { id: '21', date: '14 Nov', time: '10:11', description: 'Equipment Lease', type: 'DR', amount: 240000 },
  { id: '22', date: '16 Nov', time: '14:48', description: 'Business Funding', type: 'CR', amount: 260000 },
  { id: '23', date: '18 Nov', time: '09:54', description: 'Survey Services', type: 'DR', amount: 200000 },
  { id: '24', date: '20 Nov', time: '13:26', description: 'Capital Adjustment', type: 'CR', amount: 240000 },
  { id: '25', date: '22 Nov', time: '10:37', description: 'Partner Settlement', type: 'DR', amount: 180000 },
  { id: '26', date: '24 Nov', time: '15:11', description: 'Operations Funding', type: 'CR', amount: 220000 },
  { id: '27', date: '26 Nov', time: '11:04', description: 'Storage Charges', type: 'DR', amount: 150000 },
  { id: '28', date: '28 Nov', time: '16:18', description: 'Project Contribution', type: 'CR', amount: 200000 },
  { id: '29', date: '01 Dec', time: '09:42', description: 'Insurance Premium', type: 'DR', amount: 120000 },
  { id: '30', date: '03 Dec', time: '14:36', description: 'Private Transfer', type: 'CR', amount: 190000 },
  { id: '31', date: '05 Dec', time: '10:19', description: 'Legal & Compliance', type: 'DR', amount: 110000 },
  { id: '32', date: '07 Dec', time: '15:07', description: 'Associate Transfer', type: 'CR', amount: 180000 },
  { id: '33', date: '10 Dec', time: '11:23', description: 'Platform Charges', type: 'DR', amount: 80000 },
  { id: '34', date: '12 Dec', time: '16:01', description: 'Portfolio Adjustment', type: 'CR', amount: 170000 },
  { id: '35', date: '14 Dec', time: '10:46', description: 'Licensing Fees', type: 'DR', amount: 60000 },
  { id: '36', date: '16 Dec', time: '14:58', description: 'Revenue Credit', type: 'CR', amount: 160000 },
  { id: '37', date: '18 Dec', time: '09:31', description: 'Miscellaneous Credit', type: 'CR', amount: 150000 },
  { id: '38', date: '19 Dec', time: '13:12', description: 'Operating Expenses', type: 'DR', amount: 40000 },
  { id: '39', date: '20 Dec', time: '15:44', description: 'Interest Earned', type: 'CR', amount: 130000 },
  { id: '40', date: '20 Dec', time: '17:10', description: 'FX Gain', type: 'CR', amount: 2290000 },
];

export const calculateTotals = (transactions: Transaction[]) => {
  const totalCredits = transactions
    .filter(t => t.type === 'CR')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebits = transactions
    .filter(t => t.type === 'DR')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalCredits,
    totalDebits,
    netMovement: totalCredits - totalDebits,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};
