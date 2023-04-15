import React, { useEffect, useState } from "react";
import { useWeather } from "../../hooks";
import {
  EmptyCurrentWeather,
  LocationHistoryModel,
  SettingsModel,
} from "../../models";
import { Loading } from "../Common";
import CurrentWeather from "../CurrentWeather/CurrentWeather";
import CurrentWeatherDetails from "../CurrentWeatherDetails/CurrentWeatherDetails";
import Header from "../Header/Header";
import History from "../History/History";

import "./Container.scss";

type ContainerProps = {
  settings: SettingsModel;
  changeSettings: (newSettings: object) => void;
};

export const Container = ({ settings, changeSettings }: ContainerProps) => {
  const [currentWeatherSelectedItem, setCurrentWeatherSelectedItem] =
    useState(EmptyCurrentWeather);
  const [currentLocationName, setCurrentLocationName] = useState<string>("");
  const [text, setText] = useState<string>("");

  const { isLoading, location, currentWeather } = useWeather(
    currentLocationName,
    settings.unit
  );

  useEffect(() => {
    setCurrentWeatherSelectedItem(currentWeather);
  }, [currentWeather]);

  const changeLocationHandler = (location: string) => {
    setCurrentLocationName(location);
  };

  return (
    <div className="container">
      <Loading isLoading={isLoading}>
        <>
          <div className="title">Today's weather</div>
          <div className="search">
            <input
              className="input"
              placeholder="Enter your city or country"
              value={text}
              onChange={(e) => {
                setText(e.currentTarget.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  changeLocationHandler(text);
                }
              }}
            />

            <button
              className="button"
              onClick={() => {
                changeLocationHandler(text);
              }}
            >
              Search
            </button>
          </div>

          {currentLocationName && location === null && (
            <div className="error">No location found</div>
          )}

          <div className="grid-container">
            {location && (
              <>
                <Header
                  locality={location.locality}
                  country={location.country}
                  data={currentWeatherSelectedItem}
                  settings={settings}
                  changeSettings={changeSettings}
                />
                <CurrentWeather
                  settings={settings}
                  data={currentWeatherSelectedItem}
                />
                <CurrentWeatherDetails
                  data={currentWeatherSelectedItem.details}
                />
              </>
            )}

            {/* <Hourly
            settings={settings}
            data={hourlyWeather}
            clickHandler={hourlyItemClickHandler}
          ></Hourly> */}
            {/* <Daily settings={settings} data={dailyWeather} /> */}
            <History
              onLocationClick={(h: LocationHistoryModel) => {
                changeLocationHandler(h.country);
              }}
            />
          </div>
        </>
      </Loading>
    </div>
  );
};
