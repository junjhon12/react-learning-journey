import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        alert("Logged out!");
        navigate('/login');
        window.location.reload(); // Refresh to update UI
    };
    return (
        <nav style={styles.nav}>
            <h1 style={styles.logo}>📖 WebStories</h1>
            <div style={styles.links}>
                <Link to="/" style={styles.link}>Library</Link>
                
                {/* Show different links based on login status */}
                {token ? (
                    <>
                        // Inside Navbar.jsx
                        <Link to="/create" style={styles.link}>Create Book</Link>
                        <span style={{color: '#aaa', marginLeft: '10px'}}>Hello, {username}</span>
                        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
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
        marginBottom: '20px',
    },
    logo: { margin: '0 10px 0 0', fontSize: '1.5rem' },
    links: { display: 'flex', gap: '20px' },
    link: { color: 'white', textDecoration: 'none', fontSize: '1.2rem' }
};

export default Navbar;