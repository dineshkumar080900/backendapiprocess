import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('http://mitrahomebackendapi.pemixcels.com/api/testimonials/all');
        const data = await response.json();
        
        if (data.success) {
          // Filter out testimonials with null title, subtitle, or details
          const validTestimonials = data.data.filter(
            testimonial => testimonial.ttitle && testimonial.tsub && testimonial.tdet
          );
          setTestimonials(validTestimonials);
        } else {
          setError('Failed to fetch testimonials');
        }
      } catch (err) {
        setError('Error connecting to API: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Function to truncate text for preview
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2>TESTIMONIALS</h2>
          <p>What Our Loving Clients Are Saying</p>
        </div>
        <div className="loading-spinner">Loading testimonials...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2>TESTIMONIALS</h2>
          <p>What Our Loving Clients Are Saying</p>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="testimonials-container">
      <div className="testimonials-header">
        <h2>TESTIMONIALS</h2>
        <p>What Our Loving Clients Are Saying</p>
      </div>

      {testimonials.length === 0 ? (
        <div className="no-testimonials">
          No testimonials available at the moment.
        </div>
      ) : (
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.tid} className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar-container">
                  {testimonial.timg ? (
                    <img 
                      src={testimonial.timg} 
                      alt={testimonial.ttitle} 
                      className="avatar"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/50/808080/FFFFFF?text=${testimonial.ttitle ? testimonial.ttitle.charAt(0) : 'U'}`;
                      }}
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {testimonial.ttitle ? testimonial.ttitle.charAt(0) : 'U'}
                    </div>
                  )}
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">{testimonial.ttitle}</h3>
                  <p className="testimonial-role">{testimonial.tsub}</p>
                </div>
              </div>
              <div className="testimonial-content">
                <p className="testimonial-text">
                  {truncateText(testimonial.tdet)}
                </p>
              </div>
              {testimonial.tdet && testimonial.tdet.length > 150 && (
                <a href="#" className="read-more">Read more...</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimonials;