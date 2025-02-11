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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
});
console.log(formData);
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      image: event.target.files[0]
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

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
   />
    
  );
}

export default DoctorRegistration;

