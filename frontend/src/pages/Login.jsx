import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await client.post('/auth/request-otp', { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await client.post('/auth/verify-otp', { email, otp });
      // Set a dummy cookie hint for the UI since HttpOnly cookie is set by backend
      document.cookie = "token=true; path=/";
      navigate('/triage');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary)' }}>
        CareNavigator Login
      </h2>
      
      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOtp}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              placeholder="you@example.com"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send Login Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Enter 6-digit Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.25rem' }}
              placeholder="------"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
          <button 
            type="button" 
            className="btn btn-outline" 
            style={{ width: '100%', marginTop: '0.5rem' }} 
            onClick={() => setStep(1)}
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
