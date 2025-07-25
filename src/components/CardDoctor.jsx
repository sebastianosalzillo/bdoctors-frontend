/* eslint-disable react/prop-types */
import Stars from "../components/Stars";
import { Link } from "react-router-dom";
import AppMap from "./AppMap";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const CardDoctor = ({ doctor }) => {
  // Stato per gestire la visualizzazione della mappa e le coordinate
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

// Funzione per gestire il click sull'indirizzo
  const handleAddressClick = () => {
    // Esegui una chiamata API a Google Maps Geocoding per ottenere le coordinate dell'indirizzo
    const address = doctor.address;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapsApiKey}`;

    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setCoordinates({ lat: location.lat, lng: location.lng });
          setShowMap(true);
        }
      })
      .catch(error => console.error("Errore nella geocodifica:", error));
  };

  return (
    <>
      <div key={doctor.id} className="col-md-4 mb-4 ">
        <div className="card ms-card  h-100">
          <div className="text-center">
            <img
              src={doctor.image ? (doctor.image.startsWith("http")
                ? doctor.image
                : `http://localhost:3000/images/doctors/${doctor.image}`)
                : 'placeholder1.webp'}
              className="card-img-top"
              alt={doctor.first_name}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="card-body home lh-sm">
            <h5 className="card-title">{doctor.first_name} {doctor.last_name}</h5>
            <p className="card-text my-1"> <strong>Specializzazione: </strong>{doctor.specialization}</p>
            <p className="card-text my-1"
              onClick={handleAddressClick}
              style={{ cursor: "pointer", color: "blue" }}>
              <span><FontAwesomeIcon className="text-dark" icon={faMapLocationDot} />   {doctor.address}</span>
            </p>
            <p className="card-text my-1"> <Stars voto={doctor.average_rating} /></p>
          </div>
          <div className="button-container">
            <Link to={`/doctor/${doctor.slug}`} className="btn btn-primary ms-3 mb-3 mt-1 w-50">Vedi dettagli</Link>
          </div>

        </div>
        <AppMap
          firstName={doctor.first_name}
          lastName={doctor.last_name}
          show={showMap}
          handleClose={() => setShowMap(false)}
          lat={coordinates.lat}
          lng={coordinates.lng}
        />
      </div>
    </>
  )
};

export default CardDoctor;