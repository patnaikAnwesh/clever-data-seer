
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
        
        # Add symbol column
        df['Symbol'] = symbol
        
        return df
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        # Return empty DataFrame with expected columns
        return pd.DataFrame(columns=['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Change', 'ChangePercent', 'Symbol'])

def get_multiple_stocks_data(symbols, period='90d', interval='1d'):
    """
    Fetch data for multiple stock symbols efficiently
    
    Args:
        symbols (list): List of stock symbols
        period (str): Period of data to fetch
        interval (str): Interval between data points
    
    Returns:
        dict: Dictionary with symbol as key and DataFrame as value
    """
    result = {}
    
    # For efficiency, we can use yf.download for multiple symbols at once
    if len(symbols) > 1:
        try:
            data = yf.download(symbols, period=period, interval=interval, group_by='ticker')
            
            for symbol in symbols:
                if symbol in data.columns.levels[0]:
                    # Extract data for this symbol
                    df = data[symbol].reset_index()
                    
                    # Calculate additional metrics
                    df['Change'] = df['Close'] - df['Open']
                    df['ChangePercent'] = (df['Change'] / df['Open']) * 100
                    
                    # Convert date to string format
                    df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
                    
                    # Add symbol column
                    df['Symbol'] = symbol
                    
                    result[symbol] = df
                else:
                    print(f"No data found for {symbol}")
                    result[symbol] = pd.DataFrame(columns=['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Change', 'ChangePercent', 'Symbol'])
        except Exception as e:
            print(f"Error fetching data for multiple symbols: {e}")
            # Fall back to individual fetching
            for symbol in symbols:
                result[symbol] = get_stock_data(symbol, period, interval)
    else:
        # For a single symbol, use the existing function
        for symbol in symbols:
            result[symbol] = get_stock_data(symbol, period, interval)
    
    return result

# ... keep existing code (prepare_data_for_training function)

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
