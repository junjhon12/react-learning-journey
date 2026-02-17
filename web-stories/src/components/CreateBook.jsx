import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateBook = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    // Security Check
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            alert("Please login first!");
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description }),
            });

            if (response.ok) {
                alert("Book Created!");
                navigate('/'); // Go back to Library
            } else {
                alert("Failed to create book");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Create New Book</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Book Title:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '1rem' }} 
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Description (The "Back of the Book"):</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        rows="4" 
                        style={{ width: '100%', padding: '8px', fontSize: '1rem' }} 
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Create Book Jacket
                </button>
            </form>
        </div>
    );
};

export default CreateBook;