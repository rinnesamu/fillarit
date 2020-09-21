import React, {useEffect, useState} from 'react';
import './App.css';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import conditions from  './components/Weather'


const request = require('request');
const key = process.env['WEATHER_API_KEY '];



function App() {
  let weather = conditions();
  const[stations, setStations] = useState([]);
  const position = [60.192059, 24.945831]
  const map = (
      <Map center={position} zoom={12} style={{ height: '1080px', width: '1920px' }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {stations.map(station => {

          const ensemble = [station.lat, station.lon];
          return (
              <Marker position={ensemble} key={station.id}>
                <Popup>
                  Aseman nimi: {station.name}<br/>
                  Pyöriä vapaapaana: {station.bikesAvailable} <br/>
                  Paikkoja jäljellä: {station.spacesAvailable}
                </Popup>
              </Marker>
            )
        })
        }
      </Map>
  )
  useEffect(() => {
    /*request(reqWeather, false, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log("JSON", JSON.parse(JSON.stringify(body)));
        setWeather(JSON.parse(JSON.stringify(body)));
      }
    })*/
    request (reqStation, false, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        setStations((JSON.parse(JSON.stringify(body.data.bikeRentalStations, null, 4))));
      }
    });
     }, []);
  return (
    <div className="App">
      <div className="Map">
        {map}
      </div>
      <div className="Weather">
        {weather}
      </div>
    </div>

  );
}




var req = {
  url: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  method: 'post',
  headers: { "Content-Type": "application/json" },
  body: { "query": `{
    bikeRentalStations {
    stationId
    name
    bikesAvailable
    spacesAvailable
    lat
    lon
    allowDropoff
  }
  }` },
  json: true
};

let reqStation = {
  url: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  method: 'post',
  headers: { "Content-Type": "application/json" },
  body: { "query": `{
    bikeRentalStations {
    name
    bikesAvailable
    spacesAvailable
    lat
    lon
  }
  }` },
  json: true
};

let reqWeather ={
  url: 'http://api.openweathermap.org/data/2.5/weather?q=Helsinki&appid=' + key,
  method: 'get'
};


export default App;

