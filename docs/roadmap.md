# ORI6IN roadmap (current focus)

## Current focus: Phase 2 product depth

We are building real parent / company / mentor / internship workflows next.
Month 1 MVP (public site + core student / mentor / admin) is treated as the base.

### Phase 2 build queue
1. **Company** — ✅ role CRUD, applicant pipeline, sandbox pay-to-post + admin approval (interviews list from pipeline)  
2. **Parent** — ✅ student linking (invite/accept), 2-way messaging, sandbox payments & internship approvals  
3. **Mentor** — ✅ session booking, review drafts/templates, internship completion approvals  
4. **Internships** — ✅ student status board (timeline + parent/mentor decisions), company labels/notes, admin pending queue polish  
5. **Platform extras** — ✅ sandbox program certificates (issue / student view / admin list / public verify); mentor meeting links on sessions · remaining: community, referrals/gamification, live video providers, deeper analytics, distinct super-admin

Public explainer page: `/roles` (“What you can do”).

---

## Explicitly skipped for now

### AI (deferred)
- Keep basic student AI chat as-is  
- **Skip for now:** conversation memory / RAG, AI career coach, AI resume, AI roadmap, voice  
- Scaffold API modules under `ai-career-coach`, `ai-resume`, `ai-roadmap` stay deferred

### Hardening / production ops (deferred)
- Live Razorpay / Stripe (checkout remains sandbox-capable until we wire providers)  
- Production transactional email (verify / reset / notifications)  
- Hardened S3 file storage  
- Custom domain polish, monitoring, backups playbooks  
- Turning off demo logins for a “real” public launch  
- Broad automated test / CI gate expansion  

These are fine to pick up **after** Phase 2 product depth — not blockers for Phase 2 feature work.

---

## Already shipped (Phase 1 base)
- Public marketing site, programs, mentors directory, blog/CMS, pricing/about  
- Auth (email flows + demo logins), RBAC  
- Student learning + profile + internship browse/apply  
- Mentor hub / students / reviews  
- Admin users / catalog / CMS  
- Parent & company **thin** portals (UI + light APIs; Phase 2 deepens them)  
- Railway Docker deploy path  

See also: [mvp-checklist.md](./mvp-checklist.md), [modules.md](./modules.md), [website-overview.md](./website-overview.md).
