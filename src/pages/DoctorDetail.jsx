import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";

function DoctorDetail() {

  const array = [1, 2, 3, 4, 5]
  let { slug } = useParams();
  let [doc, setDoc] = useState(null)

  const emptyRece = {
    rating: 0,
    patient_name: "",
    email: "",
    content: ""
  }
  let [newRece, setNewRece] = useState(emptyRece)


  useEffect(() => {
    refresh()
  }, [])

  const refresh = () => {
    axios.get(`http://localhost:3000/doctors/${slug}`).then((resp) => {
      setDoc(resp.data.data)
    })
  }

  const printData = () => {
    return (
      <><div className="spec">{doc.specialization}</div>
        <p className="my-1"><strong>Telefono: </strong>{doc.phone}</p>
        <p className="my-1"><strong>Email: </strong>{doc.email}</p>
        <p className="my-1"><strong>Indirizzo: </strong>{doc.address}</p></>
        //manca il voto medio
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
    let risp = rece.map((curRece) => {
      console.log("Dati recensione corrente:", curRece);
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

  const printRadioCheck = () => {
    let risp = array.map((i) => {
      return (
        <div key={i} className="form-check form-check-inline">
          <input required className="form-check-input" type="radio" name="rating" id={i} checked={newRece.rating == i} onChange={(event) => handleInputChange(event)} value={i} />
          <label className="form-check-label" htmlFor={i}>{i}</label>
        </div>
      )
    })
    return risp
  }

  const handleInputChange = (event) => {
    let name = event.target.name
    let value = event.target.value
    let obj = {
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

        <div>
          <form onSubmit={(event) => handleOnSubmit(event)} className="recensioni">
            <h3 className="py-2">Lascia una recensione!</h3>
            <div className="form-group">
              <label className="mt-1" htmlFor="patient_name">Nome e Cognome</label>
              <input required type="text" minLength={3} className="form-control mt-1" id="patient_name" name="patient_name" value={newRece.patient_name} onChange={(event) => { handleInputChange(event) }} />
            </div>

            <div className="form-group">
              <label className="mt-1" htmlFor="email">Email</label>
              <input required type="email" className="form-control mt-1" id="email" name="email" value={newRece.email} onChange={(event) => { handleInputChange(event) }} />
            </div>

            <div className="mt-3">
              <label htmlFor="rating"><span>Valutazione:</span></label>
              {printRadioCheck()}
            </div>

            <div className="form-group mt-2">
              <label className="mt-1" htmlFor="content">Raccontaci come è andata!</label>
              <textarea className="form-control mt-1" type="text" id="content" rows="3" name="content" minLength={6} value={newRece.content} onChange={(event) => { handleInputChange(event) }}></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Conferma</button>
          </form>

        </div>
      </>
    }
  </>
  );
}

export default DoctorDetail;
