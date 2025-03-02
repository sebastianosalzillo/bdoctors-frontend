import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand">
      <div className="container">
        {/* logo */}
        <div>
          <img src="/logo_BDoctors.png" alt="Logo" />
        </div>

        {/* lista dei link */}
        <ul className="navbar-nav align-items-center">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/registration">Registrati come Medico</Link>
          </li>
        </ul>
      </div>

    </nav>
  );
}

export default Navbar;
