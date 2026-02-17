import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from './CommentsSection';

const ReadChapter = () => {
    const { id } = useParams(); 
    const [chapter, setChapter] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/chapters/${id}`)
            .then(res => res.json())
            .then(data => setChapter(data))
            .catch(err => console.error("Error loading chapter:", err));
    }, [id]);

    if (!chapter) return <div className="container text-center mt-4">Loading...</div>;

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>
            <div className="card">
                <Link to={`/books/${chapter.book?._id}`} className="text-muted" style={{ fontSize: '0.9rem' }}>
                    ← Back to Table of Contents
                </Link>

                <h1 style={{ textAlign: 'center', fontSize: '3rem', marginTop: '20px', fontFamily: 'Georgia, serif', borderBottom: '1px solid #30363d', paddingBottom: '20px' }}>
                    {chapter.title}
                </h1>
                
                {/* IMPORTANT: We use 'dangerouslySetInnerHTML' so the 
                   <b>Bold</b> and <i>Italics</i> actually show up!
                */}
                <div 
                    className="story-content"
                    style={{ fontSize: '1.25rem', lineHeight: '1.8', fontFamily: 'Georgia, serif', color: '#c9d1d9', marginTop: '30px' }}
                    dangerouslySetInnerHTML={{ __html: chapter.content }} 
                />
            </div>

            <CommentsSection chapterId={id} />
        </div>
    );
};

export default ReadChapter;