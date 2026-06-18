# Bloomora

A digital bouquet builder that lets users create personalized virtual flower arrangements and share them via email or link.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 6
- **UI:** React 19, Tailwind CSS 4, Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (optional for local dev)
- A Resend API key (optional for local dev)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/anmolsansi/Bloomora.git
   cd Bloomora
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment file and fill in your keys:

   ```bash
   cp .env.local.example .env.local
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | No* | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No* | Supabase anonymous key |
| `RESEND_API_KEY` | No* | Resend API key for sending emails |
| `NEXT_PUBLIC_APP_URL` | No | Base URL for email links (defaults to `http://localhost:3000`) |

\* The app works without these in development using in-memory storage. All are required for production.

### Database Setup

If using Supabase, run the migration in the Supabase SQL editor:

```sql
-- See supabase/migrations/001_initial.sql
```

## Project Structure

```
src/
  app/
    create/           # Multi-step bouquet builder
      flowers/        # Step 1: Select flowers
      arrange/        # Step 2: Arrange positions
      customize/      # Step 3: Style wrapper/ribbon/background
      message/        # Step 4: Write personal message
      preview/        # Step 5: Preview before sending
      delivery/       # Step 6: Email or get share link
    bouquet/[slug]/   # Recipient view page
    api/bouquets/     # REST API for bouquet CRUD + email
  components/
    builder/          # Builder UI components
    landing/          # Home page sections
    layout/           # Header, footer, builder layout
    recipient/        # Recipient-facing components
    ui/               # Reusable UI primitives
  lib/                # Utilities, state, email, flowers data
  types/              # TypeScript interfaces
```

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
```

## License

MIT
