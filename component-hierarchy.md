# Component Hierarchy

This document outlines the high-level component structure of the DealWise application.

## Layout Components

- `RootLayout`: The main layout for the entire application. It includes the header, footer, and a main content area where pages are rendered.
- `AuthLayout`: A specific layout for authentication pages like Login and Sign Up. It might have a simpler structure without the main navigation.

## Page Components

Located in `src/pages/`, these are the top-level components for each route.

- `HomePage`: The main landing page.
- `DealsPage`: Displays a list or grid of deals.
  - `DealCard`: Individual deal item.
  - `FilterSidebar`: For filtering and sorting deals.
- `DealDetailPage`: Shows the details for a single deal.
- `LoginPage`: User login form.
- `SignUpPage`: User registration form.
- `ProfilePage`: User's profile and settings.

## Shared Components

Located in `src/components/ui/` (from Shadcn) and `src/components/shared/`. These are reusable across the application.
