# Automated Test Scenarios for MotorTrend Onboarding App

This document outlines comprehensive automated test scenarios that can be executed using Chrome DevTools MCP.

## Test Environment Setup

**Base URL:** `http://localhost:5173`

## Test Scenarios

### 1. Navigation & Routing Tests

#### Test 1.1: Home Page Load
- **Objective:** Verify the vehicle inventory page loads correctly
- **Steps:**
  1. Navigate to `http://localhost:5173/`
  2. Wait for page load
  3. Verify page title contains "MotorTrend"
  4. Take screenshot
  5. Check for vehicle cards presence

#### Test 1.2: Sign In Page Navigation
- **Objective:** Verify sign in page loads and displays correctly
- **Steps:**
  1. Navigate to `http://localhost:5173/signin`
  2. Wait for page load
  3. Verify MotorTrend logo is visible
  4. Verify "Sign In" heading is present
  5. Verify social login buttons (Google, Facebook, Apple) are visible
  6. Verify email and password fields are present
  7. Take screenshot

#### Test 1.3: Vehicle Details Page
- **Objective:** Test vehicle details page navigation
- **Steps:**
  1. Navigate to `http://localhost:5173/vehicles/2021/Subaru/WRX`
  2. Wait for page load
  3. Verify vehicle name is displayed
  4. Verify ratings are visible
  5. Verify images are loaded
  6. Take screenshot

#### Test 1.4: Profile Page Navigation
- **Objective:** Test profile page access
- **Steps:**
  1. Navigate to `http://localhost:5173/my-account/profile`
  2. Wait for page load
  3. Verify profile banner is visible
  4. Verify navigation tabs are present
  5. Take screenshot

### 2. Form Interaction Tests

#### Test 2.1: Sign In Form Validation
- **Objective:** Test form validation and interactions
- **Steps:**
  1. Navigate to `/signin`
  2. Click email field
  3. Type invalid email: "test"
  4. Verify validation message (if present)
  5. Clear field
  6. Type valid email: "test@example.com"
  7. Click password field
  8. Type password: "testpassword123"
  9. Toggle password visibility
  10. Verify password is visible/hidden
  11. Take screenshot

#### Test 2.2: Social Login Buttons
- **Objective:** Verify social login buttons are clickable
- **Steps:**
  1. Navigate to `/signin`
  2. Find Google login button
  3. Click Google button
  4. Verify click event (may open popup/modal)
  5. Repeat for Facebook and Apple buttons
  6. Take screenshots

### 3. Onboarding Flow Tests

#### Test 3.1: Complete Onboarding Flow
- **Objective:** Test the complete onboarding process
- **Steps:**
  1. Navigate to `/onboarding/step1`
  2. Verify step 1 content is displayed
  3. Fill required fields (if any)
  4. Click "Next" or "Continue"
  5. Verify navigation to step 2
  6. Repeat for steps 2, 3, and 4
  7. Verify final step completion
  8. Take screenshots at each step

#### Test 3.2: Onboarding Step Navigation
- **Objective:** Test navigation between onboarding steps
- **Steps:**
  1. Navigate to `/onboarding/step1`
  2. Take screenshot
  3. Navigate to `/onboarding/step2`
  4. Verify step 2 content
  5. Take screenshot
  6. Navigate to `/onboarding/step3`
  7. Verify step 3 content
  8. Take screenshot
  9. Navigate to `/onboarding/step4`
  10. Verify step 4 content
  11. Take screenshot

### 4. Vehicle Inventory Tests

#### Test 4.1: Vehicle Card Display
- **Objective:** Verify vehicle cards render correctly
- **Steps:**
  1. Navigate to `/vehicles`
  2. Wait for page load
  3. Find vehicle cards
  4. Verify card images are loaded
  5. Verify card titles are visible
  6. Verify ratings are displayed
  7. Take screenshot

#### Test 4.2: Vehicle Card Interactions
- **Objective:** Test vehicle card click interactions
- **Steps:**
  1. Navigate to `/vehicles`
  2. Find first vehicle card
  3. Click on card
  4. Verify navigation to vehicle details page
  5. Verify correct vehicle information is displayed
  6. Take screenshot

#### Test 4.3: Vehicle Search/Filter
- **Objective:** Test vehicle search functionality (if present)
- **Steps:**
  1. Navigate to `/vehicles`
  2. Find search input field
  3. Type search query: "Subaru"
  4. Wait for results
  5. Verify filtered results
  6. Take screenshot

### 5. Vehicle Details Page Tests

#### Test 5.1: Vehicle Details Content
- **Objective:** Verify all vehicle details are displayed
- **Steps:**
  1. Navigate to `/vehicles/2021/Subaru/WRX`
  2. Verify vehicle name/title
  3. Verify vehicle image
  4. Verify staff rating
  5. Verify community rating
  6. Verify review section
  7. Verify AI insights section
  8. Take screenshot

