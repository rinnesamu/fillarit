import React, {useEffect, useState} from 'react';
import './App.css';
import { JsonToTable } from "react-json-to-table";
import L from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import {marker} from 'leaflet/dist/leaflet-src.esm';
//import "leaflet/dist/leaflet.css";

const request = require('request');


function App() {
  const [markers, setMarkers] = useState([[60.192059, 24.945831], [61.192059, 24.945831]])
  const[stations, setStations] = useState([]);
  const position = [60.192059, 24.945831]
  const map = (
      <Map center={position} zoom={13} style={{ height: '1080px', width: '1920px' }}>
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
    request (reqStation, false, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        setStations((JSON.parse(JSON.stringify(body.data.bikeRentalStations, null, 4))));
      }
    });
     }, []);
  return (
    <div className="App">
      {map}
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

var reqStation = {
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

export default App;

