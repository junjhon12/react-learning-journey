import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ReadNovel = () => {
    const { id } = useParams();
    const [novel, setNovel] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/novels/${id}`)
            .then(res => res.json())
            .then(data => setNovel(data))
            .catch(err => console.error("Error loading novel:", err));
    }, [id]);

    if (!novel) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading book...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            {/* Back Button */}
            <Link to="/" style={{ textDecoration: 'none', color: '#666', fontSize: '0.9rem' }}>
                ← Back to Library
            </Link>

            {/* Title */}
            <h1 style={{ 
                textAlign: 'center', 
                fontSize: '3rem', 
                marginTop: '20px', 
                marginBottom: '40px',
                fontFamily: 'Georgia, serif' 
            }}>
                {novel.title}
            </h1>
            
            <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '40px' }} />

            {/* The Content - Styled for Reading */}
            <div style={{ 
                whiteSpace: 'pre-wrap',       // Preserves paragraphs
                fontSize: '1.25rem',          // Larger text is easier to read
                lineHeight: '1.8',            // More space between lines
                fontFamily: 'Georgia, serif', // Classic book font
                color: '#cacaca',
                maxWidth: '700px',
                margin: '0 auto'
            }}>
                {novel.chapter}
            </div>
        </div>
    );
};

export default ReadNovel;