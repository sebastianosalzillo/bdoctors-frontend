import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormDoctor from "../components/FormDoctor";
import axios from 'axios';
import { useAlertContext } from "../contexts/AlertContext";

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
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { message, setMessage } = useAlertContext();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/specialization')
      .then(response => {
        setSpecialization(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching specializations:', error);
      });
  }, []);

  const checkEmail = (email) => {
    return axios.post('http://localhost:3000/doctors', { emailOnly: email })
      .then(response => {
        if (response.data.exists) {
          setEmailError("Email già registrata");
          return false; // Indica che l'email non è valida
        } else {
          setEmailError('');
          return true; // Indica che l'email è valida
        }
      })
      .catch(error => {
        console.error('Errore durante la verifica dell\'email:', error);
        return false; // In caso di errore, l'email non è valida
      });
  };

  const checkPhone = (phone) => {
    return axios.post('http://localhost:3000/doctors', { phoneOnly: phone })
      .then(response => {
        if (response.data.exists) {
          setPhoneError("Numero di telefono già registrato");
          return false; // Indica che il telefono non è valido
        } else {
          setPhoneError('');
          return true; // Indica che il telefono è valido
        }
      })
      .catch(error => {
        console.error('Errore durante la verifica del telefono:', error);
        return false; // In caso di errore, il telefono non è valido
      });
  };



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
      image: event.target.files[0]
    });


  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verifica l'email e il telefono prima di inviare il modulo
    const emailPromise = checkEmail(formData.email); // Verifica la validità dell'email
    const phonePromise = checkPhone(formData.phone); // Verifica la validità del telefono

    // Quando entrambe le Promesse sono risolte, controlla se sono valide
    Promise.all([emailPromise, phonePromise])
      .then((results) => {
        const isEmailValid = results[0]; // Risultato di checkEmail
        const isPhoneValid = results[1]; // Risultato di checkPhon

        // Se una delle verifiche fallisce, non inviare il modulo
        if (!isEmailValid || !isPhoneValid) {
          return; // Impedisce l'invio del form se l'email o il telefono non sono validi
        }
      })

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    // Log dei dati per la verifica
    for (var pair of data.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    axios.post('http://localhost:3000/doctors', data)
      .then(response => {
        setMessage({ text: 'Dottore registrato con successo!', type: 'success' });
            navigate('/');
            setTimeout(() => setMessage({ text: '', type: '' }), 6000); 
      })
      .catch(error => {
          console.error('Error:', error);
      });


  };

  return (
    <>
      <div className="my-3">
      <a className="back" onClick={() => navigate(-1)}>Torna indietro</a>
      </div>
      <FormDoctor
        formData={formData}
        specialization={specialization}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        emailError={emailError}
        phoneError={phoneError}
      />
    </>
  );
}

export default DoctorRegistration;