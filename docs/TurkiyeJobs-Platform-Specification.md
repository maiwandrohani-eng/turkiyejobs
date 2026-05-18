# TurkiyeJobs.org — Complete Product & Technical Specification

**For Cursor AI / developers cloning TürkiyeJobs for Turkey**

Replace geography and Turkish with Turkey and Turkish; keep architecture and workflows identical unless noted.

---

## 1. Product overview

### 1.1 Purpose
Sector-specific job board for NGOs, INGOs, development agencies, and social enterprises:
- **Individuals** — browse, save, apply
- **Organizations** — register, verify, post listings
- **Admins** — verify orgs, approve listings, moderate users

### 1.2 Core value
- **Two-stage trust:** organization account + each listing human-reviewed before public
- **Listing types:** Jobs, Consultancies, Trainings, Volunteer Roles, Tenders, Grants
- **Apply modes:** internal on-platform, email, external URL
- **Verified employer directory**

### 1.3 Market (TurkiyeJobs)
| Dimension | Value |
|-----------|--------|
| Sector | Turkey NGO / development / civil society |
| Languages | **English + Turkish (TR)** |
| Domain | **https://turkiyejobs.org** |
| Secondary locale | Turkish (`tr`) — **LTR** (not RTL) |
| Examples | Istanbul, Ankara, Turkish organizations |

---

## 2. Tech stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Language | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7 |
| Auth | NextAuth v4, Credentials, JWT (30 days) |
| Email | Resend |
| Passwords | bcryptjs |
| Validation | Zod |
| Hosting | Vercel (GitHub main → deploy) |

### Scripts
```bash
npm run dev
npm run build
npx prisma db push    # from app root (turkiyejobs/)
npx prisma db seed
```

### Environment
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://turkiyejobs.org
NEXT_PUBLIC_SITE_URL=https://turkiyejobs.org
NEXT_PUBLIC_ENABLE_DEMO_AUTH=false
RESEND_API_KEY=
EMAIL_FROM=TurkiyeJobs <noreply@turkiyejobs.org>
CONTACT_INBOX_EMAIL=
```

---

## 3. Design system

- **Navy** `#1b365d` — primary
- **Gold** `#c5a059` — accent
- **Background** `#f8f7f4`
- Rounded cards, PageShell/PageIntro, sticky header

---

## 4. Roles & auth

| Role | Dashboard |
|------|-----------|
| INDIVIDUAL | /dashboard/user |
| ORG_USER | /dashboard/organization |
| ADMIN | /dashboard/admin |

Register → login → JWT. `/dashboard/*` protected in `src/proxy.ts`. Demo auth only local (`NEXT_PUBLIC_ENABLE_DEMO_AUTH=true`).

---

## 5. Database (Prisma)

**Models:** User, Organization, OrganizationProfileChange, Category (nameEn + nameTr), Opportunity, OpportunityAttachment, Application, SavedOpportunity, FeaturedOpportunity, ExternalApplyIntent, Notification, AdminActionLog, PasswordResetToken, NewsletterSubscription, EarlyAccessEmail, CommunityEvent (confirmed boolean), SiteSetting.

**Opportunity status:** PENDING_APPROVAL → PUBLISHED | REJECTED | CLOSED

**Org verification:** PENDING → VERIFIED | REJECTED

**Categories:** Jobs, Consultancies, Trainings, Volunteer Roles, Tenders, Grants

---

## 6. Workflows

### Organization (stage 1)
Register → admin approve/reject → VERIFIED can post.

### Listing (stage 2)
Submit → admin approve/reject → public catalog. Featured toggle. Close/delete.

### Applications
- Internal: POST /api/applications/internal → Application row + emails
- Email / external: instructions + ExternalApplyIntent
- Employer PATCH application status → applicant email

### Catalog
GET /api/catalog — published only, no-store. Production uses Neon, not localStorage.

### Homepage early launch
If published count < 10: early-access email (EarlyAccessEmail). Else: category pills.

