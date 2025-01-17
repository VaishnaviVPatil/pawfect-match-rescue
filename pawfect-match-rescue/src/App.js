import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import SearchPage from './components/SearchPage'; 
import MatchResult from './components/MatchResults';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/search" element={<SearchPage />} /> 
        <Route path="/match-result" element={<MatchResult />} />
      </Routes>
    </Router>
  );
}

export default App;
