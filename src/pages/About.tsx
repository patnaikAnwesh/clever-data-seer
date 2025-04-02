
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About JHS</h1>
          
          <div className="flex flex-col md:flex-row items-center mb-16">
            <div className="md:w-1/3 mb-6 md:mb-0 md:pr-8">
              <img 
                src="/lovable-uploads/c0a5d0d3-3af9-4c5a-b0fa-f81460aeab8d.png" 
                alt="JHS Logo" 
                className="mx-auto w-40 h-40"
              />
            </div>
            <div className="md:w-2/3">
              <p className="text-lg mb-4">
                JHS was started with a common goal of serving the finance community while maintaining integrity. Our members bring to table their unique expertise and experience of stock market which they would like to pass on to future investors.
              </p>
              <p className="text-lg">
                We leverage cutting-edge machine learning technologies to provide accurate stock price predictions and market insights, helping investors make more informed decisions.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Our Machine Learning Models</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-green-700">ARIMA Model</h3>
                <p className="text-gray-700">
                  ARIMA (AutoRegressive Integrated Moving Average) is a statistical model used for time series forecasting. It combines autoregression, differencing, and moving average components to model temporal dependencies in the data.
                </p>
                <div className="mt-4 text-sm text-green-800 font-medium">
                  Best for: Short-term predictions and capturing seasonal patterns
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-blue-700">LSTM Model</h3>
                <p className="text-gray-700">
                  LSTM (Long Short-Term Memory) is a type of recurrent neural network designed to learn and remember over long sequences. It has the ability to remember information for long periods and is well-suited for time series prediction.
                </p>
                <div className="mt-4 text-sm text-blue-800 font-medium">
                  Best for: Learning complex patterns and long-term dependencies
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-red-700">Linear Regression Model</h3>
                <p className="text-gray-700">
                  Linear Regression is a fundamental statistical method that analyzes the linear relationship between a dependent variable and one or more independent variables. It provides a baseline for comparison with more complex models.
                </p>
                <div className="mt-4 text-sm text-red-800 font-medium">
                  Best for: Understanding basic relationships and interpretability
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">How We Make Predictions</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-16">
            <div className="flex flex-col">
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="bg-stock-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">1</div>
                  <h3 className="text-xl font-bold">Data Collection</h3>
                </div>
                <p className="pl-11 text-gray-700">
                  We gather historical stock data, including price, volume, and market indicators. We also collect relevant news, social media sentiment, and economic factors that may influence stock performance.
                </p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="bg-stock-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">2</div>
                  <h3 className="text-xl font-bold">Data Preprocessing</h3>
                </div>
                <p className="pl-11 text-gray-700">
                  Raw data is cleaned, normalized, and transformed into features that our models can effectively learn from. This includes handling missing values, outlier detection, and feature engineering.
                </p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="bg-stock-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">3</div>
                  <h3 className="text-xl font-bold">Model Training</h3>
                </div>
                <p className="pl-11 text-gray-700">
                  We train multiple models (ARIMA, LSTM, Linear Regression) on historical data, optimizing their parameters to minimize prediction errors and capture market patterns effectively.
                </p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="bg-stock-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">4</div>
                  <h3 className="text-xl font-bold">Prediction Generation</h3>
                </div>
                <p className="pl-11 text-gray-700">
                  Our models generate forecasts for future stock prices, which are then evaluated and refined based on their accuracy and consistency across different prediction horizons.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-3">
                  <div className="bg-stock-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">5</div>
                  <h3 className="text-xl font-bold">Analysis & Recommendations</h3>
                </div>
                <p className="pl-11 text-gray-700">
                  We combine model predictions with sentiment analysis and market insights to provide comprehensive stock analysis and actionable investment recommendations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-stock-blue text-white p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Predicting?</h2>
            <p className="text-xl mb-0">
              Use our advanced ML models to make informed investment decisions.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
