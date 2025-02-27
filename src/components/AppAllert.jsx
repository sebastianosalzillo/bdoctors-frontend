//importa il contesto alert
import { useAlertContext } from "../contexts/AlertContext";

//funzione per gestire tipo e testo del messaggio
function AppAlert() {
  const { message } = useAlertContext();

  return message.text && (
    <div className={`alert alert-${message.type} fixed-alert`}>
      {message.text}
    </div>
    )
}

export default AppAlert;