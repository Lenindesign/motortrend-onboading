import React from 'react';
import './BentleyShowcase.css';

export const BentleyShowcase: React.FC = () => {
  return (
    <div className="bentley-showcase">
      <header className="bentley-hero">
        <div className="bentley-hero-content">
          <h1 className="bentley-title">🚗 Bentley Vehicle Showcase</h1>
          <p className="bentley-subtitle">Premium Rating & Review System Implementation</p>
          <div className="bentley-hero-buttons">
            <a href="#walkthrough" className="bentley-btn bentley-btn-primary">View Walkthrough</a>
            <a href="#demo" className="bentley-btn bentley-btn-secondary">See Demo</a>
          </div>
        </div>
      </header>

      <section className="bentley-features">
        <h2>✨ Features Implemented</h2>
        <div className="bentley-feature-grid">
          <div className="bentley-feature-card">
            <div className="bentley-feature-icon">🎯</div>
            <h3>Interactive Rating</h3>
            <p>Rate vehicles on a 0-100 scale with smooth animations</p>
          </div>
          <div className="bentley-feature-card">
            <div className="bentley-feature-icon">✍️</div>
            <h3>Review System</h3>
            <p>Write detailed reviews with titles and descriptions</p>
          </div>
          <div className="bentley-feature-card">
            <div className="bentley-feature-icon">🎨</div>
            <h3>Premium Design</h3>
            <p>Glassmorphism effects with vibrant purple gradients</p>
          </div>
          <div className="bentley-feature-card">
            <div className="bentley-feature-icon">📱</div>
            <h3>Responsive</h3>
            <p>Optimized for all screen sizes and devices</p>
          </div>
        </div>
      </section>

      <section id="demo" className="bentley-demo-section">
        <h2>🎬 Live Demo Recording</h2>
        <div className="bentley-demo-container">
          <p className="bentley-demo-caption">Complete user flow: Rating selection → Review submission → Confirmation</p>
        </div>
      </section>

      <section className="bentley-screenshots">
        <h2>📸 Screenshots</h2>
        <div className="bentley-screenshot-grid">
          <div className="bentley-screenshot-item">
            <p>Hero Section</p>
          </div>
          <div className="bentley-screenshot-item">
            <p>Rating Modal</p>
          </div>
          <div className="bentley-screenshot-item">
            <p>Review Form</p>
          </div>
          <div className="bentley-screenshot-item">
            <p>Success Confirmation</p>
          </div>
        </div>
      </section>

      <section id="walkthrough" className="bentley-walkthrough-section">
        <h2>📖 Complete Walkthrough</h2>
        <div className="bentley-walkthrough-content">
          <div className="bentley-walkthrough-card">
            <h3>Implementation Details</h3>
            <p>View the complete technical walkthrough with step-by-step implementation details, code snippets, and design decisions.</p>
          </div>
        </div>
      </section>

      <section className="bentley-tech-stack">
        <h2>🛠️ Tech Stack</h2>
        <div className="bentley-tech-grid">
          <div className="bentley-tech-item"><span className="bentley-tech-badge">React 18</span></div>
          <div className="bentley-tech-item"><span className="bentley-tech-badge">Vite</span></div>
          <div className="bentley-tech-item"><span className="bentley-tech-badge">Vanilla CSS</span></div>
          <div className="bentley-tech-item"><span className="bentley-tech-badge">Glassmorphism</span></div>
          <div className="bentley-tech-item"><span className="bentley-tech-badge">React Router</span></div>
        </div>
      </section>

      <section className="bentley-user-flow">
        <h2>🔄 User Flow</h2>
        <div className="bentley-flow-steps">
          <div className="bentley-flow-step">
            <div className="bentley-step-number">1</div>
            <h3>Access Rating</h3>
            <p>Click "Rate This Vehicle" button</p>
          </div>
          <div className="bentley-flow-arrow">→</div>
          <div className="bentley-flow-step">
            <div className="bentley-step-number">2</div>
            <h3>Select Rating</h3>
            <p>Choose a rating from 0-100</p>
          </div>
          <div className="bentley-flow-arrow">→</div>
          <div className="bentley-flow-step">
            <div className="bentley-step-number">3</div>
            <h3>Write Review</h3>
            <p>Add detailed feedback</p>
          </div>
          <div className="bentley-flow-arrow">→</div>
          <div className="bentley-flow-step">
            <div className="bentley-step-number">4</div>
            <h3>Confirmation</h3>
            <p>View success message</p>
          </div>
        </div>
      </section>

      <footer className="bentley-footer">
        <div className="bentley-footer-content">
          <p>Built with ❤️ using React + Vite</p>
          <p>© 2025 Bentley Vehicle Showcase</p>
        </div>
      </footer>
    </div>
  );
};

export default BentleyShowcase;
