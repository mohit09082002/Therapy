import React, { useState, useEffect } from 'react';

function Directory({ user }) {
  const [therapists, setTherapists] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    pincode: '',
    disorder: 'All Disorders'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchAnimation, setSearchAnimation] = useState(false);

  useEffect(() => {
    loadTherapists();
  }, []);

  useEffect(() => {
    filterTherapists();
  }, [filters, therapists]);

  const loadTherapists = async () => {
    try {
      const response = await fetch('http://localhost:8050/api/therapists');
      if (response.ok) {
        const data = await response.json();
        setTherapists(data);
        setFilteredTherapists(data);
      } else {
        // Fallback to local data
        const localData = await fetch('/data/therapists.json');
        const data = await localData.json();
        setTherapists(data);
        setFilteredTherapists(data);
      }
    } catch (error) {
      console.error('Error loading therapists:', error);
      // Fallback data
      const fallbackData = [
        {
          id: 1,
          name: "Dr. Priya Sharma",
          specialization: "Pediatric Psychologist",
          disorder_focus: "ADHD",
          location: "Mumbai, 400001",
          languages: ["English", "Hindi"],
          fee: "₹1500 per session",
          rating: 4.8,
          whatsapp: "+91 9876543210"
        },
        {
          id: 2,
          name: "Dr. Rajesh Kumar",
          specialization: "Speech Therapist",
          disorder_focus: "Speech Delay",
          location: "Delhi, 110001",
          languages: ["English", "Hindi", "Punjabi"],
          fee: "₹1200 per session",
          rating: 4.6,
          whatsapp: "+91 9876543211"
        }
      ];
      setTherapists(fallbackData);
      setFilteredTherapists(fallbackData);
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  const filterTherapists = () => {
    setSearchAnimation(true);
    setTimeout(() => setSearchAnimation(false), 300);

    let filtered = therapists.filter(therapist => {
      const cityMatch = !filters.city || 
        therapist.location.toLowerCase().includes(filters.city.toLowerCase());
      
      const pincodeMatch = !filters.pincode || 
        therapist.location.includes(filters.pincode);
      
      const disorderMatch = filters.disorder === 'All Disorders' || 
        therapist.disorder_focus === filters.disorder;
      
      return cityMatch && pincodeMatch && disorderMatch;
    });
    
    setFilteredTherapists(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWhatsAppBooking = (therapist) => {
    const message = `Hi Dr. ${therapist.name}, I would like to book a consultation for my child. I found your profile on the Therapist Discovery Platform.`;
    const whatsappUrl = `https://wa.me/${therapist.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="directory-loading">
        <div className="loading-container">
          <div className="loading glow"></div>
          <h3 className="text-gradient">Loading Therapists...</h3>
          <p>Finding the best professionals for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="directory animate-fade-in">
      <div className="directory-header">
        <h2 className="section-title text-gradient">Therapist Directory</h2>
        <p className="section-subtitle">Find trusted professionals specializing in your child's needs</p>
      </div>

      {/* Advanced Search Filters */}
      <div className="search-filters card glass hover-lift">
        <h3 className="filter-title">
          <span className="filter-icon">🔍</span>
          Search Filters
        </h3>
        
        <div className="filter-grid">
          <div className="form-group-floating">
            <input
              type="text"
              className="form-input form-input-floating transition-bounce"
              placeholder=" "
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
            <label className="form-label form-label-floating">City</label>
          </div>

          <div className="form-group-floating">
            <input
              type="text"
              className="form-input form-input-floating transition-bounce"
              placeholder=" "
              value={filters.pincode}
              onChange={(e) => handleFilterChange('pincode', e.target.value)}
            />
            <label className="form-label form-label-floating">Pincode</label>
          </div>

          <div className="form-group">
            <label className="form-label">Disorder/Specialization</label>
            <select
              className="form-input transition-bounce"
              value={filters.disorder}
              onChange={(e) => handleFilterChange('disorder', e.target.value)}
            >
              <option value="All Disorders">All Disorders</option>
              <option value="ADHD">ADHD</option>
              <option value="Autism Spectrum Disorder">Autism Spectrum Disorder</option>
              <option value="Speech Delay">Speech Delay</option>
              <option value="Learning Disabilities">Learning Disabilities</option>
              <option value="Anxiety Disorders">Anxiety Disorders</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className={`results-counter ${searchAnimation ? 'animate-scale-in' : ''}`}>
        <span className="results-text">
          Showing <strong className="text-gradient">{filteredTherapists.length}</strong> therapist(s)
        </span>
      </div>

      {/* Therapist Cards */}
      <div className="therapists-grid">
        {filteredTherapists.length === 0 ? (
          <div className="no-results card glass">
            <div className="no-results-content">
              <div className="no-results-icon">🔍</div>
              <h3>No therapists found</h3>
              <p>Try adjusting your search filters to find more results.</p>
            </div>
          </div>
        ) : (
          filteredTherapists.map((therapist, index) => (
            <div 
              key={therapist.id} 
              className="therapist-card hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card Header */}
              <div className="therapist-header">
                <div className="therapist-info">
                  <h3 className="therapist-name">{therapist.name}</h3>
                  <p className="therapist-specialization">{therapist.specialization}</p>
                </div>
                <div className="therapist-rating">
                  <span className="star">⭐</span>
                  <span>{therapist.rating}/5</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="therapist-details">
                <div className="therapist-detail">
                  <span className="therapist-detail-label">Specialization</span>
                  <span className="therapist-detail-value">{therapist.specialization}</span>
                </div>
                
                <div className="therapist-detail">
                  <span className="therapist-detail-label">Disorder Focus</span>
                  <span className="therapist-detail-value">
                    <span className="disorder-tag">{therapist.disorder_focus}</span>
                  </span>
                </div>
                
                <div className="therapist-detail">
                  <span className="therapist-detail-label">Location</span>
                  <span className="therapist-detail-value">
                    <span className="location-icon">📍</span>
                    {therapist.location}
                  </span>
                </div>
                
                <div className="therapist-detail">
                  <span className="therapist-detail-label">Languages</span>
                  <span className="therapist-detail-value">
                    {Array.isArray(therapist.languages) ? therapist.languages.map((lang, idx) => (
                      <span key={idx} className="language-tag">
                        {lang}
                      </span>
                    )) : (
                      <span className="language-tag">
                        {therapist.languages || 'English'}
                      </span>
                    )}
                  </span>
                </div>
                
                <div className="therapist-detail">
                  <span className="therapist-detail-label">Fee</span>
                  <span className="therapist-detail-value fee-value">{therapist.fee}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="therapist-actions">
                <button 
                  className="btn btn-primary hover-glow"
                  onClick={() => handleWhatsAppBooking(therapist)}
                >
                  <span className="whatsapp-icon">📱</span>
                  Book via WhatsApp
                </button>
              </div>

              {/* Hover Effect Overlay */}
              <div className="card-overlay"></div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .directory {
          max-width: 1200px;
          margin: 0 auto;
        }

        .directory-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .directory-header {
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

        .filter-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #374151;
        }

        .filter-icon {
          font-size: 1.5rem;
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .results-counter {
          margin: 2rem 0;
          text-align: center;
        }

        .results-text {
          font-size: 1.125rem;
          color: #64748b;
          font-weight: 500;
        }

        .therapists-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .therapist-card {
          position: relative;
          overflow: hidden;
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .therapist-card:nth-child(1) { animation-delay: 0.1s; }
        .therapist-card:nth-child(2) { animation-delay: 0.2s; }
        .therapist-card:nth-child(3) { animation-delay: 0.3s; }
        .therapist-card:nth-child(4) { animation-delay: 0.4s; }

        .therapist-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .therapist-name {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.25rem;
        }

        .therapist-specialization {
          color: #64748b;
          font-weight: 500;
        }

        .therapist-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .therapist-details {
          display: grid;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .therapist-detail {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .therapist-detail-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
        }

        .therapist-detail-value {
          font-weight: 600;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .disorder-tag {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .language-tag {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .location-icon {
          font-size: 0.875rem;
        }

        .fee-value {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }

        .therapist-actions {
          display: flex;
          gap: 1rem;
        }

        .whatsapp-icon {
          font-size: 1.125rem;
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .therapist-card:hover .card-overlay {
          opacity: 1;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
        }

        .no-results-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .no-results-icon {
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
          .therapists-grid {
            grid-template-columns: 1fr;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .therapist-header {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Directory;

