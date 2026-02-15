import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const NovelList = () => {
    const [novels, setNovels] = useState([]);
    const navigate = useNavigate(); // 2. Initialize hook

    // ... (Keep your existing useEffect, fetchNovels, and handleDelete) ...
    // COPY PASTE your existing useEffect, fetchNovels, and handleDelete functions here
    useEffect(() => {
        fetch('http://localhost:5000/api/novels')
            .then(res => res.json())
            .then(data => setNovels(data))
            .catch(err => console.error("Error:", err));
    }, []);

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this novel?")) return;
        try {
            await fetch(`http://localhost:5000/api/novels/${id}`, { method: 'DELETE' });
            setNovels(novels.filter(n => n._id !== id));
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>📚 Novel Library</h2>
            {novels.map((novel) => (
                // ... inside your map function ...

                <div key={novel._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px', position: 'relative' }}>
                    
                    <h3 style={{ margin: '0 0 10px 0' }}>{novel.title}</h3>
                    
                    {/* Preview Text */}
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        {novel.chapter.substring(0, 100)}...
                    </p>

                    <div style={{ marginTop: '15px' }}>
                        {/* NEW: Read Button (Primary Action) */}
                        <button 
                            onClick={() => navigate(`/read/${novel._id}`)} 
                            style={{ 
                                backgroundColor: '#007bff', 
                                color: 'white', 
                                border: 'none', 
                                padding: '8px 16px', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                marginRight: '10px',
                                fontWeight: 'bold'
                            }}
                        >
                            Read Now
                        </button>

                        {/* Edit Button (Secondary Action) */}
                        <button 
                            onClick={() => navigate(`/edit/${novel._id}`)} 
                            style={{ backgroundColor: '#eee', color: '#333', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                        >
                            Edit
                        </button>

                        {/* Delete Button (Destructive Action) */}
                        <button onClick={() => handleDelete(novel._id)} style={{ backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '7px 11px', borderRadius: '4px', cursor: 'pointer' }}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NovelList;