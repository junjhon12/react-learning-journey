import React, { useState, useEffect } from 'react';

// Receive props from App.jsx
const CreateNovel = ({ novelToEdit, onEditComplete }) => {
    const [title, setTitle] = useState('');
    const [chapter, setChapter] = useState('');

    // Pre-fill the form when "novelToEdit" changes
    useEffect(() => {
        if (novelToEdit) {
            setTitle(novelToEdit.title);
            setChapter(novelToEdit.chapter);
        } else {
            setTitle('');
            setChapter('');
        }
    }, [novelToEdit]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // LOGIC BRANCH: Are we Updating or Creating?
        if (novelToEdit) {
            // --- UPDATE MODE ---
            await updateNovel();
        } else {
            // --- CREATE MODE ---
            await createNovel();
        }
    };

    const createNovel = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/novels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, chapter }),
            });
            if (response.ok) {
                alert("Novel Created!");
                setTitle('');
                setChapter('');
                // Ideally, trigger a refresh of the list here (we'll fix that next)
                window.location.reload(); 
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const updateNovel = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/novels/${novelToEdit._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, chapter }),
            });
            if (response.ok) {
                alert("Novel Updated!");
                onEditComplete(); // Tell App we are done editing
                window.location.reload(); // Refresh to see changes
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
            <h2>{novelToEdit ? "Edit Novel" : "Create New Novel"}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block' }}>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block' }}>Chapter:</label>
                    <textarea value={chapter} onChange={(e) => setChapter(e.target.value)} rows="10" style={{ width: '100%' }} />
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: novelToEdit ? '#ffc107' : '#007bff', color: 'white', border: 'none' }}>
                    {novelToEdit ? "Update Novel" : "Publish Novel"}
                </button>
                {novelToEdit && (
                    <button type="button" onClick={onEditComplete} style={{ marginLeft: '10px', padding: '10px' }}>
                        Cancel
                    </button>
                )}
            </form>
        </div>
    );
};

export default CreateNovel;