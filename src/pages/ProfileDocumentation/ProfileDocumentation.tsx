import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Documentation/Documentation.css';

export const ProfileDocumentation: React.FC = () => {
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
      const sections = ['overview', 'tabs', 'components', 'features', 'user-flows', 'design', 'implementation', 'api'];
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
            <h2>Profile Page</h2>
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
                  href="#tabs" 
                  className={activeSection === 'tabs' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('tabs');
                  }}
                >
                  Profile Tabs
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
                  href="#features" 
                  className={activeSection === 'features' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('features');
                  }}
                >
                  Features
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
                  href="#api" 
                  className={activeSection === 'api' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('api');
                  }}
                >
                  API Integration
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
                  to="/docs/onboarding" 
                  className="documentation-sidebar-other-docs-link"
                >
                  Onboarding Flow
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <main className="documentation-main">
        <div className="documentation-container">
          <header className="documentation-header">
            <h1>Profile Page</h1>
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
              The Profile Page is a comprehensive user profile management system that allows users to manage their account settings,
              saved items (vehicles, articles, comparisons, videos), subscriptions, and preferences. The page uses a tabbed interface
              for organized navigation between different profile sections.
            </p>
            
            <div className="documentation-highlight-box">
              <h4>Key Features</h4>
              <ul>
                <li><strong>Profile Banner</strong> - Displays user avatar, banner image, name, join date, and location</li>
                <li><strong>Tabbed Navigation</strong> - Four main tabs: My Account, Saved Items, Subscriptions, Settings</li>
                <li><strong>Editable Fields</strong> - Inline editing for user information (name, username, email, password)</li>
                <li><strong>Vehicle Management</strong> - Add, remove, and manage vehicles with ownership status</li>
                <li><strong>Saved Items</strong> - Manage bookmarked articles, comparisons, and videos</li>
                <li><strong>Subscription Management</strong> - View and manage newsletter subscriptions</li>
                <li><strong>Profile Completion</strong> - Visual indicator of profile completion status</li>
                <li><strong>Responsive Design</strong> - Mobile-first approach with desktop optimization</li>
              </ul>
            </div>
          </section>

          <section id="tabs" className="documentation-section">
            <h2>📑 Profile Tabs</h2>
            
            <h3>My Account Tab</h3>
            <div className="documentation-feature-card">
              <h4>Purpose</h4>
              <p>Manage basic account information and view profile completion status.</p>
              
              <h4>Sections</h4>
              <ul>
                <li><strong>Basic Info</strong> - Editable fields for name, username, email, password</li>
                <li><strong>Profile Completion Card</strong> - Shows completion percentage and links to incomplete steps</li>
              </ul>
              
              <h4>Features</h4>
              <ul>
                <li>Inline editing with save/cancel functionality</li>
                <li>Password field with hidden display</li>
                <li>Profile completion tracking</li>
                <li>Quick access to complete onboarding steps</li>
              </ul>
            </div>

            <h3>Saved Items Tab</h3>
            <div className="documentation-feature-card">
              <h4>Purpose</h4>
              <p>Manage bookmarked content and vehicles.</p>
              
              <h4>Sections</h4>
              <ul>
                <li><strong>Vehicles</strong> - "Cars I Own" and "Cars I Want" sections</li>
                <li><strong>Articles</strong> - Bookmarked articles</li>
                <li><strong>Car Comparisons</strong> - Saved vehicle comparisons</li>
                <li><strong>Videos</strong> - Bookmarked videos</li>
              </ul>
              
              <h4>Features</h4>
              <ul>
                <li>Add vehicles with ownership status</li>
                <li>Rate vehicles</li>
                <li>Remove bookmarked items</li>
                <li>Change vehicle ownership (move between Own/Want)</li>
                <li>Navigate to vehicle details</li>
              </ul>
            </div>

            <h3>Subscriptions Tab</h3>
            <div className="documentation-feature-card">
              <h4>Purpose</h4>
              <p>View and manage newsletter subscriptions.</p>
              
              <h4>Features</h4>
              <ul>
                <li>Display active subscriptions</li>
                <li>Subscribe/unsubscribe to newsletters</li>
                <li>Subscription status indicators</li>
              </ul>
            </div>

            <h3>Settings Tab</h3>
            <div className="documentation-feature-card">
              <h4>Purpose</h4>
              <p>Manage account settings and connected accounts.</p>
              
              <h4>Sections</h4>
              <ul>
                <li><strong>Connected Accounts</strong> - Link/unlink social accounts</li>
                <li><strong>Privacy Settings</strong> - Manage privacy preferences</li>
                <li><strong>Notifications</strong> - Configure notification preferences</li>
              </ul>
            </div>
          </section>

          <section id="components" className="documentation-section">
            <h2>🏗️ Components</h2>
            
            <h3>Main Components</h3>
            <div className="documentation-code-block">
              <pre><code>{`src/pages/Profile/
├── Profile.tsx              # Main profile page component
└── Profile.css              # Profile page styles

src/components/
├── ProfileBanner/           # User banner with avatar
├── ProfileNav/              # Tab navigation sidebar
├── ProfileCompletionCard/   # Profile completion indicator
├── EditableField/           # Inline editable input field
├── VehicleCard/             # Vehicle display card
├── ArticleCard/             # Article card component
├── ComparisonCard/          # Vehicle comparison card
├── VideoCard/               # Video card component
├── EmptyVehicleSection/     # Empty state for vehicles
├── VehicleSearch/           # Vehicle autocomplete search
├── AvatarBannerModal/        # Avatar/banner upload modal
└── Toast/                   # Toast notifications`}</code></pre>
            </div>

            <h3>Component Hierarchy</h3>
            <div className="documentation-code-block">
              <pre><code>{`Profile Page
├── ProfileBanner
│   └── Avatar & Banner (editable)
├── ProfileNav (sidebar)
└── Profile Content (main)
    ├── My Account Tab
    │   ├── EditableField (multiple)
    │   └── ProfileCompletionCard
    ├── Saved Items Tab
    │   ├── VehicleCard (grid)
    │   ├── ArticleCard
    │   ├── ComparisonCard
    │   └── VideoCard
    ├── Subscriptions Tab
    │   └── SubscriptionItem
    └── Settings Tab
        └── ConnectedAccount`}</code></pre>
            </div>
          </section>

          <section id="features" className="documentation-section">
            <h2>🚀 Features</h2>
            
            <h3>Profile Banner</h3>
            <div className="documentation-feature-card">
              <ul>
                <li>User avatar image (uploadable)</li>
                <li>Banner background image (uploadable)</li>
                <li>User name display</li>
                <li>Join date</li>
                <li>Location</li>
                <li>Edit profile button (opens modal)</li>
              </ul>
            </div>

            <h3>Vehicle Management</h3>
            <div className="documentation-feature-card">
              <ul>
                <li>Add vehicles via search autocomplete</li>
                <li>Remove vehicles from saved list</li>
                <li>Change ownership status (Own ↔ Want)</li>
                <li>Rate vehicles (1-10 scale)</li>
                <li>View vehicle details</li>
                <li>Separate sections for "Cars I Own" and "Cars I Want"</li>
                <li>Empty state with add button</li>
              </ul>
            </div>

            <h3>Saved Items Management</h3>
            <div className="documentation-feature-card">
              <ul>
                <li>Bookmark/unbookmark articles</li>
                <li>Save/unsave vehicle comparisons</li>
                <li>Bookmark/unbookmark videos</li>
                <li>View saved content in grid layout</li>
                <li>Navigate to full content</li>
              </ul>
            </div>

            <h3>Editable Fields</h3>
            <div className="documentation-feature-card">
              <ul>
                <li>Inline editing with edit/save/cancel</li>
                <li>Real-time validation</li>
                <li>Toast notifications for success/error</li>
                <li>Password field with show/hide toggle</li>
                <li>Auto-save to localStorage</li>
              </ul>
            </div>
          </section>

          <section id="user-flows" className="documentation-section">
            <h2>🔄 User Flows</h2>
            
            <h3>Edit Profile Information</h3>
            <div className="documentation-flow-diagram">
              <div className="documentation-flow-step">User clicks edit icon on editable field</div>
              <div className="documentation-flow-step">Field switches to edit mode</div>
              <div className="documentation-flow-step">User modifies value</div>
              <div className="documentation-flow-step">User clicks Save button</div>
              <div className="documentation-flow-step">Value validated and saved to localStorage</div>
              <div className="documentation-flow-step">Toast notification shows success</div>
              <div className="documentation-flow-step">Field returns to display mode</div>
            </div>

            <h3>Add Vehicle</h3>
            <div className="documentation-flow-diagram">
              <div className="documentation-flow-step">User clicks "Add Vehicle" in empty state</div>
              <div className="documentation-flow-step">VehicleSearch component appears</div>
              <div className="documentation-flow-step">User types vehicle name</div>
              <div className="documentation-flow-step">Autocomplete suggestions appear</div>
              <div className="documentation-flow-step">User selects vehicle</div>
              <div className="documentation-flow-step">Vehicle added to appropriate section (Own/Want)</div>
              <div className="documentation-flow-step">Vehicle card appears in grid</div>
            </div>

            <h3>Change Vehicle Ownership</h3>
            <div className="documentation-flow-diagram">
              <div className="documentation-flow-step">User clicks ownership toggle on vehicle card</div>
              <div className="documentation-flow-step">Ownership status changes</div>
              <div className="documentation-flow-step">Vehicle card moves to appropriate section</div>
              <div className="documentation-flow-step">Data updated in localStorage</div>
            </div>

            <h3>Edit Profile Banner</h3>
            <div className="documentation-flow-diagram">
              <div className="documentation-flow-step">User clicks "Edit Profile" button</div>
              <div className="documentation-flow-step">AvatarBannerModal opens</div>
              <div className="documentation-flow-step">User uploads new avatar or banner</div>
              <div className="documentation-flow-step">Preview displayed</div>
              <div className="documentation-flow-step">User clicks Save</div>
              <div className="documentation-flow-step">Images saved and displayed in banner</div>
            </div>
          </section>

          <section id="design" className="documentation-section">
            <h2>🎨 Design Specifications</h2>
            
            <h3>Layout</h3>
            <ul>
              <li><strong>Max Width</strong> - 1280px container</li>
              <li><strong>Sidebar Width</strong> - Fixed width navigation sidebar</li>
              <li><strong>Main Content</strong> - Flexible width main content area</li>
              <li><strong>Grid Layouts</strong> - Responsive grid for cards (vehicles, articles, etc.)</li>
            </ul>

            <h3>Profile Banner</h3>
            <ul>
              <li>Full-width banner with background image</li>
              <li>Circular avatar overlay</li>
              <li>User info displayed below banner</li>
              <li>Edit button for quick access</li>
            </ul>

            <h3>Section Cards</h3>
            <ul>
              <li>White background cards with shadow</li>
              <li>Border radius: 8px</li>
              <li>Padding: 24px</li>
              <li>Section headers with consistent typography</li>
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
                  <td>Profile Name</td>
                  <td>Heading (Poppins)</td>
                  <td>24px</td>
                  <td>600</td>
                </tr>
                <tr>
                  <td>Section Heading</td>
                  <td>Heading (Poppins)</td>
                  <td>24px</td>
                  <td>600</td>
                </tr>
                <tr>
                  <td>Body Text</td>
                  <td>Body (Geist)</td>
                  <td>14px</td>
                  <td>400</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="implementation" className="documentation-section">
            <h2>💻 Technical Implementation</h2>
            
            <h3>Routing</h3>
            <p>Uses React Router with multiple route patterns:</p>
            <div className="documentation-code-block">
              <pre><code>{`/my-account/profile          → My Account tab
/my-account/saved-items      → Saved Items tab
/my-account/subscriptions    → Subscriptions tab
/my-account/settings         → Settings tab

Legacy routes also supported:
/profile/my-account
/profile/saved-items
/etc.`}</code></pre>
            </div>

            <h3>State Management</h3>
            <ul>
              <li><strong>localStorage</strong> - Persistent storage for user data</li>
              <li><strong>React Context</strong> - RatingContext for vehicle ratings</li>
              <li><strong>Component State</strong> - Local state for UI interactions</li>
            </ul>

            <h3>Data Structure</h3>
            <div className="documentation-code-block">
              <pre><code>{`onboardingData: {
  name: string;
  location: string;
  userType: string;
  vehicles: Array<{
    name: string;
    ownership: 'own' | 'want';
    rating?: number;
  }>;
  newsletters: string[];
  joinDate: string;
  avatar?: string;
  banner?: string;
}`}</code></pre>
            </div>

            <h3>Profile Completion Logic</h3>
            <p>The profile completion card calculates completion based on:</p>
            <ul>
              <li>Name provided (Step 1)</li>
              <li>User type selected (Step 2)</li>
              <li>At least one vehicle added (Step 3)</li>
              <li>Newsletter subscriptions (Step 4)</li>
            </ul>
          </section>

          <section id="api" className="documentation-section">
            <h2>🔌 API Integration</h2>
            
            <h3>Component Usage Example</h3>
            <div className="documentation-code-block">
              <pre><code>{`import { Profile } from './pages/Profile';

function App() {
  return (
    <Profile 
      userData={{
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
        joinDate: '1/14/2024',
        location: 'New York, NY'
      }}
    />
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
                  <td>GET</td>
                  <td><code>/api/user/profile</code></td>
                  <td>Get user profile data</td>
                </tr>
                <tr>
                  <td>PUT</td>
                  <td><code>/api/user/profile</code></td>
                  <td>Update user profile</td>
                </tr>
                <tr>
                  <td>POST</td>
                  <td><code>/api/user/avatar</code></td>
                  <td>Upload avatar image</td>
                </tr>
                <tr>
                  <td>POST</td>
                  <td><code>/api/user/banner</code></td>
                  <td>Upload banner image</td>
                </tr>
                <tr>
                  <td>GET</td>
                  <td><code>/api/user/saved-items</code></td>
                  <td>Get saved items (vehicles, articles, etc.)</td>
                </tr>
                <tr>
                  <td>POST</td>
                  <td><code>/api/user/bookmarks</code></td>
                  <td>Save/bookmark item</td>
                </tr>
                <tr>
                  <td>DELETE</td>
                  <td><code>/api/user/bookmarks/:id</code></td>
                  <td>Remove bookmark</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfileDocumentation;

