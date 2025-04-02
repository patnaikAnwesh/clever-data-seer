
"""
Linear Regression model for stock price prediction
"""
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler
import pickle
import os

class LinearRegressionModel:
    def __init__(self, sequence_length=10):
        """
        Initialize Linear Regression model
        
        Args:
            sequence_length (int): Number of previous time steps to use
        """
        self.sequence_length = sequence_length
        self.model = LinearRegression()
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        
    def _prepare_data(self, data):
        """
        Prepare data for Linear Regression model
        
        Args:
            data (np.array): Input data
        
        Returns:
            tuple: Scaled data, original shape
        """
        # Reshape data for scaling
        data_reshaped = data.reshape(-1, 1)
        data_scaled = self.scaler.fit_transform(data_reshaped)
        
        return data_scaled, data_reshaped.shape
    
    def _create_sequences(self, data):
        """
        Create sequences for Linear Regression model
        
        Args:
            data (np.array): Input data
        
        Returns:
            tuple: X and y arrays
        """
        X, y = [], []
        
        for i in range(len(data) - self.sequence_length):
            X.append(data[i:i+self.sequence_length].flatten())
            y.append(data[i+self.sequence_length])
        
        return np.array(X), np.array(y)
    
    def train(self, data):
        """
        Train Linear Regression model
        
        Args:
            data (np.array): Input data
        """
        try:
            # Prepare data
            data_scaled, _ = self._prepare_data(data)
            X, y = self._create_sequences(data_scaled)
            
            # Train model
            self.model.fit(X, y)
            
            return True
        except Exception as e:
            print(f"Error training Linear Regression model: {e}")
            return False
    
    def predict(self, data, steps=1):
        """
        Make predictions using trained model
        
        Args:
            data (np.array): Input data for prediction
            steps (int): Number of steps to predict
        
        Returns:
            np.array: Predicted values (unscaled)
        """
        # Prepare data
        data_scaled, original_shape = self._prepare_data(data)
        
        # Make predictions
        predictions = []
        current_sequence = data_scaled[-self.sequence_length:].flatten().reshape(1, -1)
        
        for _ in range(steps):
            current_pred = self.model.predict(current_sequence)[0]
            predictions.append(current_pred)
            
            # Update sequence for next prediction
            current_sequence = np.append(current_sequence[:, 1:], [[current_pred]], axis=1)
        
        # Convert predictions back to original scale
        predictions = np.array(predictions).reshape(-1, 1)
        predictions = self.scaler.inverse_transform(predictions)
        
        return predictions.flatten()
    
    def evaluate(self, test_data):
        """
        Evaluate model on test data
        
        Args:
            test_data (np.array): Actual values to compare against
        
        Returns:
            dict: Dictionary with evaluation metrics
        """
        # Get the last sequence_length values from the training data
        train_data = test_data[:-len(test_data)]
        last_sequence = train_data[-self.sequence_length:]
        
        # Predict values for test period
        predictions = self.predict(last_sequence, steps=len(test_data))
        
        # Calculate MAPE
        mape = np.mean(np.abs((test_data - predictions) / test_data)) * 100
        
        return {
            'mape': mape,
            'predictions': predictions,
            'actual': test_data
        }
    
    def save(self, filepath='models/linear_model.pkl'):
        """
        Save model to file
        
        Args:
            filepath (str): Path to save model
        """
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'wb') as f:
            pickle.dump((self.model, self.scaler), f)
    
    def load(self, filepath='models/linear_model.pkl'):
        """
        Load model from file
        
        Args:
            filepath (str): Path to load model from
        """
        with open(filepath, 'rb') as f:
            self.model, self.scaler = pickle.load(f)
