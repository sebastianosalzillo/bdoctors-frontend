import { createContext, useState, useContext } from "react";

// Crea un contesto per gli alert 
const AlertContext = createContext();

// Funzione che fornisce il contesto degli alert ai componenti figli
function AlertProvider({ children }) {
  const [message, setMessage] = useState(({ text: "", type: "" }));

// Crea un oggetto con lo stato e la funzione per aggiornarlo
  const providerValue = { message, setMessage };

// Ritorna il provider del contesto con il valore fornito e i componenti figli
  return (
    <AlertContext.Provider value={providerValue}>
      {children}
    </AlertContext.Provider>
  );
}
// useAlert permette ai componenti di accedere al contesto degli alert.
function useAlertContext() {
    //ritorna useContext per ottenere il valore dal AlertContext.
  return useContext(AlertContext);
}

export { AlertProvider, useAlertContext };