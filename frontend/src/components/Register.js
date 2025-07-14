import React, { useState } from 'react';

function Register({ onRegister, onSwitchToLogin }) {
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    child_condition: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

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

  const conditions = [
    'ADHD',
    'Autism Spectrum Disorder',
    'Speech Delay',
    'Learning Disabilities',
    'Anxiety Disorders',
    'Behavioral Issues',
    'Developmental Delays',
    'Other'
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setStep(2);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    if ((selectedRole === 'parent_dealing' || selectedRole === 'parent_solved') && !formData.child_condition) {
      setError('Please select your child\'s condition');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const registrationData = {
        role: selectedRole,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        child_condition: formData.child_condition || 'N/A'
      };

      const response = await fetch('http://localhost:8050/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Registration successful
        onRegister({
          role: selectedRole,
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim()
        });
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Fallback for development - allow registration without backend
      onRegister({
        role: selectedRole,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedRole('');
    }
  };

  return (
    <div className="animate-scale-in">
      {/* Progress Indicator */}
      <div className="mb-lg">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-md)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: step >= 1 ? 'var(--primary-gradient)' : 'var(--glass-border)',
            color: step >= 1 ? 'white' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            transition: 'all var(--transition-normal)'
          }}>
            1
          </div>
          <div style={{
            width: '40px',
            height: '2px',
            background: step >= 2 ? 'var(--primary-gradient)' : 'var(--glass-border)',
            transition: 'all var(--transition-normal)'
          }}></div>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: step >= 2 ? 'var(--primary-gradient)' : 'var(--glass-border)',
            color: step >= 2 ? 'white' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            transition: 'all var(--transition-normal)'
          }}>
            2
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem'
        }}>
          {step === 1 ? 'Choose Your Role' : 'Complete Your Profile'}
        </div>
      </div>

      {/* Step 1: Role Selection */}
      {step === 1 && (
        <div className="card glass animate-slide-in-up">
          <div className="card-header text-center">
            <h2 className="card-title text-gradient">Join Our Community</h2>
            <p className="card-subtitle">Select your role to get started</p>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                className="role-card hover-lift"
                onClick={() => handleRoleSelect(role.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-md)',
                  border: '2px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'transparent',
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
                <div style={{
                  fontSize: '1.5rem',
                  color: 'var(--text-secondary)',
                  transition: 'transform var(--transition-normal)'
                }}>
                  →
                </div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onSwitchToLogin}
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Registration Form */}
      {step === 2 && (
        <div className="card glass animate-slide-in-up">
          <div className="card-header">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={goBack}
              style={{ marginBottom: 'var(--space-sm)' }}
            >
              ← Back
            </button>
            <div className="text-center">
              <h3 className="card-title">Complete Your Profile</h3>
              <p className="card-subtitle">
                Registering as: <strong style={{ color: 'var(--text-accent)' }}>
                  {roles.find(r => r.id === selectedRole)?.title}
                </strong>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group-floating">
              <input
                type="text"
                name="full_name"
                className="form-input form-input-floating transition-bounce"
                placeholder=" "
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />
              <label className="form-label form-label-floating">Full Name</label>
            </div>

            <div className="form-group-floating">
              <input
                type="email"
                name="email"
                className="form-input form-input-floating transition-bounce"
                placeholder=" "
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label className="form-label form-label-floating">Email Address</label>
            </div>

            <div className="form-group-floating">
              <input
                type="tel"
                name="phone"
                className="form-input form-input-floating transition-bounce"
                placeholder=" "
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <label className="form-label form-label-floating">Phone Number</label>
            </div>

            {(selectedRole === 'parent_dealing' || selectedRole === 'parent_solved') && (
              <div className="form-group">
                <label className="form-label">Child's Condition/Challenge</label>
                <select
                  name="child_condition"
                  className="form-select transition-bounce"
                  value={formData.child_condition}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select condition</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                onClick={onSwitchToLogin}
                style={{ flex: 1 }}
              >
                Have Account? Login
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
                    Creating...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .role-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--purple-300);
        }
        
        .role-card:hover div:last-child {
          transform: translateX(5px);
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
        
        .role-card:hover::before {
          opacity: 0.05;
        }
        
        @media (max-width: 768px) {
          .role-card {
            flex-direction: column;
            text-align: center;
            gap: var(--space-sm) !important;
          }
          
          .role-card div:last-child {
            transform: rotate(90deg);
          }
          
          .role-card:hover div:last-child {
            transform: rotate(90deg) translateX(5px);
          }
        }
      `}</style>
    </div>
  );
}

export default Register;

