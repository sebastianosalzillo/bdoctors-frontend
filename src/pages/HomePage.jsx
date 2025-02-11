import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const navigate = useNavigate();

  // Recupero dati dal backend
  useEffect(() => {
    axios.get("http://localhost:3000/doctors")
      .then(response => setDoctors(response.data.data))
      .catch(error => console.error("Errore nel recupero dottori", error));

    axios.get("http://localhost:3000/specialization")
      .then(response => setSpecializations(response.data.data))
      .catch(error => console.error("Errore nel recupero specializzazioni", error));
  }, []);

  // 🔹 Funzione per navigare alla ricerca con la specializzazione selezionata
  const handleSearchBySpecialization = () => {
    if (selectedSpecialization) {
      navigate(`/ricerca?specialization=${selectedSpecialization}`);
    }
  };

  return (
    <div className="container mt-4">

      <h1 className="text-center mt-4">Benvenuto su BDoctors</h1>
      <p className="text-center">Trova il doctor specialista che fa per te.</p>

      {/* 🔍 Selezione Specializzazione e Pulsante di Ricerca */}
      <div className="row mt-4 align-items-center">
        <div className="col-md-8">
          <select
            className="form-control my-1"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            <option value="">Tutte le specializzazioni</option>
            {specializations.map((spec) => (
              <option key={spec.id} value={spec.name}>{spec.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-primary w-100 my-1"
            onClick={handleSearchBySpecialization}
            disabled={!selectedSpecialization}
          >
            Cerca
          </button>
        </div>
      </div>

      <h2 className="mt-5">I nostri migliori dottori</h2>

      <div className="row mt-3">
        {doctors.length > 0 ? (
          doctors
            .filter(doctor => doctor.average_rating >= 4.5)
            .map(doctor => (
              <div key={doctor.id} className="col-md-4 mb-4">
                <div className="card ms-card">
                  <img
                    src={doctor.image.startsWith("http") ? doctor.image : `http://localhost:3000/images/doctors/${doctor.image}`}
                    className="card-img-top"
                    alt={doctor.first_name}
                    style={{ objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{doctor.first_name} {doctor.last_name}</h5>
                    <p className="card-text"><strong>Specializzazione:</strong> {doctor.specialization}</p>
                    <p className="card-text"><strong>Media Voto:</strong> {doctor.average_rating}/5</p>
                    <Link to={`/dottori/${doctor.slug}`} className="btn btn-primary">Vedi dettagli</Link>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p className="text-center">Nessun dottore trovato</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
