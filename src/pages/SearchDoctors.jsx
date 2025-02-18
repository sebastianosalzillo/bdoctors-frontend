import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import CardDoctor from "../components/CardDoctor";
import { Autocomplete } from "@react-google-maps/api";

const apiUrl = "http://localhost:3000";


const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("");
  // const [filteredSearchTerm, setFilteredSearchTerm] = useState("");
  // const [filteredCity, setFilteredCity] = useState("");

  const autocompleteRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedSpecialization = queryParams.get("specialization") || "";
  const protoFilter = {
    specialization: selectedSpecialization,
    name: "",
    address: [],
  }

  const [filter, setFilter] = useState(protoFilter);

  function extractKeywords(address) {
    if (typeof address !== 'string' || !address.trim()) return [];
    if (city) {
      address = city
    }
    console.log(address);


    // Converti in minuscolo e rimuovi spazi inutili
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


  const filterDoctors = () => {
    let newAddress = extractKeywords(filter.address)
    console.log(newAddress);
    axios.get(`${apiUrl}/doctors`, {
      params: {
        specialization: filter.specialization,
        name: filter.name,
        address: newAddress,
      }
    }).then((resp) => {
      console.log(resp.data.data);
      const allDoctors = resp.data.data;
      setDoctors(allDoctors);
    });
  }

  useEffect(() => {
    filterDoctors();
    axios.get(`${apiUrl}/specialization`).then((resp) => {
      setSpecializations(resp.data.data);
    });

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilter = { ...filter, [name]: value };
    console.log(newFilter);
    setFilter(newFilter);
    setCity("");
  }

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    setCity(place.formatted_address);
  };

  const search = (event) => {
    event.preventDefault();
    filterDoctors();
  };

  return (
    <>
      <div className="my-3">
        <a className="back" onClick={() => navigate(-1)}>Torna indietro</a>
      </div>

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
          <div className="text-center mb-4">
            <button className="btn btn-primary" onClick={search}>
              Cerca
            </button>
          </div>
        </div>


        <div>
          {doctors.length > 0 ? (
            <>
              <h4 className="my-3">Sono stati trovati {doctors.length} medici</h4>
              <div className="row">
                {doctors.map((doctor) => (
                  <CardDoctor key={doctor.id} doctor={doctor} />
                ))}
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
