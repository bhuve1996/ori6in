# ORI6IN Website Overview (Source Summary)

Source: [Website Overview Google Doc](https://docs.google.com/document/d/1wqEzCWLFZXV1YRSyk-zjkmyxJnP6vYVld41OT4ywQYY/edit?pli=1&tab=t.0)

## Locked scope answers

### Public Website
- Phase 1: ORI6IN products only (not partner programs)
- Direct purchase without sales: Yes
- Internships visible after login only
- Blogs managed through Admin CMS: Yes

### Authentication
- One person, one role
- Companies created through admins only
- Parents register themselves

### Student Portal
- Learning: both self-paced and mentor-led
- Project uploads for review: Yes
- Mentor session booking: Yes
- Badges/points: Yes (gamification deferred to Month 3 per roadmap)
- Attendance tracking: No (MVP)
- Auto-generated certificates: No (MVP)

### Parent Portal
- Message mentors through portal: Yes
- Approve internships: Yes
- Make payments: Yes

### Mentor Portal
- One mentor → many students: Yes
- Mentors create courses only with Admin approval
- Mentors grade assignments: Yes
- Mentors approve internship completion with supporting docs: Yes

### Company Portal
- Companies create internships: Yes
- Internships require admin approval: Yes
- Companies pay to post internships: Yes

### Admin Portal
- Impersonate users for support: Yes
- Approval workflows for courses/internships: Yes
- Audit logs for every action: Yes

### AI Features
- Remember previous conversations: Yes (after basic chat)
- Use ORI6IN data (RAG) + general knowledge: Both
- Voice interaction: Later

## Month 1 MVP include
Public Website, Authentication, Student Portal (core), Mentor Portal (core), Admin Portal (core), Programs & courses, Internship listings, Payments, AI Chat (basic), Notifications (email + in-app)

## Current focus (Phase 2)
Parent Portal depth, Company Portal depth, Mentor booking / richer reviews, Internship approval workflows.  
Public role guide: `/roles`.

## Explicitly deferred right now
- **AI depth** — memory/RAG, career coach, resume, roadmap, voice (basic chat stays)
- **Hardening** — live Razorpay/Stripe, production email, S3 hardening, launch ops

## Later (after Phase 2 depth)
Community & Forums, Video Meetings, Referral, Gamification, Super Admin, Advanced analytics

Full notes: [roadmap.md](./roadmap.md)
