import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CardDoctor from "../components/CardDoctor";

function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const navigate = useNavigate();

  // Recupero dottori e specializzazioni
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
      navigate(`/search?specialization=${selectedSpecialization}`);
    }
  };

  return (
    <div className="container mt-4">

      {/* Titolo della pagina */}
      <h1 className="text-center mt-4">Benvenuto su BDoctors</h1>
      <p className="text-center">Trova il dottore specialista che fa per te.</p>

      {/* Selezione Specializzazione e Pulsante di ricerca */}
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

      {/* Sezione per mostrare i migliori dottori */}
      <h2 className="mt-5">I nostri migliori dottori</h2>

      <div className="row mt-3">
        {doctors.length > 0 ? (
          doctors
            .filter(doctor => doctor.average_rating >= 4.5)
            .map(doctor => (
              <CardDoctor key={doctor.id} doctor={doctor} />
            ))
        ) : (
          <p className="text-center">Nessun dottore trovato</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
