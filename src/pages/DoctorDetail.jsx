/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faPhone, faEnvelope, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import FormReview from "../components/FormReview";
import { useAlertContext } from "../contexts/AlertContext";
import Stars from "../components/Stars";

const validateName = (name) => {
  return typeof name === 'string' && name.trim().length >= 3;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRating = (rating) => {
  return rating >= 1 && rating <= 5;
};

function DoctorDetail() {
  const emptyRece = {
    rating: 0,
    patient_name: "",
    email: "",
    content: ""
  };

  const navigate = useNavigate();
  const mapRef = useRef(null);
  const { slug } = useParams();
  const location = useLocation();
  const [newRece, setNewRece] = useState(emptyRece);
  const [doc, setDoc] = useState(null);
  const { message, setMessage } = useAlertContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Carica i dati del medico
  useEffect(() => {
    refresh();
  }, [slug]);

  // Aggiorna l'URL con la specializzazione
  useEffect(() => {
    if (doc) {
      const currentParams = new URLSearchParams(location.search);
      currentParams.set("specialization", doc.specialization);

      navigate(`/doctor/${slug}?${currentParams.toString()}`, { replace: true });
    }
  }, [doc, navigate, slug, location.search]);

  // Caricamento della mappa
  useEffect(() => {
    if (doc && doc.address) {
      const map = new google.maps.Map(mapRef.current, {
        zoom: 15,
      });

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: doc.address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          map.setCenter(results[0].geometry.location);
          new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
          });
        }
      });
    }
  }, [doc]);

  const refresh = () => {
    axios.get(`http://localhost:3000/doctors/${slug}`).then((resp) => {
      setDoc(resp.data.data);
    });
  };

  const goToSpecialization = () => {
    if (doc.specialization) {
      navigate(`/search?specialization=${encodeURIComponent(doc.specialization)}`);
    }
  };

  const printRecensioni = () => {
    if (doc.reviews.length) {
      return doc.reviews.map((curRece) => (
        <div key={curRece.id} className="rece-card">
          <p>{new Date(curRece.data).toLocaleDateString()}</p>
          <h5>{curRece.patient_name}</h5>
          <div><strong>Voto: </strong> <Stars voto={curRece.rating} /></div>
          <p>{curRece.content}</p>
        </div>
      ));
    } else {
      return (
        <p className="no-rece">Questo medico non ha ancora recensioni. Sii il primo ad aggiungere una recensione!</p>
      );
    }
  };


  const handleBlur = async (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'patient_name':
        setErrors(prevErrors => ({
          ...prevErrors,
          patient_name: validateName(value) ? '' : 'Il nome deve avere più di 3 caratteri'
        }));
        break;
      case 'email':
        if (!validateEmail(value)) {
          setErrors(prevErrors => ({ ...prevErrors, email: 'La mail inserita non è valida' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, email: '' }));
          await checkEmail(value);
        }
        break;
      default:
        break;
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRece(prev => ({ ...prev, [name]: value }));
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:3000/reviews/doctors/${doc.slug}/reviews`, newRece);
      setNewRece(emptyRece);
      setMessage({ text: 'Grazie per aver lasciato una recensione!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      refresh();
    } catch (error) {
      console.error("Errore durante il submit:", error);
      setMessage({ text: 'Si è verificato un errore, compila i campi contrassegnati(*)', type: 'danger' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {doc &&
        <>
          <div className="my-3">
            <a className="back" onClick={() => navigate(-1)}>Torna indietro</a>
          </div>

          <h2 className="py-2 px-1">{doc.first_name} {doc.last_name}</h2>
          <div className="card card-detail mb-3">
            <div className="row g-0">
              <div className="col-md-4 col-lg-4 col-xxl-3 col-img">
                <div className="imm">
                  <img
                    src={
                      doc.image
                        ? doc.image.startsWith("http")
                          ? doc.image
                          : `http://localhost:3000/images/doctors/${doc.image}`
                        : "http://localhost:3000/images/doctors/placeholder1.webp"
                    }
                    alt={`medico ${doc.first_name} ${doc.last_name}`}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-xxl-5">
                <div className="card-body detail">
                  <p className="mx-1 mb-0" dangerouslySetInnerHTML={{ __html: doc.description }}></p>
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-xxl-4 col-text">
                <div className="card-body detail">
                  <p className="m-1">
                    <FontAwesomeIcon icon={faPhone} /> {doc.phone}
                  </p>
                  <p className="m-1">
                    <FontAwesomeIcon icon={faEnvelope} />{" "}
                    <a href={`mailto:${doc.email}`}>{doc.email}</a>
                  </p>
                  <p className="m-1">
                    <FontAwesomeIcon icon={faMapLocationDot} /> {doc.address}
                  </p>
                  <p className="m-1">
                    <Stars voto={doc.average_rating} />
                  </p>
                  <button onClick={goToSpecialization} className="btn my-2 spec">
                    {doc.specialization}
                  </button>
                </div>
              </div>
            </div>
          </div>


          <h3>Visualizza Mappa</h3>
          <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>

          <h3 className="my-4">Recensioni ({doc.reviews.length})</h3>
          {printRecensioni()}

          <hr className="linea" />

          <FormReview {...{ handleOnSubmit, handleInputChange, newRece, isSubmitting, doc, errors, handleBlur }} />
        </>
      }
    </>
  );
}

export default DoctorDetail;
