import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";

function DettaglioMedico() {

  let { slug } = useParams();
  let [doc, setDoc] = useState(null)
  useEffect(() => {
    axios.get(`http://localhost:3000/doctors/${slug}`).then((resp) => {
      setDoc(resp.data.data)
      console.log(resp.data.data)
    })
  }, [])


  const stelline = (voto) => {
    const array = [1, 2, 3, 4, 5]
    return array.map((cur) => {
        if (voto >= cur) {
            return <FontAwesomeIcon className="stellina" key={cur} icon={solidStar} />
        } else {
            return <FontAwesomeIcon className="stellina" key={cur} icon={regularStar} />
        }
    })
};

  const printRecensioni=() => {
    const rece = doc.reviews
    let array = rece.map((curRece) => {
      return (
        <>
          <div key={curRece.id} className="rece-card">
            <h5>{curRece.patient}</h5>
            <div><strong>Voto: </strong> {stelline(curRece.voto)}</div>
            <p>{curRece.text}</p>
          </div>
        </>
      );
    })
    return array
  }

  return (<>
    {doc &&
      <>
        <div className="medico-card">
          <div className="imm">
            <img src={`http://localhost:3000/images/doctors/${doc.immagine}`} alt={`medico ${doc.nome} ${doc.cognome}`} />
          </div>
          <section className="p-3">
            <h2>{doc.nome}{doc.cognome}</h2>
            <div className="spec">{doc.specializzazione}</div>
            <p className="my-1"><strong>Telefono: </strong>{doc.telefono}</p>
            <p className="my-1"><strong>Email: </strong>{doc.email}</p>
            <p className="my-1"><strong>Indirizzo: </strong>{doc.indirizzo}</p>
          </section>
        </div>

        <div>
          <h3 className="my-4">Recensioni</h3>
          {printRecensioni()}
        </div>
      </>
    }
  </>
  );
}

export default DettaglioMedico;
