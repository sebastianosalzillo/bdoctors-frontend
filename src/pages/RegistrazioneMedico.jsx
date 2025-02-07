import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function DoctorRegistration() {
  const initialFormRegistration = {
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    indirizzo: '',
    specializzazione: '',
    servizi: '',
    immagine: null,
    genere: ''
  };

  const [formData, setFormData] = useState(initialFormRegistration);
  const [specializzazioni, setSpecializzazioni] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Effettuare la chiamata API per ottenere le specializzazioni
    axios.get('/api/specializzazioni')
      .then(response => {
        setSpecializzazioni(response.data);
      })
      .catch(error => {
        console.error('Error fetching specializzazioni:', error);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      immagine: event.target.files[0]
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    axios.post('/register-doctor', data)
      .then(response => {
        console.log('Success:', response.data);
        navigate('/success'); // Naviga alla pagina specifica dopo il successo
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="container">
      <h3 className="text-center">Sei un nuovo? Registrati qui!</h3>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <h6 className="my-4">Dati anagrafici</h6>
                <div className="form-group">
                  <label htmlFor="nome">Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="cognome">Cognome</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cognome"
                    name="cognome"
                    value={formData.cognome}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>
              <div className="form-group mt-3">
                <label htmlFor="genere">Genere</label>
                <select
                  className="form-control"
                  id="genere"
                  name="genere"
                  value={formData.genere}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleziona genere</option>
                  <option value="Maschio">Maschio</option>
                  <option value="Femmina">Femmina</option>
                  <option value="Non indicato">Non indicato</option>
                </select>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <h6 className="my-4">Contatti</h6>
              <div className="form-group">
                <label htmlFor="telefono">Numero di telefono</label>
                <input
                  type="text"
                  className="form-control"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className="form-group mt-3">
                  <label htmlFor="indirizzo">Indirizzo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="indirizzo"
                    name="indirizzo"
                    value={formData.indirizzo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <hr />
            <h6 className="mt-4">Info sulla professione</h6>
            <div className="form-group mb-3">
              <label htmlFor="specializzazione">Specializzazione</label>
              <select
                className="form-control"
                id="specializzazione"
                name="specializzazione"
                value={formData.specializzazione}
                onChange={handleChange}
                required
              >
                <option value="">Seleziona specializzazione</option>
                {specializzazioni.map(specializzazione => (
                  <option key={specializzazione.id} value={specializzazione.nome}>
                    {specializzazione.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="servizi">Servizi</label>
              <textarea
                className="form-control"
                id="servizi"
                name="servizi"
                value={formData.servizi}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <hr />
            <h6 className="mt-4">Immagine di profilo</h6>
            <div className="form-group mb-3 w-100">
              <label htmlFor="immagine">Immagine di profilo</label>
              <input
                type="file"
                className="form-control mt-1"
                id="immagine"
                name="immagine"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary mt-5">Registrati</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorRegistration;

