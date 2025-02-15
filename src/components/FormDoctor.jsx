
function FormDoctor({ formData, specialization, handleChange, handleFileChange, handleSubmit, emailError, phoneError, handleBlur, errors, isFormValid }) {
    return (
        <div>
            <h3 className="text-center my-5">Sei nuovo? Registrati qui!</h3>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <form className="registration" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <h6 className="my-4">Dati anagrafici</h6>
                                <div className="form-group mb-5">
                                    <label htmlFor="first_name">Nome <span className="red">*</span></label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                        id="first_name"
                                        name="first_name"
                                        autoComplete="off"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="deve contenere almeno 3 caratteri"
                                        onBlur={handleBlur}
                                    />
                                    {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                                </div>
                                <div className="form-group mb-5">
                                    <label htmlFor="last_name">Cognome <span className="red">*</span></label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                        id="last_name"
                                        name="last_name"
                                        placeholder="deve contenere almeno 3 caratteri"
                                        autoComplete="off"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="gender">Genere <span className="red">*</span></label>
                                    <select
                                        className="form-control"
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <option value="">-</option>
                                        <option value="M">M</option>
                                        <option value="F">F</option>
                                        <option value="X">X</option>
                                    </select>
                                    {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <h6 className="my-4">Contatti</h6>
                                <div className="form-group mb-5">
                                    <label htmlFor="phone">Numero di telefono <span className="red">*</span></label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        id="phone"
                                        name="phone"
                                        placeholder="inserisci numero valido"
                                        autoComplete="off"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                    {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}
                                </div>
                                <div className="form-group mb-5">
                                    <label htmlFor="email">Email <span className="red">*</span></label>
                                    <input
                                       placeholder="inserisci email valida"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        title="L'email deve includere la @"
                                        autoComplete="off"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="address">Indirizzo <span className="red">*</span></label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        id="address"
                                        name="address"
                                        placeholder="inserisci indirizzo valido"
                                        autoComplete="off"
                                        title="L'indirizzo deve contenere almeno 5 caratteri"
                                        value={formData.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                </div>
                            </div>
                        </div>
                        <hr />
                        <h6 className="my-4">Professione</h6>
                        <div className="form-group  mb-4">
                            <label htmlFor="id_specialization">Specializzazione <span className="red">*</span></label>
                            <select
                                className="form-control mt-2"
                                id="id_specialization"
                                name="id_specialization"
                                value={formData.id_specialization}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                <option value="">-</option>
                                {specialization.map(curItem => (
                                    <option key={curItem.id} value={curItem.id}>
                                        {curItem.name}
                                    </option>
                                ))}
                            </select>
                            {errors.id_specialization && <div className="invalid-feedback">{errors.id_specialization}</div>}
                        </div>
                        <div className="form-group mb-5">
                            <label htmlFor="description">Servizi <span className="red">*</span></label>
                            <textarea
                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                id="description"
                                name="description"
                                placeholder="deve contenere almeno 5 caratteri"
                                autoComplete="off"
                                title="Devi inserire almeno 6 caratteri"
                                value={formData.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            ></textarea>
                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
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
                            <button type="submit" className="btn btn-primary mt-5" disabled={!isFormValid}>Registrati</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormDoctor;
