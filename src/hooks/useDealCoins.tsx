import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface DealCoinsData {
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

export interface CoinTransaction {
  id: string;
  amount: number;
  type: "earned" | "spent" | "refund";
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
      const { data, error } = await supabase
        .from("deal_coins")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        return;
      }

      if (data) {
        setCoins({
          balance: data.balance,
          totalEarned: data.total_earned,
          totalSpent: data.total_spent,
        });
      }
    } catch (err) {
      console.error(err);
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
        .from("deal_coins_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        return;
      }

      setTransactions(data as CoinTransaction[]);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    fetchCoins();
    fetchTransactions();
  }, [fetchCoins, fetchTransactions]);

  return {
    coins,
    transactions,
    isLoading,
    refetchCoins: fetchCoins,
  };
};
