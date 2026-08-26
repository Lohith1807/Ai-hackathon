import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone, FaStop, FaUpload, FaPaperPlane } from 'react-icons/fa';
import client from '../api/client';
import RiskCard from '../components/RiskCard';
import SkeletonLoader from '../components/SkeletonLoader';

const Triage = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [saveHistory, setSaveHistory] = useState(true);
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // Check auth
    if (!document.cookie.includes('token=')) {
      navigate('/login');
    }

    // Setup speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setSymptoms(prev => prev + ' ' + finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [navigate]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await client.post('/triage', { symptoms, saveHistory });
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to analyze symptoms.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>AI Triage Assessment</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Describe your symptoms to receive an initial risk assessment and recommendations. 
        <strong> This is not a medical diagnosis.</strong>
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              What are your symptoms?
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g., I have had a severe headache for two days and a slight fever..."
              style={{ 
                width: '100%', 
                minHeight: '150px', 
                padding: '1rem', 
                borderRadius: 'var(--border-radius)', 
                border: '1px solid var(--border-color)',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button" 
                className={`btn ${isRecording ? 'btn-primary' : 'btn-outline'}`}
                onClick={toggleRecording}
                style={{ backgroundColor: isRecording ? '#dc3545' : 'transparent', color: isRecording ? 'white' : 'inherit' }}
              >
                {isRecording ? <><FaStop /> Stop</> : <><FaMicrophone /> Voice</>}
              </button>
              
              <button type="button" className="btn btn-outline" disabled title="Image upload fallback">
                <FaUpload /> Image
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <input 
                  type="checkbox" 
                  checked={saveHistory} 
                  onChange={(e) => setSaveHistory(e.target.checked)} 
                />
                Save to History
              </label>
              
              <button type="submit" className="btn btn-primary" disabled={loading || !symptoms.trim()}>
                <FaPaperPlane /> Analyze
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {loading && <SkeletonLoader />}
      {!loading && result && <RiskCard result={result} />}

    </div>
  );
};

export default Triage;
