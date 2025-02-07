import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const [medici, setMedici] = useState([]); 
  const [specializzazioni, setSpecializzazioni] = useState([]); 
  const [selectedSpecialization, setSelectedSpecialization] = useState(""); 
  const navigate = useNavigate(); // ✅ Hook per la navigazione

  // Recupero dati dal backend
  useEffect(() => {
    axios.get("http://localhost:3000/doctors")
      .then(response => setMedici(response.data.data))
      .catch(error => console.error("Errore nel recupero medici", error));

    axios.get("http://localhost:3000/specialization")
      .then(response => setSpecializzazioni(response.data))
      .catch(error => console.error("Errore nel recupero specializzazioni", error));
  }, []);

  // 🔹 Funzione per navigare alla ricerca con la specializzazione selezionata
  const handleSearchBySpecialization = () => {
    if (selectedSpecialization) {
      navigate(`/ricerca?specializzazione=${selectedSpecialization}`);
    }
  };

  return (
    <div className="container mt-4">
      {/* Bottone in alto a destra */}
      <div className="d-flex justify-content-end">
        <Link to="/registrazione" className="btn btn-success">Registra il tuo profilo</Link>
      </div>

      <h1 className="text-center mt-4">Benvenuto su BDoctors</h1>
      <p className="text-center">Trova il medico specialista che fa per te.</p>

      {/* 🔍 Selezione Specializzazione e Pulsante di Ricerca */}
      <div className="row mt-4">
        <div className="col-md-8">
          <select
            className="form-control"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            <option value="">Tutte le specializzazioni</option>
            {specializzazioni.map(spec => (
              <option key={spec.id} value={spec.nome}>{spec.nome}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <button 
            className="btn btn-primary w-100" 
            onClick={handleSearchBySpecialization} 
            disabled={!selectedSpecialization}
          >
            Cerca
          </button>
        </div>
      </div>

      <h2 className="mt-5">I nostri migliori medici</h2>

      <div className="row mt-3">
        {medici.length > 0 ? (
          medici.map(medico => (
            <div key={medico.id} className="col-md-4 mb-4">
              <div className="card">
                <img src={medico.immagine} className="card-img-top" alt={medico.nome} style={{ height: "200px", objectFit: "cover" }} />
                <div className="card-body">
                  <h5 className="card-title">{medico.nome} {medico.cognome}</h5>
                  <p className="card-text"><strong>Specializzazione:</strong> {medico.specializzazione}</p>
                  <p className="card-text"><strong>Media Voto:</strong> {medico.media_voto}/5</p>
                  <Link to={`/medico/${medico.slug}`} className="btn btn-primary">Vedi dettagli</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Nessun medico trovato</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
