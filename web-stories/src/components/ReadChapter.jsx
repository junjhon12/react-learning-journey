import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from './CommentsSection'; // 1. Import it

const ReadChapter = () => {
    const { id } = useParams(); 
    const [chapter, setChapter] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/chapters/${id}`)
            .then(res => res.json())
            .then(data => setChapter(data))
            .catch(err => console.error("Error loading chapter:", err));
    }, [id]);

    if (!chapter) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            {/* ... (Keep your Back Link, Title, Content, etc.) ... */}
            <Link to={`/books/${chapter.book?._id}`} style={{ textDecoration: 'none', color: '#666', fontSize: '0.9rem' }}>
                ← Back to Table of Contents
            </Link>

            <h1 style={{ textAlign: 'center', fontSize: '3rem', marginTop: '20px', fontFamily: 'Georgia, serif' }}>
                {chapter.title}
            </h1>
            
            <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '40px 0' }} />

            <div style={{ 
                whiteSpace: 'pre-wrap', 
                fontSize: '1.25rem', 
                lineHeight: '1.8', 
                fontFamily: 'Georgia, serif', 
                color: '#333' 
            }}>
                {chapter.content}
            </div>

            {/* 2. Add the Comments Section Here */}
            <CommentsSection chapterId={id} />
        </div>
    );
};

export default ReadChapter;