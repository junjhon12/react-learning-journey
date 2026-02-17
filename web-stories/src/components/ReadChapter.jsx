import React, { useEffect, useState, useRef } from 'react'; // 1. Added useRef
import { useParams, Link } from 'react-router-dom';
import CommentsSection from './CommentsSection';

const ReadChapter = () => {
    const { id } = useParams(); 
    const [chapter, setChapter] = useState(null);
    const hasCountedView = useRef(false); // 2. Create the guard

    useEffect(() => {
        fetch(`http://localhost:5000/api/chapters/${id}`)
            .then(res => res.json())
            .then(data => {
                setChapter(data);
                
                // 3. Only count the view if we haven't already for THIS chapter load
                if (data.book?._id && !hasCountedView.current) {
                    fetch(`http://localhost:5000/api/books/${data.book._id}/view`, { method: 'POST' });
                    hasCountedView.current = true; // Set guard to true
                }
            })
            .catch(err => console.error("Error loading chapter:", err));

        // Reset the guard if the user switches to a DIFFERENT chapter
        return () => {
            hasCountedView.current = false;
        };
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