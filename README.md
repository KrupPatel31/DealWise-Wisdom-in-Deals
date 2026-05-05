<h1 align="center"> DealWise - Wisdom in Deals </h1>

<p align="center"> Master the Art of Smart Shopping with Real-time Price Intelligence, Visual Discovery, and Gamified Savings Ecosystems. </p>

<p align="center">
  <img alt="Build" src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge">
  <img alt="Issues" src="https://img.shields.io/badge/Issues-0%20Open-blue?style=for-the-badge">
  <img alt="Contributions" src="https://img.shields.io/badge/Contributions-Welcome-orange?style=for-the-badge">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>
<!-- 
  **Note:** These are static placeholder badges. Replace them with your project's actual badges.
  You can generate your own at https://shields.io
-->

## 📌 Table of Contents

- [🚀 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack \& Architecture](#-tech-stack--architecture)
- [📁 Project Structure](#-project-structure)
- [🔐 Environment Variables](#-environment-variables)
- [🚀 Getting Started](#-getting-started)
- [🔧 Usage](#-usage)
- [🤝 Contributing](#-contributing)
- [🌐 Live Demo](#-live-demo)
- [📝 License](#-license)

---

## 🚀 Overview

**DealWise** is a comprehensive, data-driven deal discovery and shopping intelligence platform designed to empower users with the "wisdom" to make informed purchasing decisions. By aggregating real-time price history, providing visual search capabilities, and integrating a gamified loyalty system, DealWise transforms the traditionally chaotic experience of online shopping into a structured, rewarding, and transparent journey.

> In today’s volatile e-commerce landscape, consumers struggle with artificial price inflation, fleeting discounts, and the overwhelming effort required to compare products across multiple platforms. Shoppers often miss out on genuine value because they lack historical context for pricing or find the manual search process too cumbersome to be effective.

DealWise solves these challenges by providing a centralized hub where transparency is the priority. Through **Price History Tracking**, users can verify if a "deal" is truly a discount or just marketing hype. With **Visual and Barcode Search**, the friction of manual data entry is removed. Finally, the **DealCoins** ecosystem incentivizes engagement, turning every smart purchase and community interaction into tangible value.

### 🏗️ Architecture Overview

The platform is built on a modern **Component-based Architecture** utilizing **React** for a highly responsive user experience. The frontend is powered by **Vite** for lightning-fast build cycles and HMR (Hot Module Replacement). Data management and backend logic are handled via a robust **Supabase** integration, utilizing PostgreSQL for structured data, Supabase Auth for secure identity management, and Edge Functions for heavy-lifting tasks like visual processing and barcode lookups.

---

## ✨ Key Features

### 💰 Gamified Savings: DealCoins Ecosystem

Transform your shopping habits into a rewarding game. DealWise introduces a native loyalty currency, **DealCoins**, managed through a sophisticated custom hook (`useDealCoins.tsx`) and backend Edge Functions (`earn-coins`).

- **Earn as You Shop:** Automatically accumulate coins based on a verified `COIN_EARN_RATE`.
- **Engagement Rewards:** Gain coins for verifying deals, sharing insights, or completing checkouts.
- **Visual Progress:** Track your balance in real-time with the `DealCoinsDisplay.tsx` component.

### 📈 Price Transparency: History & Comparison

Never overpay again. DealWise provides the historical context necessary to judge the quality of a discount.

- **Price History Charts:** Visualized via **Recharts**, the `PriceHistoryChart.tsx` component shows fluctuations over time, helping users predict the best time to buy.
- **Side-by-Side Comparison:** Use the `ComparePrices.tsx` page to evaluate similar products and determine which offers the best "Wisdom-per-Dollar" ratio.

### 🔍 Advanced Discovery: Visual & Barcode Search

Search the way you live. DealWise leverages specialized Supabase Edge Functions for modern search paradigms.

- **Visual Search:** Upload or snap a photo to find products via the `visual-search` backend function.
- **Barcode Scanner:** Use the `BarcodeScanner.tsx` interface and the `barcode-lookup` function to instantly pull product details while in physical stores, bridging the gap between offline and online commerce.

### 🛒 Seamless Commerce Engine

A streamlined path from discovery to ownership.

- **Cart Management:** A persistent, context-aware cart (`CartContext.tsx`) that handles complex interactions and inventory checks.
- **Secure Checkout:** A multi-step checkout process (`Checkout.tsx`) integrated with bill generation logic (`billGenerator.ts`) to provide instant transaction transparency.
- **Order Tracking:** Maintain a comprehensive history of all your "wise" purchases via the `Orders.tsx` dashboard.

### 🛡️ Secure User Environment

Built with security and privacy as core pillars.

- **Advanced Authentication:** Powered by Supabase Auth, supporting everything from standard sign-ups to password recovery (`ForgotPassword.tsx`).
- **Profile Customization:** Comprehensive user profiles (`useProfile.tsx`) that store preferences and activity history.
- **Validation Layers:** Robust client-side validation using **Zod** and specialized password validation utilities.

---

## 🛠️ Tech Stack & Architecture

DealWise utilizes a cutting-edge tech stack selected for performance, type safety, and scalability.

| Technology         | Purpose              | Why it was Chosen                                                                                   |
| :----------------- | :------------------- | :-------------------------------------------------------------------------------------------------- |
| **React**          | Frontend Framework   | Enables a reactive, component-based UI that handles complex state updates efficiently.              |
| **TypeScript**     | Primary Language     | Provides static typing to ensure code reliability and reduce runtime errors across the application. |
| **Vite**           | Build Tool           | Offers significantly faster development starts and build times compared to traditional bundlers.    |
| **Supabase**       | Backend-as-a-Service | Simplifies Auth, Database management, and Edge Function deployment with a unified API.              |
| **Tailwind CSS**   | Styling              | Allows for rapid UI development with a utility-first approach, ensuring a consistent design system. |
| **Framer Motion**  | Animations           | Delivers high-performance, fluid page transitions and interactive UI elements.                      |
| **Lucide React**   | Iconography          | Provides a lightweight, customizable, and consistent set of icons.                                  |
| **TanStack Query** | Data Fetching        | Optimizes server-state management with built-in caching, synchronizing, and background updating.    |
| **Recharts**       | Data Visualization   | A composable charting library that perfectly handles the price history visualization.               |

---

## 📁 Project Structure

```
DealWise/
├── 📁 public/                    # Static assets
│   ├── 📄 favicon.jpg            # Application icon
│   └── 📁 images/                # UI images and team assets
│       ├── 📄 coin-front.jpg     # DealCoin assets
│       └── 📁 team/              # Team member photography
├── 📁 supabase/                  # Backend configuration
│   ├── 📄 config.toml            # Supabase local config
│   ├── 📁 functions/             # Edge Functions (TypeScript)
│   │   ├── 📁 visual-search/     # Image recognition logic
│   │   ├── 📁 barcode-lookup/    # Barcode scanning API
│   │   └── 📁 earn-coins/        # Gamification logic
│   └── 📁 migrations/            # SQL database schema versions
├── 📁 src/                       # Application source code
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 ui/                # Shadcn UI primitives (buttons, cards, etc.)
│   │   ├── 📄 PriceHistoryChart.tsx # Recharts implementation
│   │   └── 📄 DealCard.tsx       # Standardized product display
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── 📄 useDealCoins.tsx   # Coin logic management
│   │   └── 📄 useCart.tsx        # Cart state orchestration
│   ├── 📁 pages/                 # Full-page view components
│   │   ├── 📄 BarcodeScanner.tsx # Scanning interface
│   │   └── 📄 ComparePrices.tsx  # Comparison engine
│   ├── 📁 integrations/          # External service clients
│   │   └── 📁 supabase/          # Generated types and client config
│   ├── 📁 utils/                 # Pure utility functions
│   │   ├── 📄 billGenerator.ts   # Invoice generation
│   │   └── 📄 passwordValidation.ts # Auth security rules
│   ├── 📄 App.tsx                # Main routing and provider setup
│   └── 📄 main.tsx               # Application entry point
├── 📄 tailwind.config.ts         # Design system configuration
├── 📄 tsconfig.json              # TypeScript compiler settings
└── 📄 vite.config.ts             # Vite build orchestration
```

---

## 🔐 Environment Variables

To run DealWise, you need to configure the following environment variables in a `.env` file at the root of your project:

| Variable                        | Description                                                     |
| :------------------------------ | :-------------------------------------------------------------- |
| `SUPABASE_URL`                  | Your Supabase project URL for database and auth access.         |
| `SUPABASE_PUBLISHABLE_KEY`      | Public API key for making client-side requests to Supabase.     |
| `VITE_SUPABASE_URL`             | Vite-prefixed URL for frontend environment availability.        |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Vite-prefixed key for secure frontend-to-backend communication. |
| `VITE_SUPABASE_PROJECT_ID`      | The unique identifier for your Supabase project instance.       |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** Ensure you have the latest LTS version installed.
- **Package Manager:** This project uses `npm` (compatible with `bun`).
- **Supabase Account:** Required for database and edge function hosting.

### Installation

1.  Clone the repository to your local machine:

    ```bash
    git clone https://github.com/KrupPatel31/DealWise-Wisdom-in-Deals.git
    cd DealWise-Wisdom-in-Deals
    ```

### Installing Dependencies

This project uses Bun as its package manager.

1.  Install the project dependencies:

    ```bash
    npm install
    ```

### Setting up Environment Variables

1.  Create a `.env` file in the root directory of the project.
2.  Populate the `.env` file with your specific environment variables. Refer to `.env.example` (if available) for required variables.

### Running the Application

1.  Start the development server:

    ```bash
    npm run dev
    ```

This will start the application, and you can access it in your browser, typically at `http://localhost:8080` (the port might vary).

### Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles the project into a production-ready bundle.
- `npm run lint`: Performs static code analysis to ensure quality.
- `npm run preview`: Locally previews the production build.

---

## 🔧 Usage

### Discovering Deals

Navigate to the **Featured Deals** section on the homepage to see curated items. Click on any `DealCard` to view detailed insights, including price history and similar item comparisons.

### Using Visual Search

1. Click on the Search icon in the `Header.tsx`.
2. Select the "Visual Search" option.
3. Upload an image of a product.
4. The system triggers the `visual-search` Edge Function to return the most accurate product matches.

### Earning DealCoins

As you interact with the platform, your coin balance will update. You can view your current status via the `DealCoinsDisplay` in your profile navigation. These coins are automatically calculated and applied during the `Checkout` process if applicable.

---

## 🤝 Contributing

We welcome contributions to improve DealWise! Your input helps make this project better for everyone.

### How to Contribute

1. **Fork the repository** - Click the 'Fork' button at the top right of this page.
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** - Improve code, documentation, or features.
4. **Test thoroughly** - Ensure all functionality works as expected.
   ```bash
   npm run lint
   # Ensure no errors are returned
   ```
5. **Commit your changes** - Write clear, descriptive commit messages.
   ```bash
   git commit -m 'Add: Amazing new feature that does X'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** - Submit your changes for review.

### Ideas for Contributions

- 🐛 **Bug Fixes:** Help us squash bugs in the `barcode-lookup` logic.
- ✨ **New Features:** Implement advanced filters for the `PriceHistoryChart`.
- 📖 **Documentation:** Enhance this README or create user guides.
- ⚡ **Performance:** Optimize the `useCart` hook for faster state transitions.

---

## 🌐 Live Demo

[https://www.dealwise.in/](https://www.dealwise.in/)

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### What this means:

- ✅ **Commercial use:** You can use this project commercially.
- ✅ **Modification:** You can modify the code.
- ✅ **Distribution:** You can distribute this software.
- ✅ **Private use:** You can use this project privately.
- ⚠️ **Liability:** The software is provided "as is", without warranty.
- ⚠️ **Trademark:** This license does not grant trademark rights.

---

<p align="center">Made with ❤️ by the DealWise Team</p>
