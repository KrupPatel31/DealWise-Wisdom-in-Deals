# DealWise - Smart Deal Finder

A modern web application that helps users find the best deals across multiple e-commerce platforms.

## Features

- **Smart Search**: Search for products across Amazon, Flipkart, and other platforms
- **Price Comparison**: Compare prices from multiple retailers
- **Deal Alerts**: Get notified about price drops and special offers
- **User Authentication**: Secure login and signup system
- **Shopping Cart**: Save and manage your favorite deals
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Component library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (for backend)

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

### Backend Setup

See [backend/README.md](./backend/README.md) for detailed backend setup instructions.

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

Built with ❤️ using [Lovable](https://lovable.dev)
