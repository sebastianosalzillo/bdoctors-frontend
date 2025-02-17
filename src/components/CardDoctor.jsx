import Stars from "../components/Stars";
import { Link } from "react-router-dom";

const CardDoctor = ({ doctor }) => {
    return(
        <>
         <div key={doctor.id} className="col-md-4 mb-4 ">
                <div className="card ms-card ">
                  <div className="text-center">
                    <img
                      src={doctor.image ? (doctor.image.startsWith("http")
                        ? doctor.image
                        : `http://localhost:3000/images/doctors/${doctor.image}`)
                        : 'placeholder1.webp'}
                      className="card-img-top"
                      alt={doctor.first_name}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-body home">
                    <h5 className="card-title">{doctor.first_name} {doctor.last_name}</h5>
                    <p className="card-text my-1"> <strong>Specializzazione: </strong>{doctor.specialization}</p>
                    <p className="card-text my-1"> <strong>Indirizzo: </strong>{doctor.address}</p>
                    <p className="card-text my-1"> <Stars voto={doctor.average_rating}  /></p>
                    <Link to={`/doctor/${doctor.slug}`} className="btn btn-primary">Vedi dettagli</Link>
                  </div>
                </div>
              </div>
        </>
    )
};

export default CardDoctor;