# DealWise – Wisdom in Deals

A deal-comparison app built with React, Vite, and Supabase.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/KrupPatel31/DealWise-Wisdom-in-Deals.git
cd DealWise-Wisdom-in-Deals
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Open `.env` and set the two required variables:

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

**Where to find these values:**

1. Go to [https://supabase.com](https://supabase.com) and open your project.
2. Navigate to **Project Settings → API**.
3. Copy the **Project URL** → paste as `VITE_SUPABASE_URL`.
4. Copy the **anon / public** key → paste as `VITE_SUPABASE_PUBLISHABLE_KEY`.

> **Important:** After creating or editing `.env`, restart the Vite dev server so the new
> variables are picked up.

### 4. Start the dev server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Troubleshooting – "Failed to fetch" / Sign In & Sign Up errors

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| "Supabase is not configured" toast | `.env` file is missing or variables are empty | Follow step 3 above and restart the dev server |
| "Cannot reach Supabase" toast | Network issue – adblock, VPN, or wrong URL | See below |
| Generic "Failed to fetch" | Browser network request blocked | See below |

### Network / CORS checklist

1. **Verify the URL** – `VITE_SUPABASE_URL` must be exactly `https://<ref>.supabase.co` (no trailing slash, no path).
2. **Adblock / browser extensions** – Some extensions block requests to `*.supabase.co`. Try in an incognito window without extensions.
3. **VPN / corporate proxy** – VPNs can intercept HTTPS and cause certificate or CORS errors. Try disabling the VPN.
4. **Mixed content** – Ensure you access the dev server via `http://localhost` (Vite's default). If you serve the app over HTTPS locally with a self-signed certificate, some browsers enforce stricter CORS/security policies that can interfere with Supabase requests.
5. **Supabase project paused** – Free-tier projects pause after inactivity. Visit the Supabase dashboard to resume your project.
6. **Wrong anon key** – Ensure you copied the **anon** key, not the **service_role** key.
