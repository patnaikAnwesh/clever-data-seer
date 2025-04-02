
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import StockSelector from "@/components/StockSelector";
import StockCard from "@/components/StockCard";
import StockChart from "@/components/StockChart";
import PredictionCard from "@/components/PredictionCard";
import SentimentChart from "@/components/SentimentChart";
import ModelAccuracyChart from "@/components/ModelAccuracyChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  fetchStockData, 
  fetchHistoricalData, 
  fetchPredictions, 
  fetchSentimentData, 
  fetchFuturePredictions,
  StockData,
  PredictionData
} from "@/services/stockService";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedStock, setSelectedStock] = useState(searchParams.get("symbol") || "AAPL");
  const [currentTab, setCurrentTab] = useState("overview");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<StockData[]>([]);
  const [predictions, setPredictions] = useState<{ [key: string]: PredictionData } | null>(null);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [futurePredictions, setFuturePredictions] = useState<{ [key: string]: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Generate mock model accuracy data
  const generateModelAccuracyData = (days: number = 30) => {
    const basePrice = 300;
    const result = [];
    
    for (let i = 1; i <= days; i++) {
      const actual = basePrice + Math.sin(i / 5) * 30 + (Math.random() - 0.5) * 10;
      const predicted = actual + (Math.random() - 0.5) * 15;
      result.push({ day: i, actual, predicted });
    }
    
    return result;
  };

  const arimaAccuracyData = generateModelAccuracyData();
  const lstmAccuracyData = generateModelAccuracyData();
  const linearAccuracyData = generateModelAccuracyData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchStockData(selectedStock);
        const historical = await fetchHistoricalData(selectedStock, 90);
        const predictionData = await fetchPredictions(selectedStock);
        const sentiment = await fetchSentimentData(selectedStock);
        const future = await fetchFuturePredictions(selectedStock);
        
        setStockData(data);
        setHistoricalData(historical);
        setPredictions(predictionData);
        setSentimentData(sentiment);
        setFuturePredictions(future);
        
        // Update URL with selected stock
        setSearchParams({ symbol: selectedStock });
      } catch (error) {
        console.error("Error fetching data:", error);
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
  }, [selectedStock, setSearchParams, toast]);

  const handleStockChange = (value: string) => {
    setSelectedStock(value);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Stock Dashboard</h1>
            <p className="text-gray-500">Comprehensive analysis and predictions</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="mr-3 text-gray-700">Select Stock:</span>
            <StockSelector value={selectedStock} onChange={handleStockChange} />
          </div>
        </div>

        {/* Stock Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            stockData && (
              <>
                <Card className="bg-blue-500 text-white">
                  <CardContent className="p-6">
                    <div className="text-sm font-medium">OPEN</div>
                    <div className="text-3xl font-bold my-2">${stockData.open.toFixed(2)}</div>
                    <div className="text-xs">Start of trading day</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-yellow-500 text-white">
                  <CardContent className="p-6">
                    <div className="text-sm font-medium">HIGH</div>
                    <div className="text-3xl font-bold my-2">${stockData.high.toFixed(2)}</div>
                    <div className="text-xs">Highest price today</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-500 text-white">
                  <CardContent className="p-6">
                    <div className="text-sm font-medium">LOW</div>
                    <div className="text-3xl font-bold my-2">${stockData.low.toFixed(2)}</div>
                    <div className="text-xs">Lowest price today</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-red-500 text-white">
                  <CardContent className="p-6">
                    <div className="text-sm font-medium">CLOSE</div>
                    <div className="text-3xl font-bold my-2">${stockData.close.toFixed(2)}</div>
                    <div className="text-xs">Latest trading price</div>
                  </CardContent>
                </Card>
              </>
            )
          )}
        </div>

        {/* Volume Display */}
        {!loading && stockData && (
          <Card className="mb-8 bg-amber-500 text-white">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">VOLUME</div>
                <div className="text-3xl font-bold my-2">
                  {(stockData.volume / 1000000).toFixed(2)}M
                </div>
                <div className="text-xs">Total shares traded today</div>
              </div>
              <div className="text-5xl md:text-6xl font-bold opacity-50">VOL</div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="overview" value={currentTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="models">Model Accuracy</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stock Card and Details */}
              <div className="lg:col-span-1">
                {loading ? (
                  <Skeleton className="h-64 w-full rounded-lg" />
                ) : (
                  stockData && <StockCard data={stockData} />
                )}
                
                {/* Price History Card */}
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Price History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-40 w-full rounded-lg" />
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm">
                            <div className="text-gray-500">7-day Change</div>
                            <div className="font-medium text-stock-green">+2.34%</div>
                          </div>
                          <div className="text-sm">
                            <div className="text-gray-500">30-day Change</div>
                            <div className="font-medium text-stock-red">-1.89%</div>
                          </div>
                          <div className="text-sm">
                            <div className="text-gray-500">90-day Change</div>
                            <div className="font-medium text-stock-green">+8.76%</div>
                          </div>
                          <div className="text-sm">
                            <div className="text-gray-500">YTD Change</div>
                            <div className="font-medium text-stock-green">+12.45%</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Stock Chart */}
              <div className="lg:col-span-2">
                {loading ? (
                  <Skeleton className="h-96 w-full rounded-lg" />
                ) : (
                  <StockChart 
                    data={historicalData} 
                    title={`${selectedStock} Stock Price History (Last 90 Days)`}
                    height={400}
                    showVolume={true}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          {/* Predictions Tab Content */}
          <TabsContent value="predictions" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prediction Cards */}
              <div>
                <h3 className="text-xl font-bold mb-4">Tomorrow's Predictions</h3>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-40 w-full rounded-lg" />
                    ))}
                  </div>
                ) : (
                  predictions && stockData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <PredictionCard 
                        data={predictions.ARIMA} 
                        currentPrice={stockData.close}
                        colorScheme="green"
                      />
                      <PredictionCard 
                        data={predictions.LSTM} 
                        currentPrice={stockData.close}
                        colorScheme="blue"
                      />
                      <PredictionCard 
                        data={predictions.LINEAR} 
                        currentPrice={stockData.close}
                        colorScheme="red"
                      />
                    </div>
                  )
                )}
                
                {/* Prediction Statistics */}
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Prediction Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-40 w-full rounded-lg" />
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-500">ARIMA MAPE</div>
                          <div className="text-xl font-bold text-green-500">9.81%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">LSTM MAPE</div>
                          <div className="text-xl font-bold text-blue-500">18.79%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">LINEAR MAPE</div>
                          <div className="text-xl font-bold text-red-500">26.76%</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* 7-Day Predictions */}
              <div>
                <h3 className="text-xl font-bold mb-4">7-Day Price Forecast</h3>
                <Card>
                  <CardContent className="p-6">
                    {loading ? (
                      <Skeleton className="h-80 w-full rounded-lg" />
                    ) : (
                      futurePredictions && (
                        <div>
                          <div className="mb-6">
                            <div className="flex items-center justify-between border-b pb-3 mb-3">
                              <div className="text-gray-500">#</div>
                              <div className="text-gray-500">Close</div>
                            </div>
                            {Object.entries(futurePredictions).map(([day, price]) => (
                              <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div className="font-medium">Day {day}</div>
                                <div className="font-bold">${price.toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="text-center mt-4">
                            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              <span className="font-medium">
                                {futurePredictions['7'] > (stockData?.close || 0) ? 'Upward Trend' : 'Downward Trend'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
                
                {/* Recommendation */}
                {!loading && predictions && (
                  <Card className="mt-6 bg-blue-500 text-white">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-medium mb-2">Recommendation</h4>
                      <p className="text-sm mb-4">
                        According to our ML Predictions & Sentiment Analysis of the Tweets, 
                        a RISE in {selectedStock} stock is expected.
                      </p>
                      <div className="text-2xl font-bold text-center py-2 bg-white/10 rounded">
                        BUY
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Model Accuracy Tab Content */}
          <TabsContent value="models" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ModelAccuracyChart 
                title="ARIMA Model Accuracy" 
                data={arimaAccuracyData}
                color="#10b981"
              />
              <ModelAccuracyChart 
                title="LSTM Model Accuracy" 
                data={lstmAccuracyData}
                color="#3b82f6"
              />
              <ModelAccuracyChart 
                title="Linear Regression Model Accuracy" 
                data={linearAccuracyData}
                color="#ef4444"
              />
            </div>
          </TabsContent>

          {/* Sentiment Analysis Tab Content */}
          <TabsContent value="sentiment" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sentiment Chart */}
              <div>
                {loading ? (
                  <Skeleton className="h-80 w-full rounded-lg" />
                ) : (
                  sentimentData && (
                    <SentimentChart 
                      data={sentimentData} 
                      title={`${selectedStock} Tweet Sentiment Analysis`}
                    />
                  )
                )}
              </div>
              
              {/* Recent Tweets */}
              <div>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Tweets About {selectedStock}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {Array(5).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full rounded-lg" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">@marketanalyst</div>
                              <div className="text-sm text-gray-600 mt-1">
                                ${selectedStock} showing strong resistance at current levels. Technical indicators suggest a potential breakout in coming sessions. #StockMarket #TechnicalAnalysis
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">@investorTips</div>
                              <div className="text-sm text-gray-600 mt-1">
                                Have added earnings and dividends data on hotfolio for individual companies e.g. ${selectedStock}. Check out our new features!
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">@stockinvestor</div>
                              <div className="text-sm text-gray-600 mt-1">
                                ${selectedStock} quarterly results exceeded expectations. Revenue up 8.1% YoY and EPS growth at 12.3%. Management guidance positive for next quarter. #Earnings #StockNews
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">@tradingexpert</div>
                              <div className="text-sm text-gray-600 mt-1">
                                Just bought more ${selectedStock} on this dip. The company's fundamentals remain strong and their new product line looks promising. Long-term bullish! #Investing
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">@financeNews</div>
                              <div className="text-sm text-gray-600 mt-1">
                                Breaking: ${selectedStock} announces new partnership with leading tech firm to enhance their AI capabilities. Stock up 2.3% in pre-market trading. #StockMarket #TechNews
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
