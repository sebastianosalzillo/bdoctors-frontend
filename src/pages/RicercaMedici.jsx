import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiUrl = 'http://localhost:3000';

const RicercaMedici = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const getDoctors = () => {
    axios.get(`${apiUrl}/doctors`).then((resp) => {
      setDoctors(resp.data.data);
    })
  }

  useEffect(() => {
    getDoctors()
  }, []);

  // Filtro per nome e cognome
  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.nome.toLowerCase()} ${doctor.cognome.toLowerCase()}`;
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div>
        <h2>Ricerca Medici</h2>

        {/* Barra di ricerca */}
        <input
          type="text"
          placeholder="Cerca per nome o cognome"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {/* Dettaglio medici */}
        <div className="row">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div className="cols-md-4" key={doctor.id}>
                <div className="card">
                  <img src={doctor.immagine} className="card-img-top" alt="" />
                </div>
                <div className="card-body">
                  <p><strong>Nome e Cognome:</strong> {doctor.nome} {doctor.cognome}</p>
                  <p><strong>Specializzazione:</strong> {doctor.specializzazione}</p>
                  <p><strong>Telefono:</strong> {doctor.telefono}</p>
                  <p><strong>Email:</strong> {doctor.email}</p>
                  <p><strong>Indirizzo:</strong> {doctor.indirizzo}</p>
                </div>
                <button onClick={() => navigate(`/medico/${doctor.slug}`)}>
                  Vai al dettaglio
                </button>
              </div>
            ))
          ) : (
            <p>Nessun medico trovato</p>
          )}
        </div>
      </div>
    </>
  );
};

export default RicercaMedici;
