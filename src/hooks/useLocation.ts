import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import { LocationHistoryModel, LocationModel } from "../models";

export const useLocation = (locationName: string) => {
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const geocodeBaseUrl = process.env.REACT_APP_OPENWEATHER_GEOCODE_URL;

  const [location, setLocation] = useState<LocationModel | null>(null);

  const handleError = useErrorHandler();
  const saveToHistory = useCallback((location: LocationModel) => {
    const currentHistory: Array<LocationHistoryModel> = JSON.parse(
      localStorage.getItem("searchHistory") || "[]"
    );

    const findIndex = currentHistory.findIndex(
      (item) =>
        item.position.latitude === location.position.latitude &&
        item.position.longitude === location.position.longitude
    );

    if (findIndex === -1) {
      const newHistory = [
        ...currentHistory,
        { ...location, timestamp: Date.now() },
      ];
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    }
  }, []);

  const getCoordsByLocationName = useCallback(
    (locationName: string) => {
      axios
        .get(`${geocodeBaseUrl}?q=${locationName}&limit=1&appid=${apiKey}`)
        .then((res: any) => {
          if (res.data && res.data.length === 0) {
            setLocation(null);
            return;
          }

          if (res.data && res.data[0]) {
            const location = res.data[0];
            const formattedAddress = location.name;
            const formatedLocation = {
              position: {
                latitude: location.lat,
                longitude: location.lon,
              },
              locality: location.country,
              country: formattedAddress,
            };
            setLocation(formatedLocation);
            saveToHistory(formatedLocation);
          }
        })
        .catch((error) => {
          handleError(error);
        });
    },
    [apiKey, geocodeBaseUrl, handleError, saveToHistory]
  );

  useEffect(() => {
    if (locationName !== "") {
      getCoordsByLocationName(locationName);
    }
  }, [getCoordsByLocationName, handleError, locationName]);

  return {
    location,
  };
};
