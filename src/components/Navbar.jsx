import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">BDoctors</Link>
        
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/ricerca">Cerca Medici</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/registrazione">Registrati come Medico</Link>
            </li>
          </ul>
        </div>
      
    </nav>
  );
}

export default Navbar;
