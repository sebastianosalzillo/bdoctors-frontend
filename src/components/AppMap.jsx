import React from "react";
import { Modal, Button } from "react-bootstrap";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";


// Componente AppMap che mostra una mappa di Google all'interno di un modal
const AppMap = ({ show, handleClose, address, lat, lng, firstName, lastName }) => {
  // Stile del contenitore della mappa
  const mapContainerStyle = {
    height: "400px",
    width: "100%"
  };
 // Centro della mappa basato sulle coordinate lat e lng
  const center = {
    lat: lat,
    lng: lng
  };

  return (
    // Modal di Bootstrap che mostra la mappa
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Posizione su Mappa di {firstName} {lastName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
       
       {/* Componente GoogleMap che carica la mappa */}
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
          >
            {/* Marker che indica la posizione sulla mappa */}
            <Marker position={center} />
          </GoogleMap>
        
      </Modal.Body>
      <Modal.Footer>
        {/* Bottone per chiudere il modal */}
        <Button variant="secondary" onClick={handleClose}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppMap;
