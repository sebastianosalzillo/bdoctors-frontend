const FormReview = ({handleOnSubmit, handleInputChange, newRece, array}) => {
    return (
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
                    {array.map((i) => (
                        <div key={i} className="form-check form-check-inline">
                            <input required className="form-check-input" type="radio" name="rating" id={i} checked={newRece.rating == i} onChange={handleInputChange} value={i} />
                            <label className="form-check-label" htmlFor={i}>{i}</label>
                        </div>
                    ))}
                </div>

                <div className="form-group mt-2">
                    <label className="mt-1" htmlFor="content">Raccontaci come è andata!</label>
                    <textarea className="form-control mt-1" type="text" id="content" rows="3" name="content" minLength={6} value={newRece.content} onChange={(event) => { handleInputChange(event) }}></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Conferma</button>
            </form>

        </div>
    )
}

export default FormReview