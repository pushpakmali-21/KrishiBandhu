#!/usr/bin/env python3
"""
ml-service.py - KrishiBandhu Price Prediction Model
Reads historical price data from stdin (JSON) and outputs forecast + recommendation to stdout.
Called by run-ml-pipeline.js (for batch/scheduled use).
"""
import json
import numpy as np
from datetime import datetime, timedelta

class PricePredictionModel:
    """
    Linear Regression-based price prediction model with seasonal adjustments.
    """

    def __init__(self):
        self.trend_coefficient = 0
        self.volatility = 0
        self.r_squared = 0

    def train(self, historical_prices):
        """
        Train on historical price data.
        historical_prices: list of {date, price}
        """
        if not historical_prices or len(historical_prices) < 2:
            return False

        try:
            prices = np.array([p['price'] for p in historical_prices], dtype=float)
            prices[prices == 0] = 1e-6  # Prevent division by zero

            x = np.arange(len(prices))
            y = prices

            # Linear regression (y = mx + b)
            coeffs = np.polyfit(x, y, 1)
            self.trend_coefficient = coeffs[0]

            # R-squared for model fit quality
            p = np.poly1d(coeffs)
            y_fit = p(x)
            y_mean = np.mean(y)
            ssr = np.sum((y_fit - y) ** 2)
            sst = np.sum((y - y_mean) ** 2)
            self.r_squared = 1 - (ssr / sst) if sst != 0 else 1.0

            # Volatility as % standard deviation of daily returns
            returns = np.diff(prices) / prices[:-1]
            self.volatility = np.std(returns) * 100

            return True

        except Exception:
            return False

    def predict(self, historical_prices, days=7):
        """
        Predict the next N days of prices using a compound growth model.
        """
        if not self.train(historical_prices):
            raise ValueError("Not enough valid data to train model")

        prices = [p['price'] for p in historical_prices]
        last_price = prices[-1]
        growth_rate = self.trend_coefficient / last_price if last_price != 0 else 0

        predictions = []
        for day in range(1, days + 1):
            predicted = last_price * ((1 + growth_rate) ** day)
            # Mild seasonal adjustment based on volatility
            seasonal_factor = 1 + (self.volatility / 100) * np.sin(day / 3)
            predicted *= seasonal_factor
            predictions.append(round(float(predicted), 2))

        return predictions

    def calculate_demand(self, forecast, current_price):
        """
        Generate 7-day demand trend indicators based on forecast trajectory.
        """
        demand = []
        for price in forecast:
            change_pct = ((price - current_price) / current_price) * 100
            if change_pct > 5:
                demand.append('HIGH')
            elif change_pct < -3:
                demand.append('LOW')
            else:
                demand.append('MEDIUM')
        return demand

    def calculate_recommendation(self, current_price, forecast):
        """
        Generate a trading recommendation based on forecast and market conditions.
        """
        if not forecast:
            return {
                'action': 'HOLD',
                'confidence': 0,
                'reasoning': 'No forecast data available',
                'expected_price': current_price,
                'days_to_wait': 0
            }

        max_future_price = max(forecast)
        price_increase_pct = ((max_future_price - current_price) / current_price) * 100
        days_to_wait = int(np.argmax(forecast)) + 1

        # Confidence: 70–90 based on model fit, minus volatility penalty
        base_confidence = 70 + (self.r_squared * 20)
        confidence = base_confidence - (self.volatility * 1.2)
        if price_increase_pct > 6:
            confidence += 5
        final_confidence = round(max(45, min(97, confidence)), 1)

        if price_increase_pct > 8 and self.volatility < 3:
            return {'action': 'WAIT', 'confidence': final_confidence,
                    'reasoning': f'Strong price increase expected ({price_increase_pct:.1f}%)',
                    'expected_price': max_future_price, 'days_to_wait': days_to_wait}

        elif price_increase_pct > 4 and self.volatility < 3.5:
            return {'action': 'WAIT', 'confidence': final_confidence,
                    'reasoning': f'Moderate increase expected ({price_increase_pct:.1f}%)',
                    'expected_price': forecast[min(1, len(forecast) - 1)], 'days_to_wait': 2}

        elif self.volatility > 4.5:
            return {'action': 'SELL NOW', 'confidence': final_confidence,
                    'reasoning': f'High volatility ({self.volatility:.1f}%). Minimize risk.',
                    'expected_price': current_price, 'days_to_wait': 0}

        else:
            return {'action': 'SELL NOW', 'confidence': final_confidence,
                    'reasoning': 'Fair price with stable market',
                    'expected_price': current_price, 'days_to_wait': 0}


# --- Entry Point: Called by Node.js via stdin (run-ml-pipeline.js) ---
if __name__ == '__main__':
    import sys

    try:
        data = json.load(sys.stdin)

        if 'history' not in data or not isinstance(data['history'], list) or len(data['history']) < 2:
            raise ValueError("Invalid or insufficient 'history' data")
        if 'current' not in data:
            raise ValueError("Missing 'current' price")

        model = PricePredictionModel()
        forecast = model.predict(data['history'], 7)
        demand = model.calculate_demand(forecast, data['current'])
        recommendation = model.calculate_recommendation(data['current'], forecast)

        print(json.dumps({
            'forecast': forecast,
            'demand': demand,
            'volatility': round(model.volatility, 2),
            'recommendation': recommendation
        }))

    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)