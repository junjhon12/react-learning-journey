import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // 1. Fetch User Details
        fetch(`http://localhost:5000/api/users/${userId}`)
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error(err));

        // 2. Fetch Books by this Author
        fetch(`http://localhost:5000/api/books?author=${userId}`)
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error(err));
    }, [userId]);

    if (!user) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading Profile...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            
            {/* --- PROFILE HEADER --- */}
            <div style={{ 
                backgroundColor: '#fff', 
                padding: '30px', 
                borderRadius: '8px', 
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginBottom: '40px'
            }}>
                <h1 style={{ margin: 0 }}>{user.username}</h1>
                <p style={{ color: '#888' }}>
                    Member since {new Date(user._id.getTimestamp ? user._id.getTimestamp() : Date.now()).toLocaleDateString()}
                    {/* Note: In a real app, use a proper 'createdAt' field, but this is a MongoDB trick for now */}
                </p>
            </div>

            {/* --- USER'S BOOKS --- */}
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                Published Books ({books.length})
            </h2>

            {books.length === 0 ? (
                <p>No books published yet.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {books.map(book => (
                        <div key={book._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff' }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{book.title}</h3>
                            <button 
                                onClick={() => navigate(`/books/${book._id}`)}
                                style={{ width: '100%', padding: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
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

export default UserProfile;