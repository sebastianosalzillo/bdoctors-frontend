/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import CardDoctor from "../components/CardDoctor";
import { Autocomplete } from "@react-google-maps/api";

const apiUrl = "http://localhost:3000";


const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [city, setCity] = useState("");
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const autocompleteRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedSpecialization = queryParams.get("specialization") || "";

  //stato iniziale dei filtri
  const protoFilter = {
    specialization: selectedSpecialization,
    name: "",
    address: [],
    page: 1,
  }
  const [filter, setFilter] = useState(protoFilter);

  // Funzione per aggiornare l'URL con i parametri di ricerca
  const updateURL = (specialization, name, city, page) => {
    const params = new URLSearchParams();
    if (page) params.set("page", page);
    if (specialization) params.set("specialization", specialization);
    if (name) params.set("name", name);
    if (city.length !== 0) params.set("city", city);


    navigate(`/search?${params.toString()}`, { replace: true });
  };

  // Funzione per estrarre le parole chiave dall'indirizzo
  function extractKeywords(address) {
    if (typeof address !== 'string' || !address.trim()) return [];
    // Converte in minuscolo e rimuovi spazi inutili
    const lowerAddress = address.toLowerCase().trim();
    // Lista di parole da escludere
    const excludedWords = new Set([
      'via', 'viale', 'vle', 'piazza', 'pza', 'corso', 'viale', 'strada', 'largo', 'vicolo',
      'contrada', 'borgo', 'galleria', 'rotonda', 'traversa', 'salita',
      'discesa', 'ponte', 'lungomare', 'n', 'n.', 'num', 'numero', 'civico', 'int', 'interno',
      'a', 'al', 'alla', 'alle', 'dal', 'dalla', 'dello', 'della', 'dei', 'degli', 'delle',
      'il', 'lo', 'la', 'i', 'gli', 'le',
      'e', 'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra'
    ]);
    // Pulizia della stringa: rimuove tutto tranne lettere e numeri
    const words = lowerAddress
      .replace(/[^\w\s]/g, '') // Rimuove punteggiatura
      .split(/\s+/) // Divide in parole
      .filter(word => word.length > 1 && !excludedWords.has(word));
    return words;
  }

  // Funzione per estrarre le parole dal nome  
  function extractName(name) {
    if (typeof name !== 'string' || !name.trim()) return [];
    // Converti in minuscolo e rimuovi spazi inutili
    const lowerName = name.toLowerCase().trim();
    // Pulizia della stringa: rimuove tutto tranne lettere e numeri
    const words = lowerName
      .replace(/[^\w\s]/g, '') // Rimuove punteggiatura
      .split(/\s+/) // Divide in parole
      .filter(word => word.length > 1); // Mantiene solo parole con più di 1 carattere
    return words;
  }

  // Funzione per filtrare i dottori in base ai criteri di ricerca
  const filterDoctors = () => {
    let newAddress = extractKeywords(filter.address)
    let newName = extractName(filter.name)
    console.log(newAddress);
    axios.get(`${apiUrl}/doctors`, {
      params: {
        specialization: filter.specialization,
        name: newName,
        address: newAddress,
        page: filter.page
      }
    }).then((resp) => {
      updateURL(filter.specialization, filter.name, newAddress, filter.page);
      const allDoctors = resp.data.data;
      setDoctors(allDoctors);
      console.log(allDoctors);
      setTotalDoctors(resp.data.totalDoctors);
      setTotalPages(resp.data.totalPages);
    });
  }
  // carica i dottori e le specializzazioni all'inizio e quando cambia la pagina
  useEffect(() => {
    filterDoctors();
    axios.get(`${apiUrl}/specialization`).then((resp) => {
      setSpecializations(resp.data.data);
    });
  }, [filter.page]);

  useEffect(() => {
    axios.get(`${apiUrl}/specialization`).then((resp) => {
      setSpecializations(resp.data.data);
    });
  }, []);

  // Gestione del cambiamento degli input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
    if (name === "address") {
      setCity(value);  // Mantieni city sincronizzato con il valore inserito
    }
  };

  // Gestione della selezione del luogo dall'autocomplete
  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
    }
    const formattedAddress = place.formatted_address;
    setCity(formattedAddress);
    setFilter({ ...filter, address: formattedAddress }); // Sincronizza filter.address
  };

  // Funzione per avviare la ricerca
  const search = (event) => {
    event.preventDefault();
    setFilter({ ...filter, page: 1 });
    filterDoctors();
  };

  // Funzione per cambiare pagina
  const changePage = (event, a) => {
    event.preventDefault();
    setFilter({ ...filter, page: filter.page + a.value });
  };

  return (
    <>
      {/* Link per tornare indietro */}
      <div className="my-3">
        <a className="back" onClick={() => navigate(-1)}>Torna indietro</a>
      </div>

      {/* Selezione della specializzazione */}
      <div>
        <h2 className="text-center mb-4">Cerca dottori</h2>
        <div className="row mb-4">
          <div className="col-md-4">
            <select className="form-control" name="specialization" value={filter.specialization} onChange={handleChange}>
              <option value="">Tutte le specializzazioni</option>
              {specializations.map(spec => (
                <option key={spec.id} value={spec.name}>{spec.name}</option>
              ))}
            </select>
          </div>

          {/* Input per cercare per nome o cognome */}
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Cerca per nome o cognome"
              name="name"
              value={filter.name}
              onChange={handleChange}
            />
          </div>

          {/* Input per cercare per città con autocomplete */}
          <div className="col-md-4">
            <Autocomplete
              onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={handlePlaceSelect}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Cerca per città"
                name="address"
                value={filter.address}
                onChange={handleChange}
              />
            </Autocomplete>
          </div>

          {/* Bottone per avviare la ricerca */}
          <div className="text-center mb-4">
            <button className="btn btn-primary" onClick={search}>
              Cerca
            </button>
          </div>
        </div>


        <div>
          {doctors.length > 0 ? (
            <>
              {/* Mostra il numero totale di dottori trovati e le pagine totali */}
              <h4 className="my-2">Sono stati trovati {totalDoctors} medici</h4>
              <div className="my-2">
                <span>Pagina {filter.page} di {totalPages}</span>
                <br />
              </div>
              <div className="row">
                {/* Mappa i dottori trovati */}
                {doctors.map((doctor) => (
                  <CardDoctor key={doctor.id} doctor={doctor} />
                ))}
              </div>
              <div>
                <span>Pagina {filter.page} di {totalPages}</span>
                <br />
              </div>
              {/* Bottoni per andare alla pagina precedente o successiva */}
              <div className="d-flex mb-3 gap-3">
                <button className="btn btn-primary" onClick={(event) => changePage(event, { value: -1 })} disabled={filter.page <= 1}>Indietro</button>
                <button className="btn btn-primary" onClick={(event) => changePage(event, { value: 1 })} disabled={doctors.length < 9 || filter.page >= totalPages}>Avanti</button>
              </div>

            </>
          ) : (
            <p className="text-center">Nessun medico trovato</p>
          )}
        </div>
      </div>

    </>
  );
};

export default SearchDoctors;

