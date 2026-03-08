import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GalaxyButton } from "@/components/ui/galaxy-button";
import { 
  ScanLine, Camera, CameraOff, Keyboard, Loader2, 
  AlertCircle, ShoppingCart, Star, Tag, BarChart3, ExternalLink 
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface BarcodeProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: string | null;
  store: string;
  category: string;
  description: string;
  image: string | null;
  link: string | null;
  source: string;
  brand?: string;
}

const BarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [products, setProducts] = useState<BarcodeProduct[]>([]);
  const [isLooking, setIsLooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsScanning(false);
  };

  const startScanner = async () => {
    if (!user) {
      toast.error("Please sign in to use the scanner");
      navigate("/sign-in");
      return;
    }

    setError(null);
    setProducts([]);
    setScannedBarcode(null);

    try {
      const html5QrCode = new Html5Qrcode("barcode-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: Math.min(280, window.innerWidth - 80), height: 150 }, aspectRatio: 1.777 },
        (decodedText) => {
          handleBarcodeScan(decodedText);
          stopScanner();
        },
        () => {} // ignore scan failures
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Scanner error:", err);
      setError("Camera access denied or not available. Try entering the barcode manually.");
      setShowManual(true);
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    setScannedBarcode(barcode);
    await lookupBarcode(barcode);
  };

  const handleManualSubmit = async () => {
    if (!manualBarcode.trim()) {
      toast.error("Please enter a barcode");
      return;
    }
    if (!user) {
      toast.error("Please sign in to use the scanner");
      navigate("/sign-in");
      return;
    }
    setScannedBarcode(manualBarcode.trim());
    await lookupBarcode(manualBarcode.trim());
  };

  const lookupBarcode = async (barcode: string) => {
    setIsLooking(true);
    setError(null);
    setProducts([]);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        toast.error("Session expired. Please sign in again.");
        navigate("/sign-in");
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke('barcode-lookup', {
        body: { barcode },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (fnError) {
        console.error('Barcode lookup error:', fnError);
        setError('Failed to look up barcode. Try searching manually.');
        return;
      }

      if (data?.error) {
        setError(data.message || 'Product not found for this barcode.');
        return;
      }

      if (data?.products?.length > 0) {
        setProducts(data.products);
        toast.success(`Found ${data.products.length} result(s) for barcode ${barcode}`);
      }
    } catch (err) {
      console.error('Lookup error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLooking(false);
    }
  };

  const handleCompare = (product: BarcodeProduct) => {
    navigate(`/compare-prices?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image || '')}&store=${encodeURIComponent(product.store)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <ScanLine className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-semibold text-sm sm:text-base">Barcode & QR Scanner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            Scan to Compare Prices
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Scan any product barcode or QR code to instantly find and compare prices across stores
          </p>
        </div>

        {/* Scanner Area */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div 
              id="barcode-reader" 
              className={`w-full ${isScanning ? 'min-h-[300px]' : 'hidden'}`}
            />

            {!isScanning && !scannedBarcode && (
              <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <ScanLine className="h-12 w-12 text-primary" />
                </div>
                <GalaxyButton onClick={startScanner} className="px-8 py-3 text-lg">
                  <Camera className="h-5 w-5 mr-2" />
                  Start Camera Scanner
                </GalaxyButton>
                <Button variant="outline" onClick={() => setShowManual(!showManual)}>
                  <Keyboard className="h-4 w-4 mr-2" />
                  Enter Barcode Manually
                </Button>
              </div>
            )}

            {isScanning && (
              <div className="p-4 flex justify-center">
                <Button variant="destructive" onClick={stopScanner}>
                  <CameraOff className="h-4 w-4 mr-2" />
                  Stop Scanner
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Input */}
        {showManual && !isScanning && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter barcode number (e.g., 8901030865992)"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                  className="flex-1"
                />
                <GalaxyButton onClick={handleManualSubmit} disabled={isLooking}>
                  {isLooking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lookup"}
                </GalaxyButton>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scanned Barcode Display */}
        {scannedBarcode && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="secondary" className="text-base px-4 py-1.5">
              Barcode: {scannedBarcode}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => { 
              setScannedBarcode(null); 
              setProducts([]); 
              setError(null); 
            }}>
              Scan Another
            </Button>
          </div>
        )}

        {/* Loading */}
        {isLooking && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Looking up product...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="mb-6 border-destructive/50">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-destructive font-medium">{error}</p>
                <Button variant="link" className="p-0 h-auto text-sm" onClick={() => {
                  setShowManual(true);
                  setError(null);
                }}>
                  Try entering the barcode manually
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {products.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              Results ({products.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg bg-muted shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>

                        {product.price > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg font-bold text-primary">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        )}

                        {product.discount > 0 && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <Tag className="h-3 w-3 mr-1" />{product.discount}% off
                          </Badge>
                        )}

                        <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                          {product.rating && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {product.rating}
                            </span>
                          )}
                          {product.store && (
                            <span className="flex items-center gap-1">
                              <ShoppingCart className="h-3 w-3" />
                              {product.store}
                            </span>
                          )}
                          <Badge variant="outline" className="text-[10px]">{product.source}</Badge>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="text-xs" onClick={() => handleCompare(product)}>
                            <BarChart3 className="h-3 w-3 mr-1" />Compare
                          </Button>
                          {product.link && (
                            <Button size="sm" variant="outline" className="text-xs" asChild>
                              <a href={product.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />Visit
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BarcodeScanner;
