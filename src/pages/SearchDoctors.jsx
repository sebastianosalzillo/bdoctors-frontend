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
  // const [latitude, setLatitude] = useState(null);
  // const [longitude, setLongitude] = useState(null);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const autocompleteRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedSpecialization = queryParams.get("specialization") || "";
  const protoFilter = {
    specialization: selectedSpecialization,
    name: "",
    address: [],
    page: 1,
  }
  const [filter, setFilter] = useState(protoFilter);

  const updateURL = (specialization, name, city, page) => {
    const params = new URLSearchParams();
    if (page) params.set("page", page);
    if (specialization) params.set("specialization", specialization);
    if (name) params.set("name", name);
    if (city) params.set("city", city);

    navigate(`/search?${params.toString()}`, { replace: true });
  };

  function extractKeywords(address) {
    if (typeof address !== 'string' || !address.trim()) return [];
    if (city) { address = city }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilter = { ...filter, [name]: value, };
    console.log(newFilter);
    setFilter(newFilter);
    setCity("");
    console.log(totalDoctors)
  }

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      // setLatitude(place.geometry.location.lat());
      // setLongitude(place.geometry.location.lng());
    }
    setCity(place.formatted_address);
  };

  const search = (event) => {
    event.preventDefault();
    setFilter({ ...filter, page:1 });
    filterDoctors();
  };

  const changePage = (event, a) => {
    event.preventDefault();
    setFilter({ ...filter, page: filter.page + a.value });
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
              <h4 className="my-3">Sono stati trovati {totalDoctors} medici</h4>
              <div>
                <span>Pagina {filter.page} di {totalPages}</span>
                <br />
              </div>
              <div className="d-flex mb-3 gap-3">
                <button className="btn btn-primary" onClick={(event) => changePage(event, { value: -1 })} disabled={filter.page <= 1}>Indietro</button>
                <button className="btn btn-primary" onClick={(event) => changePage(event, { value: 1 })} disabled={doctors.length < 10 || filter.page >= totalPages}>Avanti</button>
              </div>
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

