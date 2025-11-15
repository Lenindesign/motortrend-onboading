import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Documentation/Documentation.css';

export const OnboardingDocumentation: React.FC = () => {
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
      const sections = ['overview', 'steps', 'components', 'data-flow', 'user-flows', 'design', 'implementation', 'testing'];
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
    handleScroll();
    
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
            <h2>Onboarding Flow</h2>
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
                  href="#steps" 
                  className={activeSection === 'steps' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('steps');
                  }}
                >
                  Onboarding Steps
                </a>
              </li>
              <li>
                <a 
                  href="#components" 
                  className={activeSection === 'components' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('components');
                  }}
                >
                  Components
                </a>
              </li>
              <li>
                <a 
                  href="#data-flow" 
                  className={activeSection === 'data-flow' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('data-flow');
                  }}
                >
                  Data Flow
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
                  to="/docs/review-system" 
                  className="documentation-sidebar-other-docs-link"
                >
                  Review System
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
            </ul>
          </div>
        </div>
      </aside>

      <main className="documentation-main">
        <div className="documentation-container">
          <header className="documentation-header">
            <h1>Onboarding Flow</h1>
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
              The Onboarding Flow is a 4-step user onboarding experience that collects essential user information,
              preferences, vehicle data, and newsletter subscriptions. The system guides new users through a personalized
              setup process that helps customize their experience.
            </p>
            
            <div className="documentation-highlight-box">
              <h4>Key Features</h4>
              <ul>
                <li><strong>4-Step Process</strong> - Name/location, user type selection, vehicle selection, and newsletter preferences</li>
                <li><strong>Progress Tracking</strong> - Visual step indicators showing current progress</li>
                <li><strong>Skip Functionality</strong> - Users can skip optional steps</li>
                <li><strong>Data Persistence</strong> - All data stored in localStorage for session continuity</li>
                <li><strong>Location Services</strong> - Automatic location detection with manual override</li>
                <li><strong>Vehicle Search</strong> - Autocomplete vehicle search with rating capabilities</li>
                <li><strong>Responsive Design</strong> - Mobile-first approach with desktop optimization</li>
              </ul>
            </div>
          </section>

          <section id="steps" className="documentation-section">
            <h2>📋 Onboarding Steps</h2>
            
            <h3>Step 1: Start Your Engines</h3>
            <div className="documentation-feature-card">
              <h4>Purpose</h4>
              <p>Collect user's name and location information.</p>
              
              <h4>Fields</h4>
              <ul>
                <li><strong>Name</strong> (Required) - Text input field</li>
                <li><strong>Location</strong> (Optional) - Location autocomplete with geolocation detection</li>
              </ul>
              
              <h4>Features</h4>
              <ul>
                <li>Location autocomplete with search suggestions</li>
                <li>Automatic location detection using browser geolocation API</li>
                <li>Reverse geocoding to convert coordinates to readable location</li>
                <li>Skip button to proceed without location</li>
              </ul>
            </div>

            <h3>Step 2: What Describes You Best?</h3>
            <div className="documentation-feature-card">
              <h4>Purpose</h4>
              <p>Identify user type to personalize content and recommendations.</p>
              
              <h4>Options</h4>
              <ul>
                <li><strong>Car Buyer</strong> - Shopping for a new or used car</li>
                <li><strong>Car Enthusiast</strong> - Love cars, reviews, and auto culture</li>
                <li><strong>Both</strong> - Car lover always eyeing the next ride</li>
              </ul>
              
              <h4>Features</h4>
              <ul>
                <li>Visual selection cards with images</li>
                <li>Single selection required</li>
                <li>Previous and Skip navigation options</li>
              </ul>
            </div>

            <h3>Step 3: Tell Us About Your Ride</h3>
            <div className="documentation-feature-card">
              <h4>Purpose</h4>
              <p>Collect information about vehicles the user owns or wants.</p>
              
              <h4>Features</h4>
              <ul>
                <li>Vehicle search with autocomplete</li>
                <li>Add multiple vehicles</li>
                <li>Set ownership status (Own / Want to Own)</li>
                <li>Rate vehicles (1-10 scale)</li>
                <li>Navigate to vehicle details to write reviews</li>
              </ul>
              
              <h4>Vehicle Data</h4>
              <ul>
                <li>Vehicle name (e.g., "2025 BMW 3-Series")</li>
                <li>Ownership type: "own" or "want"</li>
                <li>Optional rating (stored in RatingContext)</li>
              </ul>
            </div>

            <h3>Step 4: Let's Keep In Touch</h3>
            <div className="documentation-feature-card">
              <h4>Purpose</h4>
              <p>Collect newsletter subscription preferences.</p>
              
              <h4>Newsletter Options</h4>
              <ul>
                <li><strong>MotorTrend Newsletter</strong> - Car reviews, news, rankings</li>
                <li><strong>HOT ROD Newsletter</strong> - Latest automotive news and insights</li>
                <li><strong>Events Newsletter</strong> - Information on car events</li>
              </ul>
              
              <h4>Features</h4>
              <ul>
                <li>Multiple selection checkboxes</li>
                <li>Brand logos for visual identification</li>
                <li>Skip option to complete onboarding without subscriptions</li>
              </ul>
            </div>
          </section>

          <section id="components" className="documentation-section">
            <h2>🏗️ Components</h2>
            
            <h3>Main Components</h3>
            <div className="documentation-code-block">
              <pre><code>{`src/pages/Onboarding/
├── OnboardingStep1.tsx      # Step 1: Name & Location
├── OnboardingStep1.css      # Step 1 styles
├── OnboardingStep2.tsx      # Step 2: User Type Selection
├── OnboardingStep2.css      # Step 2 styles
├── OnboardingStep3.tsx      # Step 3: Vehicle Selection
├── OnboardingStep3.css      # Step 3 styles
├── OnboardingStep4.tsx      # Step 4: Newsletter Subscriptions
├── OnboardingStep4.css      # Step 4 styles
└── index.ts                  # Exports

Supporting Components:
├── LocationAutocomplete/     # Location search & geolocation
├── VehicleSearch/            # Vehicle autocomplete search
├── VehicleCard/              # Vehicle display card
└── RatingModal/              # Vehicle rating input`}</code></pre>
            </div>

            <h3>Component Hierarchy</h3>
            <div className="documentation-code-block">
              <pre><code>{`OnboardingStep1
└── TextField (design-system)
└── LocationAutocomplete
    └── Geolocation detection

OnboardingStep2
└── User Type Selection Cards

OnboardingStep3
└── VehicleSearch
    └── Autocomplete dropdown
└── VehicleCard (for selected vehicles)
└── RatingModal (overlay)

OnboardingStep4
└── Newsletter Checkbox Cards`}</code></pre>
            </div>
          </section>

          <section id="data-flow" className="documentation-section">
            <h2>💾 Data Flow</h2>
            
            <h3>localStorage Structure</h3>
            <div className="documentation-code-block">
              <pre><code>{`{
  "onboardingData": {
    "name": "John Doe",
    "location": "New York, NY",
    "userType": "buyer" | "enthusiast" | "both",
    "vehicles": [
      {
        "name": "2025 BMW 3-Series",
        "ownership": "own" | "want",
        "rating": 8.5
      }
    ],
    "newsletters": ["motortrend", "hotrod", "events"],
    "joinDate": "1/14/2024"
  }
}`}</code></pre>
            </div>

            <h3>RatingContext Structure</h3>
            <div className="documentation-code-block">
              <pre><code>{`{
  "vehicleRatings": {
    "2025 BMW 3-Series": 8.5,
    "2024 Tesla Model 3": 9.0
  }
}`}</code></pre>
            </div>

            <h3>Data Collection Flow</h3>
            <div className="documentation-flow-diagram">
              <div className="documentation-flow-step">User enters Step 1 → Name & Location stored in localStorage</div>
              <div className="documentation-flow-step">User selects user type → Stored in onboardingData</div>
              <div className="documentation-flow-step">User adds vehicles → Stored in onboardingData.vehicles[]</div>
              <div className="documentation-flow-step">User rates vehicles → Stored in RatingContext</div>
              <div className="documentation-flow-step">User selects newsletters → Stored in onboardingData.newsletters[]</div>
              <div className="documentation-flow-step">Onboarding complete → localStorage.setItem('onboardingComplete', 'true')</div>
              <div className="documentation-flow-step">Navigate to Welcome page</div>
            </div>
          </section>

          <section id="user-flows" className="documentation-section">
            <h2>🔄 User Flows</h2>
            
            <h3>Complete Onboarding Flow</h3>
            <div className="documentation-flow-diagram">
              <div className="documentation-flow-step">User signs in → Redirected to Step 1</div>
              <div className="documentation-flow-step">Step 1: Enter name (required), location (optional), click Next</div>
              <div className="documentation-flow-step">Step 2: Select user type, click Next</div>
              <div className="documentation-flow-step">Step 3: Search and add vehicles, set ownership, optionally rate, click Next</div>
              <div className="documentation-flow-step">Step 4: Select newsletters (optional), click Complete</div>
              <div className="documentation-flow-step">Navigate to Welcome page</div>
            </div>

            <h3>Skip Flow</h3>
            <div className="documentation-flow-diagram">
              <div className="documentation-flow-step">User clicks "Skip this step" on any step</div>
              <div className="documentation-flow-step">Progress to next step without saving data</div>
              <div className="documentation-flow-step">Can skip all optional steps</div>
            </div>

            <h3>Location Detection Flow</h3>
            <div className="documentation-flow-diagram">
              <div className="documentation-flow-step">User clicks "Detect Location" button</div>
              <div className="documentation-flow-step">Browser requests geolocation permission</div>
              <div className="documentation-flow-step">Get coordinates (latitude, longitude)</div>
              <div className="documentation-flow-step">Reverse geocode coordinates to location name</div>
              <div className="documentation-flow-step">Display location in input field</div>
            </div>
          </section>

          <section id="design" className="documentation-section">
            <h2>🎨 Design Specifications</h2>
            
            <h3>Layout</h3>
            <ul>
              <li><strong>Card Layout</strong> - Centered card design with max-width constraints</li>
              <li><strong>Progress Indicators</strong> - Step X/4 displayed in header</li>
              <li><strong>Illustrations</strong> - Each step has a unique illustration</li>
              <li><strong>Navigation</strong> - Previous, Skip, and Next buttons</li>
            </ul>

            <h3>Typography</h3>
            <table className="documentation-table">
              <thead>
                <tr>
                  <th>Element</th>
                  <th>Font Family</th>
                  <th>Size</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Step Title</td>
                  <td>Heading (Poppins)</td>
                  <td>32px</td>
                  <td>600</td>
                </tr>
                <tr>
                  <td>Step Subtitle</td>
                  <td>Body (Geist)</td>
                  <td>16px</td>
                  <td>400</td>
                </tr>
                <tr>
                  <td>Form Labels</td>
                  <td>Body (Geist)</td>
                  <td>14px</td>
                  <td>500</td>
                </tr>
              </tbody>
            </table>

            <h3>Spacing</h3>
            <ul>
              <li>Card padding: 32px</li>
              <li>Section gaps: 24px</li>
              <li>Button spacing: 16px</li>
            </ul>
          </section>

          <section id="implementation" className="documentation-section">
            <h2>💻 Technical Implementation</h2>
            
            <h3>Geolocation API</h3>
            <div className="documentation-code-block">
              <pre><code>{`// Location detection using browser Geolocation API
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    // Reverse geocode using external API
    fetch(\`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=\${latitude}&longitude=\${longitude}\`)
      .then(res => res.json())
      .then(data => {
        setLocation(\`\${data.city}, \${data.principalSubdivision}\`);
      });
  },
  (error) => {
    // Handle permission denied, timeout, etc.
  }
);`}</code></pre>
            </div>

            <h3>localStorage Management</h3>
            <div className="documentation-code-block">
              <pre><code>{`// Merge new data with existing data
const existingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
localStorage.setItem('onboardingData', JSON.stringify({
  ...existingData,
  name: newName,
  location: newLocation
}));`}</code></pre>
            </div>

            <h3>Routing</h3>
            <p>Uses React Router for navigation between steps:</p>
            <ul>
              <li><code>/onboarding/step1</code></li>
              <li><code>/onboarding/step2</code></li>
              <li><code>/onboarding/step3</code></li>
              <li><code>/onboarding/step4</code></li>
              <li><code>/welcome</code> (completion page)</li>
            </ul>
          </section>

          <section id="testing" className="documentation-section">
            <h2>✅ Testing Checklist</h2>
            
            <h3>Functional Testing</h3>
            <ul className="documentation-checklist">
              <li><strong>Step 1</strong> - Name validation (required field), location autocomplete works, geolocation detection works</li>
              <li><strong>Step 2</strong> - User type selection works, data persists</li>
              <li><strong>Step 3</strong> - Vehicle search works, multiple vehicles can be added, ownership toggle works, rating modal opens/closes</li>
              <li><strong>Step 4</strong> - Newsletter selection works, multiple selections allowed</li>
              <li><strong>Navigation</strong> - Previous/Skip/Next buttons work correctly</li>
              <li><strong>Data Persistence</strong> - Data saved to localStorage correctly</li>
            </ul>

            <h3>Edge Cases</h3>
            <ul className="documentation-checklist">
              <li>Geolocation permission denied</li>
              <li>Geolocation timeout</li>
              <li>Invalid location data</li>
              <li>Multiple rapid navigation clicks</li>
              <li>Browser back button behavior</li>
              <li>localStorage unavailable</li>
            </ul>

            <h3>Responsive Testing</h3>
            <ul className="documentation-checklist">
              <li>Mobile viewport (320px - 768px)</li>
              <li>Tablet viewport (768px - 1024px)</li>
              <li>Desktop viewport (1024px+)</li>
              <li>Button text truncation on mobile</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OnboardingDocumentation;

