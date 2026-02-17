import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';     // NEW
import CreateBook from './components/CreateBook'; // NEW
import BookDetail from './components/BookDetail';
import WriteChapter from './components/WriteChapter';
import ReadChapter from './components/ReadChapter';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#464646', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/create" element={<CreateBook />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/read/:id" element={<ReadChapter />} />
          <Route path="/books/:bookId/new-chapter" element={<WriteChapter />} />
          <Route path="/books/:bookId/new-chapter" element={<WriteChapter />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;