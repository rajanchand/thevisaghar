# Static Content Layer README — The Visa Ghar

This document describes the decoupled static content architecture implemented for public routes, guidelines for adding new resources, and outstanding placeholders.

---

## 1. Content Layer Architecture Choice

All public read-only pages (Home, Services, Country details, Courses, Success Stories, Blog post views) are powered by a **Version-Controlled Static TypeScript Data Layer** located in the [data/](file:///Users/drona/Virus/untitled%20folder/the%20visa%20ghar/data) directory.

### Why this approach?
1. **SSG Compatibility & Speed**: Enables Next.js to pre-render all public views to static HTML during builds (`generateStaticParams`). Page loads are instantaneous and have perfect Lighthouse performance.
2. **SEO Performance**: Search engines crawl fully pre-rendered HTML containing correct meta structures, JSON-LD schemas, and heading hierarchies.
3. **Database Decoupling**: Eliminates database query overhead on public traffic. Prisma/PostgreSQL is reserved strictly for admin writes (bookings, contact inquiries, and CMS activity).
4. **Type Safety**: Avoids parsing inconsistencies or runtime JSON errors by validating data structures during compilation.

---

## 2. Managing Content (How-To)

### Add a New Study Destination
1. Open [data/countries.ts](file:///Users/drona/Virus/untitled%20folder/the%20visa%20ghar/data/countries.ts).
2. Append a new object to the `countries` array matching the `Country` interface structure.
3. On the next build, Next.js will automatically create the route at `/countries/[slug]` and list the destination in the main catalog.

### Add a New Success Story (Testimonial)
1. Open [data/testimonials.ts](file:///Users/drona/Virus/untitled%20folder/the%20visa%20ghar/data/testimonials.ts).
2. Append a new client object matching the `Testimonial` interface.
3. The story will automatically render on the home page and in the filterable grid at `/success-stories`.

### Add a New Blog Post
1. Open [data/blog-posts.ts](file:///Users/drona/Virus/untitled%20folder/the%20visa%20ghar/data/blog-posts.ts).
2. Append an article object matching the `BlogPost` interface (including a detailed `contentHtml` body in plain English).
3. The article will automatically generate at `/blog/[slug]` and list on the main blog catalog.

---

## 3. Placeholders Remaining to Fill In

While the platform is fully production-ready, the following items should be configured prior to final deployment:
1. **Testimonial Avatars & Team Photos**: Add real photos in `public/images/` and update references in `data/testimonials.ts` and `data/team.ts` (currently fall back to color circles with initials).
2. **Production Env Variables**: Configure `RESEND_API_KEY` for email dispatch, `DATABASE_URL` (production database connection), and `NEXTAUTH_SECRET` in the active `.env` file.
3. **Google Analytics/Pixel IDs**: Insert tracking tags into the root layout if marketing scripts are required.
