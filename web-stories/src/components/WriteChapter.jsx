import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new'; //
import 'react-quill-new/dist/quill.snow.css'; //

const WriteChapter = () => {
    const { bookId, chapterId } = useParams(); 
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const isEditMode = Boolean(chapterId);

    // Quill Toolbar Configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'clean']
        ],
    };

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
        const url = isEditMode ? `http://localhost:5000/api/chapters/${chapterId}` : `http://localhost:5000/api/books/${bookId}/chapters`;
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                alert(isEditMode ? "Chapter Updated!" : "Chapter Published!");
                navigate(-1); 
            }
        } catch (error) { console.error("Error:", error); }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="card">
                <h2>{isEditMode ? "Edit Chapter" : "Write New Chapter"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Chapter Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    
                    <label>Story Content:</label>
                    {/* The Rich Text Editor */}
                    <div style={{ backgroundColor: '#fff', color: '#000', borderRadius: '4px', marginBottom: '20px' }}>
                        <ReactQuill 
                            theme="snow" 
                            value={content} 
                            onChange={setContent} 
                            modules={modules}
                            style={{ height: '300px', marginBottom: '50px' }} 
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-block">Publish Chapter</button>
                </form>
            </div>
        </div>
    );
};

export default WriteChapter;