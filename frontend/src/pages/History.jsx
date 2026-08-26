import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import RiskCard from '../components/RiskCard';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth
    if (!document.cookie.includes('token=')) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await client.get(`/history?page=${page}&limit=5`);
        setHistory(response.data.data.results);
        setTotalPages(response.data.data.pagination.totalPages);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page, navigate]);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Your Triage History</h2>
      
      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading history...</div>
      ) : history.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          No triage history found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {history.map((item) => (
            <div key={item._id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {new Date(item.createdAt).toLocaleString()}
              </div>
              <div style={{ padding: '1rem' }}>
                <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>"{item.symptoms}"</p>
                {/* Reusing RiskCard without the margin/shadow for inline display */}
                <RiskCard result={item} />
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button 
            className="btn btn-outline" 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            Page {page} of {totalPages}
          </span>
          <button 
            className="btn btn-outline" 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
