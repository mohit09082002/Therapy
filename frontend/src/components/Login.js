import React, { useState } from 'react';
import Testimonials from './Testimonials';

function Login({ onLogin, onSwitchToRegister }) {
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'parent_dealing',
      title: 'Parent Currently Dealing',
      description: "I'm currently dealing with special needs challenges",
      icon: '👨‍👩‍👧‍👦',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 'parent_solved',
      title: 'Parent Who Has Solved',
      description: "I've successfully navigated similar challenges",
      icon: '🌟',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 'therapist',
      title: 'Therapist',
      description: "I'm a healthcare professional",
      icon: '🩺',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole || !email || !phone) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call to verify user
      const response = await fetch('http://localhost:8050/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
          role: selectedRole
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login successful
        onLogin({
          role: selectedRole,
          email: email.trim(),
          phone: phone.trim(),
          full_name: data.full_name || roles.find(r => r.id === selectedRole)?.title
        });
      } else {
        // Login failed - user not found
        setError(data.message || 'Login failed. Please check your credentials or register first.');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Fallback for development - allow login without backend
      onLogin({
        role: selectedRole,
        email: email.trim(),
        phone: phone.trim(),
        full_name: roles.find(r => r.id === selectedRole)?.title
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-scale-in">
      {/* Role Selection */}
      <div className="card glass mb-lg">
        <div className="card-header text-center">
          <h2 className="card-title text-gradient">Welcome Back</h2>
          <p className="card-subtitle">Please select your role to continue</p>
        </div>

        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
              onClick={() => setSelectedRole(role.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: 'var(--space-md)',
                border: selectedRole === role.id 
                  ? '2px solid var(--purple-500)' 
                  : '2px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                background: selectedRole === role.id 
                  ? 'var(--glass-bg)' 
                  : 'transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                textAlign: 'left',
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div 
                style={{
                  fontSize: '2rem',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: role.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {role.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '1.125rem', 
                  fontWeight: '700',
                  color: 'var(--text-primary)'
                }}>
                  {role.title}
                </h3>
                <p style={{ 
                  margin: '0.25rem 0 0 0', 
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  {role.description}
                </p>
              </div>
              {selectedRole === role.id && (
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--success-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Login Form */}
      {selectedRole && (
        <div className="card glass animate-slide-in-up">
          <div className="card-header text-center">
            <h3 className="card-title">Enter Your Details</h3>
            <p className="card-subtitle">We'll verify your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group-floating">
              <input
                type="email"
                className="form-input form-input-floating transition-bounce"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="form-label form-label-floating">Email Address</label>
            </div>

            <div className="form-group-floating">
              <input
                type="tel"
                className="form-input form-input-floating transition-bounce"
                placeholder=" "
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <label className="form-label form-label-floating">Phone Number</label>
            </div>

            {error && (
              <div style={{
                padding: 'var(--space-sm)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#dc2626',
                fontSize: '0.875rem',
                marginBottom: 'var(--space-md)',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onSwitchToRegister}
                style={{ flex: 1 }}
              >
                New User? Register
              </button>
              <button
                type="submit"
                className="btn btn-primary hover-glow"
                disabled={isLoading}
                style={{ flex: 1 }}
              >
                {isLoading ? (
                  <>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    Verifying...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials */}
      <div className="mt-lg">
        <Testimonials />
      </div>

      <style jsx>{`
        .role-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .role-card.selected {
          transform: translateY(-2px);
          box-shadow: var(--shadow-glow);
        }
        
        .role-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--primary-gradient);
          opacity: 0;
          transition: opacity var(--transition-normal);
          z-index: -1;
        }
        
        .role-card.selected::before {
          opacity: 0.05;
        }
        
        @media (max-width: 768px) {
          .role-card {
            flex-direction: column;
            text-align: center;
            gap: var(--space-sm) !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;

