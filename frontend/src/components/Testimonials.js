import React, { useState, useEffect } from 'react';

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      text: "This platform helped me find the perfect therapist for my son with ADHD. The community support has been incredible!",
      author: "Priya Sharma",
      role: "Parent",
      rating: 5,
      avatar: "P"
    },
    {
      id: 2,
      text: "As a therapist, I love how this platform connects me with families who truly need my help. It's made a real difference.",
      author: "Dr. Rajesh Kumar",
      role: "Child Psychologist",
      rating: 5,
      avatar: "R"
    },
    {
      id: 3,
      text: "After struggling for months, I found both professional help and a supportive community here. My daughter is thriving now!",
      author: "Anita Patel",
      role: "Parent",
      rating: 5,
      avatar: "A"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span 
        key={i} 
        style={{ 
          color: i < rating ? '#fbbf24' : '#d1d5db',
          fontSize: '1.25rem'
        }}
      >
        ⭐
      </span>
    ));
  };

  return (
    <div className="testimonials-container">
      <div className="card glass">
        <div className="card-header text-center">
          <h3 className="card-title text-gradient">What Our Community Says</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-sm)' }}>
            {renderStars(5)}
          </div>
        </div>

        <div className="testimonials-slider">
          <div 
            className="testimonials-track"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-slide">
                <div className="testimonial-content">
                  <div className="quote-icon">"</div>
                  <p className="testimonial-text">
                    {testimonial.text}
                  </p>
                  
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      {testimonial.avatar}
                    </div>
                    <div className="author-info">
                      <div className="author-name">{testimonial.author}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="testimonials-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .testimonials-container {
          margin: var(--space-lg) 0;
        }

        .testimonials-slider {
          overflow: hidden;
          position: relative;
          margin: var(--space-lg) 0;
        }

        .testimonials-track {
          display: flex;
          width: ${testimonials.length * 100}%;
        }

        .testimonial-slide {
          width: ${100 / testimonials.length}%;
          flex-shrink: 0;
          padding: 0 var(--space-sm);
        }

        .testimonial-content {
          text-align: center;
          position: relative;
        }

        .quote-icon {
          font-size: 4rem;
          color: var(--purple-300);
          line-height: 1;
          margin-bottom: var(--space-sm);
          font-family: serif;
        }

        .testimonial-text {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--text-primary);
          font-style: italic;
          margin-bottom: var(--space-lg);
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .author-info {
          text-align: left;
        }

        .author-name {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .author-role {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .testimonials-dots {
          display: flex;
          justify-content: center;
          gap: var(--space-xs);
          margin-top: var(--space-lg);
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: var(--glass-border);
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .dot:hover {
          background: var(--purple-300);
          transform: scale(1.2);
        }

        .dot.active {
          background: var(--primary-gradient);
          transform: scale(1.3);
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }

        @media (max-width: 768px) {
          .testimonial-author {
            flex-direction: column;
            gap: var(--space-sm);
          }
          
          .author-info {
            text-align: center;
          }
          
          .testimonial-text {
            font-size: 1rem;
          }
          
          .quote-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Testimonials;

