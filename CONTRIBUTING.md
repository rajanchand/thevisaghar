# Contributing to The Visa Ghar

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL database (or [Supabase](https://supabase.com) / [Neon](https://neon.tech) for managed hosting)

### Getting Started

1. **Fork and clone** the repository
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and secrets
   ```
4. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
5. **Start the dev server**:
   ```bash
   npm run dev
   ```

## Code Style

- **TypeScript**: Strict mode enabled. No `any` types.
- **ESLint**: Run `npm run lint` before committing.
- **Formatting**: Use your editor's auto-format with the project config.
- **Naming**: camelCase for variables/functions, PascalCase for components/types.

## Making Changes

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes following the code style guidelines.
3. Add or update tests as needed.
4. Run the full test suite:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
5. Commit with a descriptive message:
   ```
   feat: add visa eligibility quiz
   fix: resolve booking form date validation
   docs: update API documentation
   ```
6. Push your branch and open a Pull Request.

## Pull Request Guidelines

- Keep PRs focused on a single change.
- Include a clear description of what and why.
- Link related issues.
- Ensure CI passes before requesting review.
- Add screenshots for UI changes.

## Testing

- **Unit tests**: `npm run test` (Jest)
- **E2E tests**: `npm run test:e2e` (Playwright)
- Write tests for new features and bug fixes.

## Security

If you discover a security vulnerability, please **do not** open a public issue. Instead, email **security@thevisaghar.com** with details.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
