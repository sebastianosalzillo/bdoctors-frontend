/* eslint-disable react/prop-types */
function FormDoctor({ formData, specialization, handleChange, handleFileChange, handleSubmit, emailError, phoneError }) {
    return (
        <div className="container">
            <h3 className="text-center my-5">Sei un nuovo? Registrati qui!</h3>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <h6 className="my-4">Dati anagrafici</h6>
                                <div className="form-group">
                                    <label htmlFor="first_name">Nome</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first_name"
                                        name="first_name"
                                        minLength={3}
                                        autoComplete="off"
                                        title="Il nome deve contenere almeno 3 caratteri"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="last_name">Cognome</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        name="last_name"
                                        minLength={3}
                                         title="Il cognome deve contenere almeno 3 caratteri"
                                        autoComplete="off"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="gender">Genere</label>
                                    <select
                                        className="form-control"
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-</option>
                                        <option value="M">M</option>
                                        <option value="F">F</option>
                                        <option value="X">X</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <h6 className="my-4">Contatti</h6>
                                <div className="form-group">
                                    <label htmlFor="phone">Numero di telefono</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        pattern="^\+?[0-9]{1,15}$"
                                        title="Il numero deve avere massimo 15 caratteri e può iniziare con il +"
                                        autoComplete="off"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                    {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        //pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
                                        title="L'email deve includere la @"
                                        autoComplete="off"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="address">Indirizzo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        minLength={5}
                                        autoComplete="off"
                                        title="L'indirizzo deve contenere almeno 5 caratteri"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <h6 className="mt-4">Professione</h6>
                        <div className="form-group mb-3">
                            <label htmlFor="id_specialization"></label>
                            <select
                                className="form-control"
                                id="id_specialization"
                                name="id_specialization"
                                value={formData.id_specialization}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleziona specializzazione</option>
                                {specialization.map(curItem => (
                                    <option key={curItem.id} value={curItem.id}>
                                        {curItem.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group my-4">
                            <label htmlFor="description">Servizi</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                minLength={6}
                                autoComplete="off"
                                title="Devi inserire almeno 6 aratteri"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <hr />
                        <h6 className="mt-4">Immagine di profilo</h6>
                        <div className="form-group mb-3 w-100">
                            <label htmlFor="image"></label>
                            <input
                                type="file"
                                className="form-control mt-1"
                                id="image"
                                name="image"
                                onChange={handleFileChange}
                                
                            />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary mt-5">Registrati</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default FormDoctor;