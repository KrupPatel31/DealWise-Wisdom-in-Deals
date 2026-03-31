<h1 align="center"> 🛍️ DealWise: Wisdom in Deals </h1>

<p align="center">
  <b>An intelligent, full-stack shopping companion transforming the deal-hunting experience through visual intelligence, real-time comparisons, and rewarding loyalty ecosystems.</b>
</p>

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

---

## 📑 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Project Structure](#-project-structure)
- [Demo & Screenshots](#-demo--screenshots)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

### Hook
**DealWise** is a sophisticated e-commerce intelligence platform that empowers consumers to make informed purchasing decisions by centralizing deal discovery, price history analysis, and advanced product search into a single, seamless React-based application.

### The Problem
> Modern shoppers are overwhelmed by fragmented marketplaces, fluctuating price points, and the manual labor required to find genuine value. Comparing prices across platforms often requires multiple tabs, hours of research, and a lack of transparency regarding historical pricing. Furthermore, traditional loyalty programs are often disconnected from the actual discovery process, leading to missed savings and a disjointed user journey.

### The Solution
DealWise bridges the gap between intent and purchase by providing a data-driven interface for "Wisdom in Deals." By leveraging **Supabase Edge Functions** for visual search and barcode lookup, users can instantly identify products in the physical world and compare them against digital marketplace prices. The platform integrates a comprehensive **DealCoins** system to reward engagement, alongside interactive price charts that ensure users never buy at the peak of a price cycle. Built on a modern **Vite + React** architecture, it delivers a high-performance, mobile-responsive experience for the modern savvy shopper.

### Architecture Overview
The system follows a **Component-Based Architecture** utilizing React for the frontend and **Supabase** as a Backend-as-a-Service (BaaS). The logic is distributed between client-side React hooks (for state management of carts, auth, and coins) and serverless Supabase Edge Functions (for heavy computational tasks like barcode lookup and order validation).

---

## ✨ Key Features

DealWise is designed with the user at the center, ensuring every technical capability translates into a tangible shopping benefit.

### 🔍 Advanced Product Discovery
*   **Intelligent Search:** Utilize the `ProductSearchService` to browse a massive catalog of items with real-time filtering and category-based navigation.
*   **Visual Search:** (📷) Upload or capture images to find identical or similar products using advanced visual recognition logic hosted via Supabase Edge Functions.
*   **Barcode Lookup:** (🏷️) Instantly retrieve product specifications and pricing by scanning standard barcodes, effectively bridging offline browsing with online saving.

### 📊 Financial Intelligence
*   **Price Comparison Engine:** View prices from multiple sources side-by-side to ensure you are getting the absolute best deal available.
*   **Interactive Price History:** (📈) Leverage `Recharts`-powered visualizations in the `PriceHistoryChart` component to track trends and predict the best time to buy.
*   **Coupon Management:** Access a dedicated repository of active coupons to stack savings during the checkout process.

### 🪙 Rewarding Ecosystem (DealCoins)
*   **Earn While You Shop:** A integrated loyalty system where users earn "DealCoins" through engagement and validated purchases.
*   **Gamified Experience:** Track coin balances in real-time via the `DealCoinsDisplay` component and use them to unlock exclusive benefits.
*   **Secure Validation:** All coin transactions and order validations are handled by secure server-side logic (`validate-order` and `earn-coins` functions).

### 🛒 Seamless Commerce Flow
*   **Comprehensive Cart Management:** Manage your selections with the `useCart` hook, providing persistent state and easy adjustments.
*   **Professional Bill Generation:** Automatically generate itemized receipts and bills using the internal `billGenerator` utility.
*   **Secure Checkout:** A structured checkout pipeline that moves from cart validation to final order confirmation with polished UI feedback.

---

## 🛠️ Tech Stack & Architecture

The project utilizes a cutting-edge tech stack designed for scalability, type safety, and exceptional user experience.

| Technology | Purpose | Why it was Chosen |
| :--- | :--- | :--- |
| **React 18** | Frontend Library | Enables a reactive, component-based UI for high-performance user interactions. |
| **TypeScript** | Primary Language | Ensures end-to-end type safety and reduces runtime errors across complex data models. |
| **Vite** | Build Tool | Provides lightning-fast HMR (Hot Module Replacement) and optimized production builds. |
| **Supabase** | Backend/Auth/DB | Offers a robust PostgreSQL database, real-time subscriptions, and secure Edge Functions. |
| **Tailwind CSS** | Styling | Allows for rapid, utility-first UI development with a consistent design system. |
| **Radix UI** | Accessible UI | Provides the unstyled, accessible foundation for complex components like dropdowns and sheets. |
| **Framer Motion** | Animation | Delivers smooth page transitions and interactive micro-animations for a premium feel. |
| **TanStack Query** | Data Fetching | Manages asynchronous state, caching, and synchronization with the Supabase backend. |

---

## 📁 Project Structure

```
KrupPatel31-DealWise/
├── 📁 supabase/                   # Backend services and migrations
│   ├── 📁 functions/              # Supabase Edge Functions (Serverless logic)
│   │   ├── 📁 search-products/    # Product search aggregation
│   │   ├── 📁 earn-coins/         # Loyalty reward logic
│   │   ├── 📁 validate-order/     # Purchase verification
│   │   ├── 📁 visual-search/      # Image-based search logic
│   │   └── 📁 barcode-lookup/     # Barcode scanning API
│   └── 📁 migrations/             # SQL database schema evolutions
├── 📁 src/                        # Main application source code
│   ├── 📁 components/             # Reusable UI components
│   │   ├── 📁 ui/                 # Atomic Shadcn/UI components
│   │   ├── 📄 DealCard.tsx        # Individual deal display logic
│   │   ├── 📄 PriceHistoryChart.tsx # Recharts implementation
│   │   └── 📄 ProductSearchBar.tsx # Intelligent search input
│   ├── 📁 pages/                  # Top-level application routes
│   │   ├── 📄 ComparePrices.tsx   # Price comparison dashboard
│   │   ├── 📄 DealCoins.tsx       # Rewards management page
│   │   ├── 📄 VisualSearch.tsx    # Camera/Image search interface
│   │   └── 📄 Checkout.tsx        # Transaction processing
│   ├── 📁 hooks/                  # Custom React hooks (Auth, Cart, Profile)
│   ├── 📁 integrations/           # Supabase client and generated types
│   ├── 📁 utils/                  # Business logic (Bill generation, search services)
│   ├── 📄 App.tsx                 # Main application router
│   └── 📄 main.tsx                # Application entry point
├── 📁 public/                     # Static assets and icons
├── 📄 tailwind.config.ts          # Styling configuration
├── 📄 tsconfig.json               # TypeScript configuration
└── 📄 vite.config.ts              # Vite build and plugin configuration
```

---

## 🔐 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file. These connect your frontend to the Supabase backend services.

| Variable | Description |
| :--- | :--- |
| `VITE_SUPABASE_URL` | The unique API URL for your Supabase project instance. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | The public 'anon' key used to interact with your Supabase database. |
| `VITE_SUPABASE_PROJECT_ID` | The internal ID for your Supabase project (used for service identification). |

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js:** Latest LTS version recommended.
*   **Package Manager:** `npm` (Project uses standard npm scripts).
*   **Supabase Account:** Required to host the database and Edge Functions.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/KrupPatel31/DealWise-Wisdom-in-Deals.git
    cd DealWise-Wisdom-in-Deals
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and populate it with your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_public_anon_key
    VITE_SUPABASE_PROJECT_ID=your_project_id
    ```

4.  **Launch Development Server**
    ```bash
    npm run dev
    ```

---

## 🔧 Usage

### Searching for Products
Navigate to the **Search** page or use the `ProductSearchBar` in the header. The system uses the `ProductSearchService` to query available deals across categories.

### Using Visual Search
On mobile or desktop with a camera, visit the **Visual Search** page. Upload a photo of a product to trigger the `visual-search` Edge Function, which will attempt to match the item with existing deals.

### Tracking Rewards
Every purchase validated via the **Checkout** flow triggers the `earn-coins` logic. You can view your current balance on the **DealCoins** page, managed by the `useDealCoins` hook.

### Building for Production
To generate a highly optimized production build:
```bash
npm run build
```
The output will be located in the `dist/` directory, ready for deployment on platforms like Vercel, Netlify, or Supabase Hosting.

---

## 🤝 Contributing

We welcome contributions to improve DealWise! Whether it's a bug fix, a new feature, or documentation improvements, your input is valuable.

### How to Contribute

1. **Fork the repository** - Click the 'Fork' button at the top right of this page.
2. **Create a feature branch** 
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** - Ensure your code follows the established TypeScript patterns.
4. **Test thoroughly** - Verify that your changes don't break existing checkout or search flows.
   ```bash
   npm run lint
   ```
5. **Commit your changes** - Use clear, descriptive commit messages.
   ```bash
   git commit -m 'Add: Integration for new price comparison source'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** - Provide a detailed description of your changes.

### Development Guidelines
- ✅ Follow the existing directory structure (e.g., place UI components in `components/ui`).
- 📝 Document new utility functions in `utils/`.
- 🧪 Ensure all new components are mobile-responsive using Tailwind breakpoints.

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### What this means:
*   ✅ **Commercial use:** You can use this project commercially.
*   ✅ **Modification:** You can modify the code as you see fit.
*   ✅ **Distribution:** You can distribute this software to others.
*   ⚠️ **Liability:** The software is provided "as is", without warranty of any kind.

---

<p align="center">Made with ❤️ by the DealWise Team</p>
<p align="center">
  <a href="#">⬆️ Back to Top</a>
</p>
