import React, {useEffect, useState} from 'react';
import './App.css';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import conditions from  './components/Weather'
import "leaflet-routing-machine";
import L from 'leaflet'


const request = require('request');

function App() {
  let weather = conditions();
  let newMap = null;
  let fromSet = false;
  let whereSet = false;
  let routingControl;
  const [options, setOptions] = useState([]);
  let whereBox = <form>
    <table>
      <tbody>
      <tr>
        <td>
          <label>Minne</label>
          <select id='selectValue' onChange={drawRoute}>
            {options}
          </select>
        </td>
      </tr>
      </tbody>
    </table>
  </form>
  const[stations, setStations] = useState([]);
  let from = null;
  let where = null;
  const position = [60.192059, 24.945831]
  useEffect(() => {
    newMap = L.map('map', {
      center: position,
      zoom: 13
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);
  }, [])

  useEffect(() => {
    request (reqStation, false, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        setStations((JSON.parse(JSON.stringify(body.data.bikeRentalStations, null, 4))));
        JSON.parse(JSON.stringify(body.data.bikeRentalStations, null, 4)).forEach(function(entry) {
          L.marker([entry.lat, entry.lon])
              .bindPopup("Aseman nimi:" + entry.name + " <br>Pyöriä vapaapaana: " + entry.bikesAvailable + " <br>Paikkoja jäljellä: " + entry.spacesAvailable).on('click', updateFrom)
              .addTo(newMap);
        })
      }
    });
     }, [newMap]);

  useEffect( () => {
    let temp = [];
    stations.forEach(function(entry){
      console.log(entry.name);
      temp.push(<option key={entry.name} value={[entry.lat + " " + entry.lon]}>{entry.name}</option>)
    })
    setOptions(temp);
  }, [stations])

  function drawRoute(){
    let selection = document.getElementById('selectValue').value;
    let where = [selection.split(" ")[0], selection.split(" ")[1]];
    console.log(from, where)
    if (from && where){
      if (routingControl != null) {
        newMap.removeControl(routingControl);
        routingControl = null;
      }
      console.log("Uusi route")
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(from),
          L.latLng(where)
        ],
        routeWhileDragging: true,
      }).addTo(newMap);
    }
  }
  function updateWhere(e){
    console.log("TÄNNE");
    where = [e.target._latlng.lat, e.target._latlng.lng];
    whereSet = true;
  }
  function updateFrom(e){
    console.log(from);
    if (!fromSet){
      console.log("EKA")
    }
    if (fromSet){
      console.log("ASDSDFASDF")
    }
    from = [e.target._latlng.lat, e.target._latlng.lng];
    console.log(fromSet)
    fromSet = true;
    console.log(fromSet)
    drawRoute();
  }
  return (
    <div className="App">
      <div id="map" className="Map" >
        {newMap}
      </div>
      <div className='rightSide'>
        <div className="Weather">
          {weather}
        </div>
        <div className="Where">
          {whereBox}
        </div>
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

