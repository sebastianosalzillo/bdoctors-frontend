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
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
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

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      setLatitude(place.geometry.location.lat());
      setLongitude(place.geometry.location.lng());
    }
    setCity(place.formatted_address);
  };

  const handleSpecializationChange = (e) => {
    const newSpecialization = e.target.value;
    setSelectedSpecialization(newSpecialization);
    updateURL(newSpecialization, filteredSearchTerm, filteredCity);
  };

  const handleSearch = () => {
    setFilteredSearchTerm(searchTerm);
    setFilteredCity(city);
    updateURL(selectedSpecialization, searchTerm, city);
  };

  const updateURL = (specialization, name, city) => {
    const params = new URLSearchParams();
    if (specialization) params.set("specialization", specialization);
    if (name) params.set("name", name);
    if (city) params.set("city", city);

    navigate(`/search?${params.toString()}`, { replace: true });
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.first_name.toLowerCase()} ${doctor.last_name.toLowerCase()}`;
    let isWithinDistance = true;

    const sanitizedCity = filteredCity
      .toLowerCase()
      .replace(/\b(via|italia)\b/g, '')
      .trim();

    const address = doctor.address ? doctor.address.toLowerCase() : "";
    const cityKeywords = sanitizedCity.split(' ');
    const matchCity = cityKeywords.some(keyword => address.includes(keyword));

    if (latitude && longitude && doctor.latitude && doctor.longitude) {
      const distance = getDistance(latitude, longitude, doctor.latitude, doctor.longitude);
      isWithinDistance = distance <= 10;
    }

    return fullName.includes(filteredSearchTerm.toLowerCase()) && matchCity && isWithinDistance;
  });

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
                placeholder="Cerca per città o indirizzo"
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
