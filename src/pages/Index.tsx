
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import StockSelector from "@/components/StockSelector";
import StockCard from "@/components/StockCard";
import StockChart from "@/components/StockChart";
import StockPricesList from "@/components/StockPricesList";
import { fetchStockData, fetchHistoricalData, StockData } from "@/services/stockService";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchStockData(selectedStock);
        const historical = await fetchHistoricalData(selectedStock, 30);
        setStockData(data);
        setHistoricalData(historical);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch stock data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStock, toast]);

  const handleStockChange = (value: string) => {
    setSelectedStock(value);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-stock-blue text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('/lovable-uploads/aa6db145-a117-4c3a-a001-3780737c840a.png')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">STOCK MARKET PREDICTION</h1>
            <p className="text-xl md:text-2xl mb-8">
              WELCOME TO THE FUTURE OF INVESTING!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-stock-orange hover:bg-orange-600">
                <Link to="/predict">
                  Predict Stock Prices <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* All Stocks Prices Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <StockPricesList />
        </div>
      </section>

      {/* Quick Stock View */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">Quick Stock Analysis</h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Select Stock:</span>
              <StockSelector value={selectedStock} onChange={handleStockChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stock Data Card */}
            <div className="md:col-span-1">
              {loading ? (
                <Card className="h-full animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3 w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ) : (
                stockData && <StockCard data={stockData} />
              )}
              <div className="mt-6">
                <Button asChild className="w-full bg-stock-blue hover:bg-blue-800">
                  <Link to={`/dashboard?symbol=${selectedStock}`}>View Detailed Analysis</Link>
                </Button>
              </div>
            </div>

            {/* Stock Chart */}
            <div className="md:col-span-2">
              {loading ? (
                <Card className="h-full animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ) : (
                <StockChart 
                  data={historicalData} 
                  title={`${selectedStock} Stock Price History (Last 30 Days)`}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our ML Models & Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-stock-blue">ARIMA Model</h3>
              <p className="text-gray-600 mb-6">
                The ARIMA (AutoRegressive Integrated Moving Average) model excels at 
                capturing temporal dependencies in time series data, making it ideal 
                for short-term stock price predictions.
              </p>
              <div className="mt-auto">
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/predict?model=arima">
                    Try ARIMA Model <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-stock-blue">LSTM Model</h3>
              <p className="text-gray-600 mb-6">
                Our Long Short-Term Memory (LSTM) neural network model addresses 
                the vanishing gradient problem and excels at learning long-term 
                dependencies for more accurate stock trend predictions.
              </p>
              <div className="mt-auto">
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/predict?model=lstm">
                    Try LSTM Model <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-stock-blue">Linear Regression</h3>
              <p className="text-gray-600 mb-6">
                Our Linear Regression model provides baseline predictions by identifying 
                the linear relationship between various factors and stock prices, 
                offering easily interpretable results.
              </p>
              <div className="mt-auto">
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/predict?model=linear">
                    Try Linear Regression <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-stock-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Predict the Future?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Use our advanced ML models to make informed investment decisions 
            based on data-driven predictions and analytics.
          </p>
          <Button asChild size="lg" className="bg-stock-orange hover:bg-orange-600">
            <Link to="/dashboard">
              Explore Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
