// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// A simple placeholder for About
function About() {
  return <h2>About Chef's Corner: We love food!</h2>;
}

function App() {
  return (
    <BrowserRouter>
      {/* Navbar sits OUTSIDE Routes so it always shows */}
      <Navbar />
      
      <Routes>
        {/* Define the paths */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;