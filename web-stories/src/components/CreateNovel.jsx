import React, { useState } from 'react';

const CreateNovel = () => {
    const [title, setTitle] = useState('');
    const [chapter, setChapter] = useState('');

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };
    const handleChapterChange = (event) => {
        setChapter(event.target.value);
    };

    const autoSave = async (event) => {
        event.preventDefault(); // Prevents page reload
        if (title.length === 0) {
            alert("Title is required.");
            return;
        }
        if (!chapter) {
            alert("Cannot upload empty chapter.")
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/novels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, chapter }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Server: ${data.message}`);
                setTitle('');
                setChapter('');
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server connection failed.")
        }
    };

    return (
        <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Create/Edit/Upload Your Webnovel</h2>
            <form onSubmit={autoSave}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="title" style={{ display: 'block' }}>Novel Title: </label>
                    <input 
                        type="text" 
                        id="title" 
                        value={title} 
                        onChange={handleTitleChange}
                        style={{ width: '100%', padding: '8px' }} 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="chapter" style={{ display: 'block' }}>Chapter content: </label>
                    <textarea 
                        id="chapter" 
                        value={chapter} 
                        onChange={handleChapterChange} 
                        rows="10" 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                {/* --- THIS WAS MISSING --- */}
                <button 
                    type="submit" 
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        cursor: 'pointer' 
                    }}
                >
                    Publish Novel
                </button>
                {/* ------------------------ */}

                <hr />
                <h3>Preview</h3>
                <h4>{title || "Untitled"}</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{chapter || "Waiting on content..."}</p>    
            </form>
        </div>
    );
};

export default CreateNovel;