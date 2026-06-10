# The Visa Ghar (thevisaghar.com)

A professional, production-ready Next.js visa and immigration consultancy platform targeting Nepali clients seeking UK, Schengen, and Australia visas.

## Tech Stack
- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider + JWT + bcrypt)
- **AI Chat Widget**: Vercel AI SDK + Claude (streaming via Claude Sonnet)
- **Email Notifications**: Resend API
- **CMS/Admin**: Custom Admin Panel for managing services, bookings, inquiries, team members, testimonials, and audit logs.

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database instance (or a Supabase connection string)

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install --legacy-peer-deps
```

### 2. Environment Configuration
Create a `.env` file in the root directory based on the `.env.example` file:
```bash
cp .env.example .env
```
Ensure you update the following environment variables:
- `DATABASE_URL`: Connection string to your PostgreSQL instance.
- `NEXTAUTH_SECRET`: Random 32-character string.
- `ANTHROPIC_API_KEY`: For the Claude AI Chat widget.
- `RESEND_API_KEY`: For email triggers (contact/bookings).

### 3. Database Migration & Seeding
Apply the Prisma schema migrations and seed initial catalog data (such as UK Student, Skilled Worker, Schengen visa profiles, and admin credentials):
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database catalog and default admin credentials
# Default admin credentials:
# Email: admin@thevisaghar.com
# Password: Admin123!
npx prisma db seed
```

### 4. Running Locally
Start the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site. Navigate to `/admin/login` to access the administration panel.

---

## Testing

This codebase includes automated Jest unit/integration tests and Playwright E2E browser test setups.

### Running Unit/Integration Tests
Runs the Jest test suite:
```bash
npm run test
```

### Running Playwright E2E Tests
Runs the Playwright E2E tests:
```bash
npx playwright install
npm run test:e2e
```

---

## CI/CD Pipeline
A GitHub Actions workflow is configured in `.github/workflows/ci.yml` that automatically:
1. Installs clean dependencies.
2. Audits packages for vulnerabilities.
3. Runs linters.
4. Executes unit and integration test suites.
5. Builds the production bundle to verify compilation.
