import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WriteChapter = () => {
    // We might have bookId (for creating) OR chapterId (for editing)
    const { bookId, chapterId } = useParams(); 
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const isEditMode = Boolean(chapterId);

    // Security Check
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            alert("Please login first!");
            navigate('/login');
        }
    }, [navigate]);

    // Fetch existing data if Editing
    useEffect(() => {
        if (isEditMode) {
            fetch(`http://localhost:5000/api/chapters/${chapterId}`)
                .then(res => res.json())
                .then(data => {
                    setTitle(data.title);
                    setContent(data.content);
                })
                .catch(err => console.error(err));
        }
    }, [isEditMode, chapterId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        // Determine URL and Method based on mode
        const url = isEditMode 
            ? `http://localhost:5000/api/chapters/${chapterId}`
            : `http://localhost:5000/api/books/${bookId}/chapters`;
            
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                alert(isEditMode ? "Chapter Updated!" : "Chapter Published!");
                // If editing, we need to fetch the chapter to know which book to go back to
                // For now, let's just go back -1 in history or home
                navigate(-1); 
            } else {
                alert("Failed to save chapter");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
            <h2>{isEditMode ? "Edit Chapter" : "Write New Chapter"}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Chapter Title:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                        style={{ width: '100%', padding: '10px', fontSize: '1rem' }} 
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Story Content:</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        rows="20" 
                        required
                        style={{ width: '100%', padding: '10px', fontSize: '1.1rem', fontFamily: 'Georgia, serif', lineHeight: '1.6' }} 
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {isEditMode ? "Update Chapter" : "Publish Chapter"}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WriteChapter;