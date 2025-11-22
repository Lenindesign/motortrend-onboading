import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Documentation.css';

export const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  
  // Get current date for "Last Updated"
  const getCurrentDate = () => {
    const now = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'features', 'architecture', 'data-models', 'user-flows', 'design', 'implementation', 'audit', 'api', 'testing'];
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="documentation-page">
      <aside className="documentation-sidebar">
        <div className="documentation-sidebar-content">
          <div className="documentation-sidebar-header">
            <h2>User Review System</h2>
            <p className="documentation-sidebar-subtitle">Documentation</p>
          </div>
          
          <nav className="documentation-sidebar-nav">
            <ul>
              <li>
                <a 
                  href="#overview" 
                  className={activeSection === 'overview' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('overview');
                  }}
                >
                  Overview
                </a>
              </li>
              <li>
                <a 
                  href="#features" 
                  className={activeSection === 'features' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('features');
                  }}
                >
                  Features & Capabilities
                </a>
              </li>
              <li>
                <a 
                  href="#architecture" 
                  className={activeSection === 'architecture' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('architecture');
                  }}
                >
                  Component Architecture
                </a>
              </li>
              <li>
                <a 
                  href="#data-models" 
                  className={activeSection === 'data-models' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('data-models');
                  }}
                >
                  Data Models
                </a>
              </li>
              <li>
                <a 
                  href="#user-flows" 
                  className={activeSection === 'user-flows' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('user-flows');
                  }}
                >
                  User Flows
                </a>
              </li>
              <li>
                <a 
                  href="#design" 
                  className={activeSection === 'design' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('design');
                  }}
                >
                  Design Specifications
                </a>
              </li>
              <li>
                <a 
                  href="#implementation" 
                  className={activeSection === 'implementation' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('implementation');
                  }}
                >
                  Technical Implementation
                </a>
              </li>
            <li>
              <a 
                href="#audit" 
                className={activeSection === 'audit' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('audit');
                }}
              >
                Atomic Audit
              </a>
            </li>
              <li>
                <a 
                  href="#api" 
                  className={activeSection === 'api' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('api');
                  }}
                >
                  API Integration Guide
                </a>
              </li>
              <li>
                <a 
                  href="#testing" 
                  className={activeSection === 'testing' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('testing');
                  }}
                >
                  Testing Checklist
                </a>
              </li>
            </ul>
          </nav>

          <div className="documentation-sidebar-other-docs">
            <h3 className="documentation-sidebar-other-docs-title">Other Documentation</h3>
            <ul className="documentation-sidebar-other-docs-list">
              <li>
                <Link 
                  to="/docs/onboarding" 
                  className="documentation-sidebar-other-docs-link"
                >
                  Onboarding Flow
                </Link>
              </li>
              <li>
                <Link 
                  to="/docs/profile" 
                  className="documentation-sidebar-other-docs-link"
                >
                  Profile Page
                </Link>
              </li>
              <li>
                <Link 
                  to="/documentation/atomic-design-audit" 
                  className="documentation-sidebar-other-docs-link"
                >
                  Atomic Design Audit
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <main className="documentation-main">
        <div className="documentation-container">
          <header className="documentation-header">
            <h1>User Review System</h1>
            <p className="documentation-subtitle">
              Comprehensive Documentation for Product Managers and Developers
            </p>
            <div className="documentation-meta">
              <span>Last Updated: {getCurrentDate()}</span>
              <span>•</span>
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Product & Engineering</span>
            </div>
          </header>

        <section id="overview" className="documentation-section">
          <h2>🎯 Overview</h2>
          <p>
            The User Review System enables customers to share detailed vehicle reviews with ratings, 
            media, verification, and social interactions. The system supports both creating new reviews 
            and editing existing ones.
          </p>
          
          <div className="documentation-highlight-box">
            <h4>Key Benefits</h4>
            <ul>
              <li><strong>Comprehensive Rating System</strong> - Overall ratings (1-10) with 5 category-specific ratings</li>
              <li><strong>Media Support</strong> - Image and video uploads with preview</li>
              <li><strong>Verification System</strong> - Multi-tier ownership verification with badges</li>
              <li><strong>Social Features</strong> - Thumbs up, replies, and sharing capabilities</li>
              <li><strong>Edit Functionality</strong> - Users can update their reviews with change tracking</li>
              <li><strong>Auto-Calculation</strong> - Overall rating automatically computed from category ratings</li>
              <li><strong>Responsive Design</strong> - Mobile-first with desktop optimization</li>
            </ul>
          </div>
        </section>

        <section id="features" className="documentation-section">
          <h2>🚀 Features & Capabilities</h2>
          
          <h3>Core Features</h3>
          <div className="documentation-features-grid">
            <div className="documentation-feature-card">
              <h4>1. Review Creation</h4>
              <ul>
                <li>Overall rating (1-10 with decimals)</li>
                <li>Review title (required)</li>
                <li>Review content with paragraphs</li>
                <li>Vehicle model selection</li>
                <li>Media upload (images/videos)</li>
                <li>Category ratings</li>
                <li>Vehicle relationship</li>
                <li>VIN verification (optional)</li>
              </ul>
            </div>

            <div className="documentation-feature-card">
              <h4>2. Review Editing</h4>
              <ul>
                <li>Edit any field</li>
                <li>Original date preserved</li>
                <li>Updated date timestamp</li>
                <li>Visual change indicator</li>
                <li>Pre-filled data in modal</li>
              </ul>
            </div>

            <div className="documentation-feature-card">
              <h4>3. Rating System</h4>
              <ul>
                <li>Automatic calculation</li>
                <li>Manual override</li>
                <li>Fractional support (e.g., 7.5)</li>
                <li>Smart sync logic</li>
              </ul>
            </div>

            <div className="documentation-feature-card">
              <h4>4. Verification System</h4>
              <ul>
                <li><span className="documentation-badge documentation-badge-success">Documents Verified</span> - VIN provided</li>
                <li><span className="documentation-badge documentation-badge-info">Verified Owner</span> - Reserved</li>
                <li><span className="documentation-badge documentation-badge-gray">Owner</span> - Basic verification</li>
                <li>No badge - Unverified</li>
              </ul>
            </div>
          </div>

          <h3>Vehicle Relationship Options</h3>
          <p>Users can specify their relationship with the vehicle:</p>
          <ul>
            <li>✅ Currently own</li>
            <li>✅ Previously owned</li>
            <li>✅ Leased</li>
            <li>✅ Rented</li>
            <li>✅ Test drove</li>
            <li>✅ Was a passenger</li>
          </ul>
          <p>Duration is collected for each relationship type.</p>
        </section>

        <section id="architecture" className="documentation-section">
          <h2>🏗️ Component Architecture</h2>
          
          <h3>Main Components</h3>
          <div className="documentation-code-block">
            <pre><code>{`src/components/
├── UserReviews/
│   ├── UserReviews.tsx # Main review display component
│   ├── UserReviews.css # Component styles
│   └── index.ts # Exports
├── WriteReviewModal/
│   ├── WriteReviewModal.tsx # Create/edit review modal
│   ├── WriteReviewModal.css # Modal styles
│   └── index.ts # Exports
└── RatingModal/
    └── RatingModal.tsx # Overall rating input`}</code></pre>
          </div>

          <h3>Component Hierarchy</h3>
          <div className="documentation-code-block">
            <pre><code>{`VehicleDetails Page
└── UserReviews Component
    ├── Rating Modal (overlay)
    ├── Write Review Modal (overlay)
    └── Review List
        └── Review Card
            ├── Reviewer Info
            ├── Title
            ├── Media
            ├── Content (formatted)
            ├── Category Ratings
            ├── Actions
            └── Replies`}</code></pre>
          </div>
        </section>

        <section id="data-models" className="documentation-section">
          <h2>📊 Data Models</h2>
          
          <h3>ReviewData Interface</h3>
          <div className="documentation-code-block">
            <pre><code>{`export interface ReviewData {
  // Core Fields
  id: string;                      // Unique review identifier
  reviewerName: string;            // Reviewer's name
  rating: number;                  // Overall rating (1-10, supports decimals)
  title: string;                   // Review title (required)
  content: string;                 // Review body (required, supports paragraphs)
  vehicleType: string;             // Vehicle type
  vehicleModel: string;            // Specific model/variant
  date: string;                    // Original publish date
  updatedDate?: string;            // Last update date (if edited)
  
  // Media
  mediaFiles?: File[];             // Uploaded media files
  mediaPreviews?: string[];        // Preview URLs for display
  
  // Social Features
  thumbsUpCount?: number;          // Number of likes
  isThumbsUp?: boolean;            // Current user's like status
  replies?: ReplyData[];           // Comments/replies
  
  // Category Ratings (1-10 scale)
  categoryRatings?: {
    comfort?: number;              // Comfort rating
    reliability?: number;          // Reliability rating
    interior?: number;             // Interior rating
    value?: number;                // Value rating
    safety?: number;               // Safety rating
  };
  
  // Verification
  verificationLevel?: VerificationLevel;  // Badge level
  vinNumber?: string;              // VIN (confidential)
  
  // Relationship
  vehicleRelationship?: VehicleRelationship;  // User's relationship
  experienceDuration?: string;     // How long user experienced vehicle
}`}</code></pre>
          </div>

          <h3>Type Definitions</h3>
          <table className="documentation-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Values</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>VerificationLevel</strong></td>
                <td>'none' | 'owner' | 'verified' | 'verified_documents'</td>
                <td>Verification badge level</td>
              </tr>
              <tr>
                <td><strong>VehicleRelationship</strong></td>
                <td>'own' | 'previously_owned' | 'leased' | 'rented' | 'test_drove' | 'passenger'</td>
                <td>User's relationship with vehicle</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="user-flows" className="documentation-section">
          <h2>🔄 User Flows</h2>
          
          <h3>Flow 1: Creating a New Review</h3>
          <div className="documentation-flow-diagram">
            <div className="documentation-flow-step">User clicks "Write a Vehicle Review"</div>
            <div className="documentation-flow-step">WriteReviewModal opens</div>
            <div className="documentation-flow-step">User sets rating (overall or categories)</div>
            <div className="documentation-flow-step">User fills required fields: Title, Content</div>
            <div className="documentation-flow-step">User optionally adds: Relationship, Duration, VIN, Category Ratings, Media</div>
            <div className="documentation-flow-step">User clicks "Submit Your Review"</div>
            <div className="documentation-flow-step">Review appears at top of list</div>
            <div className="documentation-flow-step">CTA button changes to "Edit Your Review"</div>
          </div>

          <h3>Flow 2: Editing an Existing Review</h3>
          <div className="documentation-flow-diagram">
            <div className="documentation-flow-step">User clicks "Edit Your Review" (CTA or Edit button)</div>
            <div className="documentation-flow-step">WriteReviewModal opens in edit mode with pre-filled data</div>
            <div className="documentation-flow-step">User modifies desired fields</div>
            <div className="documentation-flow-step">User clicks "Update Review"</div>
            <div className="documentation-flow-step">Review updates with modifiedDate timestamp</div>
            <div className="documentation-flow-step">Review displays "Updated [date]"</div>
          </div>

          <h3>Flow 3: Rating Calculation Logic</h3>
          <div className="documentation-highlight-box">
            <h4>Automatic Mode (Default)</h4>
            <p>User sets category ratings → Overall rating auto-calculates (average) → Supports fractional ratings (e.g., 7.5)</p>
            
            <h4>Manual Override</h4>
            <p>User clicks overall rating stars → Manual mode activated → Category changes reset manual mode → Returns to automatic calculation</p>
          </div>
        </section>

        <section id="design" className="documentation-section">
          <h2>🎨 Design Specifications</h2>
          
          <h3>Typography</h3>
          <table className="documentation-table">
            <thead>
              <tr>
                <th>Element</th>
                <th>Font Family</th>
                <th>Weight</th>
                <th>Size</th>
                <th>Line Height</th>
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Review Title</td>
                <td>Heading (Poppins)</td>
                <td>600</td>
                <td>18px</td>
                <td>1.333em</td>
                <td>Neutrals-1</td>
              </tr>
              <tr>
                <td>Review Content</td>
                <td>Body (Geist)</td>
                <td>400</td>
                <td>16px</td>
                <td>1.6em</td>
                <td>Neutrals-2</td>
              </tr>
              <tr>
                <td>Reviewer Name</td>
                <td>Body (Geist)</td>
                <td>600</td>
                <td>16px</td>
                <td>1.5em</td>
                <td>Neutrals-1</td>
              </tr>
              <tr>
                <td>Review Date</td>
                <td>Body (Geist)</td>
                <td>400</td>
                <td>12px</td>
                <td>1.5em</td>
                <td>#6E7481</td>
              </tr>
              <tr>
                <td>Overall Rating</td>
                <td>Heading (Poppins)</td>
                <td>600</td>
                <td>24px</td>
                <td>1.375em</td>
                <td>Neutrals-1</td>
              </tr>
            </tbody>
          </table>

          <h3>Color Palette</h3>
          <table className="documentation-table">
            <thead>
              <tr>
                <th>Color</th>
                <th>Hex Value</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="documentation-color-swatch" style={{backgroundColor: '#1A1A1A'}}></span>Neutrals-1</td>
                <td>#1A1A1A</td>
                <td>Headings, high contrast text</td>
              </tr>
              <tr>
                <td><span className="documentation-color-swatch" style={{backgroundColor: '#4A4A4A'}}></span>Neutrals-2</td>
                <td>#4A4A4A</td>
                <td>Body text</td>
              </tr>
              <tr>
                <td><span className="documentation-color-swatch" style={{backgroundColor: '#808080'}}></span>Neutrals-3</td>
                <td>#808080</td>
                <td>Secondary text</td>
              </tr>
              <tr>
                <td><span className="documentation-color-swatch" style={{backgroundColor: '#33CCFF'}}></span>Primary-500</td>
                <td>#33CCFF</td>
                <td>Primary actions</td>
              </tr>
            </tbody>
          </table>

          <h3>Verification Badges</h3>
          <table className="documentation-table">
            <thead>
              <tr>
                <th>Badge</th>
                <th>Background</th>
                <th>Border</th>
                <th>Text Color</th>
                <th>Icon</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="documentation-badge documentation-badge-gray">Owner</span></td>
                <td>Neutrals-7</td>
                <td>1px Neutrals-5</td>
                <td>Neutrals-2</td>
                <td>Blue star</td>
              </tr>
              <tr>
                <td><span className="documentation-badge documentation-badge-info">Verified Owner</span></td>
                <td>#E3F2FD</td>
                <td>1px #2196F3</td>
                <td>#1976D2</td>
                <td>Blue star</td>
              </tr>
              <tr>
                <td><span className="documentation-badge documentation-badge-success">Documents Verified</span></td>
                <td>#E8F5E9</td>
                <td>1px #4CAF50</td>
                <td>#2E7D32</td>
                <td>Blue star</td>
              </tr>
            </tbody>
          </table>

          <h3>Spacing System</h3>
          <p>Based on 8px grid:</p>
          <ul>
            <li><strong>xs</strong>: 4px</li>
            <li><strong>sm</strong>: 8px</li>
            <li><strong>md</strong>: 12px</li>
            <li><strong>lg</strong>: 16px</li>
            <li><strong>xl</strong>: 24px</li>
            <li><strong>2xl</strong>: 32px</li>
            <li><strong>3xl</strong>: 42px (featured review padding)</li>
          </ul>
        </section>

        <section id="implementation" className="documentation-section">
          <h2>💻 Technical Implementation</h2>
          
          <h3>Rating Calculation Algorithm</h3>
          <p><strong>Location</strong>: <code>src/utils/ratingUtils.ts</code></p>
          <div className="documentation-code-block">
            <pre><code>{`export function computeOverallRating(categoryRatings: {
  comfort?: number;
  reliability?: number;
  interior?: number;
  value?: number;
  safety?: number;
}): number {
  // Filter out undefined/zero ratings
  const ratings = Object.values(categoryRatings).filter(
    (r): r is number => typeof r === 'number' && r > 0
  );
  
  if (ratings.length === 0) return 0;
  
  // Calculate average
  const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  
  // Round to 1 decimal place for fractional support
  return Math.round(average * 10) / 10;
}`}</code></pre>
          </div>

          <div className="documentation-alert documentation-alert-info">
            <strong>Note:</strong> The rating system supports fractional values (e.g., 7.5) and automatically 
            calculates the overall rating from category ratings unless manually overridden.
          </div>

          <h3>Paragraph Formatting</h3>
          <p>Review content is automatically formatted into paragraphs:</p>
          <ol>
            <li><strong>Primary Split</strong>: Double line breaks (<code>\n\n</code>)</li>
            <li><strong>Fallback</strong>: Single line breaks (<code>\n</code>)</li>
            <li><strong>Rendering</strong>: Each paragraph wrapped in <code>&lt;p&gt;</code> tag</li>
            <li><strong>CSS</strong>: 1em spacing between paragraphs (web standard)</li>
          </ol>

          <h3>VIN Storage</h3>
          <div className="documentation-alert documentation-alert-warning">
            <strong>Security Note:</strong> In production, VINs should be encrypted before storage in 
            localStorage or sent securely to the backend.
          </div>
          <p>VINs stored in localStorage:</p>
          <div className="documentation-code-block">
            <pre><code>{`{
  "vehicleVINs": {
    "2025 BMW 3-Series": {
      "vehicleName": "2025 BMW 3-Series",
      "vin": "WBA123456789ABCDE",
      "timestamp": "2024-12-01T10:30:00.000Z"
    }
  }
}`}</code></pre>
          </div>
        </section>

        <section id="audit" className="documentation-section">
          <h2>🔍 Atomic Design Audit</h2>
          <p>
            The audit documented under <Link to="/documentation/atomic-design-audit">Atomic Design Inventory</Link> is driving three parallel sprint tracks.
          </p>
          <div className="documentation-highlight-box">
            <h4>In-progress</h4>
            <ul>
              <li>Tokenize every molecule so padding/gap values align with the 8px spacing system (`--spacing-card-*`, `--spacing-component-*`, `--spacing-gap-*`).</li>
              <li>Replace remaining rgba overlays/box-shadows in atoms (e.g., cards, tooltips, badges) with `var(--color-overlay-*)` and shadow tokens.</li>
              <li>Pull reusable atoms (card shell, badge pill, tooltip) into `src/design-system/components/` so organisms compose them rather than repro them.</li>
              <li>AIInsights sections now leverage spacing tokens for their grids/padding; document any remaining list gaps that still need a token.</li>
              <li>StickyRateBar now reuses the CTA and spacing tokens, so its ratings and button surface stay in sync with the system.</li>
              <li>ArticleReactions popups now use the same spacing/tokenized drop-shadow system as other tooltips.</li>
              <li>ArticleCard now inherits the tokenized `Card` atom (custom CSS removed), so all previews share the same spacing/shadow surface.</li>
            </ul>
          </div>
          <div className="documentation-highlight-box">
            <h4>Next sprint</h4>
            <ul>
              <li>Snapshot remaining molecules (HeroCard, ArticleCard, AIInsights, Shared Widgets) and capture token gaps inside this documentation page.</li>
              <li>Schedule a documentation review session that walks through the audit findings, links back to `CURSOR_DESIGN_SYSTEM_RULES`, and prioritizes component fixes.</li>
              <li>Surface the audit status in the design system reference so design/PM partners know what’s ready to be reused.</li>
            </ul>
          </div>
        </section>

        <section id="api" className="documentation-section">
          <h2>🔌 API Integration Guide</h2>
          
          <h3>Component Usage Example</h3>
          <div className="documentation-code-block">
            <pre><code>{`import { UserReviews } from '../../components/UserReviews';
import WriteReviewModal from '../../components/WriteReviewModal';
import type { ReviewData } from '../../components/UserReviews';

function VehicleDetailsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const handleSubmitReview = (newReview: ReviewData) => {
    // In production: Send to API
    // await api.post('/reviews', newReview);
    
    // Update local state
    setReviews(prev => [newReview, ...prev]);
    setIsWriteModalOpen(false);
  };

  const handleUpdateReview = (reviewId: string, updatedReview: ReviewData) => {
    // In production: Send to API
    // await api.put(\`/reviews/\${reviewId}\`, updatedReview);
    
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? updatedReview : review
    ));
  };

  return (
    <>
      <UserReviews
        vehicleName="2025 BMW 3-Series"
        communityRating={8.5}
        totalReviews={253}
        ratingDistribution={[5, 3, 8, 10, 20, 30, 45, 63, 50, 18]}
        reviews={reviews}
        onWriteReview={() => setIsWriteModalOpen(true)}
        onUpdateReview={handleUpdateReview}
      />
      
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        vehicleName="2025 BMW 3-Series"
        onSubmit={handleSubmitReview}
      />
    </>
  );
}`}</code></pre>
          </div>

          <h3>Suggested API Endpoints</h3>
          <table className="documentation-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>POST</td>
                <td><code>/api/vehicles/:vehicleId/reviews</code></td>
                <td>Create new review</td>
              </tr>
              <tr>
                <td>PUT</td>
                <td><code>/api/reviews/:reviewId</code></td>
                <td>Update existing review</td>
              </tr>
              <tr>
                <td>GET</td>
                <td><code>/api/vehicles/:vehicleId/reviews</code></td>
                <td>Get all reviews for vehicle</td>
              </tr>
              <tr>
                <td>POST</td>
                <td><code>/api/reviews/:reviewId/media</code></td>
                <td>Upload media files</td>
              </tr>
              <tr>
                <td>DELETE</td>
                <td><code>/api/reviews/:reviewId</code></td>
                <td>Delete review</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="testing" className="documentation-section">
          <h2>✅ Testing Checklist</h2>
          
          <h3>Functional Testing</h3>
          <ul className="documentation-checklist">
            <li><strong>Review Creation</strong> - Can create review with all required fields, optional fields work, validation works</li>
            <li><strong>Review Editing</strong> - Edit button appears for user's reviews, modal pre-fills data, updates work correctly</li>
            <li><strong>Rating System</strong> - Category ratings calculate overall rating, fractional ratings work, manual override works</li>
            <li><strong>Verification System</strong> - Badge levels assign correctly based on VIN/relationship/profile</li>
            <li><strong>Social Features</strong> - Thumbs up increments count, reply functionality works, share button appears</li>
            <li><strong>UI/UX</strong> - CTA button changes text, paragraph formatting works, media previews display, responsive design</li>
          </ul>

          <h3>Edge Cases</h3>
          <ul className="documentation-checklist">
            <li>Empty review content</li>
            <li>Very long review content</li>
            <li>Multiple media files</li>
            <li>Large file sizes</li>
            <li>Special characters in review</li>
            <li>Network errors during submission</li>
            <li>Rapid editing (race conditions)</li>
          </ul>
        </section>

        </div>
      </main>
    </div>
  );
};

export default Documentation;

