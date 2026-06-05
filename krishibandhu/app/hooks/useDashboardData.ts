import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { PriceData, RecommendationData, WeatherData, CropId } from '../types/dashboard';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export function useDashboardData(selectedCrop: CropId) {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!API_BASE) {
      setError('NEXT_PUBLIC_API_BASE environment variable is not set.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [priceRes, recRes, weatherRes] = await Promise.allSettled([
        axios.get<PriceData>(`${API_BASE}/prices/${selectedCrop}`),
        axios.get<RecommendationData>(`${API_BASE}/recommendations/${selectedCrop}`),
        axios.get<WeatherData>(`${API_BASE}/weather/forecast`)
      ]);

      if (priceRes.status === 'fulfilled') {
        setPriceData(priceRes.value.data);
      } else {
        console.warn('Failed to fetch prices:', priceRes.reason);
      }

      if (recRes.status === 'fulfilled') {
        setRecommendation({
          recommendation: recRes.value.data.recommendation,
          reasoning: recRes.value.data.reasoning,
          confidence: recRes.value.data.confidence,
          expectedPrice: recRes.value.data.expectedPrice,
          daysToWait: recRes.value.data.daysToWait,
        });
      } else {
        console.warn('Failed to fetch recommendation:', recRes.reason);
      }

      if (weatherRes.status === 'fulfilled') {
        setWeatherData(weatherRes.value.data);
      } else {
        console.warn('Failed to fetch weather:', weatherRes.reason);
      }

      if (priceRes.status === 'rejected' && recRes.status === 'rejected' && weatherRes.status === 'rejected') {
        throw new Error('All data fetching failed. Make sure the backend is running.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to reach the server.';
      console.warn('API Error:', message);
      setError(`Could not load market data: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedCrop]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { priceData, recommendation, weatherData, loading, error, refetch: fetchDashboardData };
}
