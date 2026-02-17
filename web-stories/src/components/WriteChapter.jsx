import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WriteChapter = () => {
    const { bookId, chapterId } = useParams(); 
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [aiFeedback, setAiFeedback] = useState(null); // NEW: AI State
    const [loadingAi, setLoadingAi] = useState(false); // NEW: Loading State
    const isEditMode = Boolean(chapterId);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            alert("Please login first!");
            navigate('/login');
        }
    }, [navigate]);

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

    // NEW: Function to call the AI Assistant
    const getAiCritique = async () => {
        if (!content || content.length < 100) {
            return alert("Please write a bit more before requesting a critique!");
        }

        setLoadingAi(true);
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch('http://localhost:5000/api/ai/critique', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content, bookTitle: title || "Untitled Story" }) 
            });
            
            const data = await response.json();
            if (response.ok) {
                setAiFeedback(data);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Critique failed:", error);
        } finally {
            setLoadingAi(false);
        }
    };

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
        <div className="container" style={{ display: 'flex', gap: '20px', maxWidth: '1200px', margin: '20px auto' }}>
            {/* Editor Side */}
            <div className="card" style={{ flex: 2, padding: '20px' }}>
                <h2>{isEditMode ? "Edit Chapter" : "Write New Chapter"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Chapter Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    
                    <label>Story Content:</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="20" required />
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="button" onClick={getAiCritique} className="btn btn-secondary">
                            {loadingAi ? "🕵️ Analyzing..." : "✨ Get AI Feedback"}
                        </button>
                        <button type="submit" className="btn btn-primary">Publish</button>
                    </div>
                </form>
            </div>

            {/* AI Feedback Panel */}
            {aiFeedback && (
                <div className="card" style={{ flex: 1, padding: '20px', backgroundColor: '#1a1f26', color: '#fff' }}>
                    <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Assistant's Report</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '20px 0' }}>
                        {Object.entries(aiFeedback.grades).map(([key, val]) => (
                            <div key={key} style={{ textAlign: 'center', padding: '10px', background: '#0d1117', borderRadius: '4px' }}>
                                <small style={{ textTransform: 'capitalize', color: '#8b949e' }}>{key}</small>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#58a6ff' }}>{val}</div>
                            </div>
                        ))}
                    </div>

                    <h4>Plot-Holes & Inconsistencies:</h4>
                    <ul style={{ color: '#8b949e', fontSize: '0.9rem' }}>
                        {aiFeedback.plotHoles.map((hole, i) => <li key={i}>{hole}</li>)}
                    </ul>

                    <h4>Tips for Growth:</h4>
                    <ul style={{ color: '#8b949e', fontSize: '0.9rem' }}>
                        {aiFeedback.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default WriteChapter;