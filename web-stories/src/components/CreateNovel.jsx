import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CreateNovel = () => {
    const [title, setTitle] = useState('');
    const [chapter, setChapter] = useState('');
    
    const { id } = useParams(); // Get ID from URL
    const navigate = useNavigate(); // Tool to change pages

    const isEditMode = Boolean(id); // true if we have an ID

    // Fetch data ONLY if we are editing
    useEffect(() => {
        if (isEditMode) {
            fetch(`http://localhost:5000/api/novels/${id}`)
                .then(res => res.json())
                .then(data => {
                    setTitle(data.title);
                    setChapter(data.chapter);
                })
                .catch(err => console.error("Error loading novel:", err));
        }
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const novelData = { title, chapter };
        
        const url = isEditMode 
            ? `http://localhost:5000/api/novels/${id}` 
            : 'http://localhost:5000/api/novels';
            
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novelData),
            });

            if (response.ok) {
                navigate('/'); // Go back to Library
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc' }}>
            <h2>{isEditMode ? "Edit Novel" : "Create New Novel"}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Title:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        style={{ width: '100%', display: 'block' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Chapter:</label>
                    <textarea 
                        value={chapter} 
                        onChange={(e) => setChapter(e.target.value)} 
                        rows="10" 
                        style={{ width: '100%', display: 'block' }} 
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
                    {isEditMode ? "Update" : "Publish"}
                </button>
            </form>
        </div>
    );
};

export default CreateNovel;