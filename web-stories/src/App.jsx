import React from 'react';
// Make sure the path matches where you saved CreateNovel.jsx
import CreateNovel from './components/CreateNovel'; 
import NovelList from './components/NovelList'; // Assumes you created this file in src/

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>📖 My Webnovel Platform</h1>
      
      {/* The Upload Form */}
      <CreateNovel />
      
      <hr style={{ margin: '30px 0' }} />
      
      {/* The Library List */}
      <NovelList />
    </div>
  );
}

export default App;