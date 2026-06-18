# Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) project (for database)
- A [Resend](https://resend.com) account (for email delivery)

## 1. Supabase Setup

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** and run the migration to create the `bouquets` table:

```sql
CREATE TABLE bouquets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  recipient_email TEXT,
  sender_email TEXT,
  message TEXT NOT NULL,
  occasion TEXT,
  selected_flowers JSONB NOT NULL DEFAULT '[]',
  arrangement_data JSONB NOT NULL DEFAULT '{}',
  style_data JSONB NOT NULL DEFAULT '{}',
  delivery_method TEXT,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast slug lookups
CREATE INDEX idx_bouquets_slug ON bouquets (slug);

-- Enable RLS (optional, for public read access to bouquets)
ALTER TABLE bouquets ENABLE ROW LEVEL SECURITY;

-- Allow public read access to bouquets
CREATE POLICY "Public can read bouquets" ON bouquets
  FOR SELECT USING (true);

-- Allow authenticated inserts (service role bypasses RLS)
CREATE POLICY "Service role can insert bouquets" ON bouquets
  FOR INSERT WITH CHECK (true);
```

3. Go to **Settings > API** and note:
   - `Project URL` (e.g., `https://xyz.supabase.co`)
   - `anon public` key
   - `service_role` key (keep this secret!)

## 2. Resend Setup

1. Create an account at [resend.com](https://resend.com)
2. Go to **Domains** and add your domain (e.g., `bloomora.app`)
3. Add the required DNS records (SPF, DKIM, DMARC) to verify your domain
4. Once verified, go to **API Keys** and create a new key
5. Note the API key

## 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_your-api-key
RESEND_FROM_EMAIL=Bloomora <hello@yourdomain.com>
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

> **Important:** `SUPABASE_SERVICE_ROLE_KEY` is used server-side only and bypasses RLS. Never expose it to the client.

## 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Vercel Environment Variables

Add all environment variables above in the Vercel dashboard under **Settings > Environment Variables**.

## 5. Local Development

```bash
npm install
npm run dev
```

The app works without Supabase or Resend configured (uses in-memory storage and logs emails to console).

## Architecture

```
src/
  app/
    api/bouquets/route.ts          # POST: create bouquet
    api/bouquets/[slug]/route.ts   # GET: fetch bouquet by slug
    api/bouquets/[slug]/send-email/ # POST: send email via Resend
    create/                        # Builder wizard (6 steps)
    bouquet/[slug]/                # Recipient viewing page
  lib/
    supabase.ts                    # Supabase client (anon + admin)
    email.ts                       # Resend email wrapper
    store.tsx                      # Builder state (React Context + sessionStorage)
    arrangement.ts                 # Flower position generation
```
