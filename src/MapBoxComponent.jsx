import React, { useState } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import roadSegmentsData from "./roadSegmentsData.js"; // Adjust path as needed

const MapboxRoadSegments = () => {
  const [hoverInfo, setHoverInfo] = useState(null);

  const [viewport, setViewport] = useState({
    latitude: 33.7389, // Default center (San Francisco)
    longitude: -118.2786,
    zoom: 12,
  });

  // Replace with your own Mapbox access token
  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

  // Style for the road segments layer
  const roadLayer = {
    id: "road-layer",
    type: "line",
    paint: {
      "line-color": "#FF2C2C",
      "line-width": 5,
    },
  };

  const handleHover = (event) => {
    const { features, point } = event;
    const roadFeature = features && features[0];

    if (roadFeature) {
      setHoverInfo({
        name: roadFeature.properties.seg_id,
        truck_count: roadFeature.properties.Traj_Count,
        lngLat: event.lngLat,
        x: point.x,
        y: point.y,
      });
    } else {
      setHoverInfo(null);
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <Map
        initialViewState={viewport}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={(evt) => setViewport(evt.viewState)}
        interactiveLayerIds={["road-layer"]} // Specify which layer to make interactive
        onMouseMove={handleHover} // Listen for hover events
      >
        <Source id="road-data" type="geojson" data={roadSegmentsData}>
          <Layer {...roadLayer} />
        </Source>

        {hoverInfo && (
          <Popup
            longitude={hoverInfo.lngLat.lng}
            latitude={hoverInfo.lngLat.lat}
            anchor="bottom"
            closeButton={false}
            closeOnClick={false}
          >
            <div style={{ fontSize: "15px" }}>
              Segment ID - {hoverInfo.name}
            </div>
            <div style={{ fontSize: "15px" }}>
              Truck Count - {hoverInfo.truck_count}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapboxRoadSegments;
