import React, { useEffect, useState } from 'react';

const NovelList = ({ onEdit }) => { 
    const [novels, setNovels] = useState([]);

    useEffect(() => {
        fetchNovels();
    }, []);

    const fetchNovels = () => {
        fetch('http://localhost:5000/api/novels')
            .then(response => response.json())
            .then(data => setNovels(data))
            .catch(error => console.error("Error fetching novels:", error));
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this novel?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/novels/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setNovels(novels.filter((novel) => novel._id !== id));
            } else {
                alert("Failed to delete.");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Error connecting to server.");
        }
    };
    
    return (
        <div style={{margin:'0 auto'}}>
            <h2>Novel Library</h2>
            {novels.length === 0 ? (
                <p>No novels found.</p>
            ) : (
                novels.map((novel) => (
                    <div key={novel._id} style={{
                        border: '1px solid #000',
                        borderRadius: '10px',
                        padding: '10px',
                        marginBottom: '10px',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <h3 style={{margin: '0 0 10px 0'}}>{novel.title}</h3>
                        <p style={{whiteSpace: 'pre-wrap', color:'#555'}}>
                            {novel.chapter.substring(0, 100)}...
                        </p>
                        <small style={{color:'#888'}}>
                            ID: {novel._id}
                        </small>
                        <button onClick={() => handleDelete(novel._id)} style={{ /* red button styles */ }}>
                        Delete
                        </button>
                        <button 
                            onClick={() => onEdit(novel)} 
                            style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', cursor: 'pointer' }}
                        >
                            Edit
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default NovelList;