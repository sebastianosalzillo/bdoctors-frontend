import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import CardDoctor from "../components/CardDoctor";
import { Autocomplete } from "@react-google-maps/api";

const apiUrl = "http://localhost:3000";


const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [city, setCity] = useState("");
  const [filteredSearchTerm, setFilteredSearchTerm] = useState("");
  const [filteredCity, setFilteredCity] = useState("");

  const autocompleteRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [selectedSpecialization, setSelectedSpecialization] = useState(queryParams.get("specialization") || "");


  useEffect(() => {
    axios.get(`${apiUrl}/doctors`).then((resp) => {
      const allDoctors = resp.data.data;
      const filteredBySpecialization = selectedSpecialization
        ? allDoctors.filter((doc) => doc.specialization === selectedSpecialization)
        : allDoctors;

      setDoctors(filteredBySpecialization);
    });

    axios.get(`${apiUrl}/specialization`).then((resp) => {
      setSpecializations(resp.data.data);
    });

  }, [selectedSpecialization]);

  useEffect(() => {
    console.log("Doctors updated: ", doctors);
    console.log("Filtered Search Term: ", filteredSearchTerm);
    console.log("Filtered City: ", filteredCity);
  }, [doctors, filteredSearchTerm, filteredCity]);

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.first_name.toLowerCase()} ${doctor.last_name.toLowerCase()}`;

    const address = doctor.address ? doctor.address.toLowerCase() : "";
    const cityKeywords = filteredCity.toLowerCase().split(' '); // Suddividi l'input della città in parole chiave
    const matchCity = cityKeywords.some(keyword => address.includes(keyword)); // Verifica se una delle parole chiave è presente nell'indirizzo

    return fullName.includes(filteredSearchTerm.toLowerCase()) && matchCity;
  });


  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    setCity(place.formatted_address);
  };

  const handleSpecializationChange = (e) => {
    const newSpecialization = e.target.value;
    setSelectedSpecialization(newSpecialization);
    navigate(`/search?specialization=${newSpecialization}`);
  };

  const handleSearch = () => {
    setFilteredSearchTerm(searchTerm);
    setFilteredCity(city);
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
            <select className="form-control" value={selectedSpecialization} onChange={handleSpecializationChange}>
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
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
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
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </Autocomplete>
          </div>
          <div className="text-center mb-4">
            <button className="btn btn-primary" onClick={handleSearch}>
              Cerca
            </button>
          </div>
        </div>


        <div>
          {filteredDoctors.length > 0 ? (
            <>
              <h4 className="my-3">Sono stati trovati {filteredDoctors.length} medici</h4>
              <div className="row">
                {filteredDoctors.map((doctor) => (
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
