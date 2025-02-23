import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand">
      <div className="container">
        {/* logo */}
        <img src="/logo_BDoctors.png" alt="Logo" width="75" height="75" />

        {/* lista dei link */}
        <ul className="navbar-nav">
          <li>
            <Link className="nav-link" to="/">
              <p>Home</p>
            </Link>
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
