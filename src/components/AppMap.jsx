import React from "react";
import { Modal, Button } from "react-bootstrap";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";



const AppMap = ({ show, handleClose, address, lat, lng, firstName, lastName }) => {
  const mapContainerStyle = {
    height: "400px",
    width: "100%"
  };

  const center = {
    lat: lat,
    lng: lng
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Posizione su Mappa di {firstName} {lastName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
       
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
          >
            <Marker position={center} />
          </GoogleMap>
        
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppMap;
