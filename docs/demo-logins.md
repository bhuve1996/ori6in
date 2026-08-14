# Temporary demo logins

**Status:** enabled when `ENABLE_DEMO_LOGINS=true` (default in local `.env`).

These accounts are seeded on API startup so stakeholders can walk every portal without registering.  
**Disable later:** set `ENABLE_DEMO_LOGINS=false` in `.env` and restart the API — demo emails will be rejected at login.

Shared password for all accounts:

```
DemoPass123!
```

| Role | Email | Password | Portal |
|------|-------|----------|--------|
| Student | `student@demo.ori6in.test` | `DemoPass123!` | http://localhost:3000/student |
| Mentor | `mentor@demo.ori6in.test` | `DemoPass123!` | http://localhost:3000/mentor |
| Parent | `parent@demo.ori6in.test` | `DemoPass123!` | http://localhost:3000/parent |
| Company | `company@demo.ori6in.test` | `DemoPass123!` | http://localhost:3000/company |
| Admin | `admin@demo.ori6in.test` | `DemoPass123!` | http://localhost:3000/admin |
| Super Admin | `superadmin@demo.ori6in.test` | `DemoPass123!` | http://localhost:3000/admin |

Quick picker page (local only): http://localhost:3000/demo-login

Login page: http://localhost:3000/login

### Demo content (also seeded when demo logins are on)

**Source of truth:** `packages/shared/src/demo-content.ts`  
Edit that file to change programs, CMS pages, blog, mentors, internships, curriculum, and the demo student profile. The API reseeds from it on startup.

| Type | What you should see |
|------|---------------------|
| Programs | Career Launchpad, AI Foundations (public); Mentor Intensive draft (admin only) |
| Pages | `/about`, `/pricing` from CMS |
| Blog | Welcome + Choosing your first program |
| Mentors | 6 public mentor personas on `/mentors` (profiles + bios). Portal login remains `mentor@…` only |
| Internships | Frontend / Data / Mentor Ops (student portal) |

### Demo purchase path

1. Login as `student@demo.ori6in.test`
2. Open a program → **Buy now** (or `/checkout?programId=…`)
3. Optional coupon: `ORI6IN10` (10% off)
4. **Pay (sandbox)** → lands on `/student/orders`

### Demo learning path

Demo student is pre-enrolled in **Career Launchpad**.

1. Login as student → `/student/courses`
2. Open **Getting Started** → open a lesson → **Mark complete**
3. Buy **AI Foundations** to unlock its course too

### Demo internships path

Internships are **login-only** (not on the public site).

1. Login as student → `/student/internships`
2. Open a role → **Apply**
3. See status under **My applications**

### Demo mentor path

Public directory: http://localhost:3000/mentors (all personas from `demo-content.ts`).

Portal login mentor is assigned to the demo student on **Career Launchpad**.

1. Login as `mentor@demo.ori6in.test` → `/mentor`
2. Open **Students** → Demo Student → add a session note
3. Open **Reviews & notes** → submit a review

### Demo admin path

1. Login as `admin@demo.ori6in.test` → `/admin` (live stats)
2. **Users** — filter roles, create company, assign mentor, impersonate
3. Public **Mentors** directory lists seeded mentor personas (+ any real mentor accounts)

> Do not use these credentials in production. They are walkthrough-only bypass accounts.
