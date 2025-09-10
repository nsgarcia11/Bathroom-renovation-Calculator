# Bathroom Renovation Calculator

A professional bathroom renovation estimation tool built with Next.js, Supabase, and Stripe.

## Features

- **7 Workflow Screens**: Demolition, Shower Walls, Shower Base, Floors, Finishings, and more
- **Estimate Engine**: Line items per workflow screen with live calculations and grand totals
- **Auto-save**: All data automatically saved to Supabase database
- **Notes Aggregator**: Collects notes from all workflow screens in one place
- **PDF Export**: Professional estimate templates (requires subscription)
- **Stripe Subscriptions**: Monthly subscription for PDF export access
- **Secure Authentication**: Email-only login with Supabase Auth

## Prerequisites

- **Node.js**: v20.0.0 or higher (required)
- **npm**: v10.0.0 or higher
- **Supabase Account**: For database and authentication
- **Stripe Account**: For payment processing

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Real-time)
- **Payments**: Stripe (Subscriptions, Webhooks)
- **Deployment**: Vercel

## Getting Started

### Quick Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bathroom-renovation-calculator
   ```

2. **Run the setup script** (recommended)

   ```bash
   ./scripts/setup.sh
   ```

3. **Or manually set up Node.js v20**

   ```bash
   # If you have nvm installed
   nvm use

   # Or install Node.js v20
   nvm install 20
   nvm use 20
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Set up environment variables** (see Environment Variables section)

6. **Start the development server**
   ```bash
   npm run dev
   ```

### Manual Setup

If you prefer to set up manually:

1. Ensure you have Node.js v20+ installed
2. Install dependencies: `npm install`
3. Set up environment variables (see Environment Variables section)
4. Run the development server: `npm run dev`

## Environment Variables

1. Copy the example environment file:

```bash
cp env.example .env.local
```

2. Configure your environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Set up the database:

   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor

6. Set up Stripe:

   - Create a Stripe account
   - Create a monthly subscription product
   - Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Add webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

7. Run the development server:

```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── workflow/          # Workflow screens
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── pages/             # Page components
│   └── ui/                # UI components
├── contexts/              # React contexts
├── lib/                   # Utility functions
└── types/                 # TypeScript types
```

## Workflow Screens

1. **Demolition**: Remove existing fixtures and materials
2. **Shower Walls**: Tile measurements, design options, construction details
3. **Shower Base**: Base measurements and design options
4. **Floors**: Floor measurements and tile selection
5. **Finishings**: Fixtures, hardware, and paint options

## Database Schema

The application uses the following main tables:

- `contractors`: Contractor information
- `projects`: Project details
- `workflow_screens`: Workflow screen data
- `line_items`: Labor and material line items
- `subscriptions`: User subscription status

## Stripe Integration

- Monthly subscription plan for PDF export access
- Webhook handling for subscription status updates
- Customer portal for subscription management

## Deployment

1. Deploy to Vercel:

```bash
vercel --prod
```

2. Set environment variables in Vercel dashboard

3. Update `NEXT_PUBLIC_APP_URL` to your production domain

4. Configure Stripe webhook endpoint to point to your production URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is confidential and proprietary. All rights reserved.
