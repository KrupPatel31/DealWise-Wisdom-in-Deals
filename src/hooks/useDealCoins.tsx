import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface DealCoinsData {
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

export interface CoinTransaction {
  id: string;
  amount: number;
  type: 'earned' | 'spent' | 'refund';
  description: string | null;
  order_id: string | null;
  created_at: string;
}

// Earn rate: 2% of order total as coins (1 coin = 1 rupee)
export const COIN_EARN_RATE = 0.02;

export const useDealCoins = () => {
  const { user } = useAuth();
  const [coins, setCoins] = useState<DealCoinsData>({
    balance: 0,
    totalEarned: 0,
    totalSpent: 0,
  });
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoins = useCallback(async () => {
    if (!user) {
      setCoins({ balance: 0, totalEarned: 0, totalSpent: 0 });
      setIsLoading(false);
      return;
    }

    try {
      // Get or create user's coin balance
      const { data, error } = await supabase
        .from('deal_coins')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching coins:', error);
        return;
      }

      if (data) {
        setCoins({
          balance: data.balance,
          totalEarned: data.total_earned,
          totalSpent: data.total_spent,
        });
      } else {
        // Create initial record for user
        const { error: insertError } = await supabase
          .from('deal_coins')
          .insert({
            user_id: user.id,
            balance: 0,
            total_earned: 0,
            total_spent: 0,
          });

        if (insertError && insertError.code !== '23505') {
          // Ignore duplicate key error
          console.error('Error creating coins record:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in fetchCoins:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('deal_coins_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions(data as CoinTransaction[]);
    } catch (error) {
      console.error('Error in fetchTransactions:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchCoins();
    fetchTransactions();
  }, [fetchCoins, fetchTransactions]);

  // Function to spend coins (returns the updated balance after spending)
  const spendCoins = async (amount: number, orderId: string): Promise<boolean> => {
    if (!user || amount <= 0 || amount > coins.balance) {
      return false;
    }

    try {
      // Update balance
      const newBalance = coins.balance - amount;
      const newTotalSpent = coins.totalSpent + amount;

      const { error: updateError } = await supabase
        .from('deal_coins')
        .update({
          balance: newBalance,
          total_spent: newTotalSpent,
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error spending coins:', updateError);
        return false;
      }

      // Record transaction
      await supabase.from('deal_coins_transactions').insert({
        user_id: user.id,
        amount: -amount,
        type: 'spent',
        description: 'Used at checkout',
        order_id: orderId,
      });

      // Update local state
      setCoins({
        balance: newBalance,
        totalEarned: coins.totalEarned,
        totalSpent: newTotalSpent,
      });

      return true;
    } catch (error) {
      console.error('Error in spendCoins:', error);
      return false;
    }
  };

  // Function to earn coins (called after successful order)
  const earnCoins = async (orderTotal: number, orderId: string): Promise<number> => {
    if (!user || orderTotal <= 0) {
      return 0;
    }

    const coinsToEarn = Math.floor(orderTotal * COIN_EARN_RATE);
    if (coinsToEarn <= 0) return 0;

    try {
      // First ensure user has a coins record
      const { data: existingData } = await supabase
        .from('deal_coins')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!existingData) {
        // Create initial record
        const { error: insertError } = await supabase
          .from('deal_coins')
          .insert({
            user_id: user.id,
            balance: coinsToEarn,
            total_earned: coinsToEarn,
            total_spent: 0,
          });

        if (insertError) {
          console.error('Error creating coins with earning:', insertError);
          return 0;
        }
      } else {
        // Update existing balance
        const newBalance = existingData.balance + coinsToEarn;
        const newTotalEarned = existingData.total_earned + coinsToEarn;

        const { error: updateError } = await supabase
          .from('deal_coins')
          .update({
            balance: newBalance,
            total_earned: newTotalEarned,
          })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error earning coins:', updateError);
          return 0;
        }
      }

      // Record transaction
      await supabase.from('deal_coins_transactions').insert({
        user_id: user.id,
        amount: coinsToEarn,
        type: 'earned',
        description: `Earned from order`,
        order_id: orderId,
      });

      // Refresh local state
      await fetchCoins();

      return coinsToEarn;
    } catch (error) {
      console.error('Error in earnCoins:', error);
      return 0;
    }
  };

  return {
    coins,
    transactions,
    isLoading,
    spendCoins,
    earnCoins,
    refetchCoins: fetchCoins,
  };
};
