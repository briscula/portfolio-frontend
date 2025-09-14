# Implementation Plan

- [x] 1. Set up design system foundation
  - Create design tokens file with color palette, typography, and spacing constants
  - Update global CSS with consistent base styles
  - Create utility classes for common design patterns
  - _Requirements: 1.1, 1.2_

- [x] 2. Create base layout components
  - [x] 2.1 Build Header component with search and user menu
    - Implement header layout with search bar and user avatar
    - Add responsive behavior for mobile screens
    - Integrate Auth0 user state for avatar and menu
    - _Requirements: 1.1, 2.1, 5.3_

  - [x] 2.2 Build Sidebar navigation component
    - Create sidebar with navigation sections (Dashboard, Portfolio, Analytics, Settings)
    - Implement active state highlighting and hover effects
    - Add responsive collapse behavior for mobile
    - _Requirements: 2.1, 2.2, 5.1, 5.3_

  - [x] 2.3 Create main layout wrapper
    - Build layout component that combines header, sidebar, and main content
    - Implement responsive grid system for different screen sizes
    - Add proper spacing and background styling
    - _Requirements: 1.1, 5.1, 5.2, 5.3_

- [x] 3. Build reusable UI components
  - [x] 3.1 Create Card component
    - Build flexible card component with padding and shadow options
    - Add TypeScript interfaces for props
    - Create variants for different use cases
    - _Requirements: 1.1, 1.2, 6.2_

  - [x] 3.2 Create Button component
    - Implement primary, secondary, and ghost button variants
    - Add loading states and disabled states
    - Include proper hover and focus styling
    - _Requirements: 1.2, 4.4_

  - [x] 3.3 Create Input and Form components
    - Build text input with consistent styling and focus states
    - Create search input with magnifying glass icon
    - Implement form field wrapper with label and error handling
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 3.4 Create List and ListItem components
    - Build list container with proper spacing
    - Create list item component with primary/secondary text and actions
    - Add status indicators and icon support
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 4. Implement dashboard page
  - [x] 4.1 Create metric cards component
    - Build metric card showing title, value, and change indicator
    - Add icons and proper typography hierarchy
    - Implement responsive grid layout for cards
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 4.2 Build recent activity section
    - Create activity list component with clean styling
    - Add proper date formatting and activity type indicators
    - Implement empty state for when no activity exists
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 4.3 Create upcoming dividends section
    - Build dividend event cards with date prominence
    - Add company information and dividend amounts
    - Implement responsive layout for different screen sizes
    - _Requirements: 3.1, 3.2, 5.1, 5.2, 5.3_

- [ ] 5. Build portfolio page
  - [ ] 5.1 Create portfolio holdings table
    - Build table component with clean styling and hover effects
    - Add columns for symbol, company, shares, value, dividend info
    - Implement sorting functionality for table columns
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 5.2 Add portfolio search and filters
    - Create search input for filtering holdings
    - Add filter dropdowns for different criteria
    - Implement real-time filtering of portfolio data
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 5.3 Create add stock functionality
    - Build modal or form for adding new stocks to portfolio
    - Implement stock symbol search with API integration
    - Add form validation and success/error states
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 6. Implement responsive behavior
  - [ ] 6.1 Add mobile navigation
    - Create hamburger menu for mobile sidebar toggle
    - Implement overlay and slide-in animation for mobile sidebar
    - Add proper touch interactions and gestures
    - _Requirements: 2.3, 5.3_

  - [ ] 6.2 Optimize tablet layouts
    - Adjust grid layouts for tablet breakpoints
    - Modify navigation and content spacing for medium screens
    - Test and refine component behavior on tablets
    - _Requirements: 5.2_

  - [ ] 6.3 Refine desktop experience
    - Optimize layouts for large screens
    - Add hover states and desktop-specific interactions
    - Ensure proper keyboard navigation support
    - _Requirements: 5.1_

- [ ] 7. Add loading and error states
  - [ ] 7.1 Create loading components
    - Build skeleton loaders for data-heavy components
    - Create spinner component for actions and form submissions
    - Add loading states to all API-dependent components
    - _Requirements: 1.1, 1.2_

  - [ ] 7.2 Implement error handling UI
    - Create error boundary components for graceful error handling
    - Build error message components with consistent styling
    - Add retry mechanisms for failed API calls
    - _Requirements: 1.1, 1.2_

  - [ ] 7.3 Add empty states
    - Create empty state components with helpful messaging
    - Add call-to-action buttons to guide users
    - Implement empty states for portfolio, activity, and other data lists
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 8. Update existing pages with new design
  - [ ] 8.1 Migrate login page to new design system
    - Update login page styling to match new design
    - Ensure Auth0 integration continues to work properly
    - Add proper loading and error states for authentication
    - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3, 4.4_

  - [ ] 8.2 Update root layout and global styles
    - Apply new design system to root layout component
    - Update global CSS with new color scheme and typography
    - Ensure consistent styling across all pages
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 9. Polish and accessibility
  - [ ] 9.1 Add keyboard navigation support
    - Implement proper tab order for all interactive elements
    - Add keyboard shortcuts for common actions
    - Ensure all components are accessible via keyboard
    - _Requirements: 2.2, 4.3_

  - [ ] 9.2 Improve focus management
    - Add visible focus indicators for all interactive elements
    - Implement proper focus trapping in modals and dropdowns
    - Ensure focus returns to appropriate elements after interactions
    - _Requirements: 1.2, 2.2, 4.3_

  - [ ] 9.3 Add ARIA labels and screen reader support
    - Add appropriate ARIA labels to all components
    - Implement screen reader announcements for dynamic content
    - Test with screen readers and fix accessibility issues
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 6.1_