import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [chapters, setChapters] = useState([]);
    
    // Get current user ID to check ownership
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        fetch(`http://localhost:5000/api/books/${id}`)
            .then(res => res.json())
            .then(data => {
                setBook(data.book);
                setChapters(data.chapters);
            })
            .catch(err => console.error("Error:", err));
    }, [id]);

    if (!book) return <div style={{textAlign:'center', marginTop: '50px'}}>Loading...</div>;

    // Check if I own this book
    const isOwner = book.author && book.author._id === currentUserId;

    const handleDeleteChapter = async (chapterId) => {
        if(!window.confirm("Are you sure you want to delete this chapter?")) return;
        
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/chapters/${chapterId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setChapters(chapters.filter(c => c._id !== chapterId)); // Remove from list
            } else {
                alert("Failed to delete chapter.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            {/* --- BOOK HEADER --- */}
            <div style={{ marginBottom: '40px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{book.title}</h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>By {book.author?.username}</p>
                <p style={{ marginTop: '20px', lineHeight: '1.6' }}>{book.description}</p>
                
                {/* Only Owner sees "Write Chapter" button */}
                {isOwner && (
                    <button 
                        onClick={() => navigate(`/books/${id}/new-chapter`)}
                        style={{ 
                            marginTop: '20px', 
                            padding: '10px 20px', 
                            backgroundColor: '#28a745', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        + Write New Chapter
                    </button>
                )}
            </div>

            {/* --- TABLE OF CONTENTS --- */}
            <h2>Table of Contents</h2>
            {chapters.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic' }}>No chapters yet. Start writing!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {chapters.map((chapter, index) => (
                        <div key={chapter._id} style={{ 
                            padding: '15px', 
                            backgroundColor: '#fff', 
                            border: '1px solid #eee', 
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: '#000'
                        }}>
                            <span style={{ fontSize: '1.1rem' }}>
                                <strong>Chapter {index + 1}:</strong> {chapter.title}
                            </span>
                            
                            <div>
                                <button 
                                    onClick={() => navigate(`/read/${chapter._id}`)}
                                    style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                                >
                                    Read
                                </button>

                                {/* NEW: Edit/Delete Buttons (Only for Owner) */}
                                {isOwner && (
                                    <>
                                        <button 
                                            onClick={() => navigate(`/chapters/${chapter._id}/edit`)}
                                            style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteChapter(chapter._id)}
                                            style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
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