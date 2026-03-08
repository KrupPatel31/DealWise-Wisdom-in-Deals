import { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDealCoins } from "@/hooks/useDealCoins";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingBag, CalendarCheck, Users, Star, Zap, Gift,
  ArrowRight, Clock, TrendingUp, Coins, Copy, Check, Loader2,
} from "lucide-react";

const AnimatedCounter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (target <= 0) { setCount(0); return; }
    let start = 0;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const SpinningCoin = () => (
  <div className="deal-coin-purse">
    <div className="deal-coin">
      <div className="deal-coin-front" />
      <div className="deal-coin-back" />
      <div className="deal-coin-side">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="deal-coin-spoke" />
        ))}
      </div>
    </div>
  </div>
);

const redemptionOptions = [
  { title: "Flat Discount", desc: "Use coins at checkout — 1 coin = ₹1 off", icon: Gift },
  { title: "Free Shipping", desc: "Redeem 100 coins for free delivery", icon: TrendingUp },
  { title: "Exclusive Access", desc: "Unlock members-only flash sales", icon: Zap },
];

const DealCoins = () => {
  const { user } = useAuth();
  const { coins, transactions, isLoading, refetchCoins } = useDealCoins();
  const { toast } = useToast();

  const [dailyClaimLoading, setDailyClaimLoading] = useState(false);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralInput, setReferralInput] = useState("");
  const [useReferralLoading, setUseReferralLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const balance = user ? coins.balance : 1250;
  const totalEarned = user ? coins.totalEarned : 2400;
  const totalSpent = user ? coins.totalSpent : 1150;

  // Check daily claim status on mount
  useEffect(() => {
    if (!user) return;
    const checkDaily = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('daily_login_claims' as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('claimed_date', today)
        .maybeSingle();
      if (data) setDailyClaimed(true);
    };
    checkDaily();
  }, [user]);

  // Load referral code on mount
  useEffect(() => {
    if (!user) return;
    const loadCode = async () => {
      const { data } = await supabase
        .from('referral_codes' as any)
        .select('code')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) setReferralCode((data as any).code);
    };
    loadCode();
  }, [user]);

  const callEarnCoins = useCallback(async (body: any) => {
    const { data, error } = await supabase.functions.invoke('earn-coins', { body });
    if (error) throw error;
    return data;
  }, []);

  const handleDailyClaim = async () => {
    if (!user) { toast({ title: "Please sign in", variant: "destructive" }); return; }
    setDailyClaimLoading(true);
    try {
      const res = await callEarnCoins({ action: 'daily_login' });
      if (res.success) {
        setDailyClaimed(true);
        toast({ title: "🪙 +10 Coins!", description: "Daily login reward claimed!" });
        refetchCoins();
      } else {
        setDailyClaimed(true);
        toast({ title: "Already claimed", description: res.message });
      }
    } catch { toast({ title: "Error", description: "Failed to claim", variant: "destructive" }); }
    setDailyClaimLoading(false);
  };

  const handleGetReferralCode = async () => {
    if (!user) { toast({ title: "Please sign in", variant: "destructive" }); return; }
    setReferralLoading(true);
    try {
      const res = await callEarnCoins({ action: 'claim_referral_code' });
      if (res.success) setReferralCode(res.code);
    } catch { toast({ title: "Error", variant: "destructive" }); }
    setReferralLoading(false);
  };

  const handleUseReferral = async () => {
    if (!user) { toast({ title: "Please sign in", variant: "destructive" }); return; }
    if (!referralInput.trim()) return;
    setUseReferralLoading(true);
    try {
      const res = await callEarnCoins({ action: 'use_referral', code: referralInput.trim() });
      if (res.success) {
        toast({ title: "🪙 +25 Coins!", description: res.message });
        setReferralInput("");
        refetchCoins();
      } else {
        toast({ title: "Failed", description: res.message, variant: "destructive" });
      }
    } catch { toast({ title: "Error", variant: "destructive" }); }
    setUseReferralLoading(false);
  };

  const copyReferralCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({ title: "Copied!", description: "Referral code copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const displayTransactions = user && transactions.length > 0
    ? transactions
    : [
        { id: "1", amount: 50, type: "earned" as const, description: "Order #DW-20250301", order_id: null, created_at: "2025-03-01T10:00:00Z" },
        { id: "2", amount: 20, type: "earned" as const, description: "Product Review Bonus", order_id: null, created_at: "2025-02-28T14:30:00Z" },
        { id: "3", amount: -100, type: "spent" as const, description: "Redeemed at Checkout", order_id: null, created_at: "2025-02-25T09:15:00Z" },
        { id: "4", amount: 10, type: "earned" as const, description: "Daily Login Reward", order_id: null, created_at: "2025-02-24T08:00:00Z" },
        { id: "5", amount: 50, type: "earned" as const, description: "Referral Bonus", order_id: null, created_at: "2025-02-20T16:45:00Z" },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero / Balance */}
      <section className="relative overflow-hidden pt-12 sm:pt-24 pb-10 sm:pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[200px] sm:h-[400px] rounded-full bg-amber-500/10 blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">Deal Coins Wallet</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Earn coins by shopping and redeem them for exclusive rewards.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
            <SpinningCoin />
            <div className="text-center">
              <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest mb-1">Your Balance</p>
              <p className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-amber-400 drop-shadow-[0_0_24px_rgba(251,191,36,0.4)]">
                <AnimatedCounter target={balance} /> <span className="text-2xl sm:text-3xl">🪙</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { label: "Total Earned", value: totalEarned, color: "text-green-400" },
              { label: "Total Spent", value: totalSpent, color: "text-rose-400" },
              { label: "Net Balance", value: balance, color: "text-amber-400" },
            ].map((s) => (
              <Card key={s.label} className="bg-card/60 backdrop-blur-md border-border/40">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earning Methods — Interactive */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-2">How to Earn</h2>
          <p className="text-muted-foreground text-center mb-10">Multiple ways to stack your coins</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Shop Products */}
            <Card className="group bg-card/50 backdrop-blur-md border-border/30 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Shop Products</h3>
                  <p className="text-sm text-muted-foreground">Earn 2% of every purchase as Deal Coins</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-amber-400 font-semibold text-sm">
                  <Coins className="h-4 w-4" /> 2% back — automatic
                </span>
              </CardContent>
            </Card>

            {/* Daily Login */}
            <Card className="group bg-card/50 backdrop-blur-md border-border/30 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 shadow-lg">
                  <CalendarCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Daily Login</h3>
                  <p className="text-sm text-muted-foreground">Visit daily and claim your free coins</p>
                </div>
                <div className="mt-auto w-full">
                  <Button
                    onClick={handleDailyClaim}
                    disabled={dailyClaimed || dailyClaimLoading || !user}
                    className="w-full"
                    size="sm"
                  >
                    {dailyClaimLoading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                      dailyClaimed ? <><Check className="h-4 w-4 mr-1" /> Claimed Today</> :
                      <><Coins className="h-4 w-4 mr-1" /> Claim 10 Coins</>}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Invite Friends */}
            <Card className="group bg-card/50 backdrop-blur-md border-border/30 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Invite Friends</h3>
                  <p className="text-sm text-muted-foreground">Share your referral link and earn 50 coins per friend</p>
                </div>
                <div className="mt-auto w-full space-y-2">
                  {referralCode ? (
                    <div className="flex gap-2">
                      <Input value={referralCode} readOnly className="text-sm font-mono" />
                      <Button size="icon" variant="outline" onClick={copyReferralCode}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleGetReferralCode} disabled={referralLoading || !user} className="w-full" size="sm">
                      {referralLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Referral Code"}
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter friend's code"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value)}
                      className="text-sm"
                    />
                    <Button size="sm" onClick={handleUseReferral} disabled={useReferralLoading || !referralInput.trim() || !user}>
                      {useReferralLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Write Reviews */}
            <Card className="group bg-card/50 backdrop-blur-md border-border/30 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 shadow-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Write Reviews</h3>
                  <p className="text-sm text-muted-foreground">Rate products you've bought and earn 20 coins each</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-amber-400 font-semibold text-sm">
                  <Coins className="h-4 w-4" /> 20 coins per review
                </span>
              </CardContent>
            </Card>

            {/* Special Deals */}
            <Card className="group bg-card/50 backdrop-blur-md border-border/30 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-red-400 shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Special Deals</h3>
                  <p className="text-sm text-muted-foreground">Shop featured deals for bonus coins</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-amber-400 font-semibold text-sm">
                  <Coins className="h-4 w-4" /> Bonus coins on deals
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Redemption Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-2">Redeem Your Coins</h2>
          <p className="text-muted-foreground text-center mb-10">Turn coins into real value</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {redemptionOptions.map((r) => (
              <Card key={r.title} className="bg-gradient-to-br from-card to-card/60 border-border/30 hover:border-amber-500/30 transition-all duration-300 group">
                <CardContent className="p-6 text-center flex flex-col items-center gap-3">
                  <div className="p-4 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                    <r.icon className="h-8 w-8 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{r.title}</h3>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
                    Redeem <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transaction History */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-2">Coin History</h2>
          <p className="text-muted-foreground text-center mb-10">Your recent transactions</p>
          <div className="max-w-2xl mx-auto space-y-3">
            {displayTransactions.map((t) => (
              <Card key={t.id} className="bg-card/50 backdrop-blur-md border-border/30">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${t.type === "earned" ? "bg-green-500/15" : "bg-rose-500/15"}`}>
                      {t.type === "earned" ? <TrendingUp className="h-4 w-4 text-green-400" /> : <Clock className="h-4 w-4 text-rose-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold text-lg ${t.type === "earned" ? "text-green-400" : "text-rose-400"}`}>
                    {t.type === "earned" ? "+" : ""}{Math.abs(t.amount)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DealCoins;
