import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [place, setPlace] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return;
    
    if (!isLogin && (!name || !dob || !place)) {
      setError('Please fill in all registration fields');
      return;
    }

    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin 
      ? { identifier, password }
      : { identifier, password, name, dob, place };

    try {
      const res = await client.post(endpoint, payload);
      document.cookie = "token=true; path=/";
      
      // Save user to local storage for frontend use
      const user = res.data.data.user;
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate based on role
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'USER') {
        navigate('/hospitals');
      } else {
        // Fallback for Doctor or others
        navigate('/triage');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || `Failed to ${isLogin ? 'login' : 'register'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        {/* Decorative elements */}
        <div className="decor-circle decor-1"></div>
        <div className="decor-circle decor-2"></div>
        <div className="decor-star decor-3">✦</div>
        <div className="decor-star decor-4">✦</div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="login-left-content"
        >
          <div className="logo-container">
            <div className="logo-shape">
              <div className="logo-head"></div>
              <div className="logo-body-left"></div>
              <div className="logo-body-right"></div>
            </div>
          </div>
          <h1>CARE NAVIGATOR</h1>
          <p>All your healthcare needs<br/>on your finger tips</p>
        </motion.div>
        
        {/* Wave graphic at bottom */}
        <svg className="login-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgba(255,255,255,0.1)" fillOpacity="1" d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,224C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>

      <div className="login-right">
        {/* Floating shapes top right */}
        <div className="floating-shapes">
          <div className="shape shape-primary"></div>
          <div className="shape shape-secondary"></div>
          <div className="shape shape-accent"></div>
        </div>

        <div className="login-form-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-logo-container">
                <div className="logo-shape mobile-logo">
                  <div className="logo-head"></div>
                  <div className="logo-body-left"></div>
                  <div className="logo-body-right"></div>
                </div>
              </div>

              <h2 className="welcome-text">{isLogin ? 'Welcome User' : 'Create Account'}</h2>
              <p className="subtitle-text">{isLogin ? 'Sign in to continue' : 'Sign up to get started'}</p>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="custom-form">
                {!isLogin && (
                  <>
                    <div className="input-group">
                      <label>USERNAME / FULL NAME</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="input-group" style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label>DATE OF BIRTH</label>
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          required
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>PLACE / LOCATION</label>
                        <input
                          type="text"
                          value={place}
                          onChange={(e) => setPlace(e.target.value)}
                          required
                          placeholder="e.g. New York"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="input-group">
                  <label>EMAIL OR MOBILE</label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder="Enter your Mobile number or E-mail"
                  />
                </div>
                
                <div className="input-group">
                  <label>PASSWORD</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    minLength="6"
                  />
                  {isLogin && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button type="button" className="btn-text-link" style={{ fontSize: '0.75rem' }} onClick={() => alert('Forgot password flow coming soon!')}>
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="form-actions" style={{ flexDirection: 'column', gap: '1rem' }}>
                  <button type="submit" className="btn-gradient" disabled={loading}>
                    {loading ? (isLogin ? 'SIGNING IN...' : 'REGISTERING...') : (isLogin ? 'SIGN IN' : 'REGISTER')}
                  </button>
                  
                  <div style={{ position: 'relative', textAlign: 'center', margin: '1rem 0' }}>
                    <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb' }} />
                    <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '0 10px', color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600 }}>OR</span>
                  </div>

                  <button type="button" className="btn-outline-social" onClick={() => alert('Google Sign-In coming soon!')}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                    Sign in with Google
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                    <span style={{ color: '#6b7280' }}>{isLogin ? 'New user? ' : 'Already have an account? '}</span>
                    <button type="button" className="btn-text-link" onClick={toggleMode}>
                      {isLogin ? 'Register here' : 'Sign in here'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        /* Overrides for Login specifically to break out of .container */
        #root {
          height: 100vh;
        }
        .App {
          height: 100%;
        }
        main.container {
          max-width: 100%;
          padding: 0;
          height: 100%;
        }

        .login-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background-color: #fff;
          overflow: hidden;
        }

        /* CHANGED PURPLE TO BLUE GRADIENT */
        .login-left {
          flex: 1;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          overflow: hidden;
        }

        .decor-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }
        .decor-1 { width: 100px; height: 100px; top: 10%; right: 15%; }
        .decor-2 { width: 50px; height: 50px; bottom: 20%; left: 10%; }
        
        .decor-star {
          position: absolute;
          color: rgba(255, 255, 255, 0.3);
          font-size: 1.5rem;
        }
        .decor-3 { top: 15%; left: 15%; }
        .decor-4 { top: 30%; right: 25%; font-size: 1rem; }

        .login-left-content {
          text-align: center;
          z-index: 10;
          margin-top: -10vh;
        }

        .logo-container {
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
        }

        .logo-shape {
          width: 100px;
          height: 100px;
          position: relative;
        }

        .mobile-logo-container {
          display: none;
          margin-bottom: 2rem;
        }

        .mobile-logo {
          width: 60px;
          height: 60px;
        }
        
        .logo-head {
          width: 30%;
          height: 30%;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 35%;
        }
        
        .logo-body-left, .logo-body-right {
          width: 35%;
          height: 70%;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 20px;
          position: absolute;
          top: 35%;
        }

        .logo-body-left {
          left: 15%;
          transform: rotate(-45deg);
        }

        .logo-body-right {
          right: 15%;
          transform: rotate(45deg);
          background: rgba(255, 255, 255, 0.8);
        }

        /* Adjust colors for mobile logo on white bg */
        .mobile-logo .logo-head { background: #2a5298; }
        .mobile-logo .logo-body-left { background: rgba(42, 82, 152, 0.6); }
        .mobile-logo .logo-body-right { background: rgba(42, 82, 152, 0.8); }

        .login-left-content h1 {
          font-size: 2rem;
          letter-spacing: 2px;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .login-left-content p {
          font-size: 1.1rem;
          font-weight: 300;
          opacity: 0.9;
          line-height: 1.5;
        }

        .login-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: auto;
        }

        .login-right {
          flex: 1;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
        }

        .floating-shapes {
          position: absolute;
          top: 2rem;
          right: 2rem;
          width: 150px;
          height: 150px;
          opacity: 0.5;
        }

        .shape {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 4px;
          transform: rotate(45deg);
        }
        /* Blue theme floating shapes */
        .shape-primary { background: #bfdbfe; top: 20px; left: 40px; }
        .shape-secondary { background: #93c5fd; top: 60px; right: 20px; width: 20px; height: 20px; }
        .shape-accent { background: #e0f2fe; bottom: 20px; left: 60px; width: 40px; height: 40px; }

        .login-form-container {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          z-index: 10;
        }

        .welcome-text {
          font-size: 2rem;
          color: #1f2937;
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .subtitle-text {
          color: #6b7280;
          margin-bottom: 3rem;
          font-size: 1.1rem;
        }

        .error-message {
          padding: 0.75rem;
          background-color: #fee2e2;
          color: #b91c1c;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .custom-form .input-group {
          margin-bottom: 2rem;
        }

        .custom-form label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #9ca3af;
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }

        .custom-form input {
          width: 100%;
          border: none;
          border-bottom: 2px solid #e5e7eb;
          padding: 0.5rem 0;
          font-size: 1rem;
          color: #374151;
          background: transparent;
          transition: border-color 0.2s;
        }

        .custom-form input:focus {
          outline: none;
          border-bottom-color: #2a5298; /* Changed to blue */
        }
        
        .custom-form input::placeholder {
          color: #d1d5db;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        /* BLUE GRADIENT BUTTON */
        .btn-gradient {
          background: linear-gradient(to right, #1e3c72, #2a5298);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 8px;
          width: 100%;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          box-shadow: 0 4px 6px rgba(42, 82, 152, 0.2);
        }

        .btn-gradient:hover:not(:disabled) {
          opacity: 0.9;
        }
        
        .btn-gradient:active:not(:disabled) {
          transform: translateY(1px);
        }

        .btn-gradient:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-text-link {
          background: none;
          border: none;
          color: #2a5298; /* Changed to blue */
          font-size: 0.9rem;
          cursor: pointer;
          font-weight: 600;
          padding: 0;
        }
        
        .btn-text-link:hover {
          text-decoration: underline;
        }

        .btn-outline-social {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.8rem;
          background-color: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #374151;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-outline-social:hover {
          background-color: #f9fafb;
          border-color: #9ca3af;
        }

        @media (max-width: 768px) {
          .login-left {
            display: none;
          }
          .floating-shapes {
            display: none;
          }
          .mobile-logo-container {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
