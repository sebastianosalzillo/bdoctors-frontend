/* eslint-disable no-unused-vars */
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
    specialization: '',
    description: '',
    image: null,
    gender: ''
  };

  const [formData, setFormData] = useState(initialFormRegistration);
  const [specialization, setSpecialization] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/specialization')
      .then(response => {
        setSpecialization(response.data);
      })
      .catch(error => {
        console.error('Error fetching specializzazioni:', error);
      });
  }, []);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    axios.post('/', data)
      .then(response => {
        navigate('/doctors/slug'); 
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

