import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const apiUrl = "http://localhost:3000";

const RicercaMedici = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializzazioni, setSpecializzazioni] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [selectedSpecialization, setSelectedSpecialization] = useState(queryParams.get("specializzazione") || "");

  useEffect(() => {
    axios.get(`${apiUrl}/doctors`).then((resp) => {
      const allDoctors = resp.data.data;
      const filteredBySpecialization = selectedSpecialization 
        ? allDoctors.filter((doc) => doc.specializzazione === selectedSpecialization) 
        : allDoctors;

      setDoctors(filteredBySpecialization);
    });

    axios.get(`${apiUrl}/specialization`).then((resp) => {
      setSpecializzazioni(resp.data);
    });

  }, [selectedSpecialization]);

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.nome.toLowerCase()} ${doctor.cognome.toLowerCase()}`;
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleSpecializationChange = (e) => {
    const newSpecialization = e.target.value;
    setSelectedSpecialization(newSpecialization);
    navigate(`/ricerca?specializzazione=${newSpecialization}`);
  };

  return (
    <div className="container mt-4">
      <h2>Ricerca Medici</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <select className="form-control" value={selectedSpecialization} onChange={handleSpecializationChange}>
            <option value="">Tutte le specializzazioni</option>
            {specializzazioni.map(spec => (
              <option key={spec.id} value={spec.nome}>{spec.nome}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Cerca per nome o cognome"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="row">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div className="col-md-4 mb-4" key={doctor.id}>
              <div className="card ms-card">
                <img src={doctor.immagine.startsWith("http") ? doctor.immagine : `http://localhost:3000/images/doctors/${doctor.immagine}`} className="card-img-top" alt={doctor.nome} style={{ objectFit: "cover" }} />
                <div className="card-body">
                  <p><strong>Nome e Cognome:</strong> {doctor.nome} {doctor.cognome}</p>
                  <p><strong>Specializzazione:</strong> {doctor.specializzazione}</p>
                  <p><strong>Telefono:</strong> {doctor.telefono}</p>
                  <p><strong>Email:</strong> {doctor.email}</p>
                  <p><strong>Indirizzo:</strong> {doctor.indirizzo}</p>
                  <button className="btn btn-primary" onClick={() => navigate(`/medico/${doctor.slug}`)}>
                    Vai al dettaglio
                  </button>
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
};

export default RicercaMedici;
