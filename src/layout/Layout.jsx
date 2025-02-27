import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Layout() {
  return (
    <>
      <Navbar />

      <div className="main-container">
        <main className="container pt-4">
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Layout;
