
"""
LSTM model for stock price prediction
"""
import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import os

class LSTMModel:
    def __init__(self, sequence_length=10):
        """
        Initialize LSTM model
        
        Args:
            sequence_length (int): Number of previous time steps to use
        """
        self.sequence_length = sequence_length
        self.model = None
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        
    def _build_model(self, input_shape):
        """
        Build LSTM model architecture
        
        Args:
            input_shape (tuple): Shape of input data (sequence_length, features)
        """
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(50, return_sequences=False),
            Dropout(0.2),
            Dense(25),
            Dense(1)
        ])
        
        model.compile(optimizer='adam', loss='mean_squared_error')
        return model
    
    def _prepare_data(self, data):
        """
        Prepare data for LSTM model
        
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
        Create sequences for LSTM model
        
        Args:
            data (np.array): Input data
        
        Returns:
            tuple: X and y arrays
        """
        X, y = [], []
        
        for i in range(len(data) - self.sequence_length):
            X.append(data[i:i+self.sequence_length])
            y.append(data[i+self.sequence_length])
        
        return np.array(X), np.array(y)
    
    def train(self, data, epochs=50, batch_size=32, validation_split=0.2):
        """
        Train LSTM model
        
        Args:
            data (np.array): Input data
            epochs (int): Number of training epochs
            batch_size (int): Batch size for training
            validation_split (float): Fraction of data to use for validation
        """
        try:
            # Prepare data
            data_scaled, _ = self._prepare_data(data)
            X, y = self._create_sequences(data_scaled)
            
            # Reshape X for LSTM [samples, time steps, features]
            X = X.reshape(X.shape[0], X.shape[1], 1)
            
            # Build model
            self.model = self._build_model((X.shape[1], X.shape[2]))
            
            # Train model
            self.model.fit(
                X, y,
                epochs=epochs,
                batch_size=batch_size,
                validation_split=validation_split,
                verbose=1
            )
            
            return True
        except Exception as e:
            print(f"Error training LSTM model: {e}")
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
        if self.model is None:
            raise ValueError("Model has not been trained yet")
        
        # Prepare data
        data_scaled, original_shape = self._prepare_data(data)
        
        # Make predictions
        predictions = []
        current_batch = data_scaled[-self.sequence_length:].reshape(1, self.sequence_length, 1)
        
        for _ in range(steps):
            current_pred = self.model.predict(current_batch)[0]
            predictions.append(current_pred)
            
            # Update batch for next prediction
            current_batch = np.append(current_batch[:, 1:, :], [[current_pred]], axis=1)
        
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
    
    def save(self, filepath='models/lstm_model'):
        """
        Save model to file
        
        Args:
            filepath (str): Path to save model
        """
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        self.model.save(filepath)
        
        # Save scaler
        scaler_path = f"{filepath}_scaler.pkl"
        import pickle
        with open(scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)
    
    def load(self, filepath='models/lstm_model'):
        """
        Load model from file
        
        Args:
            filepath (str): Path to load model from
        """
        self.model = load_model(filepath)
        
        # Load scaler
        scaler_path = f"{filepath}_scaler.pkl"
        import pickle
        with open(scaler_path, 'rb') as f:
            self.scaler = pickle.load(f)
