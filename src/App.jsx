import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import Layout from "./layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import SearchDoctors from "./pages/SearchDoctors";
import DoctorDetail from "./pages/DoctorDetail";
import DoctorRegistration from "./pages/DoctorRegistration.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx"
import AppAllert from "./components/AppAllert.jsx"

function App() {
  return (
    <AlertProvider>
      <Router>
        <AppAllert />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/search" element={<SearchDoctors />} />
            <Route path="doctor/:slug" element={<DoctorDetail />} />
            <Route path="registration" element={<DoctorRegistration />} />
          </Route>
        </Routes>
      </Router>
    </AlertProvider>
  );
}

export default App;
