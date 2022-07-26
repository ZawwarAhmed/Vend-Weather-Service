const axios = require("axios");
const {
  APPID,
  FORECAST_URL,
  weekday,
  getHourDivisibleByThree,
} = require("../common/index");
const {
  getDailyWeatherExternalAPIResponse,
  getCurrentWeatherExternalAPIResponse,
} = require("../DTOs/index");

class WeatherExternalAPI {
  FORECAST_URL;
  APPID;
  weekday;
  constructor() {
    this.FORECAST_URL = FORECAST_URL;
    this.APPID = APPID;
    this.weekday = weekday;
  }

  async getDailyWeather(city) {
    const options = {
      method: "GET",
      url: this.FORECAST_URL,
      params: { q: city, APPID: this.APPID, units: "metric" },
    };
    const dailyWeatherData = await axios.request(options);
    const currentHourForecast = dailyWeatherData.data.list.filter((day) => {
      const currentHourResponse = parseInt(
        day.dt_txt.split(" ")[1].split(":")[0]
      );
      const currentHour = getHourDivisibleByThree(new Date().getHours());
      return currentHourResponse === currentHour;
    });
    const data = currentHourForecast.map((day) => {
      const temperature = day.main.temp;
      const weather = day.weather[0].main;
      const weatherIcon = day.weather[0].icon;
      const date = day.dt_txt.split(" ")[0];
      const currentDay =
        this.weekday[new Date(day.dt_txt.split(" ")[0]).getDay()];
      const time = day.dt_txt.split(" ")[1];
      return new getDailyWeatherExternalAPIResponse(
        temperature,
        weather,
        weatherIcon,
        date,
        currentDay,
        time
      );
    });
    return data;
  }

  async getCurrentWeather(city) {
    const options = {
      method: "GET",
      url: this.FORECAST_URL,
      params: { q: city, APPID: this.APPID, units: "metric" },
    };
    const currentWeatherData = await axios.request(options);
    const currentHourForecast = currentWeatherData.data.list.filter((day) => {
      const currentHourResponse = parseInt(
        day.dt_txt.split(" ")[1].split(":")[0]
      );
      const currentHour = getHourDivisibleByThree(new Date().getHours());
      return currentHourResponse === currentHour;
    });
    const day = currentHourForecast[0];

    const temperature = day.main.temp;
    const weather = day.weather[0].main;
    const weatherIcon = day.weather[0].icon;
    const date = day.dt_txt.split(" ")[0];
    const currentDay =
      this.weekday[new Date(day.dt_txt.split(" ")[0]).getDay()];
    const time = day.dt_txt.split(" ")[1];
    const feelsLike = day.main.feels_like;
    const humidity = day.main.humidity;
    return new getCurrentWeatherExternalAPIResponse(
      temperature,
      weather,
      weatherIcon,
      date,
      currentDay,
      time,
      feelsLike,
      humidity
    );
  }
}

module.exports = { WeatherExternalAPI };
