import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Bookshelf = () => {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to view your bookshelf.");
            navigate('/login');
            return;
        }

        fetch('http://localhost:5000/api/bookshelf', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error(err));
    }, [navigate]);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ borderBottom: '2px solid #ff4d4d', paddingBottom: '10px' }}>
                ❤️ My Bookshelf
            </h2>

            {books.length === 0 ? (
                <p>You haven't saved any books yet. Go explore the library!</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {books.map(book => (
                        <div key={book._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff' }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{book.title}</h3>
                            <small style={{ color: '#888' }}>By {book.author?.username}</small>
                            <button 
                                onClick={() => navigate(`/books/${book._id}`)}
                                style={{ width: '100%', padding: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
                            >
                                Read
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookshelf;