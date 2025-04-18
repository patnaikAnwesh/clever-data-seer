
// This file will contain the API services to fetch stock data
// It connects to our Python ML API

// Define types
export interface StockData {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  date: string;
  change: number;
  changePercent: number;
}

export interface PredictionData {
  symbol: string;
  date: string;
  predictedClose: number;
  modelType: 'ARIMA' | 'LSTM' | 'LINEAR';
  mape: number; // Mean Absolute Percentage Error
}

export interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
  overall: 'positive' | 'negative' | 'neutral';
}

// Sample stock symbols
export const availableSymbols = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'FB', 'NVDA', 'JPM', 'V', 'JNJ'];

// API base URL - update this to your Python API endpoint
const API_BASE_URL = 'http://localhost:5000/api';

// Flag to use mock data if API is not available
let useMockData = false;

// Helper function to check API availability
const checkApiAvailability = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/AAPL`, { signal: AbortSignal.timeout(3000) });
    return response.ok;
  } catch (error) {
    console.warn('ML API not available, using mock data');
    useMockData = true;
    return false;
  }
};

// Initialize API check
checkApiAvailability();

// Fetch stock data from API
export const fetchStockData = async (symbol: string): Promise<StockData> => {
  if (useMockData) {
    return fetchMockStockData(symbol);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/stock/${symbol}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return fetchMockStockData(symbol);
  }
};

// Fetch historical data from API
export const fetchHistoricalData = async (symbol: string, days: number = 30): Promise<StockData[]> => {
  if (useMockData) {
    return fetchMockHistoricalData(symbol, days);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/historical/${symbol}?days=${days}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return fetchMockHistoricalData(symbol, days);
  }
};

// Fetch predictions from API
export const fetchPredictions = async (symbol: string): Promise<{ [key: string]: PredictionData }> => {
  if (useMockData) {
    return fetchMockPredictions(symbol);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/predictions/${symbol}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return fetchMockPredictions(symbol);
  }
};

// Fetch sentiment data from API
export const fetchSentimentData = async (symbol: string): Promise<SentimentData> => {
  if (useMockData) {
    return fetchMockSentimentData(symbol);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/sentiment/${symbol}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sentiment data:', error);
    return fetchMockSentimentData(symbol);
  }
};

// Fetch future predictions from API
export const fetchFuturePredictions = async (symbol: string, days: number = 7): Promise<{ [key: string]: number }> => {
  if (useMockData) {
    return fetchMockFuturePredictions(symbol, days);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/future/${symbol}?days=${days}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching future predictions:', error);
    return fetchMockFuturePredictions(symbol, days);
  }
};

// Mock data functions (fallback when API is unavailable)
// These are the same as in the original file

const fetchMockStockData = async (symbol: string): Promise<StockData> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate random data or use hardcoded sample data
  const open = Math.random() * 500 + 100;
  const close = open * (1 + (Math.random() * 0.1 - 0.05)); // +/- 5%
  const high = Math.max(open, close) * (1 + Math.random() * 0.03);
  const low = Math.min(open, close) * (1 - Math.random() * 0.03);
  const change = close - open;
  const changePercent = (change / open) * 100;
  
  // For AAPL, use data from image
  if (symbol === 'AAPL') {
    return {
      symbol: 'AAPL',
      open: 316.77,
      high: 323.44,
      low: 315.63, 
      close: 318.25,
      volume: 33390200,
      date: new Date().toISOString().split('T')[0],
      change: 318.25 - 316.77,
      changePercent: ((318.25 - 316.77) / 316.77) * 100
    };
  }
  
  return {
    symbol,
    open,
    high,
    low,
    close,
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    date: new Date().toISOString().split('T')[0],
    change,
    changePercent
  };
};

const fetchMockHistoricalData = async (symbol: string, days: number = 30): Promise<StockData[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const data: StockData[] = [];
  const today = new Date();
  let basePrice = 0;
  
  // For AAPL, use starting price from image
  if (symbol === 'AAPL') {
    basePrice = 316.77;
  } else {
    basePrice = Math.random() * 500 + 100;
  }
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic price movement
    const dailyChange = (Math.random() - 0.5) * 0.02; // -1% to 1% change
    basePrice = basePrice * (1 + dailyChange);
    
    const open = basePrice;
    const close = basePrice * (1 + (Math.random() * 0.02 - 0.01)); // +/- 1%
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const change = close - open;
    
    data.push({
      symbol,
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      date: date.toISOString().split('T')[0],
      change,
      changePercent: (change / open) * 100
    });
    
    // Update base price for next day
    basePrice = close;
  }
  
  return data;
};

const fetchMockPredictions = async (symbol: string): Promise<{ [key: string]: PredictionData }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // For AAPL, use data from image
  if (symbol === 'AAPL') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    return {
      ARIMA: {
        symbol,
        date: tomorrowStr,
        predictedClose: 316.83,
        modelType: 'ARIMA',
        mape: 9.81
      },
      LSTM: {
        symbol,
        date: tomorrowStr,
        predictedClose: 319.17,
        modelType: 'LSTM',
        mape: 18.79
      },
      LINEAR: {
        symbol,
        date: tomorrowStr,
        predictedClose: 333.29,
        modelType: 'LINEAR',
        mape: 26.76
      }
    };
  }
  
  // Generate random prediction data
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const currentPrice = (await fetchMockStockData(symbol)).close;
  const arimaChange = (Math.random() * 0.04 - 0.02); // -2% to 2%
  const lstmChange = (Math.random() * 0.05 - 0.025); // -2.5% to 2.5%
  const linearChange = (Math.random() * 0.06 - 0.03); // -3% to 3%
  
  return {
    ARIMA: {
      symbol,
      date: tomorrow.toISOString().split('T')[0],
      predictedClose: currentPrice * (1 + arimaChange),
      modelType: 'ARIMA',
      mape: Math.random() * 10 + 5 // 5-15% error
    },
    LSTM: {
      symbol,
      date: tomorrow.toISOString().split('T')[0],
      predictedClose: currentPrice * (1 + lstmChange),
      modelType: 'LSTM',
      mape: Math.random() * 15 + 10 // 10-25% error
    },
    LINEAR: {
      symbol,
      date: tomorrow.toISOString().split('T')[0],
      predictedClose: currentPrice * (1 + linearChange),
      modelType: 'LINEAR',
      mape: Math.random() * 20 + 15 // 15-35% error
    }
  };
};

const fetchMockSentimentData = async (symbol: string): Promise<SentimentData> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // For AAPL, use data from image
  if (symbol === 'AAPL') {
    return {
      positive: 50.7,
      negative: 27.3,
      neutral: 22.0,
      overall: 'positive'
    };
  }
  
  // Random sentiment data
  const positive = Math.random() * 60 + 20; // 20-80%
  const negative = Math.random() * (100 - positive) * 0.6; // Up to 60% of remainder
  const neutral = 100 - positive - negative;
  
  let overall: 'positive' | 'negative' | 'neutral';
  if (positive > negative && positive > neutral) {
    overall = 'positive';
  } else if (negative > positive && negative > neutral) {
    overall = 'negative';
  } else {
    overall = 'neutral';
  }
  
  return {
    positive,
    negative,
    neutral,
    overall
  };
};

const fetchMockFuturePredictions = async (symbol: string, days: number = 7): Promise<{ [key: string]: number }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 900));
  
  const predictions: { [key: string]: number } = {};
  const currentPrice = (await fetchMockStockData(symbol)).close;
  let basePrice = currentPrice;
  
  // For AAPL, use data inspired by image
  if (symbol === 'AAPL') {
    return {
      '1': 333.23,
      '2': 334.44,
      '3': 337.12,
      '4': 335.01,
      '5': 337.94,
      '6': 336.71,
      '7': 335.81
    };
  }
  
  for (let i = 1; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Add some randomness but with a trend
    const trend = Math.random() > 0.5 ? 1 : -1;
    const change = (Math.random() * 0.015 + 0.005) * trend;
    basePrice = basePrice * (1 + change);
    
    predictions[i.toString()] = parseFloat(basePrice.toFixed(2));
  }
  
  return predictions;
};
