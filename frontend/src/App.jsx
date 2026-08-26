import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Triage from './pages/Triage';
// Lazy load history page
const History = lazy(() => import('./pages/History'));

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/triage" element={<Triage />} />
              <Route path="/history" element={<History />} />
              <Route path="/" element={<Navigate to="/triage" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
