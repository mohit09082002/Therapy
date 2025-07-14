import React from 'react';

function Chatbot() {
  return (
    <div className="under-construction">
      <div className="construction-icon">🚧</div>
      <h2>Chatbot Under Construction</h2>
      <p>
        Our AI chatbot is currently being developed to provide personalized support 
        and guidance. In the meantime, please explore the Directory to find therapists 
        or visit the Community to connect with other parents.
      </p>
      <div style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
        <p>Coming soon:</p>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          <li>🤖 AI-powered therapy recommendations</li>
          <li>💬 24/7 support chat</li>
          <li>📚 Personalized resource suggestions</li>
          <li>🎯 Goal tracking and progress monitoring</li>
        </ul>
      </div>
    </div>
  );
}

export default Chatbot;

