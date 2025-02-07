import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function DettaglioMedico() {

  let { id } = useParams();
  let [doc, setDoc] = useState(null)
  useState(() => {
    axios.get("http://localhost:3000/doctors/mario-rossi").then((resp) => {
      setDoc(resp.data.data)
      console.log(resp.data.data)
    })
  }, [])



  return (<>
    {doc &&
      <>
        <h2>Dettagli medico</h2>
        <div>{doc.id}</div>
      </>
    }
  </>
  );
}

export default DettaglioMedico;
