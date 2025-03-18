import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Logo = () => (
  <div className="logo">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#FF6B9D"/>
      <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20Z" fill="white"/>
      <circle cx="20" cy="20" r="4" fill="#FF6B9D"/>
      <rect x="24" y="10" width="2" height="4" rx="1" fill="white"/>
    </svg>
    <span>PicapicaBooth</span>
  </div>
);

const Home = ({ onShowTutorial }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/photobooth');
  };

  // Sample user testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Photography Enthusiast",
      comment: "PicapicaBooth allows me to easily create professional-grade photo strips. The interface is clean and intuitive, and the results are fantastic!",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Event Planner",
      comment: "I use PicapicaBooth for all my events, and clients absolutely love the fun photo booth feature.",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Wang",
      role: "Social Media Manager",
      comment: "The sharing feature is amazing! Our company's social media engagement increased by 30% thanks to this tool.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 4
    }
  ];

  // Features list
  const features = [
    {
      id: 1,
      title: "Photo Capture",
      description: "Easily take high-quality photos using your webcam, with customizable countdown and multi-shot options.",
      icon: "fa-camera"
    },
    {
      id: 2,
      title: "Creative Filters",
      description: "Apply a variety of professional filter effects including black and white, vintage, high contrast, and more to give your photos an artistic touch.",
      icon: "fa-wand-magic-sparkles"
    },
    {
      id: 3,
      title: "Photo Strip Generation",
      description: "Automatically combine your photos into classic photo strip layouts, perfectly capturing sequential moments.",
      icon: "fa-images"
    },
    {
      id: 4,
      title: "Easy Sharing",
      description: "Download your photos or share directly to social media. Share with friends via QR code.",
      icon: "fa-share-nodes"
    }
  ];

  // Usage statistics
  const stats = [
    { id: 1, value: "300,000+", label: "Monthly Visitors" },
    { id: 2, value: "1,500,0+", label: "Photos Created" },
    { id: 3, value: "98%", label: "User Satisfaction" },
    { id: 4, value: "15+", label: "Countries" }
  ];

  return (
    <div className="home-page">
      <header className="main-header">
        <div className="container">
          <Logo />
          <nav className="main-nav">
            <a href="#features">Features</a>
            <a href="#showcase">Gallery</a>
            <a href="#testimonials">Reviews</a>
            <button onClick={onShowTutorial} className="nav-tutorial-btn">
              Tutorial <i className="fas fa-play-circle"></i>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Create Beautiful Photo Strips with our <span className="highlight">Online Photo Booth</span></h1>
            <p className="hero-description">
              PicapicaBooth lets you easily capture, edit, and share stunning photos without professional equipment, anytime, anywhere.
            </p>
            <div className="hero-buttons">
              <button onClick={handleGetStarted} className="btn btn-primary">
                Get Started <i className="fas fa-arrow-right"></i>
              </button>
              <button onClick={onShowTutorial} className="btn btn-secondary">
                View Tutorial <i className="fas fa-play-circle"></i>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img src="/photobooth-strip.png" alt="PicapicaBooth photo strip example" className="main-demo-image" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-container">
            {stats.map(stat => (
              <div key={stat.id} className="stat-item">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features, Simple Interface</h2>
            <p>PicapicaBooth offers professional-grade photo processing with an easy-to-use interface</p>
          </div>
          <div className="features-grid">
            {features.map(feature => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section">
        <div className="container">
          <div className="section-header">
            <h2>Three Simple Steps to Create Beautiful Photos</h2>
            <p>No complex setup required, complete the entire process in minutes</p>
          </div>
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <h3>Take Photos</h3>
              <p>Allow browser access to your camera, set a countdown, and automatically capture multiple photos</p>
            </div>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <h3>Edit & Enhance</h3>
              <p>Choose filters, adjust layout, add borders to make your photos more personalized</p>
            </div>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <h3>Save & Share</h3>
              <p>Download your photo strip or share directly to social media to share moments with friends</p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase-section" id="showcase">
        <div className="container">
          <div className="section-header">
            <h2>Unlimited Creativity, Stunning Results</h2>
            <p>Check out beautiful photo strips created by users with PicapicaBooth</p>
          </div>
          <div className="showcase-gallery">
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="Photo strip example 1" />
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="Photo strip example 2" />
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="Photo strip example 3" />
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="Photo strip example 4" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Real User Reviews</h2>
            <p>Genuine feedback from our 300,000+ global users</p>
          </div>
          <div className="testimonials-container">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star ${i < testimonial.rating ? 'active' : ''}`}
                    ></i>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.comment}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Common questions about PicapicaBooth</p>
          </div>
          <div className="faq-container">
            <div className="faq-item">
              <h3>Is PicapicaBooth free to use?</h3>
              <p>Yes, PicapicaBooth's basic features are completely free. We provide high-quality photo capture, editing, and sharing functionality at no cost.</p>
            </div>
            <div className="faq-item">
              <h3>Do I need to install any software?</h3>
              <p>No. PicapicaBooth is a web-based application that only requires a modern browser (such as Chrome, Firefox, Safari, or Edge) to access and use all features.</p>
            </div>
            <div className="faq-item">
              <h3>Where are my photos stored?</h3>
              <p>Your photos are only stored on your device unless you choose to share them. We don't store your photos on our servers, ensuring your privacy and security.</p>
            </div>
            <div className="faq-item">
              <h3>Does PicapicaBooth support mobile devices?</h3>
              <p>Yes, PicapicaBooth fully supports mobile devices. You can use the front camera on your smartphone or tablet to take and edit photos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Create Your Photo Strip?</h2>
            <p>Start using PicapicaBooth now to capture and share your amazing moments!</p>
            <button onClick={handleGetStarted} className="btn btn-primary btn-large">
              Get Started <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>PicapicaBooth</h3>
              <p>Create beautiful photo strips with our online photo booth tool</p>
              <div className="social-links">
                <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-links-column">
                <h4>Product</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#showcase">Gallery</a></li>
                  <li><a href="#testimonials">Reviews</a></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Support</h4>
                <ul>
                  <li><a href="#faq">FAQ</a></li>
                  <li><a href="/contact">Contact Us</a></li>
                  <li><a href="/privacy-policy">Privacy Policy</a></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="https://blog.picapicabooth.app" target="_blank" rel="noopener noreferrer">Blog</a></li>
                  <li><a href="/careers">Careers</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 PicapicaBooth. All Rights Reserved.</p>
            <p>
              Created by <a href="https://agneswei.com" target="_blank" rel="noopener noreferrer">Agnes Wei</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
