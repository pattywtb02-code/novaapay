import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { initialTransactions, Transaction as LocalTransaction } from '@/lib/transactions';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  balance: number;
  account_number: string;
  routing_number: string;
  pin_hash: string | null;
}

export interface Card {
  id: string;
  card_number: string;
  card_type: string;
  expiry_date: string;
  card_holder: string;
  is_active: boolean;
  credit_limit: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
}

export interface DbTransaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  category: string | null;
  transaction_date: string;
  transaction_time: string;
}

export const useBanking = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [savings, setSavings] = useState<SavingsGoal[]>([]);
  const [dbTransactions, setDbTransactions] = useState<DbTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Combine initial transactions with new db transactions
  const allTransactions: LocalTransaction[] = [
    ...dbTransactions.map(t => ({
      id: t.id,
      date: new Date(t.transaction_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      time: t.transaction_time.slice(0, 5),
      description: t.description,
      type: t.type as 'CR' | 'DR',
      amount: Math.abs(t.amount),
    })),
    ...initialTransactions,
  ].sort((a, b) => {
    // Sort by date descending (newest first)
    return b.id.localeCompare(a.id);
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch cards
      const { data: cardsData } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id);

      if (cardsData) {
        setCards(cardsData as Card[]);
      }

      // Fetch savings goals
      const { data: savingsData } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id);

      if (savingsData) {
        setSavings(savingsData as SavingsGoal[]);
      }

      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (transactionsData) {
        setDbTransactions(transactionsData as DbTransaction[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (description: string, amount: number, type: 'CR' | 'DR') => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      description,
      amount: type === 'DR' ? -Math.abs(amount) : Math.abs(amount),
      type,
    });

    if (!error) {
      await fetchData(); // Refresh data
    }

    return { error };
  };

  const addSavingsGoal = async (name: string, targetAmount: number) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase.from('savings_goals').insert({
      user_id: user.id,
      name,
      target_amount: targetAmount,
    });

    if (!error) {
      await fetchData();
    }

    return { error };
  };

  const updateSavingsGoal = async (id: string, currentAmount: number) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('savings_goals')
      .update({ current_amount: currentAmount })
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      await fetchData();
    }

    return { error };
  };

  const updatePin = async (pin: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Simple hash for demo - in production use proper hashing
    const pinHash = btoa(pin);

    const { error } = await supabase
      .from('profiles')
      .update({ pin_hash: pinHash })
      .eq('user_id', user.id);

    if (!error) {
      await fetchData();
    }

    return { error };
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    if (!profile?.pin_hash) return false;
    const pinHash = btoa(pin);
    return pinHash === profile.pin_hash;
  };

  const hasPin = (): boolean => {
    return !!profile?.pin_hash;
  };

  return {
    profile,
    cards,
    savings,
    transactions: allTransactions,
    loading,
    createTransaction,
    addSavingsGoal,
    updateSavingsGoal,
    refreshData: fetchData,
    updatePin,
    verifyPin,
    hasPin,
  };
};
