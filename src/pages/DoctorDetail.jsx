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
    vote: 0,
    name: "",
    email: "",
    text: ""
  }
  let [newRece, setNewRece] = useState(emptyRece)


  useEffect(() => {
    refresh()
  }, [])

  const refresh = () => {
    axios.get(`http://localhost:3000/doctors/${slug}`).then((resp) => {
      setDoc(resp.data.data)
      console.log(("Refreshato"))
    })
  }

  const printData = () => {
    return (
      <><div className="spec">{doc.specializzazione}</div>
        <p className="my-1"><strong>Telefono: </strong>{doc.telefono}</p>
        <p className="my-1"><strong>Email: </strong>{doc.email}</p>
        <p className="my-1"><strong>Indirizzo: </strong>{doc.indirizzo}</p></>
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
      return (
        <div key={curRece.id} className="rece-card">
          <h5>{curRece.patient}</h5>
          <div><strong>Voto: </strong> {stelline(curRece.voto)}</div>
          <p>{curRece.text}</p>
        </div>
      );
    })
    return risp
  }

  const printRadioCheck = () => {
    let risp = array.map((i) => {
      return (
        <div key={i} className="form-check form-check-inline">
          <input required className="form-check-input" type="radio" name="vote" id={i} checked={newRece.vote == i} onChange={(event) => handleInputChange(event)} value={i} />
          <label className="form-check-label" htmlFor={i}>{i}</label>
        </div>
      )
    })
    return risp
  }

  const handleInputChange = (event) => {
    let nome = event.target.name
    let valore = event.target.value
    let obj = {
      ...newRece,
      [nome]: valore
    }
    setNewRece(obj)
  }

  const handleOnSubmit = (event) => {
    event.preventDefault();
    console.log("Inizio submit");
    axios.post(`http://localhost:3000/reviews/doctors/${doc.id}/reviews`, newRece).then(() => {
      refresh();
      setNewRece(emptyRece);
    });
  }

  return (<>
    {doc &&
      <>
        <div className="medico-card">
          <div className="imm">
            <img src={`http://localhost:3000/images/doctors/${doc.immagine}`} alt={`medico ${doc.nome} ${doc.cognome}`} />
          </div>
          <section className="p-3">
            <h2>{doc.nome} {doc.cognome}</h2>
            {printData()}
          </section>
        </div>
        <div className="medico-card mobile">
          <h2 className="py-2">{doc.nome} {doc.cognome}</h2>
          <div className="imm">
            <img src={`http://localhost:3000/images/doctors/${doc.immagine}`} alt={`medico ${doc.nome} ${doc.cognome}`} />
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
            <h3 className="py-2">Scrivi una recensione!</h3>
            <div className="form-group">
              <label className="mt-1" htmlFor="name">Nome e Cognome</label>
              <input required type="text" minLength={3} className="form-control mt-1" id="name" name="name" value={newRece.name} onChange={(event) => { handleInputChange(event) }} />
            </div>

            <div className="form-group">
              <label className="mt-1" htmlFor="email">Email</label>
              <input required type="email" className="form-control mt-1" id="email" name="email" value={newRece.email} onChange={(event) => { handleInputChange(event) }} />
            </div>

            <div className="mt-3">
              <label htmlFor="vote"><span>Valutazione:</span></label>
              {printRadioCheck()}
            </div>

            <div className="form-group mt-2">
              <label className="mt-1" htmlFor="text">Aggiungi una recensione scritta</label>
              <textarea className="form-control mt-1" type="text" id="text" rows="3" name="text" minLength={6} value={newRece.text} onChange={(event) => { handleInputChange(event) }}></textarea>
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
