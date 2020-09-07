import React, {useEffect, useState} from 'react';
import './App.css';
import { JsonToTable } from "react-json-to-table";
const request = require('request');

function App() {
  const[display, setDisplay] = useState([]);
  useEffect(() => {
    request (reqStation, false, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        setDisplay((JSON.parse(JSON.stringify(body.data.bikeRentalStations, null, 4))));
      }
    });
     }, []);
  return (
    <div className="App">
      <h1>Kaupunkipyörätilanne</h1>
        <JsonToTable json={display} />
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
  }
  }` },
  json: true
};

export default App;
