import React, { useState, useEffect } from 'react';

function Community({ user }) {
  const [activeTab, setActiveTab] = useState('currently_dealing');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCommunityData();
  }, [activeTab]);

  const loadCommunityData = async () => {
    try {
      const response = await fetch('/data/community.json');
      const data = await response.json();
      setPosts(data[activeTab] || []);
    } catch (error) {
      console.error('Error loading community data:', error);
      // Fallback data
      const fallbackData = {
        currently_dealing: [
          {
            id: 1,
            title: "Need advice for ADHD management",
            description: "My 7-year-old was recently diagnosed with ADHD. Looking for practical tips from other parents.",
            author: "Parent123",
            timestamp: "2 hours ago",
            replies: 5,
            likes: 12
          },
          {
            id: 2,
            title: "Speech therapy progress sharing",
            description: "Wanted to share our 6-month journey with speech therapy. Happy to answer questions!",
            author: "MomOfTwo",
            timestamp: "1 day ago",
            replies: 8,
            likes: 24
          }
        ],
        already_solved: [
          {
            id: 3,
            title: "Successfully managed autism spectrum challenges",
            description: "After 2 years of therapy, my child has made incredible progress. Here's what worked for us.",
            author: "ProudDad",
            timestamp: "3 days ago",
            replies: 15,
            likes: 45
          }
        ]
      };
      setPosts(fallbackData[activeTab] || []);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.description.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const post = {
        id: Date.now(),
        title: newPost.title,
        description: newPost.description,
        author: user.full_name || user.role,
        timestamp: "Just now",
        replies: 0,
        likes: 0
      };

      setPosts(prev => [post, ...prev]);
      setNewPost({ title: '', description: '' });
      setShowForm(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="community animate-fade-in">
      <div className="community-header">
        <h2 className="section-title text-gradient">Community Forum</h2>
        <p className="section-subtitle">Connect with other parents and share experiences</p>
      </div>

      {/* Community Tabs */}
      <div className="community-tabs">
        <button 
          className={`community-tab transition-elastic ${activeTab === 'currently_dealing' ? 'active' : ''}`}
          onClick={() => setActiveTab('currently_dealing')}
        >
          <span className="tab-icon">💛</span>
          Currently Dealing
        </button>
        <button 
          className={`community-tab transition-elastic ${activeTab === 'already_solved' ? 'active' : ''}`}
          onClick={() => setActiveTab('already_solved')}
        >
          <span className="tab-icon">✅</span>
          Already Solved
        </button>
      </div>

      {/* Post Creation Section */}
      <div className="post-creation-section">
        {!showForm ? (
          <div className="post-prompt card glass hover-lift" onClick={() => setShowForm(true)}>
            <div className="post-prompt-content">
              <div className="prompt-icon">✍️</div>
              <div className="prompt-text">
                <h3>Share your {activeTab === 'currently_dealing' ? 'current challenge' : 'success story'}</h3>
                <p>Your experience can help other parents in similar situations</p>
              </div>
              <div className="prompt-arrow">→</div>
            </div>
          </div>
        ) : (
          <div className="post-form card glass animate-scale-in">
            <div className="form-header">
              <h3 className="form-title">
                {activeTab === 'currently_dealing' ? 'Share your current challenge' : 'Share your success story'}
              </h3>
              <button 
                className="btn btn-ghost"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitPost}>
              <div className="form-group-floating">
                <input
                  type="text"
                  className="form-input form-input-floating transition-bounce"
                  placeholder=" "
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
                <label className="form-label form-label-floating">Title</label>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input transition-bounce"
                  rows="4"
                  placeholder="Share your story, ask for advice, or offer support..."
                  value={newPost.description}
                  onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary hover-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-dot"></div>
                      Posting...
                    </>
                  ) : (
                    'Post to Community'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="no-posts card glass">
            <div className="no-posts-content">
              <div className="no-posts-icon">💬</div>
              <h3>No posts yet</h3>
              <p>Be the first to share your experience with the community!</p>
            </div>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post, index) => (
              <div 
                key={post.id} 
                className="community-post hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="post-header">
                  <div className="post-meta">
                    <div className="author-info">
                      <div className="author-avatar">
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="author-details">
                        <span className="author-name">{post.author}</span>
                        <span className="post-timestamp">{post.timestamp}</span>
                      </div>
                    </div>
                    <div className="post-category">
                      {activeTab === 'currently_dealing' ? '💛 Seeking Help' : '✅ Success Story'}
                    </div>
                  </div>
                </div>

                <div className="post-content">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-description">{post.description}</p>
                </div>

                <div className="post-actions">
                  <button 
                    className="action-btn hover-glow"
                    onClick={() => handleLike(post.id)}
                  >
                    <span className="action-icon">👍</span>
                    <span className="action-count">{post.likes}</span>
                  </button>
                  
                  <button className="action-btn hover-glow">
                    <span className="action-icon">💬</span>
                    <span className="action-count">{post.replies}</span>
                  </button>
                  
                  <button className="action-btn hover-glow">
                    <span className="action-icon">🔗</span>
                    Share
                  </button>
                </div>

                {/* Post Interaction Overlay */}
                <div className="post-overlay"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .community {
          max-width: 800px;
          margin: 0 auto;
        }

        .community-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: #64748b;
          font-weight: 500;
        }

        .community-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .community-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          background: transparent;
          color: #64748b;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .community-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .community-tab:hover::before {
          opacity: 0.1;
        }

        .community-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: scale(1.02);
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
        }

        .community-tab.active::before {
          opacity: 1;
        }

        .tab-icon {
          font-size: 1.25rem;
        }

        .post-creation-section {
          margin-bottom: 2rem;
        }

        .post-prompt {
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .post-prompt-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
        }

        .prompt-icon {
          font-size: 2rem;
          opacity: 0.7;
        }

        .prompt-text h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .prompt-text p {
          color: #64748b;
          font-size: 0.875rem;
        }

        .prompt-arrow {
          margin-left: auto;
          font-size: 1.5rem;
          color: #667eea;
          transition: transform 0.3s ease;
        }

        .post-prompt:hover .prompt-arrow {
          transform: translateX(5px);
        }

        .post-form {
          padding: 2rem;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .form-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #374151;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        .posts-container {
          margin-top: 2rem;
        }

        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .community-post {
          position: relative;
          overflow: hidden;
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .community-post:nth-child(1) { animation-delay: 0.1s; }
        .community-post:nth-child(2) { animation-delay: 0.2s; }
        .community-post:nth-child(3) { animation-delay: 0.3s; }

        .post-header {
          margin-bottom: 1rem;
        }

        .post-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.125rem;
        }

        .author-details {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .post-timestamp {
          color: #64748b;
          font-size: 0.75rem;
        }

        .post-category {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .post-content {
          margin-bottom: 1.5rem;
        }

        .post-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .post-description {
          color: #4b5563;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .post-actions {
          display: flex;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.5rem;
          background: transparent;
          color: #64748b;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          transform: translateY(-1px);
        }

        .action-icon {
          font-size: 1rem;
        }

        .action-count {
          font-weight: 600;
        }

        .post-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .community-post:hover .post-overlay {
          opacity: 1;
        }

        .no-posts {
          text-align: center;
          padding: 3rem;
        }

        .no-posts-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .no-posts-icon {
          font-size: 3rem;
          opacity: 0.5;
        }

        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .community-tabs {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .community-tab {
            padding: 0.75rem 1rem;
          }
          
          .post-prompt-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .prompt-arrow {
            margin: 0;
          }
          
          .post-meta {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default Community;

