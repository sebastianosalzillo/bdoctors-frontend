import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const apiUrl = "http://localhost:3000";

const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [city, setCity] = useState("");

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

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.first_name.toLowerCase()} ${doctor.last_name.toLowerCase()}`;

    const cityInAddress = doctor.address.split(",")[1]?.trim().toLowerCase();
    const matchCity = city ? cityInAddress?.includes(city.toLowerCase()) : true;

    return fullName.includes(searchTerm.toLowerCase()) && matchCity;
  });

  const handleSpecializationChange = (e) => {
    const newSpecialization = e.target.value;
    setSelectedSpecialization(newSpecialization);
    navigate(`/search?specialization=${newSpecialization}`);
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
            <input
              type="text"
              className="form-control"
              placeholder="Cerca per città"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
          </div>
        </div>


        <div>
          {filteredDoctors.length > 0 ? (
            <>
              <h4 className="my-3">Sono stati trovati {filteredDoctors.length} medici</h4>
              <div className="row">
                {filteredDoctors.map((doctor) => (
                  <div className="col-md-4 mb-4" key={doctor.id}>
                    <div className="card ms-card p-3">
                      <img
                      className="card-img-top mt-0"
                      alt={doctor.first_name}
                      style={{ objectFit: "cover" }}
                        src={doctor.image ? (doctor.image.startsWith("http")
                          ? doctor.image
                          : `http://localhost:3000/images/doctors/${doctor.image}`)
                          : 'placeholder1.webp'}
                        
                      />

                      <div className="card-body search">
                        <p className="m-1 mt-2"><strong>Nome e Cognome:</strong> {doctor.first_name} {doctor.last_name}</p>
                        <p className="m-1"><strong>Specializzazione:</strong> {doctor.specialization}</p>
                        <p className="m-1"><strong>Indirizzo:</strong> {doctor.address}</p>
                        <p className="m-1"><strong>Media Voto:</strong> {doctor.average_rating}/5</p>
                        <button className="btn btn-primary" onClick={() => navigate(`/doctor/${doctor.slug}`)}>
                          Vai ai dettagli
                        </button>
                      </div>
                    </div>
                  </div>))}
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
