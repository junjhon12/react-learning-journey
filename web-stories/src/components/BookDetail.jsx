import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    
    const currentUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`http://localhost:5000/api/books/${id}`)
            .then(res => res.json())
            .then(data => {
                setBook(data.book);
                setChapters(data.chapters);
            });

        if (token) {
            fetch('http://localhost:5000/api/bookshelf', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(savedBooks => {
                const found = savedBooks.find(b => b._id === id);
                setIsSaved(!!found);
            });
        }
    }, [id, token]);

    const toggleSave = async () => {
        if (!token) return alert("Please login to save books!");
        const response = await fetch(`http://localhost:5000/api/books/${id}/save`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setIsSaved(data.isSaved);
    };

    const handleDeleteChapter = async (chapterId) => {
        if(!window.confirm("Delete this chapter?")) return;
        try {
            await fetch(`http://localhost:5000/api/chapters/${chapterId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setChapters(chapters.filter(c => c._id !== chapterId));
        } catch (error) { console.error(error); }
    };

    if (!book) return <div className="container text-center mt-4">Loading...</div>;
    const isOwner = book.author && book.author._id === currentUserId;

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            {/* Header Card */}
            <div className="card mb-4">
                <div className="flex-between">
                    <h1 style={{ marginBottom: 0 }}>{book.title}</h1>
                    <button onClick={toggleSave} style={{ fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                        {isSaved ? '❤️' : '🤍'}
                    </button>
                </div>
                <div className="text-muted mb-4">By {book.author?.username}</div>
                <p>{book.description}</p>
                
                {isOwner && (
                    <button onClick={() => navigate(`/books/${id}/new-chapter`)} className="btn btn-success mt-4" style={{ backgroundColor: '#2ea043', border: 'none', color: '#fff' }}>
                        + Write New Chapter
                    </button>
                )}
            </div>

            {/* Table of Contents */}
            <h3 className="mb-4">Table of Contents</h3>
            {chapters.length === 0 ? (
                <p className="text-muted">No chapters yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {chapters.map((chapter, index) => (
                        <div key={chapter._id} className="card flex-between" style={{ padding: '15px' }}>
                            <span style={{ fontWeight: 500 }}>
                                <span className="text-muted" style={{ marginRight: '10px' }}>Chapter {index + 1} |</span>
                                {chapter.title}
                            </span>
                            
                            <div>
                                <button onClick={() => navigate(`/read/${chapter._id}`)} className="btn btn-primary" style={{ marginRight: '10px', padding: '5px 10px' }}>Read</button>

                                {isOwner && (
                                    <>
                                        <button onClick={() => navigate(`/chapters/${chapter._id}/edit`)} className="btn btn-secondary" style={{ marginRight: '10px', padding: '5px 10px' }}>Edit</button>
                                        <button onClick={() => handleDeleteChapter(chapter._id)} className="btn btn-danger" style={{ padding: '5px 10px' }}>Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookDetail;