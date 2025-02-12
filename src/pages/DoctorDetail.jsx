import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";
import FormReview from "../components/FormReview";

function DoctorDetail() {

  const array = [1, 2, 3, 4, 5]
  const { slug } = useParams();
  const [doc, setDoc] = useState(null)

  const emptyRece = {
    rating: 0,
    patient_name: "",
    email: "",
    content: ""
  }
  const [newRece, setNewRece] = useState(emptyRece)


  useEffect(() => {
    refresh()
  }, [slug])

  const refresh = () => {
    axios.get(`http://localhost:3000/doctors/${slug}`).then((resp) => {
      setDoc(resp.data.data)
    })
  }

  const printData = () => {
    return (
      <>
        <div className="spec">{doc.specialization}</div>
        <p className="my-1"><strong>Telefono: </strong>{doc.phone}</p>
        <p className="my-1"><strong>Email: </strong><a href={`mailto:${doc.email}`}>{doc.email}</a></p>
        <p className="my-1"><strong>Indirizzo: </strong>{doc.address}</p>
        <p className="my-1"><strong>Voto Medio: </strong>{doc.average_rating}</p>
        <p className="my-1"><strong>Descrizione: </strong>{doc.description}</p>
      </>
    )
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
    const rece = doc.reviews
    const risp = rece.map((curRece) => {
      return (
        <div key={curRece.id} className="rece-card">
          <h5>{curRece.patient_name}</h5>
          <div><strong>Voto: </strong> {stelline(curRece.rating)}</div>
          <p>{curRece.content}</p>
          <a href={`mailto:${curRece.email}`}>{curRece.email}</a>
        </div>
      );
    })
    return risp
  }

  const handleInputChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    const obj = {
      ...newRece,
      [name]: value
    }
    setNewRece(obj)
  }

  const handleOnSubmit = (event) => {
    event.preventDefault();
    console.log("Inizio submit");
    axios.post(`http://localhost:3000/reviews/doctors/${doc.slug}/reviews`, newRece).then(() => {
      refresh();
      setNewRece(emptyRece);
    });
  }

  return (<>
    {doc &&
      <>
        <div className="medico-card">
          <div className="imm">
            <img src={`http://localhost:3000/images/doctors/${doc.image}`} alt={`medico ${doc.first_name} ${doc.last_name}`} />
          </div>
          <section className="p-3">
            <h2>{doc.first_name} {doc.last_name}</h2>
            {printData()}
          </section>
        </div>
        <div className="medico-card mobile">
          <h2 className="py-2">{doc.first_name} {doc.last_name}</h2>
          <div className="imm">
            <img src={`http://localhost:3000/images/doctors/${doc.image}`} alt={`medico ${doc.first_name} ${doc.last_name}`} />
          </div>
          <section className="p-3">
            {printData()}
          </section>
        </div>

        <div>
          <h3 className="my-4">Recensioni</h3>
          {printRecensioni()}
        </div>

        <hr className="linea" />

        <FormReview
        handleOnSubmit={handleOnSubmit}
        handleInputChange={handleInputChange}
        newRece={newRece}
        array={array}
        />
      </>
    }
  </>
  );
}

export default DoctorDetail;
