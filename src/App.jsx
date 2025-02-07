import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Layout from "./layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import RicercaMedici from "./pages/RicercaMedici";
import DettaglioMedico from "./pages/DettaglioMedico";
import RegistrazioneMedico from "./pages/RegistrazioneMedico";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="ricerca" element={<RicercaMedici />} />
          <Route path="medico/:slug" element={<DettaglioMedico />} />
          <Route path="registrazione" element={<RegistrazioneMedico />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
