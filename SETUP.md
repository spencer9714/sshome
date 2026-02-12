# SSHome Staging - Setup Guide

## Prerequisites

- Node.js 18+
- npm
- A Supabase project (free tier works)
- A Vercel account (for deployment)

---

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd sshome
npm install
```

## 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **anon public key** from Settings > API
3. Note your **service_role key** (keep this secret, server-side only)

## 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. Run Database Migrations

In the Supabase Dashboard, go to **SQL Editor** and run these files in order:

1. `supabase/migrations/001_initial_schema.sql` - Tables, triggers, indexes, RLS policies
2. `supabase/migrations/002_storage.sql` - Storage bucket and policies

Alternatively, if using the Supabase CLI:

```bash
supabase db push
```

## 5. Create Storage Bucket

If the storage migration didn't create the bucket automatically:

1. Go to Supabase Dashboard > Storage
2. Create a new bucket called `portfolio`
3. Set it to **Public** (public read access)
4. The RLS policies from the migration handle write protection

## 6. Configure Auth

1. Go to Supabase Dashboard > Authentication > Settings
2. Ensure **Email** provider is enabled
3. Disable "Confirm email" for development (optional)

## 7. Create Your Admin User

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user" and create a user with email/password
3. Go to SQL Editor and promote to admin:

```sql
UPDATE profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'your-admin@email.com'
);
```

## 8. Seed Sample Data (Optional)

Run the seed script in SQL Editor:

```bash
# Copy contents of supabase/seed.sql and run in SQL Editor
```

This inserts 8 sample portfolio projects.

## 9. Run Development Server

```bash
npm run dev
```

Visit:
- Public site: http://localhost:3000
- Admin login: http://localhost:3000/login
- Admin dashboard: http://localhost:3000/admin

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial SSHome Staging site"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Set the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy

### 3. Update Supabase Redirect URLs

In Supabase Dashboard > Authentication > URL Configuration:
- Add your Vercel URL to **Site URL** and **Redirect URLs**

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages with navbar/footer
│   │   ├── page.tsx       # Home
│   │   ├── portfolio/     # Portfolio list + [slug] detail
│   │   ├── services/      # Services page
│   │   ├── about/         # About page
│   │   └── quote/         # Quote form + server action
│   ├── admin/             # Protected admin pages
│   │   ├── page.tsx       # Dashboard
│   │   ├── projects/      # Project CRUD + image manager
│   │   └── leads/         # Lead management
│   ├── login/             # Admin login
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles + theme
│   ├── robots.ts          # robots.txt
│   └── sitemap.ts         # sitemap.xml
├── components/
│   ├── layout/            # Navbar, Footer, Section
│   ├── portfolio/         # ProjectCard
│   └── ui/                # Button, Input, Select, Badge, etc.
├── lib/
│   ├── supabase/          # Client, server, middleware helpers
│   ├── types/             # Database types
│   ├── constants.ts       # App constants, options, nav links
│   └── utils.ts           # Utility functions
└── middleware.ts           # Route protection
```

---

## TODO: Future Integrations

### Email Notifications (Resend)

Scaffolded in `src/app/(public)/quote/actions.ts`. To enable:

1. `npm install resend`
2. Add `RESEND_API_KEY` to env vars
3. Uncomment the Resend code in the quote form server action
4. Create email templates

### Slack Notifications

Scaffolded in the same file. To enable:

1. Create a Slack incoming webhook
2. Add `SLACK_WEBHOOK_URL` to env vars
3. Uncomment the Slack webhook code

### CMS Migration (Sanity)

If you want to migrate content management to Sanity:

1. Replace Supabase project queries with Sanity GROQ queries
2. Keep Supabase for auth and leads (or migrate those too)
3. The admin UI can be replaced with Sanity Studio
4. The public pages' data fetching layer is cleanly separated for easy swapping

### Richer Role Management

Currently roles are managed via SQL. To build a UI:

1. Add a `/admin/settings` page
2. Create an admin users list from the `profiles` table
3. Add role update functionality (already permitted by RLS)
