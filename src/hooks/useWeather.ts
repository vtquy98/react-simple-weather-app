import axios from "axios";
import { useEffect, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import { useLocation } from ".";
import { CurrentWeatherModel, EmptyCurrentWeather } from "../models";

export const useWeather = (locationName: string, unit: string) => {
  const baseUrl = process.env.REACT_APP_OPENWEATHER_API_URL;
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

  const { location } = useLocation(locationName);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentWeather, setCurrentWeather] =
    useState<CurrentWeatherModel>(EmptyCurrentWeather);

  const handleError = useErrorHandler();

  useEffect(() => {
    if (location) {
      setIsLoading(true);
      const url = `${baseUrl}?lat=${location.position.latitude}&lon=${location.position.longitude}&units=${unit}&exclude=minutely,alerts&appid=${apiKey}`;
      axios
        .get(url)
        .then((response) => {
          setCurrent(response.data.current);
        })
        .catch((error) => {
          handleError(error);
        })
        .finally(() => {
          setTimeout(() => setIsLoading(false), 100);
        });
    }
  }, [location, unit, baseUrl, apiKey, handleError]);

  const setCurrent = (data: any) => {
    setCurrentWeather({
      dt: data.dt,
      weather: {
        icon: data.weather[0].icon,
        description: data.weather[0].description,
      },
      temp: data.temp,
      feels_like: data.feels_like,
      details: {
        rain: 0,
        visibility: data.visibility / 1000,
        humidity: data.humidity,
        pressure: data.pressure,
        wind_speed: data.wind_speed,
      },
    });
  };

  return {
    isLoading,
    location,
    currentWeather,
  };
};
