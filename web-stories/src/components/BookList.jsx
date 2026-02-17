import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/books')
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error("Error:", err));
    }, []);

    const filteredBooks = books.filter(book => {
        const lowerTerm = searchTerm.toLowerCase();
        const titleMatch = book.title.toLowerCase().includes(lowerTerm);
        const authorMatch = book.author && book.author.username.toLowerCase().includes(lowerTerm);
        return titleMatch || authorMatch;
    });

    return (
        <div className="container">
            <div className="flex-between mb-4">
                <h2>📚 Library</h2>
                <span className="text-muted">{filteredBooks.length} Books</span>
            </div>
            
            <input 
                type="text" 
                placeholder="🔍 Search by Title or Author..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '15px', borderRadius: '30px', marginBottom: '30px' }} 
            />

            <div className="grid">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                        <div key={book._id} className="card">
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{book.title}</h3>
                            
                            <div className="text-muted mb-4">
                                By{' '}
                                {book.author ? (
                                    <Link to={`/profile/${book.author._id}`}>{book.author.username}</Link>
                                ) : "Unknown"}
                            </div>

                            <p style={{ fontSize: '0.9rem', color: '#8b949e', height: '60px', overflow: 'hidden' }}>
                                {book.description || "No description available."}
                            </p>

                            <button 
                                onClick={() => navigate(`/books/${book._id}`)} 
                                className="btn btn-primary btn-block"
                            >
                                Read Now
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                        <h3>No books found 🕵️‍♂️</h3>
                        <p className="text-muted">Try a different search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookList;