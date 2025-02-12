import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/logo_BDoctors.png" alt="Logo" width="75" height="75"/>
        </Link>

        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/registration">Registrati come Medico</Link>
          </li>
        </ul>
      </div>

    </nav>
  );
}

export default Navbar;
