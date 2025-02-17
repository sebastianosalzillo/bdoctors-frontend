import Stars from "./Stars"

/* eslint-disable react/prop-types */
const FormReview = ({ handleOnSubmit, isSubmitting, handleInputChange, newRece, array, doc, errors, handleBlur }) => {
    return (
        <div>
            <form onSubmit={(event) => handleOnSubmit(event)} className="recensioni">
                <h3 className="py-2">Lascia una recensione a {doc.first_name} {doc.last_name}!</h3>
                <div className="form-group">
                    <label className="mt-1" htmlFor="patient_name">Nome e Cognome<span className="red">*</span></label>
                    <input type="text" className="form-control mt-1" id="patient_name" name="patient_name" placeholder="Inserisci almeno 3 caratteri" onBlur={handleBlur} value={newRece.patient_name} onChange={(event) => { handleInputChange(event) }} />
                    {errors.patient_name && <div className="red">{errors.patient_name}</div>}
                </div>

                <div className="form-group">
                    <label className="mt-1" htmlFor="email">Email<span className="red">*</span></label>
                    <input type="email" className="form-control mt-1" id="email" name="email" placeholder="Inserisci una mail valida" onBlur={handleBlur} value={newRece.email} onChange={(event) => { handleInputChange(event) }} />
                    {errors.email && <div className="red">{errors.email}</div>}
                </div>

                <div className="mt-3">
                    <label htmlFor="rating"><span>Valutazione:<span className="red">*</span></span></label>
                    <Stars voto={parseInt(newRece.rating)} isActive={true} onChange={(value) => handleInputChange({ target: { name: 'rating', value } })} />
                </div>

                <div className="form-group mt-2">
                    <label className="mt-1" htmlFor="content">Raccontaci come è andata!</label>
                    <textarea placeholder="Inserisci almeno 5 caratteri" className="form-control mt-1" type="text" id="content" rows="3" name="content" value={newRece.content} onChange={(event) => { handleInputChange(event) }}></textarea>
                </div>
                <button disabled={isSubmitting} type="submit" className="btn btn-primary"> {isSubmitting ? 'Invio in corso...' : 'Conferma'}</button>
            </form>

        </div>
    )
}

export default FormReview