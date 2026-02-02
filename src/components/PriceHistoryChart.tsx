import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { TrendingDown, TrendingUp, Minus, Calendar, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PriceHistoryData {
  date: string;
  [store: string]: string | number;
}

interface PriceHistoryChartProps {
  productName: string;
  stores: string[];
  currentPrice: number;
}

// Store colors for chart lines
const storeColors: Record<string, string> = {
  "Amazon": "#FF9900",
  "Flipkart": "#2874F0",
  "Croma": "#0A6847",
  "Reliance Digital": "#E31837",
  "Tata CLiQ": "#7B2D8E",
  "JioMart": "#0F4DA8",
  "Apple Store": "#555555",
  "Samsung Store": "#1428A0",
  "Vijay Sales": "#FF6B00",
};

const getStoreColor = (store: string): string => {
  return storeColors[store] || `hsl(${Math.random() * 360}, 70%, 50%)`;
};

// Generate mock historical data
const generateMockPriceHistory = (
  basePrice: number, 
  stores: string[], 
  days: number = 30
): PriceHistoryData[] => {
  const data: PriceHistoryData[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i -= Math.ceil(days / 10)) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const entry: PriceHistoryData = {
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    };
    
    stores.forEach((store, storeIndex) => {
      // Create some price variation over time
      const variation = Math.sin(i / 5 + storeIndex) * 0.1 + (Math.random() - 0.5) * 0.05;
      const storeVariation = (storeIndex - stores.length / 2) * 0.02;
      const price = Math.round(basePrice * (1 + variation + storeVariation));
      entry[store] = price;
    });
    
    data.push(entry);
  }
  
  return data;
};

export const PriceHistoryChart = ({ productName, stores, currentPrice }: PriceHistoryChartProps) => {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryData[]>([]);
  const [timeRange, setTimeRange] = useState<string>("30");
  const [isLoading, setIsLoading] = useState(true);
  const [priceStats, setPriceStats] = useState<{
    lowest: number;
    highest: number;
    average: number;
    trend: 'up' | 'down' | 'stable';
  } | null>(null);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      setIsLoading(true);
      
      try {
        // Try to fetch from database first
        const { data, error } = await supabase
          .from('price_history')
          .select('*')
          .ilike('product_name', `%${productName.substring(0, 20)}%`)
          .gte('recorded_at', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString())
          .order('recorded_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          // Transform database data to chart format
          const groupedData: Record<string, Record<string, number>> = {};
          data.forEach(record => {
            const date = new Date(record.recorded_at).toLocaleDateString('en-IN', { 
              day: '2-digit', 
              month: 'short' 
            });
            if (!groupedData[date]) groupedData[date] = {};
            groupedData[date][record.store] = record.price;
          });
          
          const chartData = Object.entries(groupedData).map(([date, prices]) => ({
            date,
            ...prices
          }));
          
          setPriceHistory(chartData);
        } else {
          // Use mock data
          const mockData = generateMockPriceHistory(currentPrice, stores.slice(0, 5), parseInt(timeRange));
          setPriceHistory(mockData);
        }
      } catch (error) {
        console.error('Error fetching price history:', error);
        const mockData = generateMockPriceHistory(currentPrice, stores.slice(0, 5), parseInt(timeRange));
        setPriceHistory(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceHistory();
  }, [productName, stores, currentPrice, timeRange]);

  // Calculate price statistics
  useEffect(() => {
    if (priceHistory.length === 0) return;

    const allPrices: number[] = [];
    priceHistory.forEach(entry => {
      Object.entries(entry).forEach(([key, value]) => {
        if (key !== 'date' && typeof value === 'number') {
          allPrices.push(value);
        }
      });
    });

    if (allPrices.length === 0) return;

    const lowest = Math.min(...allPrices);
    const highest = Math.max(...allPrices);
    const average = Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length);

    // Determine trend
    const firstHalf = allPrices.slice(0, Math.floor(allPrices.length / 2));
    const secondHalf = allPrices.slice(Math.floor(allPrices.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (secondAvg > firstAvg * 1.02) trend = 'up';
    else if (secondAvg < firstAvg * 0.98) trend = 'down';

    setPriceStats({ lowest, highest, average, trend });
  }, [priceHistory]);

  const displayStores = stores.slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold mb-2 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.stroke }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">₹{entry.value?.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Price History
          </CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price Stats */}
        {priceStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-muted-foreground mb-1">Lowest Price</p>
              <p className="text-lg font-bold text-green-500">
                ₹{priceStats.lowest.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-muted-foreground mb-1">Highest Price</p>
              <p className="text-lg font-bold text-destructive">
                ₹{priceStats.highest.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted border border-border">
              <p className="text-xs text-muted-foreground mb-1">Average Price</p>
              <p className="text-lg font-bold">
                ₹{priceStats.average.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Price Trend</p>
              <div className="flex items-center gap-1">
                {priceStats.trend === 'down' && (
                  <>
                    <TrendingDown className="h-5 w-5 text-green-500" />
                    <span className="font-bold text-green-500">Falling</span>
                  </>
                )}
                {priceStats.trend === 'up' && (
                  <>
                    <TrendingUp className="h-5 w-5 text-destructive" />
                    <span className="font-bold text-destructive">Rising</span>
                  </>
                )}
                {priceStats.trend === 'stable' && (
                  <>
                    <Minus className="h-5 w-5 text-muted-foreground" />
                    <span className="font-bold text-muted-foreground">Stable</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="circle"
                  iconSize={8}
                />
                {displayStores.map((store) => (
                  <Line
                    key={store}
                    type="monotone"
                    dataKey={store}
                    stroke={getStoreColor(store)}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Store Legend with current prices */}
        <div className="flex flex-wrap gap-2 pt-2">
          {displayStores.map((store) => (
            <Badge 
              key={store} 
              variant="outline" 
              className="flex items-center gap-1.5"
              style={{ borderColor: getStoreColor(store) }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getStoreColor(store) }}
              />
              <Store className="h-3 w-3" />
              {store}
            </Badge>
          ))}
        </div>

        {/* Buy Recommendation */}
        {priceStats && currentPrice <= priceStats.average && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-start gap-3">
            <TrendingDown className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-500 text-sm">Good time to buy!</p>
              <p className="text-xs text-muted-foreground">
                Current price is below the {timeRange}-day average. This could be a good deal!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
