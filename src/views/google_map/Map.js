import React from "react";
//import GoogleMapReact from 'google-map-react';
import "../configure/parameters/ProductDetails.css";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Map = () => {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    // Important! Always set the container height explicitly
    // <div style={{ height: '100vh', width: '100%' }}>
    <div className="map-container">
      <div style={{ width: "100%", height: "100%" }}>
        {/* <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDvqub0gVMyj_O-pMmLRkQQKP_UsCMKFXQ' }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
        </GoogleMapReact> */}
      </div>
    </div>
  );
};

export default Map;
