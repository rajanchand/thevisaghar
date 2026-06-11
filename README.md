# The Visa Ghar (thevisaghar.com)

A professional, production-ready Next.js visa and immigration consultancy platform targeting Nepali clients seeking UK, Schengen, and Australia visas.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router) + TypeScript |
| **Styling** | Tailwind CSS v4 + Framer Motion |
| **Database** | PostgreSQL via Prisma ORM |
| **Authentication** | NextAuth.js (Credentials + JWT + bcrypt) |
| **AI Chat** | Vercel AI SDK + Claude (streaming) |
| **Email** | Resend API |
| **Admin Panel** | Custom CMS for services, bookings, inquiries, team, testimonials, and audit logs |
| **Testing** | Jest + Playwright |
| **CI/CD** | GitHub Actions |

## Architecture

```
src/
├── app/
│   ├── (public)/      # Public pages: home, services, blog, courses, etc.
│   ├── admin/         # Admin dashboard, CRUD pages
│   └── api/           # API routes (admin, public, auth, chat)
├── components/        # Reusable UI and layout components
├── lib/               # Utilities: auth, db, email, rate-limit, validation
├── middleware.ts       # Admin route protection + security
└── types/             # TypeScript type definitions
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database instance ([Supabase](https://supabase.com), [Neon](https://neon.tech), or local)

### 1. Installation
```bash
git clone https://github.com/rajanchand/thevisaghar.git
cd thevisaghar
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```
Update the following in `.env`:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
- `ADMIN_SEED_PASSWORD` — Strong password for the admin account
- `ANTHROPIC_API_KEY` — For the AI chat widget (optional)
- `RESEND_API_KEY` — For email notifications (optional)

### 3. Database Setup
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000). Admin panel at `/admin/login`.

---

## Testing

### Unit / Integration Tests
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npx playwright install
npm run test:e2e
```

---

## Security

- **Authentication**: JWT-based sessions with bcrypt password hashing
- **Authorization**: Middleware enforces ADMIN role on all `/admin` routes
- **Rate Limiting**: In-memory sliding window on login, contact, booking, and chat endpoints
- **Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy
- **Input Validation**: Zod schemas on all form inputs (client + server)
- **XSS Protection**: DOMPurify for rich text sanitization

To report a security vulnerability, email **security@thevisaghar.com**.

---

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
1. Install dependencies
2. Security audit (`npm audit --audit-level=high`)
3. Lint check
4. Unit/integration tests
5. Production build

Dependabot is configured for weekly npm updates and monthly GitHub Actions updates.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, code style, and PR guidelines.

## License

[MIT](./LICENSE)
