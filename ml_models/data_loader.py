
"""
Module for loading stock data from Yahoo Finance
"""
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def get_stock_data(symbol, period='90d', interval='1d'):
    """
    Fetch stock data from Yahoo Finance
    
    Args:
        symbol (str): Stock symbol
        period (str): Period of data to fetch (e.g., '90d', '1y')
        interval (str): Interval between data points (e.g., '1d', '1h')
    
    Returns:
        pd.DataFrame: DataFrame with stock data
    """
    try:
        stock = yf.Ticker(symbol)
        df = stock.history(period=period, interval=interval)
        
        if df.empty:
            raise ValueError(f"No data found for {symbol}")
            
        # Calculate additional metrics
        df['Change'] = df['Close'] - df['Open']
        df['ChangePercent'] = (df['Change'] / df['Open']) * 100
        
        # Reset index to make Date a column
        df = df.reset_index()
        
        # Convert date to string format
        df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
        
        return df
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        # Return empty DataFrame with expected columns
        return pd.DataFrame(columns=['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Change', 'ChangePercent'])

def prepare_data_for_training(df, target_col='Close', sequence_length=10):
    """
    Prepare data for ML model training
    
    Args:
        df (pd.DataFrame): DataFrame with stock data
        target_col (str): Column to predict
        sequence_length (int): Number of previous days to use for prediction
    
    Returns:
        tuple: (X_train, y_train, X_test, y_test)
    """
    # Create sequences
    data = df[target_col].values
    X, y = [], []
    
    for i in range(len(data) - sequence_length):
        X.append(data[i:i+sequence_length])
        y.append(data[i+sequence_length])
    
    X = np.array(X)
    y = np.array(y)
    
    # Use 80% for training
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]
    
    return X_train, y_train, X_test, y_test

def format_response_data(df):
    """
    Format data for frontend response
    
    Args:
        df (pd.DataFrame): DataFrame with stock data
    
    Returns:
        list: List of dictionaries with formatted data
    """
    result = []
    for _, row in df.iterrows():
        result.append({
            'symbol': row.get('Symbol', 'N/A'),
            'open': float(row['Open']),
            'high': float(row['High']),
            'low': float(row['Low']),
            'close': float(row['Close']),
            'volume': int(row['Volume']),
            'date': row['Date'],
            'change': float(row['Change']),
            'changePercent': float(row['ChangePercent'])
        })
    return result
