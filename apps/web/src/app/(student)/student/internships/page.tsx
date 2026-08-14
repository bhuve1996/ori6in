'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../lib/auth';
import { PageBanner } from '../../../../components/PageBanner';
import { BANNERS } from '../../../../lib/media';

type Internship = {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  description: string;
};

type Application = {
  id: string;
  internshipId: string;
  status: string;
  internship: { title: string; company: string } | null;
};

export default function StudentInternshipsPage() {
  const router = useRouter();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState('');

  async function load() {
    const listRes = await apiFetch<Internship[]>('/internships');
    const appsRes = await apiFetch<Application[]>('/internships/applications/mine');
    if (listRes.status === 401) {
      clearSession();
      router.replace('/login?next=/student/internships');
      return;
    }
    if (!listRes.ok) {
      setError('Failed to load internships (login required)');
      return;
    }
    setInternships(Array.isArray(listRes.data) ? listRes.data : []);
    if (appsRes.ok && Array.isArray(appsRes.data)) setApplications(appsRes.data);
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?next=/student/internships');
      return;
    }
    void load();
  }, [router]);

  const appliedIds = new Set(applications.map((a) => a.internshipId));

  return (
    <>
      <PageBanner
        image={BANNERS.internships}
        title="Internships"
        lead="Login-only listings. Apply as a student to track status here."
      />
      <main id="main-content" className="page page-after-banner">
      <a className="back-link" href="/student">
        ← Student
      </a>
      {error && <p className="text-error">{error}</p>}

      {applications.length > 0 && (
        <section className="section-block">
          <h2>My applications</h2>
          <ul className="plain-list">
            {applications.map((a) => (
              <li key={a.id}>
                {a.internship?.title ?? a.internshipId} — {a.status}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="section-block">
        <h2>Open roles</h2>
        <div className="card-list">
          {internships.length === 0 && <p className="meta">No internships published yet.</p>}
          {internships.map((i) => (
            <article key={i.id}>
              <h3>
                <a href={`/student/internships/${i.id}`}>{i.title}</a>
              </h3>
              <p className="meta">
                {i.company} · {i.location}
              </p>
              <p className="page-lead">{i.description}</p>
              <p>
                {appliedIds.has(i.id) ? (
                  <span className="text-success">✓ Applied</span>
                ) : (
                  <a href={`/student/internships/${i.id}`}>View & apply</a>
                )}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
    </>
  );
}
