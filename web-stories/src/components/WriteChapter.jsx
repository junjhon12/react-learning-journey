import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const WriteChapter = () => {
    const { bookId, chapterId } = useParams(); 
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const isEditMode = Boolean(chapterId);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
        if (isEditMode) {
            fetch(`http://localhost:5000/api/chapters/${chapterId}`)
                .then(res => res.json())
                .then(data => {
                    setTitle(data.title);
                    setContent(data.content);
                })
                .catch(err => console.error(err));
        }
    }, [isEditMode, chapterId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
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
                navigate(-1); 
            } else {
                alert("Failed to save chapter");
            }
        } catch (error) { console.error("Error:", error); }
    };

    return (
        <div className="container" style={{ maxWidth: '900px' }}>
            <div className="card">
                <h2 className="mb-4">{isEditMode ? "Edit Chapter" : "Write New Chapter"}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Chapter Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Chapter 1: The Beginning" />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label>Story Content</label>
                        {/* 3. The Rich Text Editor */}
                        <div style={{ backgroundColor: '#fff', color: '#000', borderRadius: '4px' }}>
                            <ReactQuill 
                                theme="snow" 
                                value={content} 
                                onChange={setContent} 
                                style={{ height: '300px', marginBottom: '50px' }} // Height + buffer for toolbar
                            />
                        </div>
                    </div>

                    <div className="flex-between">
                        <button type="submit" className="btn btn-primary">{isEditMode ? "Update" : "Publish"}</button>
                        <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WriteChapter;