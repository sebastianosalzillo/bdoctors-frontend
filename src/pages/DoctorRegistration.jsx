import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormDoctor from "../components/FormDoctor";
import axios from 'axios';

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
    axios.post('http://localhost:3000/doctors', { emailOnly: email })
      .then(response => {
        if (response.data.exists) {
          console.log(response.data.exists);

          setEmailError("Email già registrata");
        } else {
          setEmailError('');
        }
      })
      .catch(error => {
        console.error('Errore durante la verifica dell\'email:', error);
      });
  };

  const checkPhone = (phone) => {
    axios.post('http://localhost:3000/doctors', { phoneOnly: phone })
      .then(response => {
        if (response.data.exists) {
          setPhoneError("Numero di telefono già registrato");
        } else {
          setPhoneError('');
        }
      })
      .catch(error => {
        console.error('Errore durante la verifica del telefono:', error);
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
  
    // Aspetta che entrambe le verifiche dell'email e del telefono siano completate
    const isEmailValid = await checkEmail(formData.email);  // Controlla la validità dell'email
    const isPhoneValid = await checkPhone(formData.phone);  // Controlla la validità del telefono
  
    // Se una delle verifiche fallisce, non inviare il modulo
    if (!isEmailValid || !isPhoneValid) {
      return; // Impedisce l'invio del form se l'email o il telefono non sono validi
    }

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
        console.log('Success:', response.data);
        navigate('/');
      })
      .catch(error => {
        console.error('Error:', error);
      });


  };

  return (
    <FormDoctor
      formData={formData}
      specialization={specialization}
      handleChange={handleChange}
      handleFileChange={handleFileChange}
      handleSubmit={handleSubmit}
      emailError={emailError}
      phoneError={phoneError}
    />

  );
}

export default DoctorRegistration;

