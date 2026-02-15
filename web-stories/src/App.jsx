import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Adjust path if needed
import CreateNovel from './components/CreateNovel';
import NovelList from './components/NovelList';
import ReadNovel from './components/ReadNovel';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <Navbar />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <Routes>
          {/* Library (Home) */}
          <Route path="/" element={<NovelList />} />
          
          {/* Create New Novel */}
          <Route path="/create" element={<CreateNovel />} />
          
          {/* Edit Existing Novel (:id is a variable) */}
          <Route path="/edit/:id" element={<CreateNovel />} />

          {/* Read Route */}
          <Route path="/read/:id" element={<ReadNovel />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;