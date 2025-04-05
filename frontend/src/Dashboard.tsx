import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import ReactMapGL from "react-map-gl";
import "./App.css";
import React from "react";

const Dashboard = () => {
  const [viewport, setViewport] = React.useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
    width: "100%",
    height: "100%",
  });

  return (
    <>
      <div>
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Map</h1>
      <div className="card">
        <ReactMapGL
          {...viewport}
          onMove={(evt) =>
            setViewport({
              ...viewport,
              latitude: evt.viewState.latitude,
              longitude: evt.viewState.longitude,
              zoom: evt.viewState.zoom,
            })
          }
          style={{ width: "100%", height: "100%" }}
          mapboxAccessToken="pk.eyJ1IjoiamllZGQiLCJhIjoiY2t2Ynp0ZWVjOWh3dTJwdDlmZTE4dXl2YyJ9.aTXcAmgOf6hZ04SX-M6eGQ"
          mapStyle="mapbox://styles/mapbox/streets-v9"
        ></ReactMapGL>
      </div>
    </>
  );
};

export default Dashboard;