---

## 7. Public routes

| Route | Purpose |
|-------|---------|
| / | Homepage (hero, org strip, categories/early-access, explore, newsletter, employer CTA, catalog) |
| /opportunities | Filterable listings |
| /opportunities/[id] | Detail + apply |
| /organizations | Directory |
| /organizations/[slug] | Org profile |
| /resources, /resources/[slug] | Articles (code-based) |
| /about, /how-it-works, /impact | Content |
| /events | CommunityEvent + UNCONFIRMED badges |
| /sectors, /spotlights, /partners, /posting-guidelines, /contact | Hubs |
| /login, /register, /forgot-password, /reset-password | Auth |

---

## 8. Dashboards

**User:** applications, saved jobs, profile

**Organization:** post form (category-specific fields), listings, applications, profile changes (pending admin)

**Admin:** pending orgs/opportunities, registry (users/orgs mutate), profile changes, audit logs, site contact settings, transactional email test

---

## 9. API summary

Public: catalog, newsletter/subscribe, early-access, contact

Auth: register, forgot/reset password, nextauth

Me: applications, saved, password, external-intents

Organization: opportunities CRUD, applications PATCH, profile, posting-status

Admin: moderate orgs/opportunities, registry, users/mutate, audit-logs, site-settings

---

## 10. Internationalization

**File:** `src/lib/i18n/home-translations.ts`

- Locales: `en` | `tr` (not Turkish)
- `LanguageContext` — toggle in header, localStorage
- **Turkish is LTR** — `dir="ltr"` for both EN and TR
- Translate all keys in HOME_TRANSLATIONS (hero, nav, footer, filters, contact, etc.)
- Category DB field: `nameTr` instead of `nameAr`

---

## 11. Homepage spec

**Hero:** two subheadlines + trust line “Every employer verified. Every listing reviewed.”; CTAs Browse opportunities | Post a listing → /dashboard/organization

**Org strip:** verified organizations with logo/name → profile

**Categories:** 6 pills if ≥10 listings; else early launch + Notify me

**Explore:** 6 cards; card 6 “Our commitments” → /impact

**Newsletter** + **Employer CTA** (light background)

**HomeCatalog:** featured + latest

---

## 12. Content pages

**About:** mission, who we serve (4 bullets), quality, who built this (founder — Turkey copy)

**How it works:** applicants — all listings reviewed; employers — numbered 3-step two-stage + 48h email note

**Impact:** Our commitments (4 bullets), How verification works, existing principle sections

**Events:** confirmed field, UNCONFIRMED badge, warning banner

**Resources:** newsletter top; author default “TurkiyeJobs Editorial”; read time ceil(words/200)

**Contact:** Resend to inbox + user confirmation

---

## 13. Email (Resend)

Registration, password reset, application submitted, org approved/rejected, opportunity approved/rejected, application status, contact form.

---

## 14. Repository layout

```
turkiyejobs/          # clone of turkiyejobs app root
├── prisma/schema.prisma
├── prisma.config.ts
├── src/app/
├── src/components/
├── src/context/
├── src/lib/
└── src/proxy.ts
```

Run Prisma from **app root** where `.env` lives.

---

## 15. Turkey clone checklist

- [ ] Brand: TurkiyeJobs.org, logo, turkiyejobs.org env URLs
- [ ] Replace Türkiye/Istanbul/TürkiyeJobs strings with Turkey/Istanbul
- [ ] `en` + `tr` translations (full home-translations.ts)
- [ ] EN | TR toggle; LTR only
- [ ] New Neon DB, prisma db push, seed, Resend
- [ ] Vercel deploy from main; DEMO_AUTH false

---

## 16. Reference

Based on TürkiyeJobs.org architecture (commit 2a33ee9). Domain for this document: **https://turkiyejobs.org**

Contact default: hello@turkiyejobs.org  
Email from: TurkiyeJobs &lt;noreply@turkiyejobs.org&gt;

---

*End of specification*