#### Test 5.2: Rating Interactions
- **Objective:** Test rating modal and interactions
- **Steps:**
  1. Navigate to vehicle details page
  2. Find "Rate" button
  3. Click "Rate" button
  4. Verify rating modal opens
  5. Select a rating value
  6. Submit rating
  7. Verify rating is updated
  8. Take screenshots

#### Test 5.3: Write Review Flow
- **Objective:** Test review submission flow
- **Steps:**
  1. Navigate to vehicle details page
  2. Find "Write Review" button
  3. Click button
  4. Verify review modal opens
  5. Fill review form
  6. Submit review
  7. Verify success message/toast
  8. Take screenshots

### 6. Profile Page Tests

#### Test 6.1: Profile Tabs Navigation
- **Objective:** Test profile tab navigation
- **Steps:**
  1. Navigate to `/my-account/profile`
  2. Click "Saved Items" tab
  3. Verify saved items content
  4. Click "Subscriptions" tab
  5. Verify subscriptions content
  6. Click "Settings" tab
  7. Verify settings content
  8. Take screenshots for each tab

#### Test 6.2: Profile Editing
- **Objective:** Test profile information editing
- **Steps:**
  1. Navigate to `/my-account/profile`
  2. Find editable fields (name, location, etc.)
  3. Click edit button
  4. Update field value
  5. Save changes
  6. Verify changes are saved
  7. Take screenshots

### 7. Responsive Design Tests

#### Test 7.1: Mobile Viewport (375x667)
- **Objective:** Test mobile responsiveness
- **Steps:**
  1. Resize viewport to 375x667 (iPhone SE)
  2. Navigate to `/vehicles`
  3. Verify layout adapts to mobile
  4. Verify navigation menu behavior
  5. Take screenshot
  6. Test on multiple pages

#### Test 7.2: Tablet Viewport (768x1024)
- **Objective:** Test tablet responsiveness
- **Steps:**
  1. Resize viewport to 768x1024 (iPad)
  2. Navigate to `/vehicles`
  3. Verify layout adapts to tablet
  4. Take screenshot
  5. Test on multiple pages

#### Test 7.3: Desktop Viewport (1280x720)
- **Objective:** Test desktop layout
- **Steps:**
  1. Resize viewport to 1280x720
  2. Navigate to `/vehicles`
  3. Verify desktop layout
  4. Verify max-width container (1280px)
  5. Take screenshot

### 8. Performance Tests

#### Test 8.1: Page Load Performance
- **Objective:** Measure page load times
- **Steps:**
  1. Start performance trace
  2. Navigate to `/vehicles`
  3. Wait for page load
  4. Stop performance trace
  5. Analyze performance metrics
  6. Check for slow resources

#### Test 8.2: Network Request Analysis
- **Objective:** Monitor network requests
- **Steps:**
  1. Navigate to `/vehicles`
  2. List all network requests
  3. Verify API calls (if any)
  4. Check for failed requests
  5. Analyze request timing

### 9. Visual Regression Tests

#### Test 9.1: Screenshot Comparison
- **Objective:** Capture baseline screenshots
- **Steps:**
  1. Navigate to each major page
  2. Take full-page screenshots
  3. Save screenshots for comparison
  4. Pages to capture:
     - `/vehicles`
     - `/signin`
     - `/my-account/profile`
     - `/vehicles/2021/Subaru/WRX`
     - `/onboarding/step1`

### 10. Accessibility Tests

#### Test 10.1: Console Error Check
- **Objective:** Check for JavaScript errors
- **Steps:**
  1. Navigate to each page
  2. Get console messages
  3. Filter for errors
  4. Verify no critical errors
  5. Log any warnings

#### Test 10.2: Element Visibility
- **Objective:** Verify important elements are visible
- **Steps:**
  1. Navigate to `/signin`
  2. Verify all form fields are visible
  3. Verify buttons are clickable
  4. Check for hidden elements that should be visible

## Test Execution Commands

### Example: Run Navigation Test
```
Navigate to http://localhost:5173/vehicles
Wait for page load
Take screenshot
Verify vehicle cards are present
```

### Example: Run Form Test
```
Navigate to http://localhost:5173/signin
Fill email field with "test@example.com"
Fill password field with "password123"
Click submit button
Take screenshot
```

### Example: Run Performance Test
```
Start performance trace
Navigate to http://localhost:5173/vehicles
Wait for page load
Stop performance trace
Analyze performance
```

## Test Results Documentation

After running tests, document:
- Screenshots captured
- Performance metrics
- Errors found
- Console messages
- Network requests
- Test pass/fail status


