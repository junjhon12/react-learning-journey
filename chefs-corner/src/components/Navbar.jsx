import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h1>Chef's Corner 👨‍🍳</h1>
      <ul>                  
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
}

// Simple internal styles for layout
const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    background: '#333',
    color: 'white'
  },
};

export default Navbar;