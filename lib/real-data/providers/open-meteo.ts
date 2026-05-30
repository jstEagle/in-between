import { realDataConfig } from "@/config/real-data";
import { fixtureWeather } from "../fixtures";
import { compactParams, fetchJson } from "../http";
import type { Coordinates, RealDataResult, WeatherSummary } from "../types";

type OpenMeteoForecastResponse = {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  current?: {
    temperature_2m?: number;
    wind_speed_10m?: number;
  };
  daily?: {
    time?: string[];
    temperature_2m_min?: number[];
    temperature_2m_max?: number[];
    precipitation_sum?: number[];
  };
};

function normalizeForecast(payload: OpenMeteoForecastResponse, fallback: WeatherSummary): WeatherSummary {
  const dates = payload.daily?.time ?? [];

  return {
    currentTemperatureC: payload.current?.temperature_2m ?? fallback.currentTemperatureC,
    currentWindSpeedKph: payload.current?.wind_speed_10m ?? fallback.currentWindSpeedKph,
    daily: dates.slice(0, 7).map((date, index) => ({
      date,
      precipitationMm: payload.daily?.precipitation_sum?.[index] ?? 0,
      temperatureMaxC: payload.daily?.temperature_2m_max?.[index] ?? fallback.currentTemperatureC,
      temperatureMinC: payload.daily?.temperature_2m_min?.[index] ?? fallback.currentTemperatureC
    })),
    latitude: payload.latitude ?? fallback.latitude,
    longitude: payload.longitude ?? fallback.longitude,
    timezone: payload.timezone ?? fallback.timezone
  };
}

export async function fetchOpenMeteoWeather(
  coordinates: Coordinates,
  days: number = 7
): Promise<RealDataResult<WeatherSummary>> {
  const params = compactParams({
    current: "temperature_2m,wind_speed_10m",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
    forecast_days: Math.min(Math.max(days, 1), 16),
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    timezone: "auto"
  });
  const raw = await fetchJson<OpenMeteoForecastResponse>(
    `${realDataConfig.providers.openMeteo.forecastUrl}?${params}`,
    {
      fallback: {} as OpenMeteoForecastResponse,
      source: "open-meteo"
    }
  );

  if (raw.fallback) {
    return {
      data: fixtureWeather,
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  return {
    data: normalizeForecast(raw.data, fixtureWeather),
    fallback: false,
    source: "open-meteo"
  };
}
