import React, {useEffect, useState} from 'react';

const request = require('request');
const key = process.env['REACT_APP_WEATHER_API_KEY'];

function Weather(){
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    request(reqWeather, false, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        setWeather(JSON.parse(body));
      }
    })
  }, []);
  if (weather){
    let iconCode = weather.weather[0].icon;
    let iconSrc = 'http://openweathermap.org/img/wn/'+ iconCode +'@2x.png'
    let temperature = Math.round((weather.main.temp-272.15) *10)/10; // rounding to one decimal
    let clouds = weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1);
    let wind =  weather.wind.speed;
    console.log(weather);
    return (
        <div>
          <h2>
            Helsingin säätiedot:
          </h2>
          <table>
            <tbody>
            <tr>
              <td><img src={iconSrc}/></td>
              <td>{temperature}c</td>
            </tr>
            <tr>
              <td>Säätila</td>
              <td>{clouds}</td>
            </tr>
            <tr>
              <td>Tuulen nopeus</td>
              <td>{wind} m/s</td>
            </tr>
            </tbody>
          </table>
        </div>
    );
  }
}

let reqWeather ={
  url: 'http://api.openweathermap.org/data/2.5/weather?q=Helsinki&lang=fi&appid=' + key,
  method: 'get'
};

export default Weather;