import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import photoboothStripImage from "../assets/photobooth-strip.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from '../i18n/i18n';

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
  const { t, language } = useLanguage();

  const handleGetStarted = () => {
    if (language === 'zh') {
      navigate('/zh/photobooth');
    } else {
      navigate('/photobooth');
    }
  };

  // Sample user testimonials data
  const testimonials = [
    {
      id: 1,
      name: t('testimonial1Name'),
      role: t('testimonial1Role'),
      comment: t('testimonial1Comment'),
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5
    },
    {
      id: 2,
      name: t('testimonial2Name'),
      role: t('testimonial2Role'),
      comment: t('testimonial2Comment'),
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      rating: 5
    },
    {
      id: 3,
      name: t('testimonial3Name'),
      role: t('testimonial3Role'),
      comment: t('testimonial3Comment'),
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 4
    }
  ];

  // Features list
  const features = [
    {
      id: 1,
      title: t('photoCapture'),
      description: t('photoCaptureDesc'),
      icon: "fa-camera"
    },
    {
      id: 2,
      title: t('creativeFilters'),
      description: t('creativeFiltersDesc'),
      icon: "fa-wand-magic-sparkles"
    },
    {
      id: 3,
      title: t('photoStripGeneration'),
      description: t('photoStripGenerationDesc'),
      icon: "fa-images"
    },
    {
      id: 4,
      title: t('easySharing'),
      description: t('easySharingDesc'),
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

  // 工作流程步骤
  const workflowSteps = [
    {
      number: 1,
      title: t('workflowStep1'),
      desc: t('workflowStep1Desc')
    },
    {
      number: 2,
      title: t('workflowStep2'),
      desc: t('workflowStep2Desc')
    },
    {
      number: 3,
      title: t('workflowStep3'),
      desc: t('workflowStep3Desc')
    }
  ];

  // FAQ
  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') }
  ];

  return (
    <div className="home-page">
      <header className="main-header">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <nav className="main-nav">
            <a href="#features">{t('features')}</a>
            <a href="#showcase">{t('gallery')}</a>
            <a href="#testimonials">{t('reviews')}</a>
            <button onClick={onShowTutorial} className="nav-tutorial-btn">
              {t('tutorial')} <i className="fas fa-play-circle"></i>
            </button>
          </nav>
          <div className="nav-right">
            <LanguageSwitcher onSwitchLanguage={(lang) => {
              localStorage.setItem('picapica_language', lang);
              if (lang === 'zh') {
                window.location.pathname = '/zh';
              } else {
                window.location.pathname = '/';
              }
            }} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>{t('heroTitle')}</h1>
            <p className="hero-description">
              {t('heroDescription')}
            </p>
            <div className="hero-buttons">
              <button onClick={handleGetStarted} className="btn btn-primary">
                {t('getStarted')} <i className="fas fa-arrow-right"></i>
              </button>
              <button onClick={onShowTutorial} className="btn btn-secondary">
                {t('viewTutorial')} <i className="fas fa-play-circle"></i>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img src={photoboothStripImage} alt="PicapicaBooth photo strip example" className="main-demo-image" />
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
                <p>{t(stat.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <h2>{t('powerfulFeatures')}</h2>
            <p>{t('featuresIntro')}</p>
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
            <h2>{t('workflowTitle')}</h2>
            <p>{t('workflowIntro')}</p>
          </div>
          <div className="workflow-steps">
            {workflowSteps.map(step => (
              <div className="workflow-step" key={step.number}>
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase-section" id="showcase">
        <div className="container">
          <div className="section-header">
            <h2>{t('showcaseTitle')}</h2>
            <p>{t('showcaseIntro')}</p>
          </div>
          <div className="showcase-gallery">
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt={t('showcaseAlt1')} />
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt={t('showcaseAlt2')} />
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt={t('showcaseAlt3')} />
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt={t('showcaseAlt4')} />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>{t('testimonialsTitle')}</h2>
            <p>{t('testimonialsIntro')}</p>
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
            <h2>{t('faqTitle')}</h2>
            <p>{t('faqIntro')}</p>
          </div>
          <div className="faq-container">
            {faqs.map((faq, idx) => (
              <div className="faq-item" key={idx}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t('ctaTitle')}</h2>
            <p>{t('ctaDesc')}</p>
            <button onClick={handleGetStarted} className="btn btn-primary btn-large">
              {t('getStarted')} <i className="fas fa-arrow-right"></i>
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
              <p>{t('footerSlogan')}</p>
              <div className="social-links">
                <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-links-column">
                <h4>{t('footerProduct')}</h4>
                <ul>
                  <li><a href="#features">{t('features')}</a></li>
                  <li><a href="#showcase">{t('gallery')}</a></li>
                  <li><a href="#testimonials">{t('reviews')}</a></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>{t('footerSupport')}</h4>
                <ul>
                  <li><a href="#faq">{t('faq')}</a></li>
                  <li><a href="/contact">{t('contactUs')}</a></li>
                  <li><a href="/privacy-policy">{t('privacyPolicy')}</a></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>{t('footerCompany')}</h4>
                <ul>
                  <li><a href="/about">{t('aboutUs')}</a></li>
                  <li><a href="https://blog.picapicabooth.app" target="_blank" rel="noopener noreferrer">{t('blog')}</a></li>
                  <li><a href="/careers">{t('careers')}</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 PicapicaBooth. {t('footerCopyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
