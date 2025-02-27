import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormDoctor from "../components/FormDoctor";
import axios from 'axios';
import { useAlertContext } from "../contexts/AlertContext";

// Funzioni di validazione
const validateName = (name) => {
  return typeof name === 'string' && name.trim().length >= 3;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[0-9]{1,15}$/;
  return phoneRegex.test(phone);
};

const validateAddress = (address) => {
  return typeof address === 'string' && address.trim().length >= 5;
};

const validateDescription = (description) => {
  return typeof description === 'string' && description.trim().length >= 6;
};

const validateGender = (gender) => {
  return gender === 'M' || gender === 'F' || gender === 'X';
};

const validateSpecialization = (id_specialization) => {
  return id_specialization !== '';
};

//mostra messaggi di errore o successo
const showMessage = (setMessage, text, type) => {
  setMessage({ text, type });
  setTimeout(() => setMessage({ text: '', type: '' }), 3000); 
};

{/* Sezione per mostrare i migliori dottori */}
function DoctorRegistration() {
  const initialFormRegistration = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    id_specialization: '',
    description: '',
    image: '',
    gender: ''
  };

  const [formData, setFormData] = useState(initialFormRegistration);
  const [specialization, setSpecialization] = useState([]);
  const [errors, setErrors] = useState({});
  const { setMessage } = useAlertContext();
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();


  //recupera specializzazioni
  useEffect(() => {
    axios.get('http://localhost:3000/specialization')
      .then(response => {
        setSpecialization(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching specializations:', error);
      });
  }, []);

  //valida il form ogni volta che i dati e gli errori cambiano
  useEffect(() => {
    const isValid = formData.first_name && !errors.first_name &&
      formData.last_name && !errors.last_name &&
      formData.email && !errors.email &&
      formData.phone && !errors.phone &&
      formData.address && !errors.address &&
      formData.description && !errors.description &&
      formData.gender && !errors.gender &&
      formData.id_specialization && !errors.id_specialization;
    setIsFormValid(isValid);
  }, [formData, errors,]);

  //verifica se la mail già esiste
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

  //Verifica se il telefono già esiste
  const checkPhone = async (phone) => {
    try {
      const response = await axios.post('http://localhost:3000/doctors', { phoneOnly: phone });
      if (response.data.exists) {
        setErrors(prevErrors => ({ ...prevErrors, phone: "Numero di telefono già registrato" }));
        return false; // Indica che il telefono non è valido
      } else {
        setErrors(prevErrors => ({ ...prevErrors, phone: "" }));
        return true; // Indica che il telefono è valido
      }
    } catch (error) {
      console.error('Errore durante la verifica del telefono:', error);
      return false; // In caso di errore, il telefono non è valido
    }
  };

  // Funzione per gestire il blur sugli input
  const handleBlur = async (event) => {
    const { name, value } = event.target;

    // Esegui la validazione solo al blur
    switch (name) {
      case 'first_name':
        if (!validateName(value)) {
          setErrors(prevErrors => ({ ...prevErrors, first_name: 'Il nome deve avere più di 3 caratteri' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, first_name: '' }));
        }
        break;
      case 'last_name':
        if (!validateName(value)) {
          setErrors(prevErrors => ({ ...prevErrors, last_name: 'Il cognome deve avere più di 3 caratteri' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, last_name: '' }));
        }
        break;
      case 'email':
        if (!validateEmail(value)) {
          setErrors(prevErrors => ({ ...prevErrors, email: 'La mail inserita non è valida' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, email: '' }));
          await checkEmail(value);
        }
        break;
      case 'phone':
        if (!validatePhone(value)) {
          setErrors(prevErrors => ({ ...prevErrors, phone: 'Il numero di telefono non è valido.' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, phone: '' }));
          await checkPhone(value);
        }
        break;
      case 'address':
        if (!validateAddress(value)) {
          setErrors(prevErrors => ({ ...prevErrors, address: "L'indirizzo deve avere più di 5 caratteri" }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, address: '' }));
        }
        break;
      case 'description':
        if (!validateDescription(value)) {
          setErrors(prevErrors => ({ ...prevErrors, description: 'La descrizione deve avere più di 5 caratteri' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, description: '' }));
        }
        break;
      case 'gender':
        if (!validateGender(value)) {
          setErrors(prevErrors => ({ ...prevErrors, gender: 'Il genere è obbligatorio' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, gender: '' }));
        }
        break;
      case 'id_specialization':
        if (!validateSpecialization(value)) {
          setErrors(prevErrors => ({ ...prevErrors, id_specialization: 'Inserisci una specializzazione' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, id_specialization: '' }));
        }
        break;
      default:
        break;
    }
  };

  // Funzione per gestire il cambiamento degli input
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  //Funzione per gestire il cambiamento del file
  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      image: event.target.files[0]
    });
  };

  // Funzione per gestire il submit del form
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validazione completa prima dell'invio
    if (!validateName(formData.first_name) || !validateName(formData.last_name) ||
      !validateEmail(formData.email) || !validatePhone(formData.phone) ||
      !validateAddress(formData.address) || !validateDescription(formData.description) || !validateGender(formData.gender) || !validateSpecialization(formData.id_specialization)) {
      showMessage(setMessage, 'Il modulo non è completo! Verifica i campi cotrassegnati (*)', 'danger');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    axios.post('http://localhost:3000/doctors', data)
      .then(response => {
        const slug = response.data.slug;
        showMessage(setMessage, 'Dottore registrato con successo!', 'success');
        navigate(`/doctor/${slug}`);
        setTimeout(() => setMessage({ text: '', type: '' }), 6000); // Rimuove il messaggio dopo 6 secondi
      })
      .catch(error => {
        console.error('Error:', error);
        showMessage(setMessage, 'Errore durante la creazione del dottore', 'danger');
        setTimeout(() => setMessage({ text: '', type: '' }), 6000); // Rimuove il messaggio dopo 6 secondi
      });
  };

  return (
    <>
    {/* Link per tornare indietro */}
      <div className="my-3">
        <a className="back" onClick={() => navigate(-1)}>Torna indietro</a>
      </div>

      {/* Form di registrazione del dottore */}
      <FormDoctor
        formData={formData}
        setFormData={setFormData}
        specialization={specialization}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        handleBlur={handleBlur} // Aggiungi l'handler di blur
        errors={errors} // Passa gli errori al componente FormDoctor
        isFormValid={isFormValid}
      />
    </>
  );
}

export default DoctorRegistration;
