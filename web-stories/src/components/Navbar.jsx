import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={styles.nav}>
            <h1 style={styles.logo}>📖 WebStories</h1>
            <div style={styles.links}>
                {/* Link is like an <a> tag, but it doesn't reload the page */}
                <Link to="/" style={styles.link}>Library</Link>
                <Link to="/create" style={styles.link}>Write Novel</Link>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: 'white',
        marginBottom: '20px'
    },
    logo: { margin: 0, fontSize: '1.5rem' },
    links: { display: 'flex', gap: '20px' },
    link: { color: 'white', textDecoration: 'none', fontSize: '1.2rem' }
};

export default Navbar;