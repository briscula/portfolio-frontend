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

- [x] 5. Build portfolio pages with real API integration
  - [x] 5.1 Create portfolio list page (/portfolio)
    - Build portfolio cards grid showing all user portfolios
    - Display portfolio name, currency, description, and creation date
    - Implement navigation to individual portfolio details
    - Add loading states and empty state handling
    - _Requirements: 3.1, 3.2, 7.1, 7.2_

  - [x] 5.2 Create portfolio detail page (/portfolio/{id})
    - Build detailed portfolio view with positions table
    - Display portfolio summary metrics (Total Value, Cost, P&L)
    - Show positions table with symbol, company, shares, costs, dividends, portfolio percentage
    - Implement pagination for positions data
    - Add breadcrumb navigation back to portfolio list
    - _Requirements: 3.3, 3.4, 6.1, 6.2, 6.4, 7.3, 7.4_

  - [x] 5.3 Integrate with backend API
    - Connect to /portfolios endpoint for portfolio list
    - Connect to /portfolios/{id}/positions for position data
    - Handle paginated responses with proper pagination controls
    - Map API response data to UI components correctly
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 6. Implement currency and formatting support
  - [x] 6.1 Add dynamic currency support
    - Use portfolio currency information from API
    - Display correct currency symbols (€, $, etc.) based on portfolio
    - Format currency amounts using Intl.NumberFormat with proper locale
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 6.2 Implement consistent percentage formatting
    - Format all percentage values to exactly 2 decimal places
    - Apply consistent formatting in metric cards and tables
    - Add proper +/- indicators for change values
    - _Requirements: 5.4, 6.3_

  - [x] 6.3 Add portfolio percentage visualization
    - Display portfolio allocation percentages for each position
    - Add visual progress bars to show relative position sizes
    - Ensure percentages are properly calculated and displayed
    - _Requirements: 6.4_

- [x] 7. Implement improved loading and error states
  - [x] 7.1 Remove full-page loading spinners
    - Replace full-screen loading with contextual loading indicators
    - Show page layout immediately while data loads
    - Add loading spinners within content areas (tables, cards)
    - _Requirements: 4.1, 4.2_

  - [x] 7.2 Add contextual loading states
    - Implement "Loading portfolios..." in portfolio list
    - Add "Loading positions..." in portfolio detail tables
    - Show "Loading portfolio..." for summary cards
    - _Requirements: 4.3, 4.4_

  - [x] 7.3 Implement error handling UI
    - Add error message display for API failures
    - Show error states without breaking page layout
    - Provide clear error messages for portfolio and position loading failures
    - _Requirements: 8.4_

- [ ] 8. Enhance dashboard with real data integration
  - [ ] 8.1 Update dashboard to use first portfolio data
    - Modify dashboard to automatically select first portfolio
    - Display real metrics from selected portfolio positions
    - Update metric cards to show actual Total Value, Cost, and P&L
    - _Requirements: 6.1, 6.2, 8.1, 8.2_

  - [ ] 8.2 Add portfolio selection to dashboard
    - Allow users to select which portfolio to display on dashboard
    - Add portfolio switcher component to dashboard header
    - Update all dashboard metrics when portfolio changes
    - _Requirements: 7.1, 7.2_

- [ ] 9. Add responsive behavior and mobile optimization
  - [ ] 9.1 Optimize mobile navigation
    - Ensure sidebar navigation works properly on mobile devices
    - Test and refine mobile layout for portfolio cards and tables
    - Add proper touch interactions for mobile users
    - _Requirements: 2.3_

  - [ ] 9.2 Improve table responsiveness
    - Make portfolio positions table scroll horizontally on mobile
    - Optimize column widths and content for smaller screens
    - Ensure pagination controls work well on mobile
    - _Requirements: 3.3, 3.4_

  - [ ] 9.3 Test and refine cross-device experience
    - Test application on various screen sizes and devices
    - Ensure consistent functionality across desktop, tablet, and mobile
    - Optimize loading states and interactions for different devices
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 10. Implement dividends section
  - [x] 10.1 Create dividends navigation and main page
    - Add Dividends section to sidebar navigation with appropriate icon
    - Create main dividends page showing portfolio selection and overview
    - Display quick stats and upcoming dividends across all portfolios
    - _Requirements: 3.1, 3.2_

  - [x] 10.2 Build portfolio-specific dividends page
    - Create detailed dividends view for individual portfolios
    - Display dividend metrics (total received, yield, monthly estimate)
    - Show dividend-focused holdings table with yield calculations
    - Add breadcrumb navigation between dividends views
    - _Requirements: 3.3, 3.4, 6.1, 6.2, 6.4_

  - [x] 10.3 Integrate monthly dividend chart
    - Add dividend chart component to portfolio dividends page
    - Connect to /portfolios/{id}/dividends/monthly API endpoint
    - Display historical dividend payments by month across multiple years
    - _Requirements: 6.3, 8.1, 8.2, 8.3_

- [x] 11. Implement smart routing and locale detection
  - [x] 11.1 Set up automatic locale detection
    - Detect browser language preference on first visit
    - Redirect root URL to appropriate locale dashboard (en/es)
    - Remove redundant locale landing pages
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 11.2 Streamline navigation flow
    - Redirect locale roots (/en, /es) directly to dashboard
    - Ensure all navigation links use proper locale prefixes
    - Maintain consistent routing patterns across the application
    - _Requirements: 9.1, 9.2, 9.3_

- [ ] 12. Future internationalization enhancements
  - [ ] 12.1 Add language switching functionality
    - Create language switcher component in header
    - Allow users to manually change language preference
    - Store language preference in user settings or localStorage
    - _Requirements: 9.4_

  - [ ] 12.2 Enhance locale detection
    - Add more sophisticated language detection logic
    - Support additional languages beyond English and Spanish
    - Implement fallback strategies for unsupported locales
    - _Requirements: 9.1, 9.4_

- [ ] 13. Advanced portfolio features
  - [ ] 13.1 Add portfolio management features
    - Create forms for adding new portfolios
    - Implement portfolio editing and deletion
    - Add portfolio settings and configuration options
    - _Requirements: 7.1, 7.2_

  - [ ] 13.2 Enhance position management
    - Add functionality to add/edit/remove positions
    - Implement stock search and selection
    - Add transaction history and dividend tracking
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 13.3 Add advanced analytics
    - Create performance charts and graphs
    - Add dividend calendar and projections
    - Implement portfolio comparison features
    - _Requirements: 6.1, 6.2, 6.3, 6.4_