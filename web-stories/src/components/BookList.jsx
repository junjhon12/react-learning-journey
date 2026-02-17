import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/books')
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error("Error:", err));
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📚 Library</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {books.map((book) => (
                    <div key={book._id} style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        padding: '15px', 
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{book.title}</h3>
                            <small style={{ color: '#888' }}>By {book.author?.username || 'Unknown'}</small>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '10px' }}>
                                {book.description || "No description available."}
                            </p>
                        </div>

                        <button 
                            onClick={() => navigate(`/books/${book._id}`)} 
                            style={{ 
                                marginTop: '15px',
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Open Book
                        </button>

                        <small style={{ color: '#888' }}>
                            By{' '}
                            {book.author ? (
                                <Link 
                                    to={`/profile/${book.author._id}`} 
                                    style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}
                                >
                                    {book.author.username}
                                </Link>
                            ) : (
                                "Unknown"
                            )}
                        </small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;