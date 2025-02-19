import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import Layout from "./layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import SearchDoctors from "./pages/SearchDoctors";
import DoctorDetail from "./pages/DoctorDetail";
import DoctorRegistration from "./pages/DoctorRegistration.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx"
import AppAllert from "./components/AppAllert.jsx"
import  {LoadScript} from "@react-google-maps/api";
import NotFound from "./pages/NotFound.jsx";

const googleMapsApiKey = 'AIzaSyDty0JzQsRR7HwmlHAC55_ikV4QoluXUak'
const libraries = ["places"]; 

function App() {
  return (
    <AlertProvider>
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
      <Router>
        <AppAllert />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/search" element={<SearchDoctors />} />
            <Route path="doctor/:slug" element={<DoctorDetail />} />
            <Route path="registration" element={<DoctorRegistration />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      </LoadScript>
    </AlertProvider>
  );
}

export default App;
