
# ML Models for Stock Price Prediction

This directory contains machine learning models for stock price prediction:

- ARIMA (Auto-Regressive Integrated Moving Average)
- LSTM (Long Short-Term Memory)
- Linear Regression

## Setup Instructions

1. Install the required packages:
```
pip install pandas numpy scikit-learn statsmodels tensorflow yfinance flask flask-cors
```

2. Start the prediction API:
```
python api.py
```

This will start a local server on port 5000 that your React application can call for predictions.

## Model Details

- **ARIMA**: Time series model that uses auto-regression, differencing, and moving averages
- **LSTM**: Neural network designed for sequence data with memory of previous inputs
- **Linear Regression**: Simple regression model that finds linear relationship in data
