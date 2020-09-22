import React, {useEffect, useState} from 'react';
import './App.css';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import conditions from  './components/Weather'
import "leaflet-routing-machine";
import L from 'leaflet'


const request = require('request');

function App() {
  let mapContainer=false;
  let weather = conditions();
  let newMap = null;
  let mapReady = null;
  const[stations, setStations] = useState([]);
  const[from, setFrom] = useState([null, null]);
  const [where, setWhere] = useState([null, null]);
  const position = [60.192059, 24.945831]
  useEffect(() => {
    newMap = L.map('map', {
      center: position,
      zoom: 13
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);



    /*L.Routing.control({
      waypoints: [
        L.latLng(from),
        L.latLng(where)
      ],
      routeWhileDragging: true
    }).addTo(newMap);
    mapReady = true;*/
  }, [])

  /*const map = (
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
  )*/

  useEffect(() => {
    request (reqStation, false, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        setStations((JSON.parse(JSON.stringify(body.data.bikeRentalStations, null, 4))));
        JSON.parse(JSON.stringify(body.data.bikeRentalStations, null, 4)).forEach(function(entry) {
          L.marker([entry.lat, entry.lon]).bindPopup("Aseman nimi:" + entry.name + " <br>Pyöriä vapaapaana: " + entry.bikesAvailable + " <br>Paikkoja jäljellä: " + entry.spacesAvailable).addTo(newMap);
        })
      }
    });
     }, [newMap]);
  /*useEffect( () => {
    console.log("KOLMAS NEW MAP", newMap, stations);
      stations.forEach(function(entry) {
        console.log(entry.lat, entry.lon);
        L.marker([entry.lat, entry.lon]).addTo(newMap);
      })

  }, []);*/
  return (
    <div className="App">
      <div id="map" className="Map" >
        {newMap}
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
export default App;

