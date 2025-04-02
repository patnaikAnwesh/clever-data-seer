
"""
ARIMA model for stock price prediction
"""
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
import pickle
import os

class ARIMAModel:
    def __init__(self, order=(5, 1, 0)):
        """
        Initialize ARIMA model
        
        Args:
            order (tuple): ARIMA model order (p, d, q)
        """
        self.order = order
        self.model = None
        
    def train(self, data):
        """
        Train ARIMA model
        
        Args:
            data (pd.Series): Time series data for training
        """
        try:
            self.model = ARIMA(data, order=self.order)
            self.model_fit = self.model.fit()
            return True
        except Exception as e:
            print(f"Error training ARIMA model: {e}")
            return False
    
    def predict(self, steps=1):
        """
        Make predictions using trained model
        
        Args:
            steps (int): Number of steps to predict
        
        Returns:
            np.array: Predicted values
        """
        if self.model_fit is None:
            raise ValueError("Model has not been trained yet")
        
        forecast = self.model_fit.forecast(steps=steps)
        return forecast
    
    def evaluate(self, test_data):
        """
        Evaluate model on test data
        
        Args:
            test_data (pd.Series): Actual values to compare against
        
        Returns:
            dict: Dictionary with evaluation metrics
        """
        predictions = self.predict(steps=len(test_data))
        
        # Calculate MAPE
        mape = np.mean(np.abs((test_data - predictions) / test_data)) * 100
        
        return {
            'mape': mape,
            'predictions': predictions,
            'actual': test_data
        }
    
    def save(self, filepath='models/arima_model.pkl'):
        """
        Save model to file
        
        Args:
            filepath (str): Path to save model
        """
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'wb') as f:
            pickle.dump(self.model_fit, f)
    
    def load(self, filepath='models/arima_model.pkl'):
        """
        Load model from file
        
        Args:
            filepath (str): Path to load model from
        """
        with open(filepath, 'rb') as f:
            self.model_fit = pickle.load(f)
