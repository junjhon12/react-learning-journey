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
                <div key={novel._id} style={{ 
                    border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px' 
                }}>
                    <h3>{novel.title}</h3>
                    <p>{novel.chapter.substring(0, 100)}...</p>
                    
                    <button onClick={() => handleDelete(novel._id)} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', marginRight: '10px' }}>
                        Delete
                    </button>

                    {/* 3. Update Edit Button to Navigate */}
                    <button 
                        onClick={() => navigate(`/edit/${novel._id}`)} 
                        style={{ backgroundColor: '#ffc107', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                    >
                        Edit
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NovelList;