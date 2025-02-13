import { useAlertContext } from "../contexts/AlertContext";

function AppAlert() {
  const { message } = useAlertContext();

  return message.text && (
    <div className={`alert alert-${message.type} fixed-alert`}>
      {message.text}
    </div>
    )
}

export default AppAlert;