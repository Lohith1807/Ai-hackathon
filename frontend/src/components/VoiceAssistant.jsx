import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceAssistant = ({ context = 'user', stats = null }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // Initialize Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = true; // Show words as they are being spoken
      recognition.lang = 'en-US'; 
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        // Show live typing
        if (interimTranscript) setTranscript(interimTranscript);
        
        // Once they finish speaking, process the final command
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processCommand(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, [stats]);

  const toggleListen = () => {
    setIsChatOpen(false);
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setResponse('');
      recognition?.start();
      setIsListening(true);
    }
  };

  const toggleChat = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    }
    if (isChatOpen) {
      setIsChatOpen(false);
    } else {
      setTranscript('');
      setResponse('');
      setIsChatOpen(true);
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setTranscript(chatInput);
    processCommand(chatInput);
    setChatInput('');
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Female'));
      if (preferredVoice) utterance.voice = preferredVoice;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const processCommand = (text) => {
    const lower = text.toLowerCase();
    let reply = "I'm sorry, I didn't catch that.";

    if (context === 'admin') {
      if (lower.includes('how many users')) {
        reply = `There are currently ${stats?.overview?.totalUsers || 0} registered users.`;
      } else if (lower.includes('how many doctors')) {
        reply = `We have ${stats?.overview?.totalDoctors || 0} doctors available across all hospitals.`;
      } else if (lower.includes('how many appointments')) {
        reply = `There have been ${stats?.overview?.totalAppointments || 0} appointments booked in total.`;
      } else if (lower.includes('hello') || lower.includes('hi')) {
        reply = "Hello Admin. How can I help you manage the hospital today?";
      } else {
        reply = "As an admin, you can ask me about total users, doctors, or appointments.";
      }
    } else {
      // User context
      if (lower.includes('book') || lower.includes('appointment')) {
        reply = "You can book an appointment by selecting a doctor from the hospital list below.";
      } else if (lower.includes('search') || lower.includes('find')) {
        reply = "Use the search bar above to find a hospital by name or location.";
      } else if (lower.includes('hello') || lower.includes('hi')) {
        reply = "Hello! I am your Care Navigator assistant. How can I help you today?";
      } else {
        reply = "You can ask me how to book an appointment or find a hospital.";
      }
    }

    setResponse(reply);
    speak(reply);
  };

  if (!recognition) {
    return null; // Browser doesn't support speech API
  }

  return (
    <>
      <div className="fab-container">
        <button 
          className="chat-fab"
          onClick={toggleChat}
          title="Text Chat AI"
        >
          💬
        </button>
        <button 
          className={`voice-fab ${isListening ? 'listening' : ''}`}
          onClick={toggleListen}
          title="AI Voice Assistant"
        >
          {isListening ? '🛑' : '🎤'}
        </button>
      </div>

      <AnimatePresence>
        {(isListening || isChatOpen || transcript || response) && (
          <motion.div 
            className="voice-popup"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <h4 style={{ margin: '0 0 1rem 0', color: '#1e3c72', textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>🤖 Talk to AI</h4>
            
            {isChatOpen && !transcript && !response && (
               <div className="ai-speech">
                 <span className="label">AI:</span>
                 <p>Hello! Type your question below.</p>
               </div>
            )}

            {isListening && !transcript && !response && !isChatOpen && (
              <div className="ai-speech">
                <span className="label">AI:</span>
                <p>I am listening... Please speak.</p>
              </div>
            )}

            {transcript && (
              <div className="user-speech">
                <span className="label">You:</span>
                <p>"{transcript}"</p>
              </div>
            )}
            
            {response && (
              <div className="ai-speech">
                <span className="label">AI:</span>
                <p>{response}</p>
              </div>
            )}

            {isChatOpen && (
              <form onSubmit={handleChatSubmit} className="chat-input-form">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask something..."
                  autoFocus
                />
                <button type="submit">Send</button>
              </form>
            )}
            
            <button className="close-popup" onClick={() => { setTranscript(''); setResponse(''); setIsChatOpen(false); }}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .fab-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 9999;
        }
        .voice-fab, .chat-fab {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          color: white;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 0.2s;
        }
        .voice-fab {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          box-shadow: 0 10px 15px -3px rgba(30, 60, 114, 0.3);
        }
        .chat-fab {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
        }
        .voice-fab:hover, .chat-fab:hover {
          transform: scale(1.1);
        }
        .voice-fab.listening {
          background: #ef4444;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        .voice-popup {
          position: fixed;
          bottom: 6rem;
          right: 2rem;
          width: 300px;
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          z-index: 9998;
          border-left: 4px solid #2a5298;
        }
        .user-speech, .ai-speech {
          margin-bottom: 1rem;
        }
        .label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
        }
        .user-speech p {
          margin: 0.25rem 0 0 0;
          color: #374151;
          font-style: italic;
        }
        .ai-speech p {
          margin: 0.25rem 0 0 0;
          color: #1e3c72;
          font-weight: 500;
        }
        .close-popup {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 1rem;
        }
        .close-popup:hover {
          color: #ef4444;
        }
        .chat-input-form {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          border-top: 1px solid #eee;
          padding-top: 1rem;
        }
        .chat-input-form input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 9999px;
          font-size: 0.875rem;
          outline: none;
        }
        .chat-input-form input:focus {
          border-color: #2a5298;
          box-shadow: 0 0 0 2px rgba(42, 82, 152, 0.2);
        }
        .chat-input-form button {
          padding: 0.5rem 1rem;
          background: #2a5298;
          color: white;
          border: none;
          border-radius: 9999px;
          font-size: 0.875rem;
          cursor: pointer;
          font-weight: 500;
        }
        .chat-input-form button:hover {
          background: #1e3c72;
        }
      `}</style>
    </>
  );
};

export default VoiceAssistant;
