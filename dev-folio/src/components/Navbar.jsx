// Navbar.jsx
import { Link } from 'react-router-dom';
function Navbar() {
  return (
    <nav className="navbar">
      <h1>My Portfolio</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;