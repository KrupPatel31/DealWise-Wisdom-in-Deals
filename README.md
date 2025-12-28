# 🛒 DealWise – Smart Deal Finder

🔗 **Live Demo:** https://dealwisede.netlify.app/

DealWise is a modern **frontend web application** that provides a clean and intuitive interface for exploring, comparing, and managing online deals across different e-commerce platforms.

---

## ✨ Features

- 🔍 **Smart Search UI** – User-friendly product search interface  
- 💰 **Price Comparison UI** – Visually compare deals  
- 🔔 **Deal Alerts UI** – Notification interface for offers  
- 🔐 **Authentication Pages** – Sign In & Sign Up screens  
- 🛍 **Shopping Cart UI** – Save and manage favorite deals  
- 📱 **Responsive Design** – Optimized for desktop and mobile  

---

## 🛠 Tech Stack

### 🎨 Frontend
- ⚛️ **React 18** – Component-based UI development  
- 🟦 **TypeScript** – Type safety and scalability  
- ⚡ **Vite** – Fast build tool and dev server  
- 🎨 **Tailwind CSS** – Utility-first styling  
- 🧩 **Shadcn/UI** – Reusable UI components  
- 🧭 **React Router** – Client-side routing  
- 📦 **React Query** – Data handling structure  
- 📝 **React Hook Form** – Form management  
- ✅ **Zod** – Schema-based validation  

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
├── public/              # Static assets
│   ├── images/          # Image assets
│   └── favicon.jpg      # Site favicon
├── src/
│   ├── components/      # Reusable UI components
│   │   └── ui/          # Shadcn UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── lib/             # Library configurations
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── backend/             # Node.js backend API
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Express middlewares
│   ├── routes/          # API routes
│   ├── utils/           # Backend utilities
│   └── migrations/      # Database migrations
└── README.md            # This file
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with featured deals |
| `/search` | Product search results |
| `/about` | About DealWise |
| `/features` | Platform features |
| `/how-it-works` | How the platform works |
| `/contact` | Contact form |
| `/sign-in` | User login |
| `/sign-up` | User registration |
| `/cart` | Shopping cart |

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Team

- **Jainam Khadalia** - Developer
- **Krup Patel** - Developer  
- **Mayur Boricha** - Developer

## License

This project is private and proprietary.

---
