# ORI6IN Website Overview (Source Summary)

Source: [Website Overview Google Doc](https://docs.google.com/document/d/1wqEzCWLFZXV1YRSyk-zjkmyxJnP6vYVld41OT4ywQYY/edit?pli=1&tab=t.0)

## Public Education surfaces (current)

| Path | Purpose |
|------|---------|
| `/` | Homepage — Dream. Apply. Fly. |
| `/programs` | Full Education catalogue with category filters |
| `/tools` | Free tools hub (University Finder, Course Finder, Scholarships, Cost Calculator, Eligibility, Country Compare) |
| `/hub` | Student Hub (communities, sessions, resources) |
| `/pricing` | Get a quote (no public price list) |
| `/mentors` | Counsellors directory |
| `/how-it-works` | Discover → Apply → Fly |
| `/about`, `/blog` | CMS-managed copy |
| `/roles` | Portal role guide (not in primary nav) |

Catalog seed: `packages/shared/src/education-catalog.ts` (synced when `ENABLE_DEMO_LOGINS=true`).

## Locked scope answers

### Public Website
- Phase 1: ORI6IN Education products (study abroad + test prep + packages)
- Pricing: personalised quote only (not direct public price list)
- Free planning tools on `/tools`
- Blogs managed through Admin CMS: Yes
- Internships still available after student login (platform track)

### Authentication
- One person, one role
- Companies created through admins only
- Parents register themselves

### Student Portal
- Learning: both self-paced and counsellor-led
- Project uploads for review: Yes
- Counsellor session booking: Yes
- Badges/points: Yes (gamification deferred)
- Attendance tracking: No (MVP)
- Auto-generated certificates: Yes (sandbox completion certs)

### Parent Portal
- Message counsellors through portal: Yes
- Approve opportunity applications: Yes
- Make payments: Yes (sandbox)

### Counsellor / Mentor Portal
- One counsellor → many students: Yes
- Session booking and reviews: Yes
- Internship completion approvals where used: Yes

### Company Portal
- Companies create internships: Yes
- Internships require admin approval: Yes
- Companies pay to post internships: Yes (sandbox)

### Admin Portal
- Impersonate users for support: Yes
- Approval workflows for internships: Yes
- Audit logs for every action: Yes

### AI Features
- Remember previous conversations: Yes (after basic chat)
- Use ORI6IN data (RAG) + general knowledge: Both
- Voice interaction: Later

## Month 1 MVP include
Public Website, Authentication, Student Portal (core), Counsellor Portal (core), Admin Portal (core), Programs & courses, Internship listings, Payments, AI Chat (basic), Notifications (email + in-app)

## Current focus
Education public launch polish: catalogue, tools, Student Hub, quote flow.  
Portal depth notes: [roadmap.md](./roadmap.md). Role guide: `/roles`.

## Explicitly deferred right now
- **AI depth** — memory/RAG, career coach, resume, roadmap, voice (basic chat stays)
- **Hardening** — live Razorpay/Stripe, production email hardening, S3, launch ops
- **Live Student Hub forums** — page + resources live; full community backend later

## Later
Community forums depth, Video Meetings, Referral, Gamification, Super Admin, Advanced analytics

Full notes: [roadmap.md](./roadmap.md) · Demo walkthrough: [demo-logins.md](./demo-logins.md)
