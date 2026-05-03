# DealWise - Complete Technical Documentation

**Version:** 1.0.0  
**Last Updated:** April 2026  
**Platform:** React + Vite + TypeScript + Supabase

---

## Table of Contents

1. [Project Summary](#1-project-summary)
2. [Complete Feature List](#2-complete-feature-list)
3. [Full Page Structure](#3-full-page-structure)
4. [Component Structure](#4-component-structure)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Database Design](#7-database-design)
8. [API Structure](#8-api-structure)
9. [User Roles and Permissions](#9-user-roles-and-permissions)
10. [UI/UX Design System](#10-uiux-design-system)
11. [Security System](#11-security-system)
12. [Performance Optimization](#12-performance-optimization)
13. [Data Flow Explanation](#13-data-flow-explanation)
14. [Project File Structure](#14-project-file-structure)
15. [Deployment System](#15-deployment-system)
16. [Future Improvements](#16-future-improvements)
17. [Complete System Architecture](#17-complete-system-architecture)

---

## 1. Project Summary

### 1.1 Main Purpose

**DealWise** is a comprehensive price comparison and deal discovery platform designed to help Indian consumers find the best prices for products across multiple e-commerce stores. The platform aggregates pricing data, provides visual search capabilities, and rewards users for their engagement through a gamified loyalty system.

### 1.2 Problem Statement

Online shoppers face several challenges:
- **Price Opacity:** Same products have vastly different prices across Amazon, Flipkart, Croma, etc.
- **Coupon Discovery:** Finding valid, working coupon codes is time-consuming
- **No Reward for Loyalty:** Traditional shopping doesn't incentivize users to stay engaged
- **Visual Product Search:** Users often want to find products by image, not text

DealWise solves all these problems in a single, unified platform.

### 1.3 Target Users

| User Type | Description |
|-----------|-------------|
| **Shoppers** | Price-conscious consumers looking for best deals |
| **Deal Hunters** | Users who actively seek discounts and coupons |
| **Tech-Savvy Users** | Users who want advanced features like visual search and barcode scanning |
| **Loyalty Seekers** | Users who want rewards for their shopping activities |

### 1.4 Platform Type

DealWise is a **Consumer-Facing Price Comparison Platform** with:
- **B2C Focus:** Direct-to-consumer service
- **Aggregation Model:** Pulls data from multiple sources
- **Gamification Layer:** Deal Coins reward system
- **AI Integration:** Visual search powered by Gemini AI

### 1.5 Core Concept

```
┌───────────────────────────────────────────────────────────┐
│                       USER JOURNEY                        │
├───────────────────────────────────────────────────────────┤
│  DISCOVER → COMPARE → SAVE → CHECKOUT → EARN REWARDS      │
│     │          │        │        │           │            │
│  Search    Multiple   Coupons  Secure    Deal Coins       │
│  Visual    Stores     Codes    Cart      2% Cashback      │
│  Barcode   EMI Info   Deals    Invoice   Daily Login      │
└───────────────────────────────────────────────────────────┘
```

---

## 2. Complete Feature List

### 2.1 Authentication System

| Feature | Description | Users | How It Works |
|---------|-------------|-------|--------------|
| **Email Sign Up** | Register with email/password | All visitors | Supabase Auth with email verification |
| **Email Sign In** | Login with credentials | Registered users | JWT-based session management |
| **Password Reset** | Forgot password recovery | Registered users | Edge Function generates secure password, sends via Resend |
| **Change Password** | Update existing password | Authenticated users | Supabase `updateUser` API |
| **Session Persistence** | Stay logged in | All users | LocalStorage + auto-refresh tokens |

**Internal Components:**
- `useAuth.tsx` - Authentication context provider
- `SignIn.tsx`, `SignUp.tsx` - Auth pages
- `reset-password` Edge Function - Secure password reset

**Security Features:**
- Email verification required before sign-in
- Rate-limited password reset (3 attempts/hour/email)
- Secure 8-character generated passwords (uppercase, lowercase, number, special char)
- No email enumeration (silent failures for existing accounts)

---

### 2.2 Product Search System

| Feature | Description | Components |
|---------|-------------|------------|
| **Text Search** | Keyword-based product search | `ProductSearchBar.tsx`, `search-products` Edge Function |
| **Visual Search** | AI-powered image search | `VisualSearch.tsx`, `visual-search` Edge Function |
| **Barcode Scan** | Camera-based barcode lookup | `BarcodeScanner.tsx`, `barcode-lookup` Edge Function |
| **Category Filters** | Filter by product category | Search page filtering logic |
| **Sort Options** | Sort by price, discount, rating | Client-side sorting |

**Visual Search Flow:**
```
User uploads image → Base64 encoding → Gemini 2.5 Flash AI → 
Product metadata extraction → RapidAPI product search → 
Results with similarity scores → Display ranked products
```

**Search Sources:**
1. **FakeStore API** - External product catalog with USD→INR conversion
2. **RapidAPI** - Real-time product data for visual search
3. **Internal Database** - Price history and deals

---

### 2.3 Price Comparison Engine

| Feature | Description | Implementation |
|---------|-------------|----------------|
| **Multi-Store Comparison** | Compare prices across 15+ stores | `ComparePrices.tsx` |
| **Lowest Price Badge** | Highlight best deal | Green border + "🏆 Lowest Price" badge |
| **Official Store Tag** | Identify manufacturer stores | Blue highlight + shield icon |
| **EMI Calculator** | Show financing options | Bank-wise EMI breakdown |
| **Bank Offers** | Credit/debit card discounts | Static offer catalog |
| **Price History** | Historical price tracking | `PriceHistoryChart.tsx` with Recharts |

**Store Coverage:**
- Amazon India, Flipkart, Croma, Reliance Digital
- Tata CLiQ, JioMart, Vijay Sales
- Brand stores: Apple, Samsung, Xiaomi, Nike, Dyson
- Fashion: Myntra, Ajio

**Price Variation Algorithm:**
```typescript
const priceVariation = basePrice * (store.variation / 100);
const storePrice = Math.round(basePrice + priceVariation);
```

---

### 2.4 Deal Coins Loyalty System

The gamified rewards system where **1 Deal Coin = ₹1**.

| Earning Method | Coins | Condition |
|----------------|-------|-----------|
| **Shopping** | 2% of order total | Automatic on order completion |
| **Daily Login** | 10 coins | Once per day claim |
| **Referrals (Referrer)** | 50 coins | When friend signs up |
| **Referrals (Referee)** | 25 coins | Using a referral code |
| **Product Reviews** | 20 coins | After purchasing product |

**Redemption Options:**
- Use at checkout (direct discount)
- Free shipping redemption
- Exclusive member deals access

**Security Implementation:**
- All coin operations via Edge Functions (server-side only)
- Client cannot INSERT/UPDATE `deal_coins` or `deal_coins_transactions`
- User ID derived from `auth.uid()` - no client-supplied IDs accepted
- Duplicate earning prevention (unique constraints)

---

### 2.5 Shopping Cart System

| Feature | Description | Security |
|---------|-------------|----------|
| **Add to Cart** | Add products with quantities | RLS: user_id = auth.uid() |
| **Quantity Management** | Increment/decrement items | Price fields immutable (UPDATE blocked) |
| **Price Protection** | Prevent manipulation | Server-side price verification at checkout |
| **Persistent Cart** | Cart survives sessions | Stored in Supabase `cart_items` table |
| **Cross-Device Sync** | Access cart anywhere | Database-backed, not localStorage |

**Cart Security:**
```sql
-- Users CANNOT modify price fields
WITH CHECK (
  (auth.uid() = user_id) AND
  (NOT (price IS DISTINCT FROM (SELECT ci.price FROM cart_items ci WHERE ci.id = cart_items.id)))
  -- Similar checks for original_price and discount
)
```

---

### 2.6 Checkout & Order System

| Feature | Description |
|---------|-------------|
| **Multi-Step Form** | Address, payment, review |
| **Form Validation** | Phone (10 digits), Pincode (6 digits), text limits |
| **Coupon Application** | Database-validated discount codes |
| **Deal Coins Redemption** | Use coins at checkout |
| **Server-Side Order Creation** | Prevents price manipulation |
| **Invoice Generation** | PDF bill download |

**Order Flow:**
```
Client checkout request → validate-order Edge Function →
├── Read cart from DB (not client)
├── Verify prices against FakeStore API
├── Validate coupon from coupons table
├── Process coin spending
├── Create order record
├── Award 2% coins
├── Clear cart
└── Return order confirmation
```

---

### 2.7 Coupon System

| Feature | Description |
|---------|-------------|
| **Coupon Discovery** | Browse active coupons by store/category |
| **Real-Time Validation** | Server-side coupon verification |
| **Expiry Handling** | Auto-filter expired coupons |
| **Usage Tracking** | Count how many times used |
| **Copy-to-Clipboard** | One-click coupon copying |

**Coupon Types:**
- `percentage` - X% off
- `flat` - ₹X off
- `cashback` - Earn X% back
- `freeShipping` - Remove shipping cost

---

### 2.8 Daily Deals

| Feature | Description |
|---------|-------------|
| **Deal of the Day** | Featured time-limited deal |
| **Countdown Timer** | Live expiry countdown |
| **Featured Deals Grid** | Curated deal collection |
| **Store Filtering** | Filter by retailer |

---

### 2.9 Order History

| Feature | Description |
|---------|-------------|
| **Order List** | View all past orders |
| **Order Details** | Full breakdown per order |
| **Invoice Download** | Re-download bills anytime |
| **Status Tracking** | Order status display |

---

## 3. Full Page Structure

### 3.1 Home Page (`/`)

**Purpose:** Landing page showcasing platform value proposition

**Components Used:**
- `Header` - Navigation + auth state
- `HeroSection` - Hero banner with CTA
- `DealOfTheDay` - Featured daily deal
- `FeaturedDeals` - Deal grid
- `Features` - Platform benefits
- `Footer` - Links + branding

**Data Displayed:**
- Active daily deals from `daily_deals` table
- Static feature cards
- User auth state (logged in/out)

**User Actions:**
- Navigate to search/features
- Sign up / Sign in
- Browse deals

---

### 3.2 Sign In Page (`/sign-in`)

**Purpose:** User authentication

**Components:**
- `Header`, `Footer`
- `Card`, `Input`, `Button` from shadcn/ui
- `SuccessOverlay` - Post-login animation

**Authentication Logic:**
```typescript
const { error } = await signIn(email, password);
if (error) {
  toast.error(error.message); // "Email not confirmed" etc.
} else {
  setShowSuccess(true);
}
```

**Form Validation:**
- Email format validation (HTML5)
- Required field checks
- Password visibility toggle

**Security:**
- JWT tokens stored in localStorage
- Auto-redirect if already authenticated
- Rate limiting via Supabase

---

### 3.3 Sign Up Page (`/sign-up`)

**Purpose:** New user registration

**Components:**
- Full name, email, password inputs
- Password strength requirements display
- Terms acceptance checkbox

**Flow:**
1. User fills form
2. Password validated (8+ chars, uppercase, lowercase, number, special)
3. `supabase.auth.signUp()` called
4. Verification email sent
5. User redirected to check email message

**Database Trigger:**
```sql
CREATE FUNCTION handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 3.4 Search Page (`/search`)

**Purpose:** Product discovery

**Components:**
- `ProductSearchBar` - Search input
- `ProductCardSkeleton` - Loading state
- `DealCard` - Product cards

**API Calls:**
1. `search-products` Edge Function
2. `FakeStore API` directly

**Features:**
- Category filtering
- Price range sorting
- Pagination
- Add to cart from results

---

### 3.5 Visual Search Page (`/visual-search`)

**Purpose:** Image-based product search

**Flow:**
1. User uploads image (drag-drop, file, camera)
2. Image converted to base64
3. `visual-search` Edge Function called
4. Gemini AI extracts product metadata
5. RapidAPI searches products
6. Results displayed with similarity scores

**AI Integration:**
```typescript
// Edge Function
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  { body: JSON.stringify({ contents: [{ parts: [{ inlineData: { mimeType, data } }] }] }) }
);
```

---

### 3.6 Barcode Scanner Page (`/scan`)

**Purpose:** Scan product barcodes to find deals

**Components:**
- `html5-qrcode` library integration
- Camera permission handling
- Result display cards

**Flow:**
1. Camera activated
2. Barcode detected
3. `barcode-lookup` Edge Function called
4. Product info retrieved
5. Redirect to comparison page

---

### 3.7 Compare Prices Page (`/compare-prices`)

**Purpose:** Multi-store price comparison

**URL Parameters:**
- `name` - Product name
- `price` - Base price
- `image` - Product image URL
- `store` - Original store name

**Sections:**
1. Product header with lowest price highlight
2. Store comparison cards (sorted by price)
3. EMI calculator (bank-wise breakdown)
4. Bank card offers
5. Price history chart

**Add to Cart:**
```typescript
const handleAddToCart = (storePrice: StorePrice) => {
  addToCart({
    id: `${productName}-${storePrice.store}`.replace(/\s+/g, '-').toLowerCase(),
    name: productName,
    price: storePrice.price,
    // ...
  });
};
```

---

### 3.8 Cart Page (`/cart`)

**Purpose:** Review items before checkout

**Features:**
- Item list with images
- Quantity +/- controls
- Remove item
- Running totals
- Proceed to checkout button

**Data Source:**
```typescript
const { data } = await supabase
  .from('cart_items')
  .select('*')
  .eq('user_id', user.id);
```

---

### 3.9 Checkout Page (`/checkout`)

**Purpose:** Complete purchase

**Sections:**
1. **Shipping Address Form**
   - Full name, phone, address lines
   - City, state, pincode, landmark

2. **Payment Method**
   - Cash on Delivery
   - UPI (simulated)
   - Card (simulated)

3. **Order Summary**
   - Item list
   - Subtotal, shipping, discounts
   - Deal Coins usage option
   - Final total

4. **Coupon Application**
   - Input field
   - Apply/remove button
   - Discount display

**Server-Side Validation:**
```typescript
const { data, error } = await supabase.functions.invoke('validate-order', {
  body: {
    discountCode,
    coinsToUse,
    shippingAddress,
    paymentMethod,
    notes,
  },
});
```

---

### 3.10 Deal Coins Page (`/deal-coins`)

**Purpose:** Loyalty rewards dashboard

**Sections:**
1. **Balance Display**
   - 3D spinning coin animation
   - Animated counter
   - Total earned/spent/balance

2. **Earning Methods**
   - Shop products (2% back)
   - Daily login claim button
   - Referral code generation
   - Apply friend's referral code
   - Write reviews info

3. **Redemption Options**
   - Flat discount
   - Free shipping
   - Exclusive access

4. **Transaction History**
   - Recent coin activity
   - Type (earned/spent)
   - Description and date

---

### 3.11 Orders Page (`/orders`)

**Purpose:** View order history

**Features:**
- Order cards with status
- Order number, date, total
- Expand to see items
- Download invoice button

---

### 3.12 Coupons Page (`/coupons`)

**Purpose:** Browse available coupons

**Features:**
- Store filter tabs
- Category filters
- Coupon cards with:
  - Code (copy button)
  - Discount details
  - Expiry date
  - Min purchase requirement
  - Verified badge

---

### 3.13 Static Pages

| Page | Route | Purpose |
|------|-------|---------|
| Features | `/features` | Platform capabilities |
| How It Works | `/how-it-works` | User guide |
| About | `/about` | Company info, team |
| Contact | `/contact` | Support form |
| Not Found | `/*` | 404 handling |

---

## 4. Component Structure

### 4.1 Layout Components

#### Header (`src/components/Header.tsx`)

**Purpose:** Global navigation bar

**Props:** None (uses hooks)

**Features:**
- Logo + brand name
- Navigation links
- Auth state display (login/signup or user menu)
- Deal Coins balance (authenticated)
- Cart icon with count
- Mobile hamburger menu

**Hooks Used:**
- `useAuth()` - Authentication state
- `useCart()` - Cart item count
- `useProfile()` - User profile data

**Responsive Behavior:**
- Desktop: Full nav links, account dropdown
- Mobile: Hamburger menu with Sheet component

---

#### Footer (`src/components/Footer.tsx`)

**Purpose:** Site-wide footer

**Sections:**
- Brand info
- Quick links
- Contact info
- Social links
- Copyright

---

### 4.2 UI Components (shadcn/ui)

| Component | Location | Usage |
|-----------|----------|-------|
| `Button` | `ui/button.tsx` | CTAs, form submits |
| `Card` | `ui/card.tsx` | Content containers |
| `Input` | `ui/input.tsx` | Text inputs |
| `Label` | `ui/label.tsx` | Form labels |
| `Badge` | `ui/badge.tsx` | Tags, status |
| `Sheet` | `ui/sheet.tsx` | Mobile menu |
| `DropdownMenu` | `ui/dropdown-menu.tsx` | Account menu |
| `Select` | `ui/select.tsx` | Dropdowns |
| `RadioGroup` | `ui/radio-group.tsx` | Payment options |
| `Checkbox` | `ui/checkbox.tsx` | Terms acceptance |
| `Textarea` | `ui/textarea.tsx` | Multi-line input |
| `Skeleton` | `ui/skeleton.tsx` | Loading states |
| `Separator` | `ui/separator.tsx` | Visual dividers |
| `Tooltip` | `ui/tooltip.tsx` | Hover info |

---

### 4.3 Feature Components

#### DealCard (`src/components/DealCard.tsx`)

**Purpose:** Product card display

**Props:**
- `product` - Product data object
- `onCompare` - Comparison handler
- `onAddToCart` - Cart handler

**Displays:**
- Product image
- Title
- Price (current + original)
- Discount badge
- Store name
- Action buttons

---

#### PriceHistoryChart (`src/components/PriceHistoryChart.tsx`)

**Purpose:** Historical price visualization

**Library:** Recharts

**Data Source:** `price_history` table

**Chart Type:** Line chart with area fill

---

#### DealCoinsDisplay (`src/components/DealCoinsDisplay.tsx`)

**Purpose:** Compact coin balance in header

**Features:**
- Coin icon
- Balance number
- Link to Deal Coins page

---

#### SuccessOverlay (`src/components/SuccessOverlay.tsx`)

**Purpose:** Post-action celebration animation

**Variants:**
- `login` - Welcome back message
- `signup` - Account created

**Animation:** Framer Motion confetti effect

---

#### ShareDeal (`src/components/ShareDeal.tsx`)

**Purpose:** Social sharing for deals

**Platforms:**
- WhatsApp
- Twitter
- Facebook
- Copy link

---

### 4.4 Custom UI Components

#### GalaxyButton (`src/components/ui/galaxy-button.tsx`)

**Purpose:** Premium animated CTA button

**Features:**
- 3D galaxy effect on hover
- Orbiting stars animation
- Gradient background shift
- Scale animation

**CSS Class:** `.galaxy-btn`

---

#### ProductCardSkeleton (`src/components/ProductCardSkeleton.tsx`)

**Purpose:** Loading placeholder for product cards

**Implementation:** Shimmer animation with Skeleton components

---

## 5. Frontend Architecture

### 5.1 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **Vite** | 5.4.19 | Build tool + dev server |
| **TypeScript** | 5.8.3 | Type safety |
| **Tailwind CSS** | 3.4.17 | Utility-first styling |
| **shadcn/ui** | Latest | Component library |
| **Framer Motion** | 12.35.1 | Animations |
| **React Router** | 6.30.1 | Client-side routing |
| **TanStack Query** | 5.83.0 | Server state management |
| **Recharts** | 2.15.4 | Data visualization |
| **Sonner** | 1.7.4 | Toast notifications |
| **Zod** | 3.25.76 | Schema validation |

---

### 5.2 Component Architecture

```
src/
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── Header.tsx             # Layout: Navigation
│   ├── Footer.tsx             # Layout: Footer
│   ├── DealCard.tsx           # Feature: Product display
│   ├── PriceHistoryChart.tsx  # Feature: Charts
│   └── ...
├── pages/
│   ├── Index.tsx              # Route: Home
│   ├── Search.tsx             # Route: Search
│   └── ...
├── hooks/
│   ├── useAuth.tsx            # Context: Authentication
│   ├── useCart.tsx            # Context: Shopping cart
│   ├── useProfile.tsx         # Hook: User profile
│   └── useDealCoins.tsx       # Hook: Loyalty system
└── integrations/
    └── supabase/
        ├── client.ts          # Supabase client
        └── types.ts           # Generated types
```

---

### 5.3 State Management

**Context Providers:**

1. **AuthProvider** (`useAuth.tsx`)
   ```typescript
   const AuthContext = createContext<AuthContextType>({
     user: null,
     session: null,
     loading: true,
     signUp: async () => {},
     signIn: async () => {},
     signOut: async () => {},
   });
   ```

2. **CartProvider** (`useCart.tsx`)
   ```typescript
   const CartContext = createContext<CartContextType>({
     cartItems: [],
     cartCount: 0,
     addToCart: () => {},
     removeFromCart: () => {},
     updateQuantity: () => {},
     clearCart: async () => {},
   });
   ```

**Server State:** TanStack Query for API calls

**Local State:** React `useState` for component-level state

---

### 5.4 Routing System

**Library:** React Router v6

**Route Configuration:**
```typescript
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/search" element={<Search />} />
  <Route path="/compare-prices" element={<ComparePrices />} />
  <Route path="/visual-search" element={<VisualSearch />} />
  <Route path="/scan" element={<BarcodeScanner />} />
  <Route path="/sign-in" element={<SignIn />} />
  <Route path="/sign-up" element={<SignUp />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/orders" element={<Orders />} />
  <Route path="/deal-coins" element={<DealCoins />} />
  <Route path="/coupons" element={<Coupons />} />
  <Route path="/product/:id" element={<ProductDetail />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

**Page Transitions:** Framer Motion `AnimatePresence` with fade animations

---

### 5.5 Form Handling

**Validation Approach:** Custom validation functions + HTML5 validation

**Example - Checkout Form:**
```typescript
const validateForm = () => {
  // Required fields check
  const required = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];
  for (const field of required) {
    if (!shippingAddress[field].trim()) {
      toast.error(`Please fill in ${field}`);
      return false;
    }
  }
  
  // Phone: exactly 10 digits
  if (!/^\d{10}$/.test(shippingAddress.phone)) {
    toast.error("Please enter a valid 10-digit phone number");
    return false;
  }
  
  // Pincode: exactly 6 digits
  if (!/^\d{6}$/.test(shippingAddress.pincode)) {
    toast.error("Please enter a valid 6-digit pincode");
    return false;
  }
  
  return true;
};
```

---

### 5.6 Frontend-Backend Communication

**Supabase Client:**
```typescript
import { supabase } from "@/integrations/supabase/client";

// Direct database query
const { data, error } = await supabase
  .from('cart_items')
  .select('*')
  .eq('user_id', user.id);

// Edge Function call
const { data, error } = await supabase.functions.invoke('validate-order', {
  body: { /* payload */ },
});
```

**Auth State Listener:**
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  setSession(session);
  setUser(session?.user ?? null);
});
```

---

## 6. Backend Architecture

### 6.1 Server Technology

**Platform:** Lovable Cloud (Supabase)

**Components:**
- **PostgreSQL Database** - Primary data store
- **Edge Functions** - Deno-based serverless functions
- **Auth System** - Supabase Auth with JWT
- **Row-Level Security** - Database access control
- **Storage** - (Available but not used currently)

---

### 6.2 API Architecture

**API Style:** RESTful with Supabase client + Edge Functions

**Authentication Flow:**
```
Client Request → Supabase Client → 
├── Authorization Header (JWT) →
├── Supabase Auth Verification →
├── RLS Policy Check →
└── Data Access/Mutation
```

---

### 6.3 Edge Functions

| Function | File | Purpose | Auth Required |
|----------|------|---------|---------------|
| `validate-order` | `/supabase/functions/validate-order/index.ts` | Secure order creation | Yes |
| `earn-coins` | `/supabase/functions/earn-coins/index.ts` | Coin earning actions | Yes |
| `reset-password` | `/supabase/functions/reset-password/index.ts` | Password reset | No |
| `search-products` | `/supabase/functions/search-products/index.ts` | Product search | No |
| `visual-search` | `/supabase/functions/visual-search/index.ts` | AI image search | No |
| `barcode-lookup` | `/supabase/functions/barcode-lookup/index.ts` | Barcode scanning | No |

---

### 6.4 validate-order Function

**Purpose:** Secure order processing with fraud prevention

**Flow:**
1. Verify JWT token
2. Read cart from database (not client)
3. Verify prices against FakeStore API
4. Validate coupon from database
5. Process Deal Coins spending
6. Create order record
7. Award earned coins (2%)
8. Clear cart
9. Return confirmation

**Security Measures:**
```typescript
// Price verification against external API
const apiRes = await fetch('https://fakestoreapi.com/products');
const apiProducts = await apiRes.json();
for (const p of apiProducts) {
  trustedPrices[`fakestore-${p.id}`] = Math.round(p.price * 83); // USD to INR
}

// Server-side cart reading (not client-supplied)
const { data: dbCartItems } = await supabaseAdmin
  .from('cart_items')
  .select('*')
  .eq('user_id', userId);

// Max item price guard
const MAX_ITEM_PRICE = 500000; // ₹5,00,000
```

---

### 6.5 earn-coins Function

**Purpose:** Handle all coin-earning actions

**Actions Supported:**
- `daily_login` - Claim daily 10 coins
- `claim_referral_code` - Generate user's referral code
- `use_referral` - Apply friend's referral code (25 coins)
- `submit_review` - Review product for 20 coins

**Anti-Fraud:**
```typescript
// Check if already claimed today
const { data: existing } = await adminClient
  .from('daily_login_claims')
  .select('id')
  .eq('user_id', userId)
  .eq('claimed_date', today)
  .maybeSingle();

if (existing) {
  return { success: false, message: 'Already claimed today' };
}

// Verify user purchased product before review
const hasOrdered = orders?.some((order) => {
  const items = order.items;
  return items.some((item) => item.id === product_id);
});
```

---

### 6.6 reset-password Function

**Purpose:** Secure password reset without user interaction

**Flow:**
1. Check rate limit (3 attempts/hour/email)
2. Look up user by email
3. Generate secure 8-char password (CSPRNG)
4. Update user via Supabase Admin API
5. Send email via Resend
6. Return generic success (no email enumeration)

---

### 6.7 Middleware & Error Handling

**CORS Headers:**
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, ...',
};
```

**Error Response Format:**
```typescript
return new Response(
  JSON.stringify({ error: 'Error message' }),
  { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
);
```

---

## 7. Database Design

### 7.1 Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│   profiles  │     │   deal_coins    │     │   orders     │
│─────────────│     │─────────────────│     │───────────── │
│ user_id (FK)│◄────│ user_id (FK)    │     │ user_id (FK) │
│ full_name   │     │ balance         │     │ order_number │
│ email       │     │ total_earned    │     │ items (JSON) │
│ referral_cod│     │ total_spent     │     │ total        │
└─────────────┘     └─────────────────┘     └──────────────┘
                            │
                            ▼
                ┌───────────────────────────┐
                │ deal_coins_transactions   │
                │───────────────────────────│
                │ user_id (FK)              │
                │ amount                    │
                │ type (earned/spent)       │
                │ description               │
                │ order_id (FK nullable)    │
                └───────────────────────────┘
```

---

### 7.2 Complete Table Schema

#### profiles

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | FK to auth.users |
| full_name | text | Yes | - | Display name |
| email | text | Yes | - | User email |
| referral_code | text | Yes | - | User's referral code |
| is_active | boolean | No | true | Account status |
| deleted_at | timestamptz | Yes | - | Soft delete |
| created_at | timestamptz | No | now() | - |
| updated_at | timestamptz | No | now() | - |

---

#### deal_coins

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | FK to auth.users |
| balance | integer | No | 0 | Current balance |
| total_earned | integer | No | 0 | Lifetime earnings |
| total_spent | integer | No | 0 | Lifetime spending |
| created_at | timestamptz | No | now() | - |
| updated_at | timestamptz | No | now() | - |

**Unique Constraint:** `user_id`

---

#### deal_coins_transactions

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | FK to auth.users |
| amount | integer | No | - | Coins (+/-) |
| type | text | No | - | earned/spent/refund |
| description | text | Yes | - | Transaction detail |
| order_id | uuid | Yes | - | Related order |
| created_at | timestamptz | No | now() | - |

---

#### orders

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | FK to auth.users |
| order_number | text | No | - | Display number (DW...) |
| items | jsonb | No | - | Array of cart items |
| subtotal | numeric | No | - | Pre-discount total |
| shipping | numeric | No | 0 | Shipping cost |
| total | numeric | No | - | Final amount |
| shipping_address | jsonb | No | - | Address object |
| payment_method | text | No | - | cod/upi/card |
| status | text | No | 'placed' | Order status |
| notes | text | Yes | - | User notes |
| created_at | timestamptz | No | now() | - |
| updated_at | timestamptz | No | now() | - |

---

#### cart_items

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | FK to auth.users |
| product_id | text | No | - | External product ID |
| name | text | No | - | Product name |
| price | numeric | No | - | Current price |
| original_price | numeric | No | - | MRP |
| quantity | integer | No | 1 | Item count |
| discount | numeric | Yes | 0 | Discount % |
| image | text | Yes | - | Image URL |
| store | text | Yes | - | Store name |
| created_at | timestamptz | No | now() | - |
| updated_at | timestamptz | No | now() | - |

---

#### coupons

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| code | text | No | - | Coupon code |
| store | text | No | - | Store name |
| description | text | No | - | Coupon description |
| coupon_type | text | No | - | percentage/flat/cashback/freeShipping |
| discount_type | text | No | - | percentage/fixed/none |
| discount_value | numeric | No | 0 | Discount amount |
| min_purchase | numeric | No | 0 | Minimum cart value |
| max_discount | numeric | Yes | - | Cap on discount |
| expires_at | timestamptz | No | - | Expiry date |
| is_active | boolean | No | true | Active status |
| verified | boolean | No | true | Verified working |
| used_count | integer | No | 0 | Usage counter |
| category | text | No | 'All' | Product category |
| created_at | timestamptz | No | now() | - |
| updated_at | timestamptz | No | now() | - |

---

#### daily_deals

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| title | text | No | - | Deal title |
| description | text | Yes | - | Deal description |
| image_url | text | Yes | - | Product image |
| store | text | No | - | Store name |
| original_price | numeric | No | - | MRP |
| deal_price | numeric | No | - | Sale price |
| discount_percent | integer | No | - | % off |
| product_link | text | Yes | - | External link |
| category | text | Yes | - | Product category |
| starts_at | timestamptz | No | now() | Start time |
| ends_at | timestamptz | No | - | End time |
| is_active | boolean | No | true | Active status |
| created_at | timestamptz | No | now() | - |
| updated_at | timestamptz | No | now() | - |

---

#### referral_codes

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | FK to auth.users |
| code | text | No | - | Unique referral code |
| created_at | timestamptz | No | now() | - |

**Unique Constraint:** `code`

---

#### referrals

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| referrer_id | uuid | No | - | User who referred |
| referred_id | uuid | No | - | New user |
| referral_code | text | No | - | Code used |
| coins_awarded | integer | No | 50 | Coins given |
| status | text | No | 'completed' | Status |
| created_at | timestamptz | No | now() | - |

**Unique Constraint:** `referred_id` (user can only use one referral)

---

#### daily_login_claims

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | FK to auth.users |
| claimed_date | date | No | CURRENT_DATE | Claim date |
| coins_awarded | integer | No | 10 | Coins given |
| created_at | timestamptz | No | now() | - |

**Unique Constraint:** `(user_id, claimed_date)`

---

#### product_reviews

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | FK to auth.users |
| product_id | text | No | - | Product identifier |
| product_name | text | No | - | Product name |
| rating | integer | No | - | 1-5 stars |
| review_text | text | Yes | - | Review content |
| coins_awarded | integer | No | 20 | Coins given |
| created_at | timestamptz | No | now() | - |

**Unique Constraint:** `(user_id, product_id)`

---

#### price_history

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| product_name | text | No | - | Product identifier |
| store | text | No | - | Store name |
| price | numeric | No | - | Price at time |
| recorded_at | timestamptz | No | now() | Timestamp |
| created_at | timestamptz | No | now() | - |

---

#### password_reset_attempts

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| email | text | No | - | User email |
| attempted_at | timestamptz | No | now() | Attempt time |

**Purpose:** Rate limiting password resets

---

#### view_counter

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| page_path | text | No | '/' | Page URL |
| view_count | bigint | No | 0 | View counter |
| created_at | timestamptz | No | now() | - |
| updated_at | timestamptz | No | now() | - |

---

### 7.3 Database Functions

#### get_or_create_deal_coins()

```sql
CREATE FUNCTION get_or_create_deal_coins()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance INTEGER;
  p_user_id UUID := auth.uid();
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT balance INTO current_balance
  FROM public.deal_coins
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    INSERT INTO public.deal_coins (user_id, balance, total_earned, total_spent)
    VALUES (p_user_id, 0, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
    current_balance := 0;
  END IF;
  
  RETURN current_balance;
END;
$$;
```

---

#### increment_view_count(page)

```sql
CREATE FUNCTION increment_view_count(page text DEFAULT '/')
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count BIGINT;
BEGIN
  INSERT INTO public.view_counter (page_path, view_count)
  VALUES (page, 1)
  ON CONFLICT (page_path) 
  DO UPDATE SET 
    view_count = view_counter.view_count + 1,
    updated_at = now()
  RETURNING view_count INTO current_count;
  
  RETURN current_count;
END;
$$;
```

---

#### handle_new_user() [Trigger]

```sql
CREATE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;

-- Trigger on auth.users INSERT
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 8. API Structure

### 8.1 Supabase Client API

**Base URL:** Auto-configured via environment variables

#### Authentication

```typescript
// Sign Up
POST /auth/v1/signup
Body: { email, password, options: { data: { full_name } } }
Response: { user, session }

// Sign In
POST /auth/v1/token?grant_type=password
Body: { email, password }
Response: { access_token, refresh_token, user }

// Sign Out
POST /auth/v1/logout
Headers: { Authorization: Bearer <token> }
Response: {}

// Get Session
GET /auth/v1/user
Headers: { Authorization: Bearer <token> }
Response: { user }
```

---

#### Database Operations

```typescript
// SELECT
GET /rest/v1/cart_items?user_id=eq.<uuid>&select=*
Headers: { Authorization: Bearer <token>, apikey: <anon_key> }
Response: [{ id, name, price, ... }]

// INSERT
POST /rest/v1/cart_items
Headers: { Authorization: Bearer <token>, apikey: <anon_key> }
Body: { product_id, name, price, quantity, user_id }
Response: [{ id, ... }]

// UPDATE
PATCH /rest/v1/cart_items?id=eq.<uuid>
Headers: { Authorization: Bearer <token>, apikey: <anon_key> }
Body: { quantity: 3 }
Response: [{ id, ... }]

// DELETE
DELETE /rest/v1/cart_items?id=eq.<uuid>
Headers: { Authorization: Bearer <token>, apikey: <anon_key> }
Response: []
```

---

### 8.2 Edge Functions API

#### POST /functions/v1/validate-order

**Purpose:** Create secure order

**Request:**
```json
{
  "discountCode": "SAVE10",
  "coinsToUse": 50,
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "addressLine1": "123 Street",
    "addressLine2": "",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "landmark": "Near Park"
  },
  "paymentMethod": "cod",
  "notes": "Please call before delivery"
}
```

**Response (Success):**
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "orderNumber": "DW12345678",
    "subtotal": 5000,
    "shipping": 0,
    "discount": 500,
    "coinDiscount": 50,
    "coinsEarned": 89,
    "total": 4450
  }
}
```

**Response (Error):**
```json
{
  "error": "Cart is empty"
}
```

---

#### POST /functions/v1/earn-coins

**Actions:**

```json
// Daily Login
{ "action": "daily_login" }
Response: { "success": true, "coins_awarded": 10 }

// Get/Create Referral Code
{ "action": "claim_referral_code" }
Response: { "success": true, "code": "DWAB12XY" }

// Use Referral Code
{ "action": "use_referral", "code": "FRIEND123" }
Response: { "success": true, "coins_awarded": 25, "message": "..." }

// Submit Review
{
  "action": "submit_review",
  "product_id": "fakestore-1",
  "product_name": "Product Name",
  "rating": 5,
  "review_text": "Great product!"
}
Response: { "success": true, "coins_awarded": 20 }
```

---

#### POST /functions/v1/reset-password

**Request:**
```json
{ "email": "user@example.com" }
```

**Response:**
```json
{ "success": true, "message": "If an account exists..." }
```

---

#### POST /functions/v1/search-products

**Request:**
```json
{
  "query": "laptop",
  "category": "electronics"
}
```

**Response:**
```json
{
  "products": [
    {
      "id": "123",
      "name": "MacBook Pro",
      "price": 149900,
      "image": "https://...",
      "store": "Amazon"
    }
  ]
}
```

---

#### POST /functions/v1/visual-search

**Request:**
```json
{
  "image": "base64-encoded-image-data",
  "mimeType": "image/jpeg"
}
```

**Response:**
```json
{
  "products": [
    {
      "name": "Blue Running Shoes",
      "price": 4999,
      "similarity": 0.92,
      "image": "https://..."
    }
  ]
}
```

---

## 9. User Roles and Permissions

### 9.1 Role Structure

DealWise uses a **single user role** model (consumer-facing platform).

| Role | Description | Permissions |
|------|-------------|-------------|
| **Anonymous** | Non-authenticated visitor | View products, search, browse deals |
| **Authenticated** | Logged-in user | All anonymous + cart, checkout, orders, coins |

---

### 9.2 Row-Level Security Policies

#### profiles

```sql
-- SELECT: Users view own profile only
POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING ((auth.uid() = user_id) AND (is_active = true));

-- INSERT: Users create own profile
POLICY "Users can create their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users update own profile
POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id) AND (is_active = true))
WITH CHECK ((auth.uid() = user_id) AND (is_active = true));
```

---

#### cart_items

```sql
-- SELECT: Own items only
POLICY "Users can view their own cart items"
ON cart_items FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- INSERT: Own items only
POLICY "Users can insert their own cart items"
ON cart_items FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Own items only + CANNOT modify price fields
POLICY "Users can update their own cart items"
ON cart_items FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  (auth.uid() = user_id) AND
  (NOT (price IS DISTINCT FROM (SELECT ci.price FROM cart_items ci WHERE ci.id = cart_items.id))) AND
  (NOT (original_price IS DISTINCT FROM (SELECT ci.original_price FROM cart_items ci WHERE ci.id = cart_items.id))) AND
  (NOT (discount IS DISTINCT FROM (SELECT ci.discount FROM cart_items ci WHERE ci.id = cart_items.id)))
);

-- DELETE: Own items only
POLICY "Users can delete their own cart items"
ON cart_items FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

---

#### orders

```sql
-- SELECT: Own orders only
POLICY "Users can view their own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- DELETE: Own orders only
POLICY "Users can delete their own orders"
ON orders FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- INSERT/UPDATE: BLOCKED for clients (server-side only)
```

---

#### deal_coins / deal_coins_transactions

```sql
-- SELECT: Own data only
POLICY "Users can view their own coin balance"
ON deal_coins FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- INSERT/UPDATE/DELETE: BLOCKED for clients
-- All mutations via Edge Functions with service_role key
```

---

#### Public Read Tables

```sql
-- coupons: Anyone can view active, non-expired
POLICY "Anyone can view active coupons"
ON coupons FOR SELECT
USING ((is_active = true) AND (expires_at > now()));

-- daily_deals: Anyone can view active deals
POLICY "Anyone can view active deals"
ON daily_deals FOR SELECT
USING ((is_active = true) AND (ends_at > now()));

-- price_history: Anyone can view
POLICY "Anyone can view price history"
ON price_history FOR SELECT
USING (true);
```

---

#### Fully Restricted Tables

```sql
-- password_reset_attempts: No client access
POLICY "Deny all client access"
ON password_reset_attempts FOR ALL
USING (false)
WITH CHECK (false);
```

---

## 10. UI/UX Design System

### 10.1 Design Philosophy

**Theme:** Dark mode with vibrant accents

**Aesthetic Direction:**
- Modern, premium feel
- High contrast for readability
- Accent colors for action items
- Glass morphism effects
- Smooth animations

---

### 10.2 Color Palette

Defined in `src/index.css`:

```css
:root {
  /* Base - Dark Blue-Gray */
  --background: 220 27% 8%;      /* #0f1219 */
  --foreground: 210 40% 98%;     /* #f8fafc */
  
  /* Cards */
  --card: 220 27% 12%;           /* #171c26 */
  --card-foreground: 210 40% 98%;
  
  /* Primary - Electric Blue */
  --primary: 213 89% 60%;        /* #4499f0 */
  --primary-foreground: 210 40% 98%;
  
  /* Secondary - Lime Green */
  --secondary: 84 81% 58%;       /* #a3e635 */
  --secondary-foreground: 220 27% 8%;
  
  /* Muted */
  --muted: 220 27% 15%;
  --muted-foreground: 215 20.2% 65.1%;
  
  /* Accent - Same as Secondary */
  --accent: 84 81% 58%;
  
  /* Destructive - Red */
  --destructive: 0 84.2% 60.2%;
  
  /* Borders & Inputs */
  --border: 220 27% 20%;
  --input: 220 27% 15%;
  --ring: 213 89% 60%;
  
  /* Deal-Specific */
  --price-current: 84 81% 58%;   /* Green - sale price */
  --price-original: 215 20.2% 65.1%; /* Gray - strikethrough */
  --discount-bg: 213 89% 60%;    /* Blue - discount badge */
}
```

---

### 10.3 Typography

**Font Stack:**
```css
font-family: 'Inter', system-ui, sans-serif;      /* Body */
font-family: 'Poppins', 'Inter', system-ui, sans-serif; /* Display */
```

**Scale:**
- `text-xs` - 12px (labels, timestamps)
- `text-sm` - 14px (body text)
- `text-base` - 16px (default)
- `text-lg` - 18px (subheadings)
- `text-xl` - 20px (card titles)
- `text-2xl` - 24px (page headings)
- `text-3xl` - 30px (hero text)
- `text-4xl+` - Hero numbers (coin balance)

---

### 10.4 Layout System

**Container:**
```typescript
container: {
  center: true,
  padding: "2rem",
  screens: { "2xl": "1400px" },
}
```

**Grid System:**
- 1 column (mobile)
- 2 columns (tablet)
- 3-4 columns (desktop)

**Spacing Scale:**
- `gap-2` (8px) - tight grouping
- `gap-4` (16px) - standard
- `gap-6` (24px) - section spacing
- `gap-8` (32px) - major sections

---

### 10.5 Animation System

**Library:** Framer Motion

**Page Transitions:**
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 0.3 }}
>
```

**Micro-Interactions:**
```css
.hover-lift {
  @apply transition-all duration-300 
         hover:translate-y-[-4px] 
         hover:shadow-card-hover;
}

.hover-scale {
  @apply transition-transform duration-200 hover:scale-105;
}

.hover-glow {
  @apply transition-all duration-300 hover:shadow-glow;
}
```

**Custom Animations:**
- 3D Spinning Coin (CSS `@keyframes deal-coin-spin`)
- Galaxy Button (CSS variables + keyframes)
- Animated Counter (React `useEffect` interval)

---

### 10.6 Responsive Breakpoints

```typescript
// Tailwind defaults
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large
```

**Mobile-First Approach:**
```html
<!-- Stack on mobile, grid on larger -->
<div class="flex flex-col md:flex-row">
  
<!-- Full width mobile, constrained desktop -->
<div class="w-full md:w-48">

<!-- Hide on mobile, show on desktop -->
<nav class="hidden lg:flex">
```

---

### 10.7 Component Design Patterns

**Cards:**
```html
<Card class="border-border bg-card/50 backdrop-blur-sm">
```

**Glass Effect:**
```css
.glass {
  @apply bg-card/20 backdrop-blur-md border border-white/10;
}
```

**Gradient Text:**
```css
.gradient-text {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 11. Security System

### 11.1 Authentication Security

| Measure | Implementation |
|---------|----------------|
| **Password Hashing** | Supabase Auth (bcrypt) |
| **Session Tokens** | JWT with auto-refresh |
| **Email Verification** | Required before sign-in |
| **Secure Password Reset** | 8-char CSPRNG passwords |
| **No Email Enumeration** | Silent failures on signup/reset |

---

### 11.2 API Security

| Measure | Implementation |
|---------|----------------|
| **Authentication** | JWT Bearer tokens |
| **Authorization** | Row-Level Security policies |
| **Input Validation** | Server-side validation in Edge Functions |
| **Rate Limiting** | 3 password resets/hour/email |
| **CORS** | Permissive for SPA (`*` origin) |

---

### 11.3 Data Security

| Measure | Implementation |
|---------|----------------|
| **Owner-Only Access** | RLS: `auth.uid() = user_id` |
| **Immutable Fields** | Cart prices cannot be modified |
| **Server-Side Mutations** | Orders/coins via Edge Functions only |
| **Price Verification** | External API validation at checkout |
| **SQL Injection Prevention** | Parameterized queries via Supabase client |

---

### 11.4 Price Manipulation Prevention

**Client-Side:**
- Prices displayed from database
- Cannot modify cart item prices

**Server-Side (validate-order):**
```typescript
// 1. Read cart from DB, not client
const { data: dbCartItems } = await supabaseAdmin
  .from('cart_items')
  .select('*')
  .eq('user_id', userId);

// 2. Verify against external API
const apiRes = await fetch('https://fakestoreapi.com/products');
const apiProducts = await apiRes.json();
for (const p of apiProducts) {
  trustedPrices[`fakestore-${p.id}`] = Math.round(p.price * 83);
}

// 3. Use verified prices for order
const price = verifiedPrice !== undefined ? verifiedPrice : Number(row.price);
```

---

### 11.5 Security Best Practices Applied

1. **Principle of Least Privilege**
   - Users can only access their own data
   - No admin roles exposed to frontend

2. **Defense in Depth**
   - RLS at database level
   - Validation in Edge Functions
   - Input sanitization

3. **Secure Defaults**
   - All tables have RLS enabled
   - New tables default to no access

4. **Audit Trail**
   - `deal_coins_transactions` logs all coin activity
   - Order history preserved

---

## 12. Performance Optimization

### 12.1 Frontend Optimizations

| Technique | Implementation |
|-----------|----------------|
| **Code Splitting** | React.lazy + Suspense (potential) |
| **Tree Shaking** | Vite automatic |
| **Minification** | Vite production build |
| **CSS Purging** | Tailwind JIT mode |
| **Image Optimization** | External CDN URLs |

---

### 12.2 Loading States

**Skeleton Loaders:**
```typescript
<ProductCardSkeleton />
// Renders shimmer animation while loading
```

**Loading Spinners:**
```html
<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
```

---

### 12.3 Database Optimizations

| Technique | Implementation |
|-----------|----------------|
| **Indexes** | Primary keys, unique constraints |
| **Selective Queries** | `.select('id, name')` not `*` |
| **Query Limits** | `.limit(20)` on transactions |
| **Single Row Fetch** | `.single()` / `.maybeSingle()` |

---

### 12.4 Caching Strategy

**Client-Side:**
- TanStack Query caching (staleTime, cacheTime)
- LocalStorage for auth session

**Server-Side:**
- Supabase connection pooling
- Edge Function cold start optimization

---

### 12.5 Network Optimization

| Technique | Implementation |
|-----------|----------------|
| **Batch Operations** | Multiple inserts in single query |
| **Optimistic Updates** | Immediate UI feedback |
| **Debounced Search** | Delay API calls while typing |

---

## 13. Data Flow Explanation

### 13.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. USER SIGN UP
   ┌────────┐    ┌──────────────┐    ┌─────────────┐
   │ SignUp │───►│ supabase.auth│───►│ auth.users  │
   │  Form  │    │ .signUp()    │    │ (created)   │
   └────────┘    └──────────────┘    └──────┬──────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │ TRIGGER:    │
                                     │ handle_new_ │
                                     │ user()      │
                                     └──────┬──────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │ profiles    │
                                     │ (created)   │
                                     └─────────────┘

2. EMAIL VERIFICATION
   ┌────────┐    ┌──────────────┐    ┌─────────────┐
   │ Email  │───►│ Click verify │───►│ email_      │
   │ Inbox  │    │ link         │    │ confirmed=  │
   └────────┘    └──────────────┘    │ true        │
                                     └─────────────┘

3. SIGN IN
   ┌────────┐    ┌──────────────┐    ┌─────────────┐
   │ SignIn │───►│ supabase.auth│───►│ JWT Token   │
   │  Form  │    │ .signIn()    │    │ returned    │
   └────────┘    └──────────────┘    └──────┬──────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │ AuthContext │
                                     │ updated     │
                                     └──────┬──────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │ UI re-      │
                                     │ renders     │
                                     └─────────────┘
```

---

### 13.2 Shopping Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SHOPPING FLOW                              │
└─────────────────────────────────────────────────────────────────┘

1. PRODUCT SEARCH
   ┌────────┐    ┌──────────────┐    ┌─────────────┐
   │ Search │───►│ search-      │───►│ FakeStore   │
   │ Query  │    │ products     │    │ API         │
   └────────┘    │ Edge Func    │    └──────┬──────┘
                 └──────────────┘           │
                                            ▼
                                     ┌─────────────┐
                                     │ Products    │
                                     │ displayed   │
                                     └─────────────┘

2. ADD TO CART
   ┌────────┐    ┌──────────────┐    ┌─────────────┐
   │ Add to │───►│ supabase     │───►│ cart_items  │
   │ Cart   │    │ .insert()    │    │ table       │
   │ Button │    └──────────────┘    └──────┬──────┘
   └────────┘                               │
                                            ▼
                                     ┌─────────────┐
                                     │ CartContext │
                                     │ refetches   │
                                     └─────────────┘

3. CHECKOUT
   ┌────────┐    ┌──────────────┐    ┌─────────────┐
   │ Place  │───►│ validate-    │───►│ Read cart   │
   │ Order  │    │ order        │    │ from DB     │
   │ Button │    │ Edge Func    │    └──────┬──────┘
   └────────┘    └──────────────┘           │
                                            ▼
                                     ┌─────────────┐
                                     │ Verify      │
                                     │ prices      │
                                     │ (FakeStore) │
                                     └──────┬──────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │ Apply       │
                                     │ coupon &    │
                                     │ coins       │
                                     └──────┬──────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │ CREATE      │
                                     │ order       │
                                     │ record      │
                                     └──────┬──────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │ Award 2%    │
                                     │ coins       │
                                     └──────┬──────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │ Clear cart  │
                                     │ Return      │
                                     │ confirmation│
                                     └─────────────┘
```

---

### 13.3 Deal Coins Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEAL COINS FLOW                             │
└─────────────────────────────────────────────────────────────────┘

EARNING:
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐           │
│  │ Shop    │   │ Daily   │   │Referral │   │ Review  │           │
│  │ 2%back  │   │ Login   │   │ 50+25   │   │ 20coins │           │
│  └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘           │
│       │             │             │             │                │
│       └─────────────┴──────┬──────┴─────────────┘                │
│                            │                                     │
│                            ▼                                     │
│                     ┌─────────────┐                              │
│                     │ earn-coins  │                              │
│                     │ Edge Func   │                              │
│                     └──────┬──────┘                              │
│                            │                                     │
│                            ▼                                     │
│                     ┌─────────────┐                              │
│                     │ deal_coins  │                              │
│                     │ UPDATE      │                              │
│                     │ balance++   │                              │
│                     └──────┬──────┘                              │
│                            │                                     │
│                            ▼                                     │
│                     ┌─────────────┐                              │
│                     │ transaction │                              │
│                     │ INSERT      │                              │
│                     └─────────────┘                              │
└──────────────────────────────────────────────────────────────────┘

SPENDING:
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌─────────────┐                                                 │
│  │ Checkout    │                                                 │
│  │ Use coins   │                                                 │
│  │ toggle      │                                                 │
│  └──────┬──────┘                                                 │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────┐                                                 │
│  │ validate-   │                                                 │
│  │ order       │                                                 │
│  │ coinsToUse  │                                                 │
│  └──────┬──────┘                                                 │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────┐                                                 │
│  │ deal_coins  │                                                 │
│  │ UPDATE      │                                                 │
│  │ balance--   │                                                 │
│  └──────┬──────┘                                                 │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────┐                                                 │
│  │ transaction │                                                 │
│  │ INSERT      │                                                 │
│  │ type=spent  │                                                 │
│  └─────────────┘                                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## 14. Project File Structure

```
dealwise/
├── public/
│   ├── favicon.jpg
│   ├── robots.txt
│   └── images/
│       ├── coin-front.jpg      # 3D coin texture
│       ├── coin-back.jpg       # 3D coin texture
│       └── team/               # Team member photos
│           ├── Jainam Khadalia.jpg
│           ├── Krup Patel.jpg
│           └── Mayur Boricha.jpg
│
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Root component + routing
│   ├── index.css               # Global styles + design system
│   ├── vite-env.d.ts           # Vite type definitions
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── galaxy-button.tsx    # Custom animated button
│   │   │   ├── radio-group.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Site footer
│   │   ├── HeroSection.tsx     # Landing hero
│   │   ├── DealOfTheDay.tsx    # Featured deal
│   │   ├── FeaturedDeals.tsx   # Deal grid
│   │   ├── Features.tsx        # Platform features
│   │   ├── DealCard.tsx        # Product card
│   │   ├── DealCoinsDisplay.tsx # Coin balance chip
│   │   ├── PageTransition.tsx  # Framer Motion wrapper
│   │   ├── PriceHistoryChart.tsx # Recharts line chart
│   │   ├── ProductCardSkeleton.tsx # Loading placeholder
│   │   ├── ProductSearchBar.tsx # Search input
│   │   ├── ShareDeal.tsx       # Social sharing
│   │   └── SuccessOverlay.tsx  # Celebration animation
│   │
│   ├── pages/
│   │   ├── Index.tsx           # Home page
│   │   ├── SignIn.tsx          # Login
│   │   ├── SignUp.tsx          # Registration
│   │   ├── ForgotPassword.tsx  # Password reset request
│   │   ├── ChangePassword.tsx  # Change password (logged in)
│   │   ├── Search.tsx          # Product search
│   │   ├── ComparePrices.tsx   # Multi-store comparison
│   │   ├── VisualSearch.tsx    # AI image search
│   │   ├── BarcodeScanner.tsx  # Barcode scanning
│   │   ├── ProductDetail.tsx   # Single product view
│   │   ├── Cart.tsx            # Shopping cart
│   │   ├── Checkout.tsx        # Order placement
│   │   ├── Orders.tsx          # Order history
│   │   ├── DealCoins.tsx       # Loyalty dashboard
│   │   ├── Coupons.tsx         # Coupon browser
│   │   ├── Features.tsx        # Features page
│   │   ├── HowItWorks.tsx      # Guide page
│   │   ├── About.tsx           # About page
│   │   ├── Contact.tsx         # Contact page
│   │   └── NotFound.tsx        # 404 page
│   │
│   ├── hooks/
│   │   ├── useAuth.tsx         # Authentication context
│   │   ├── useCart.tsx         # Cart context
│   │   ├── useProfile.tsx      # User profile hook
│   │   ├── useDealCoins.tsx    # Loyalty system hook
│   │   └── useFakeStoreProducts.tsx # External API hook
│   │
│   ├── lib/
│   │   └── utils.ts            # cn() utility function
│   │
│   ├── utils/
│   │   ├── billGenerator.ts    # PDF invoice generation
│   │   ├── passwordValidation.ts # Password strength check
│   │   └── ProductSearchService.ts # Search abstraction
│   │
│   └── integrations/
│       └── supabase/
│           ├── client.ts       # Supabase client (auto-generated)
│           └── types.ts        # Database types (auto-generated)
│
├── supabase/
│   ├── config.toml             # Supabase configuration
│   ├── functions/
│   │   ├── validate-order/
│   │   │   └── index.ts        # Order processing
│   │   ├── earn-coins/
│   │   │   └── index.ts        # Coin earning actions
│   │   ├── reset-password/
│   │   │   └── index.ts        # Password reset
│   │   ├── search-products/
│   │   │   └── index.ts        # Product search
│   │   ├── visual-search/
│   │   │   └── index.ts        # AI image search
│   │   └── barcode-lookup/
│   │       └── index.ts        # Barcode scanning
│   └── migrations/             # Database migrations (read-only)
│
├── .env                        # Environment variables (auto-generated)
├── components.json             # shadcn/ui configuration
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
├── package.json                # Dependencies
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # App-specific TS config
├── tsconfig.node.json          # Node-specific TS config
└── vite.config.ts              # Vite configuration
```

---

## 15. Deployment System

### 15.1 Hosting Platform

**Platform:** Hostinger (with Lovable Cloud backend)

**URLs:**
- Published: [https://www.dealwise.in/](https://www.dealwise.in/)


---

### 15.2 Environment Variables

Auto-configured by Lovable Cloud:

```env
VITE_SUPABASE_URL=https://{project-id}.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbG...
VITE_SUPABASE_PROJECT_ID={project-id}
```

**Edge Function Secrets:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (for emails)
- `RAPIDAPI_KEY` (for visual search)
- `LOVABLE_API_KEY` (for AI)

---

### 15.3 Build Process

```bash
# Development
npm run dev          # Start Vite dev server on port 8080

# Production Build
npm run build        # Build for production (vite build)
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

**Build Output:**
- `dist/` folder
- Minified JS/CSS
- Static assets

---

### 15.4 Automatic Deployment

Lovable handles deployment automatically:
1. Code changes in editor
2. Hot reload in preview
3. Click "Publish" for production
4. CDN distribution

---

### 15.5 Edge Function Deployment

Edge Functions deploy automatically when:
1. Files added to `supabase/functions/`
2. Configuration in `supabase/config.toml`
3. Secrets configured in Lovable Cloud

---

## 16. Future Improvements

### 16.1 AI Features

| Feature | Description | Technology |
|---------|-------------|------------|
| **Price Prediction** | ML-based price forecasting | Time series models |
| **Smart Recommendations** | Personalized product suggestions | Collaborative filtering |
| **Chatbot Assistant** | Conversational deal finder | GPT integration |
| **Image Recognition V2** | Multi-object detection | Advanced vision models |

---

### 16.2 Analytics Enhancements

| Feature | Description |
|---------|-------------|
| **User Behavior Tracking** | Page views, time on page |
| **Conversion Funnels** | Cart → Checkout → Order |
| **A/B Testing** | Feature flag system |
| **Real-Time Dashboard** | Admin analytics view |

---

### 16.3 Scalability Improvements

| Area | Improvement |
|------|-------------|
| **Database** | Read replicas, connection pooling |
| **CDN** | Global edge caching |
| **Search** | Elasticsearch/Algolia integration |
| **Real-Time** | WebSocket subscriptions |

---

### 16.4 Feature Additions

| Feature | Description |
|---------|-------------|
| **Wishlists** | Save products for later |
| **Price Alerts** | Notify when price drops |
| **Social Features** | Share deals with friends |
| **Browser Extension** | Auto price comparison |
| **Mobile App** | React Native version |
| **Multi-Currency** | International support |
| **Admin Dashboard** | Content management |

---

### 16.5 Performance Improvements

| Area | Improvement |
|------|-------------|
| **SSR/SSG** | Next.js migration for SEO |
| **Image CDN** | Cloudflare Images integration |
| **Service Worker** | Offline capability |
| **Bundle Splitting** | Route-based code splitting |

---

## 17. Complete System Architecture

### 17.1 High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              DEALWISE ARCHITECTURE                         │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         CLIENT LAYER                                │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │                     React Application                        │   │   │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐              │   │   │
│  │  │  │   Pages    │  │ Components │  │   Hooks    │              │   │   │
│  │  │  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘              │   │   │
│  │  │         │               │               │                    │   │   │ 
│  │  │         └───────────────┼───────────────┘                    │   │   │
│  │  │                         │                                    │   │   │
│  │  │                         ▼                                    │   │   │
│  │  │              ┌──────────────────┐                            │   │   │
│  │  │              │  Supabase Client │                            │   │   │
│  │  │              └─────────┬────────┘                            │   │   │
│  │  └────────────────────────┼─────────────────────────────────────┘   │   │
│  └───────────────────────────┼─────────────────────────────────────────┘   │
│                              │                                             │
│  ┌───────────────────────────┼─────────────────────────────────────────┐   │
│  │                  BACKEND LAYER (Lovable Cloud / Supabase)           │   │
│  │                              │                                      │   │
│  │  ┌───────────────────────────┼───────────────────────────────────┐  │   │
│  │  │                           ▼                                   │  │   │
│  │  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐ │  │   │
│  │  │  │   Auth       │    │   Database   │    │  Edge Functions  │ │  │   │
│  │  │  │  (JWT/Email) │    │ (PostgreSQL) │    │    (Deno)        │ │  │   │
│  │  │  └──────────────┘    └──────────────┘    └──────────────────┘ │  │   │
│  │  │         │                   │                    │            │  │   │
│  │  │         │                   │                    │            │  │   │
│  │  │         ▼                   ▼                    ▼            │  │   │
│  │  │  ┌────────────────────────────────────────────────────────┐   │  │   │
│  │  │  │              Row-Level Security (RLS)                  │   │  │   │
│  │  │  │  ┌──────────────────────────────────────────────────┐  │   │  │   │
│  │  │  │  │  auth.uid() = user_id  │  policy enforcement     │  │   │  │   │
│  │  │  │  └──────────────────────────────────────────────────┘  │   │  │   │
│  │  │  └────────────────────────────────────────────────────────┘   │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      EXTERNAL SERVICES                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │  FakeStore   │  │   RapidAPI   │  │  Gemini AI   │               │   │
│  │  │     API      │  │  (Products)  │  │   (Vision)   │               │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  │  ┌──────────────┐                                                   │   │
│  │  │    Resend    │                                                   │   │
│  │  │   (Email)    │                                                   │   │
│  │  └──────────────┘                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 17.2 Request Flow Diagram

```
USER                    FRONTEND                    BACKEND                 DATABASE
 │                         │                          │                        │
 │  1. Open App            │                          │                        │
 ├────────────────────────►│                          │                        │
 │                         │  2. Auth Check           │                        │
 │                         ├─────────────────────────►│                        │
 │                         │                          │  3. Verify JWT         │
 │                         │                          ├───────────────────────►│
 │                         │                          │◄───────────────────────┤
 │                         │◄─────────────────────────┤  4. User data          │
 │  5. Render UI           │                          │                        │
 │◄────────────────────────┤                          │                        │
 │                         │                          │                        │
 │  6. Add to Cart         │                          │                        │
 ├────────────────────────►│  7. INSERT cart_items    │                        │
 │                         ├─────────────────────────►│  8. RLS Check          │
 │                         │                          ├───────────────────────►│
 │                         │                          │◄───────────────────────┤
 │  9. Cart Updated        │◄─────────────────────────┤                        │
 │◄────────────────────────┤                          │                        │
 │                         │                          │                        │
 │ 10. Checkout            │                          │                        │
 ├────────────────────────►│ 11. invoke('validate-order')                      │
 │                         ├─────────────────────────►│                        │
 │                         │                          │ 12. Read cart (admin)  │
 │                         │                          ├───────────────────────►│
 │                         │                          │◄───────────────────────┤
 │                         │                          │ 13. Verify prices      │
 │                         │                          │     (FakeStore API)    │
 │                         │                          │ 14. Create order       │
 │                         │                          ├───────────────────────►│
 │                         │                          │◄───────────────────────┤
 │                         │                          │ 15. Award coins        │
 │                         │                          ├───────────────────────►│
 │                         │                          │◄───────────────────────┤
 │ 16. Order Confirmation  │◄─────────────────────────┤                        │
 │◄────────────────────────┤                          │                        │
```

---

### 17.3 Database Relationship Diagram

```
                         ┌─────────────────┐
                         │   auth.users    │
                         │─────────────────│
                         │ id (PK)         │
                         │ email           │
                         │ encrypted_pwd   │
                         └────────┬────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐        ┌───────────────┐         ┌───────────────┐
│   profiles    │        │  deal_coins   │         │   orders      │
│───────────────│        │───────────────│         │───────────────│
│ id (PK)       │        │ id (PK)       │         │ id (PK)       │
│ user_id (FK)  │        │ user_id (FK)  │◄───┐    │ user_id (FK)  │
│ full_name     │        │ balance       │    │    │ order_number  │
│ email         │        │ total_earned  │    │    │ items (JSONB) │
│ referral_code │        │ total_spent   │    │    │ total         │
└───────────────┘        └───────────────┘    │    │ status        │
                                              │    └───────┬───────┘
                                              │            │
                         ┌────────────────────┴────────────┘
                         │
                         ▼
              ┌────────────────────────┐
              │ deal_coins_transactions│
              │────────────────────────│
              │ id (PK)                │
              │ user_id (FK)           │
              │ amount                 │
              │ type                   │
              │ order_id (FK nullable) │
              └────────────────────────┘

┌───────────────┐        ┌───────────────┐         ┌───────────────┐
│  cart_items   │        │   coupons     │         │ daily_deals   │
│───────────────│        │───────────────│         │───────────────│
│ id (PK)       │        │ id (PK)       │         │ id (PK)       │
│ user_id (FK)  │        │ code          │         │ title         │
│ product_id    │        │ discount_value│         │ deal_price    │
│ name          │        │ expires_at    │         │ ends_at       │
│ price         │        │ is_active     │         │ is_active     │
│ quantity      │        └───────────────┘         └───────────────┘
└───────────────┘

┌───────────────┐        ┌───────────────┐         ┌───────────────┐
│referral_codes │        │   referrals   │         │ daily_login_  │
│───────────────│        │───────────────│         │   claims      │
│ id (PK)       │        │ id (PK)       │         │───────────────│
│ user_id (FK)  │        │ referrer_id   │         │ id (PK)       │
│ code (UNIQUE) │        │ referred_id   │         │ user_id (FK)  │
└───────────────┘        │ referral_code │         │ claimed_date  │
                         │ coins_awarded │         │ coins_awarded │
                         └───────────────┘         └───────────────┘

┌───────────────┐        ┌───────────────┐
│product_reviews│        │ price_history │
│───────────────│        │───────────────│
│ id (PK)       │        │ id (PK)       │
│ user_id (FK)  │        │ product_name  │
│ product_id    │        │ store         │
│ rating        │        │ price         │
│ review_text   │        │ recorded_at   │
└───────────────┘        └───────────────┘
```

---

### 17.4 Step-by-Step Rebuild Guide

To rebuild DealWise from scratch:

#### Step 1: Initialize Project
```bash
npm create vite@latest dealwise -- --template react-ts
cd dealwise
npm install
```

#### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js @tanstack/react-query react-router-dom 
npm install framer-motion recharts sonner zod html5-qrcode
npm install @radix-ui/react-* (all primitives)
npm install tailwindcss postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate
```

#### Step 3: Configure Tailwind
- Create `tailwind.config.ts` with design tokens
- Create `src/index.css` with CSS variables
- Set up dark theme configuration

#### Step 4: Set Up shadcn/ui
```bash
npx shadcn@latest init
npx shadcn@latest add button card input (etc.)
```

#### Step 5: Create Supabase Project
1. Create Lovable Cloud project (or external Supabase)
2. Create database tables (see schema section)
3. Set up RLS policies
4. Create Edge Functions

#### Step 6: Build Core Features
1. Authentication (useAuth context)
2. Routing (React Router)
3. Layout (Header, Footer)
4. Product search
5. Cart system
6. Checkout flow
7. Deal Coins system

#### Step 7: Add Advanced Features
1. Visual search (Gemini AI)
2. Barcode scanning
3. Price comparison
4. Coupon system

#### Step 8: Deploy
1. Connect to Lovable Cloud
2. Configure environment variables
3. Deploy Edge Functions
4. Publish application

---

## Appendix A: Technology Decision Rationale

| Decision | Why |
|----------|-----|
| **React 18** | Component model, hooks, ecosystem |
| **Vite** | Fast HMR, optimized builds |
| **TypeScript** | Type safety, better DX |
| **Tailwind** | Utility-first, consistent design |
| **shadcn/ui** | Accessible, customizable components |
| **Supabase** | Full backend without server management |
| **Framer Motion** | Declarative animations |
| **TanStack Query** | Server state management |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **RLS** | Row-Level Security - database access control |
| **JWT** | JSON Web Token - authentication standard |
| **Edge Function** | Serverless function at CDN edge |
| **CSPRNG** | Cryptographically Secure Pseudo-Random Number Generator |
| **INR** | Indian Rupee |
| **EMI** | Equated Monthly Installment |
| **Deal Coin** | Loyalty points (1 coin = ₹1) |
| **FakeStore API** | Mock e-commerce API for testing |

---

## Document Information

**Author:** DealWise Team  
**Created:** March 2025  
**Total Pages:** ~200+ (rendered)  
**Word Count:** ~15,000+

---

*This documentation is intended for developers who need to understand, maintain, or extend the DealWise platform. For user documentation, see the Help Center.*
