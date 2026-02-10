import React, { useState } from 'react';

const CreateNovel = () => {
    const [title, setTitle] = useState('');
    const [chapter, setChapter] = useState('');

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };
    const handleChapterChange = (event) => {
        setChapter(event.target.value);
    };
    const autoSave = (event) => {
        event.preventDefault();
        if (title.length == 0) {
            alert("Title is required.");
            return;
        }
        if (!chapter) {
            alert("Cannot upload empty chapter.")
            return;
        }
        console.log("Uploading...", {title, chapter});
        alert(`${title} has been saved`);
    };
    return (
        <div>
            <h2>Create/Edit/Upload Your Webnovel</h2>
            <form onSubmit={autoSave}>
                <div>
                    <label htmlFor="title">Novel Title: </label>
                    <input type="text" id="title" value={title} onChange={handleTitleChange} />
                </div>
                <div>
                    <label htmlFor="chapter">Chapter content: </label>
                    <textarea id="chapter" value={chapter} onChange={handleChapterChange} rows="10" />
                </div>
                <hr />
                <h3>Preview</h3>
                <h4>{title || "Untitled"}</h4>
                <p style={{whitespace: 
                    'pre-wrap'
                }}>{chapter || "Waiting on content..."}</p>    
            </form>
            
        </div>
    );
};

export default CreateNovel;