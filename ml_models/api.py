
"""
Flask API for stock prediction models
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import json

# Import our models
from data_loader import get_stock_data, format_response_data
from arima_model import ARIMAModel
from lstm_model import LSTMModel
from linear_regression_model import LinearRegressionModel

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize models
arima_model = ARIMAModel()
lstm_model = LSTMModel()
linear_model = LinearRegressionModel()

# Model directory
MODEL_DIR = 'models'
os.makedirs(MODEL_DIR, exist_ok=True)

def train_or_load_models(symbol):
    """
    Train models or load pre-trained models
    
    Args:
        symbol (str): Stock symbol
    """
    # File paths for saved models
    arima_path = f'{MODEL_DIR}/arima_{symbol}.pkl'
    lstm_path = f'{MODEL_DIR}/lstm_{symbol}'
    linear_path = f'{MODEL_DIR}/linear_{symbol}.pkl'
    
    # Get historical data
    df = get_stock_data(symbol, period='1y')
    close_prices = df['Close'].values
    
    # Check if models exist
    arima_exists = os.path.exists(arima_path)
    lstm_exists = os.path.exists(lstm_path)
    linear_exists = os.path.exists(linear_path)
    
    # Load or train ARIMA model
    if arima_exists:
        try:
            arima_model.load(arima_path)
            print(f"Loaded ARIMA model for {symbol}")
        except Exception as e:
            print(f"Error loading ARIMA model, training new one: {e}")
            arima_model.train(close_prices)
            arima_model.save(arima_path)
    else:
        arima_model.train(close_prices)
        arima_model.save(arima_path)
    
    # Load or train LSTM model
    if lstm_exists:
        try:
            lstm_model.load(lstm_path)
            print(f"Loaded LSTM model for {symbol}")
        except Exception as e:
            print(f"Error loading LSTM model, training new one: {e}")
            lstm_model.train(close_prices)
            lstm_model.save(lstm_path)
    else:
        lstm_model.train(close_prices)
        lstm_model.save(lstm_path)
    
    # Load or train Linear Regression model
    if linear_exists:
        try:
            linear_model.load(linear_path)
            print(f"Loaded Linear Regression model for {symbol}")
        except Exception as e:
            print(f"Error loading Linear Regression model, training new one: {e}")
            linear_model.train(close_prices)
            linear_model.save(linear_path)
    else:
        linear_model.train(close_prices)
        linear_model.save(linear_path)

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock(symbol):
    """
    Get current stock data
    
    Args:
        symbol (str): Stock symbol
    """
    try:
        df = get_stock_data(symbol, period='1d')
        
        if df.empty:
            return jsonify({'error': f'No data found for {symbol}'}), 404
        
        # Add symbol column
        df['Symbol'] = symbol
        
        # Format response
        data = format_response_data(df)
        
        return jsonify(data[0])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/historical/<symbol>', methods=['GET'])
def get_historical(symbol):
    """
    Get historical stock data
    
    Args:
        symbol (str): Stock symbol
    """
    try:
        days = request.args.get('days', default=30, type=int)
        df = get_stock_data(symbol, period=f'{days}d')
        
        if df.empty:
            return jsonify({'error': f'No data found for {symbol}'}), 404
        
        # Add symbol column
        df['Symbol'] = symbol
        
        # Format response
        data = format_response_data(df)
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predictions/<symbol>', methods=['GET'])
def get_predictions(symbol):
    """
    Get predictions for next day
    
    Args:
        symbol (str): Stock symbol
    """
    try:
        # Train or load models
        train_or_load_models(symbol)
        
        # Get latest data
        df = get_stock_data(symbol, period='90d')
        close_prices = df['Close'].values
        current_price = close_prices[-1]
        
        # Make predictions
        arima_pred = arima_model.predict(steps=1)[0]
        lstm_pred = lstm_model.predict(close_prices, steps=1)[0]
        linear_pred = linear_model.predict(close_prices, steps=1)[0]
        
        # Calculate MAPE
        # For simplicity, we'll use a fixed test set (last 10 days)
        test_size = 10
        test_data = close_prices[-test_size:]
        train_data = close_prices[:-test_size]
        
        arima_model.train(train_data)
        arima_eval = arima_model.evaluate(test_data)
        
        lstm_model.train(train_data)
        lstm_eval = lstm_model.evaluate(test_data)
        
        linear_model.train(train_data)
        linear_eval = linear_model.evaluate(test_data)
        
        # Format date for tomorrow
        tomorrow = datetime.now() + timedelta(days=1)
        tomorrow_str = tomorrow.strftime('%Y-%m-%d')
        
        result = {
            "ARIMA": {
                "symbol": symbol,
                "date": tomorrow_str,
                "predictedClose": float(arima_pred),
                "modelType": "ARIMA",
                "mape": float(arima_eval['mape'])
            },
            "LSTM": {
                "symbol": symbol,
                "date": tomorrow_str,
                "predictedClose": float(lstm_pred),
                "modelType": "LSTM",
                "mape": float(lstm_eval['mape'])
            },
            "LINEAR": {
                "symbol": symbol,
                "date": tomorrow_str,
                "predictedClose": float(linear_pred),
                "modelType": "LINEAR",
                "mape": float(linear_eval['mape'])
            }
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/future/<symbol>', methods=['GET'])
def get_future_predictions(symbol):
    """
    Get future predictions for multiple days
    
    Args:
        symbol (str): Stock symbol
    """
    try:
        days = request.args.get('days', default=7, type=int)
        
        # Train or load models
        train_or_load_models(symbol)
        
        # Get latest data
        df = get_stock_data(symbol, period='90d')
        close_prices = df['Close'].values
        
        # Get predictions from the best model (ARIMA in this case)
        predictions = arima_model.predict(steps=days)
        
        # Format response
        result = {}
        for i, pred in enumerate(predictions):
            result[str(i+1)] = float(pred)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sentiment/<symbol>', methods=['GET'])
def get_sentiment(symbol):
    """
    Get sentiment analysis for a stock
    Note: This is a mock implementation
    
    Args:
        symbol (str): Stock symbol
    """
    try:
        # In a real application, this would call a sentiment analysis API
        # or analyze news/social media data
        
        # Mock sentiment data
        if symbol == 'AAPL':
            result = {
                "positive": 50.7,
                "negative": 27.3,
                "neutral": 22.0,
                "overall": "positive"
            }
        else:
            # Generate random sentiment
            positive = np.random.uniform(20, 80)
            negative = np.random.uniform(0, 100-positive) * 0.6
            neutral = 100 - positive - negative
            
            # Determine overall sentiment
            if positive > negative and positive > neutral:
                overall = "positive"
            elif negative > positive and negative > neutral:
                overall = "negative"
            else:
                overall = "neutral"
            
            result = {
                "positive": float(positive),
                "negative": float(negative),
                "neutral": float(neutral),
                "overall": overall
            }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
