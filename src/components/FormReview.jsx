/* eslint-disable react/prop-types */
const FormReview = ({handleOnSubmit, isSubmitting, handleInputChange, newRece, array, doc}) => {
    return (
        <div>
            <form onSubmit={(event) => handleOnSubmit(event)} className="recensioni">
                <h3 className="py-2">Lascia una recensione a {doc.first_name} {doc.last_name}!</h3>
                <div className="form-group">
                    <label className="mt-1" htmlFor="patient_name">Nome e Cognome<span className="red">*</span></label>
                    <input required type="text" minLength={3} className="form-control mt-1" id="patient_name" name="patient_name" value={newRece.patient_name} onChange={(event) => { handleInputChange(event) }} />
                </div>

                <div className="form-group">
                    <label className="mt-1" htmlFor="email">Email<span className="red">*</span></label>
                    <input required type="email" className="form-control mt-1" id="email" name="email"  value={newRece.email} onChange={(event) => { handleInputChange(event) }} />
                </div>

                <div className="mt-3">
                    <label htmlFor="rating"><span>Valutazione:<span className="red">*</span></span></label>
                    {array.map((i) => (
                        <div key={i} className="form-check form-check-inline">
                            <input required className="form-check-input" type="radio" name="rating" id={i} checked={newRece.rating == i} onChange={handleInputChange} value={i} />
                            <label className="form-check-label" htmlFor={i}>{i}</label>
                        </div>
                    ))}
                </div>

                <div className="form-group mt-2">
                    <label className="mt-1" htmlFor="content">Raccontaci come è andata!</label>
                    <textarea placeholder="Inserisci almeno 5 caratteri" className="form-control mt-1" type="text" id="content" rows="3" name="content" minLength={5} value={newRece.content} onChange={(event) => { handleInputChange(event) }}></textarea>
                </div>
                <button  disabled={isSubmitting} type="submit" className="btn btn-primary"> {isSubmitting ? 'Invio in corso...' : 'Conferma'}</button>
            </form>

        </div>
    )
}

export default FormReview