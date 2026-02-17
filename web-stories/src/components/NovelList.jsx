import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NovelList = () => {
    const [novels, setNovels] = useState([]);
    const navigate = useNavigate();

    const currentUserId = localStorage.getItem('userId'); // Get My ID
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch('http://localhost:5000/api/novels')
            .then(res => res.json())
            .then(data => setNovels(data))
            .catch(err => console.error("Error:", err));
    }, []);

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure?")) return;
        
        try {
            const response = await fetch(`http://localhost:5000/api/novels/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setNovels(novels.filter(n => n._id !== id));
            } else {
                alert("You are not allowed to delete this novel.");
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>📚 Novel Library</h2>
            {novels.map((novel) => (
                <div key={novel._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px', position: 'relative' }}>
                    
                    <h3 style={{ margin: '0 0 5px 0' }}>{novel.title}</h3>
                    
                    {/* Show Author Name */}
                    <small style={{display:'block', color:'#888', marginBottom:'10px'}}>
                        By: {novel.author ? novel.author.username : "Unknown"}
                    </small>

                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        {novel.chapter.substring(0, 100)}...
                    </p>

                    <div style={{ marginTop: '15px' }}>
                        <button 
                            onClick={() => navigate(`/read/${novel._id}`)} 
                            style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold' }}
                        >
                            Read Now
                        </button>

                        {/* ONLY SHOW BUTTONS IF YOU ARE THE OWNER */}
                        {novel.author && novel.author._id === currentUserId && (
                            <>
                                <button 
                                    onClick={() => navigate(`/edit/${novel._id}`)} 
                                    style={{ backgroundColor: '#eee', color: '#333', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                                >
                                    Edit
                                </button>

                                <button onClick={() => handleDelete(novel._id)} style={{ backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '7px 11px', borderRadius: '4px', cursor: 'pointer' }}>
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NovelList;