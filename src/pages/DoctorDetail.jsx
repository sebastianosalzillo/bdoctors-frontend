import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar, faPhone, faEnvelope, faMapLocationDot, } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";
import FormReview from "../components/FormReview";
import { useAlertContext } from "../contexts/AlertContext";

const validateName = (name) => {
  return typeof name === 'string' && name.trim().length >= 3;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRating = (rating) => {
  return rating > 0 && rating <= 5;
}

function DoctorDetail() {

  const emptyRece = {
    rating: 0,
    patient_name: "",
    email: "",
    content: ""
  }

  const navigate = useNavigate();
  const array = [1, 2, 3, 4, 5]
  const { slug } = useParams();
  const [newRece, setNewRece] = useState(emptyRece)
  const [doc, setDoc] = useState(null)
  const { message, setMessage } = useAlertContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const gotToSpec = () => {
    if (doc.specialization) {
      navigate(`/search?specialization=${doc.specialization}`)
    }
  }

  useEffect(() => {
    refresh()
  }, [slug])

  const refresh = () => {
    axios.get(`http://localhost:3000/doctors/${slug}`).then((resp) => {
      setDoc(resp.data.data)
    })
  }

  const stelline = (voto) => {
    return array.map((cur) => {
      if (voto >= cur) {
        return <FontAwesomeIcon key={cur} icon={solidStar} />
      } else {
        return <FontAwesomeIcon key={cur} icon={regularStar} />
      }
    })
  };

  const printRecensioni = () => {
    if (doc.reviews.length) {
      const rece = doc.reviews
      const risp = rece.map((curRece) => {
        return (
          <div key={curRece.id} className="rece-card">
            <p>{new Date(curRece.data).toLocaleDateString()}</p>
            <h5>{curRece.patient_name}</h5>
            <div><strong>Voto: </strong> {stelline(curRece.rating)}</div>
            <p>{curRece.content}</p>
            {/* <a href={`mailto:${curRece.email}`}>{curRece.email}</a> */}
          </div>
        );
      })
      return risp
    } else {
      return (<>
        <p className="no-rece">Questo medico non ha ancora recensioni. Sii il primo ad aggiungere una recensione!</p>
      </>)
    }

  }

  const checkEmail = async (email) => {
    try {
      const response = await axios.post('http://localhost:3000/doctors', { emailOnly: email });
      if (response.data.exists) {
        setErrors(prevErrors => ({ ...prevErrors, email: "Email già registrata" }));
        return false; // Indica che l'email non è valida
      } else {
        setErrors(prevErrors => ({ ...prevErrors, email: "" }));
        return true; // Indica che l'email è valida
      }
    } catch (error) {
      console.error('Errore durante la verifica dell\'email:', error);
      return false; // In caso di errore, l'email non è valida
    }
  };

  const handleBlur = async (event) => {
    const { name, value } = event.target;

    // Esegui la validazione solo al blur
    switch (name) {
      case 'patient_name':
        if (!validateName(value)) {
          setErrors(prevErrors => ({ ...prevErrors, patient_name: 'Il nome deve avere più di 3 caratteri' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, patient_name: '' }));
        }
        console.log(errors);
        break;
      case 'email':
        if (!validateEmail(value)) {
          setErrors(prevErrors => ({ ...prevErrors, email: 'La mail inserita non è valida' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, email: '' }));
          await checkEmail(value);
        }
        break;
      case 'rating':
        if (!validateRating(parseInt(value))) {
          setErrors(prevErrors => ({ ...prevErrors, rating: 'Inserisci una valutazione' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, rating: '' }));
        }
        break;
      default:
        break;
    }
  };


  const handleInputChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    const obj = {
      ...newRece,
      [name]: value
    }
    setNewRece(obj)
  }

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true)
    console.log("Inizio submit");
    try {
      await axios.post(`http://localhost:3000/reviews/doctors/${doc.slug}/reviews`, newRece);
      setNewRece(emptyRece);
      setMessage({ text: 'Grazie per aver lasciato una recensione!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      refresh();
  } catch (error) {
      // Gestione degli errori se necessario
      console.error("Errore durante il submit:", error);
      setMessage({ text: 'Si è verificato un errore', type: 'error' });
  } finally {
      // Riabilita il bottone dopo il refresh
      setIsSubmitting(false);
  }
}

  return (<>
    {doc &&
      <>
        <div className="my-3">
          <a className="back" onClick={() => navigate(-1)}>Torna indietro</a>
        </div>

        <h2 className="py-2 px-1">{doc.first_name} {doc.last_name}</h2>
        <div className="card card-detail mb-3">
          <div className="row g-0">
            <div className="col-md-4 col-lg-3 col-xxl-2 col-img">
              <div className="imm">                
                <img src={doc.image ? (doc.image.startsWith("http")
                  ? doc.image
                  : `http://localhost:3000/images/doctors/${doc.image}`)
                  : 'http://localhost:3000/images/doctors/placeholder1.webp'} alt={`medico ${doc.first_name} ${doc.last_name}`} />
              </div>
            </div>
            <div className="col-md-8 col-text">
              <div className="card-body detail">                     
                <p className="ps-1 my-1"><FontAwesomeIcon icon={faPhone} /> {doc.phone}</p>
                <p className="ps-1 my-1"><FontAwesomeIcon icon={faEnvelope} /> <a href={`mailto:${doc.email}`}>{doc.email}</a></p>
                <p className="ps-1 my-1"><span><FontAwesomeIcon icon={faMapLocationDot} /></span>  {doc.address}</p>
                <p className="ps-1 my-1"><FontAwesomeIcon icon={solidStar} /> {doc.average_rating}</p>
                <button onClick={gotToSpec} className="btn my-1 spec">{doc.specialization}</button>
                <p className="ps-1 my-1">{doc.description}</p>
              </div>
            </div>
          </div>
        </div>



        <div>
          <h3 className="my-4">Recensioni ({doc.reviews.length})</h3>
          {printRecensioni()}
        </div>

        <hr className="linea" />

        <FormReview
          handleOnSubmit={handleOnSubmit}
          handleInputChange={handleInputChange}
          newRece={newRece}
          array={array}
          isSubmitting={isSubmitting}
          doc={doc}
          errors={errors}
          handleBlur={handleBlur}
        />
      </>
    }
  </>
  );
}

export default DoctorDetail;
