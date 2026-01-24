import { useState } from 'react';
import { useBanking } from '@/hooks/useBanking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Target, PiggyBank, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/transactions';
import { toast } from 'sonner';

const SavingsView = () => {
  const { savings, addSavingsGoal, updateSavingsGoal, profile } = useBanking();
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });
  const [addAmount, setAddAmount] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Default savings goals for demo
  const displaySavings = savings.length > 0 ? savings : [
    { id: '1', name: 'Emergency Fund', target_amount: 100000, current_amount: 75000 },
    { id: '2', name: 'Vacation', target_amount: 50000, current_amount: 32000 },
    { id: '3', name: 'New Car', target_amount: 200000, current_amount: 45000 },
  ];

  const totalSaved = displaySavings.reduce((sum, g) => sum + g.current_amount, 0);
  const totalTarget = displaySavings.reduce((sum, g) => sum + g.target_amount, 0);

  const handleCreateGoal = async () => {
    if (!newGoal.name || !newGoal.target) {
      toast.error('Please fill in all fields');
      return;
    }

    const { error } = await addSavingsGoal(newGoal.name, parseFloat(newGoal.target));
    
    if (error) {
      toast.error('Failed to create goal');
      return;
    }

    toast.success('Savings goal created!');
    setNewGoal({ name: '', target: '' });
    setDialogOpen(false);
  };

  const handleAddToGoal = async (goalId: string, currentAmount: number) => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const { error } = await updateSavingsGoal(goalId, currentAmount + amount);
    
    if (error) {
      toast.error('Failed to add funds');
      return;
    }

    toast.success(`${formatCurrency(amount)} added to savings!`);
    setAddAmount('');
    setSelectedGoal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Savings Goals</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input
                  placeholder="e.g., Emergency Fund"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Amount (USD)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateGoal} className="w-full">Create Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stats-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-credit" />
            </div>
            <p className="text-sm text-muted-foreground">Total Saved</p>
          </div>
          <p className="text-2xl font-bold text-credit">{formatCurrency(totalSaved)}</p>
        </div>
        <div className="stats-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">Total Target</p>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalTarget)}</p>
        </div>
        <div className="stats-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-warning" />
            </div>
            <p className="text-sm text-muted-foreground">Progress</p>
          </div>
          <p className="text-2xl font-bold">{Math.round((totalSaved / totalTarget) * 100)}%</p>
        </div>
      </div>

      {/* Savings Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displaySavings.map((goal) => {
          const progress = (goal.current_amount / goal.target_amount) * 100;
          const remaining = goal.target_amount - goal.current_amount;

          return (
            <div key={goal.id} className="stats-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{goal.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(remaining)} remaining
                  </p>
                </div>
                <span className="text-sm font-medium text-accent">{Math.round(progress)}%</span>
              </div>

              <Progress value={progress} className="h-2 mb-4" />

              <div className="flex justify-between text-sm mb-4">
                <span className="text-muted-foreground">Saved: {formatCurrency(goal.current_amount)}</span>
                <span className="text-muted-foreground">Goal: {formatCurrency(goal.target_amount)}</span>
              </div>

              {selectedGoal === goal.id ? (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={() => handleAddToGoal(goal.id, goal.current_amount)}>
                    Add
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedGoal(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedGoal(goal.id)}
                >
                  Add Funds
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsView;
