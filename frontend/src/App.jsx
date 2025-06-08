import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicMemes from './pages/PublicMemes';
import MyMemes from './components/MyMemes'
import Templates from './pages/Templates';
import MemeEditor from './pages/MemeEditor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Templates />} />
        <Route path="/edit/:templateId" element={<MemeEditor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/memes" element={<PublicMemes />} />
        <Route path="/my-memes" element={<MyMemes />} />

      </Routes>
    </Router>
  );
}

export default App;
