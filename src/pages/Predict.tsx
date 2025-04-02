
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import StockSelector from "@/components/StockSelector";
import StockChart from "@/components/StockChart";
import ModelAccuracyChart from "@/components/ModelAccuracyChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { 
  fetchStockData, 
  fetchHistoricalData, 
  fetchPredictions,
  StockData 
} from "@/services/stockService";

const Predict = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialModel = searchParams.get("model") || "arima";
  
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [daysToPredict, setDaysToPredict] = useState(7);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [predictionResults, setPredictionResults] = useState<any>(null);
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

  // Generate future prediction data for chart
  const generatePredictionChartData = (days: number, startPrice: number) => {
    let price = startPrice;
    const result = [];
    
    const today = new Date();
    
    for (let i = 1; i <= days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      // Add some randomness to create a trend
      const change = (Math.random() - 0.5) * 0.03;
      price = price * (1 + change);
      
      result.push({
        symbol: selectedStock,
        open: price,
        high: price * 1.01,
        low: price * 0.99,
        close: price,
        volume: Math.floor(Math.random() * 10000000),
        date: date.toISOString().split('T')[0],
        change: 0,
        changePercent: 0
      });
    }
    
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchStockData(selectedStock);
        const historical = await fetchHistoricalData(selectedStock, 60);
        
        setStockData(data);
        setHistoricalData(historical);
        
        // Reset prediction results when stock changes
        setPredictionResults(null);
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

  useEffect(() => {
    // Update URL when model changes
    setSearchParams({ model: selectedModel });
  }, [selectedModel, setSearchParams]);

  const handleStockChange = (value: string) => {
    setSelectedStock(value);
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 30) {
      setDaysToPredict(value);
    }
  };

  const handlePredict = async () => {
    try {
      setPredicting(true);
      
      // In a real app, this would be an API call to a backend that runs the model
      // For the demo, we'll simulate a prediction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const predictions = await fetchPredictions(selectedStock);
      const predictedData = generatePredictionChartData(
        daysToPredict, 
        stockData?.close || 300
      );
      
      // Get prediction model-specific results
      let modelResult;
      switch (selectedModel) {
        case 'arima':
          modelResult = predictions.ARIMA;
          break;
        case 'lstm':
          modelResult = predictions.LSTM;
          break;
        case 'linear':
          modelResult = predictions.LINEAR;
          break;
        default:
          modelResult = predictions.ARIMA;
      }
      
      // Create a results object with both model-specific and extended predictions
      const results = {
        nextDayPrediction: modelResult,
        extendedPredictions: predictedData,
        model: selectedModel,
        accuracy: modelResult.mape,
        recommendation: modelResult.predictedClose > (stockData?.close || 0) ? 'BUY' : 'SELL'
      };
      
      setPredictionResults(results);
      
      toast({
        title: "Prediction Complete",
        description: `Successfully generated ${daysToPredict}-day prediction using ${selectedModel.toUpperCase()} model.`,
      });
    } catch (error) {
      console.error("Error generating prediction:", error);
      toast({
        title: "Error",
        description: "Failed to generate prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPredicting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Stock Price Prediction</h1>
            <p className="text-gray-500">Use advanced ML models to predict future stock prices</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Model Selection & Settings */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Prediction Settings</CardTitle>
                <CardDescription>Select stock and configure prediction parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handlePredict(); }}>
                  <div className="space-y-6">
                    {/* Stock Selection */}
                    <div>
                      <Label htmlFor="stock-select">Stock Symbol</Label>
                      <div className="mt-2">
                        <StockSelector value={selectedStock} onChange={handleStockChange} />
                      </div>
                    </div>
                    
                    {/* Model Selection */}
                    <div>
                      <Label>Prediction Model</Label>
                      <Tabs 
                        value={selectedModel} 
                        onValueChange={handleModelChange}
                        className="mt-2"
                      >
                        <TabsList className="grid grid-cols-3">
                          <TabsTrigger value="arima">ARIMA</TabsTrigger>
                          <TabsTrigger value="lstm">LSTM</TabsTrigger>
                          <TabsTrigger value="linear">Linear</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="arima" className="mt-4">
                          <p className="text-sm text-gray-600">
                            ARIMA (Auto-Regressive Integrated Moving Average) excels at capturing temporal dependencies in time series data.
                          </p>
                        </TabsContent>
                        
                        <TabsContent value="lstm" className="mt-4">
                          <p className="text-sm text-gray-600">
                            LSTM (Long Short-Term Memory) neural networks are designed to learn long-term dependencies in sequential data.
                          </p>
                        </TabsContent>
                        
                        <TabsContent value="linear" className="mt-4">
                          <p className="text-sm text-gray-600">
                            Linear Regression identifies the linear relationship between features and predicts future values based on this relationship.
                          </p>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    {/* Prediction Days */}
                    <div>
                      <Label htmlFor="days">Days to Predict (1-30)</Label>
                      <Input
                        id="days"
                        type="number"
                        min={1}
                        max={30}
                        value={daysToPredict}
                        onChange={handleDaysChange}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Note: Longer prediction horizons may reduce accuracy
                      </p>
                    </div>
                    
                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full bg-stock-orange hover:bg-orange-600"
                      disabled={loading || predicting}
                    >
                      {predicting ? "Generating Prediction..." : "Generate Prediction"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Current Stock Price Card */}
            {!loading && stockData && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Current Stock Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Symbol:</span>
                      <span className="font-medium">{stockData.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Price:</span>
                      <span className="font-medium">${stockData.close.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Open:</span>
                      <span className="font-medium">${stockData.open.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">High:</span>
                      <span className="font-medium">${stockData.high.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Low:</span>
                      <span className="font-medium">${stockData.low.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Change:</span>
                      <span className={`font-medium ${stockData.change >= 0 ? 'text-stock-green' : 'text-stock-red'}`}>
                        {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.change >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Historical Chart & Prediction Results */}
          <div className="lg:col-span-2">
            {/* Historical Price Chart */}
            {loading ? (
              <Skeleton className="h-96 w-full rounded-lg" />
            ) : (
              <StockChart 
                data={historicalData} 
                title={`${selectedStock} Historical Price Data`}
                height={400}
              />
            )}
            
            {/* Model Accuracy Chart */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Model Accuracy</h3>
              {loading ? (
                <Skeleton className="h-80 w-full rounded-lg" />
              ) : (
                selectedModel === 'arima' ? (
                  <ModelAccuracyChart 
                    title="ARIMA Model Accuracy" 
                    data={arimaAccuracyData}
                    color="#10b981"
                  />
                ) : selectedModel === 'lstm' ? (
                  <ModelAccuracyChart 
                    title="LSTM Model Accuracy" 
                    data={lstmAccuracyData}
                    color="#3b82f6"
                  />
                ) : (
                  <ModelAccuracyChart 
                    title="Linear Regression Model Accuracy" 
                    data={linearAccuracyData}
                    color="#ef4444"
                  />
                )
              )}
            </div>
            
            {/* Prediction Results */}
            {predictionResults && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Prediction Results</h3>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {daysToPredict}-Day Price Prediction for {selectedStock}
                    </CardTitle>
                    <CardDescription>
                      Using {selectedModel.toUpperCase()} model with {predictionResults.accuracy.toFixed(2)}% MAPE
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-8">
                      <div className="mb-4 md:mb-0">
                        <span className="text-gray-500 block mb-1">Tomorrow's Predicted Price:</span>
                        <span className="text-3xl font-bold">
                          ${predictionResults.nextDayPrediction.predictedClose.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <span className="text-gray-500 mb-1">Recommendation:</span>
                        <span className={`text-lg font-bold px-4 py-1 rounded-full ${
                          predictionResults.recommendation === 'BUY' ? 
                            'bg-green-100 text-green-700' : 
                            'bg-red-100 text-red-700'
                        }`}>
                          {predictionResults.recommendation}
                        </span>
                      </div>
                    </div>
                    
                    {/* Prediction Chart */}
                    <div className="mt-4">
                      <StockChart 
                        data={predictionResults.extendedPredictions} 
                        title={`${daysToPredict}-Day Price Prediction`}
                        height={300}
                      />
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mt-6">
                      <h4 className="font-medium text-blue-800 mb-2">Prediction Details</h4>
                      <p className="text-sm text-blue-700">
                        This prediction was generated using the {selectedModel.toUpperCase()} model based on historical data patterns. 
                        The model has a Mean Absolute Percentage Error (MAPE) of {predictionResults.accuracy.toFixed(2)}%. 
                        Remember that all predictions come with inherent uncertainty and should be used as one of many factors in investment decisions.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Predict;
