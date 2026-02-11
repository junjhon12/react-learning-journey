import React, { useEffect, useState } from 'react';

const NovelList = () => {
    const[novels, setNovels] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/novels')
            .then(response => response.json())
            .then(data => setNovels(data))
            .catch(error => console.error("Fetching novels:", error));
    }, []);

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
                    </div>
                ))
            )}
        </div>
    );
};

export default NovelList;