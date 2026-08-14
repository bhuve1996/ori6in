'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../lib/auth';
import { Avatar } from '../../../../components/Avatar';
import { PageBanner } from '../../../../components/PageBanner';
import { useToast } from '../../../../components/Toast';
import { Tooltip } from '../../../../components/Tooltip';
import { BANNERS } from '../../../../lib/media';

type Education = { school: string; degree?: string; year?: string };
type Experience = { company: string; title: string; years?: string };
type Project = { name: string; url?: string; summary?: string };

type Profile = {
  userId: string;
  headline: string;
  bio: string;
  phone: string;
  location: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
};

const empty: Profile = {
  userId: '',
  headline: '',
  bio: '',
  phone: '',
  location: '',
  skills: [],
  education: [],
  experience: [],
  projects: [],
};

export default function StudentProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const [profile, setProfile] = useState<Profile>(empty);
  const [skillsText, setSkillsText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?next=/student/profile');
      return;
    }
    void (async () => {
      const { ok, status, data } = await apiFetch<Profile>('/student/profile');
      if (status === 401) {
        clearSession();
        router.replace('/login?next=/student/profile');
        return;
      }
      if (!ok) {
        setError('Failed to load profile');
        setLoading(false);
        return;
      }
      setProfile({ ...empty, ...data });
      setSkillsText((data.skills ?? []).join(', '));
      setLoading(false);
    })();
  }, [router]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      ...profile,
      skills: skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      projects: profile.projects.map((p) => ({
        ...p,
        url: p.url?.trim() || undefined,
      })),
    };
    const { ok, data } = await apiFetch<Profile>('/student/profile', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!ok) {
      const message = (data as unknown as { message?: string }).message;
      const msg =
        typeof message === 'string' ? message : 'Save failed — check required fields';
      setError(msg);
      toast.error(msg);
      return;
    }
    setProfile({ ...empty, ...data });
    setSkillsText((data.skills ?? []).join(', '));
    toast.success('Profile saved');
  }

  function updateEdu(i: number, patch: Partial<Education>) {
    setProfile((p) => ({
      ...p,
      education: p.education.map((row, idx) => (idx === i ? { ...row, ...patch } : row)),
    }));
  }

  function updateExp(i: number, patch: Partial<Experience>) {
    setProfile((p) => ({
      ...p,
      experience: p.experience.map((row, idx) => (idx === i ? { ...row, ...patch } : row)),
    }));
  }

  function updateProject(i: number, patch: Partial<Project>) {
    setProfile((p) => ({
      ...p,
      projects: p.projects.map((row, idx) => (idx === i ? { ...row, ...patch } : row)),
    }));
  }

  if (loading) {
    return (
      <main id="main-content" className="page">
        <p className="meta">Loading…</p>
      </main>
    );
  }

  return (
    <>
      <PageBanner
        image={BANNERS.student}
        title="Profile"
        lead="Keep your career profile up to date for mentors and internships."
      />
      <main className="page page-after-banner">
      <a className="back-link" href="/student">
        ← Student
      </a>
      <div className="person-row" style={{ marginBottom: '1rem' }}>
        <Avatar
          name={profile.headline || 'Student'}
          seed={profile.userId || 'student'}
          kind="student"
          size="lg"
        />
        <p className="meta">{profile.location || 'Add your location and skills below.'}</p>
      </div>
      {error && <p className="text-error">{error}</p>}

      <form onSubmit={(e) => void onSave(e)} className="form-grid wide">
        <section className="section-block form-grid">
          <h2>Basics</h2>
          <input
            placeholder="Headline"
            value={profile.headline}
            onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))}
          />
          <textarea
            placeholder="Bio"
            rows={4}
            value={profile.bio}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
          />
          <input
            placeholder="Phone"
            value={profile.phone}
            onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
          />
          <input
            placeholder="Location"
            value={profile.location}
            onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
          />
          <Tooltip label="Separate skills with commas">
            <input
              placeholder="Skills (comma-separated)"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              style={{ width: '100%' }}
            />
          </Tooltip>
        </section>

        <section className="section-block form-grid">
          <h2>Education</h2>
          {profile.education.map((row, i) => (
            <div key={i} className="form-grid">
              <input
                placeholder="School"
                value={row.school}
                onChange={(e) => updateEdu(i, { school: e.target.value })}
                required
              />
              <input
                placeholder="Degree"
                value={row.degree ?? ''}
                onChange={(e) => updateEdu(i, { degree: e.target.value })}
              />
              <input
                placeholder="Year"
                value={row.year ?? ''}
                onChange={(e) => updateEdu(i, { year: e.target.value })}
              />
              <button
                type="button"
                className="btn secondary"
                onClick={() =>
                  setProfile((p) => ({
                    ...p,
                    education: p.education.filter((_, idx) => idx !== i),
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn secondary"
            onClick={() =>
              setProfile((p) => ({
                ...p,
                education: [...p.education, { school: '', degree: '', year: '' }],
              }))
            }
          >
            Add education
          </button>
        </section>

        <section className="section-block form-grid">
          <h2>Experience</h2>
          {profile.experience.map((row, i) => (
            <div key={i} className="form-grid">
              <input
                placeholder="Company"
                value={row.company}
                onChange={(e) => updateExp(i, { company: e.target.value })}
                required
              />
              <input
                placeholder="Title"
                value={row.title}
                onChange={(e) => updateExp(i, { title: e.target.value })}
                required
              />
              <input
                placeholder="Years"
                value={row.years ?? ''}
                onChange={(e) => updateExp(i, { years: e.target.value })}
              />
              <button
                type="button"
                className="btn secondary"
                onClick={() =>
                  setProfile((p) => ({
                    ...p,
                    experience: p.experience.filter((_, idx) => idx !== i),
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn secondary"
            onClick={() =>
              setProfile((p) => ({
                ...p,
                experience: [...p.experience, { company: '', title: '', years: '' }],
              }))
            }
          >
            Add experience
          </button>
        </section>

        <section className="section-block form-grid">
          <h2>Projects</h2>
          {profile.projects.map((row, i) => (
            <div key={i} className="form-grid">
              <input
                placeholder="Name"
                value={row.name}
                onChange={(e) => updateProject(i, { name: e.target.value })}
                required
              />
              <input
                placeholder="URL (optional)"
                value={row.url ?? ''}
                onChange={(e) => updateProject(i, { url: e.target.value })}
              />
              <textarea
                placeholder="Summary"
                rows={2}
                value={row.summary ?? ''}
                onChange={(e) => updateProject(i, { summary: e.target.value })}
              />
              <button
                type="button"
                className="btn secondary"
                onClick={() =>
                  setProfile((p) => ({
                    ...p,
                    projects: p.projects.filter((_, idx) => idx !== i),
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn secondary"
            onClick={() =>
              setProfile((p) => ({
                ...p,
                projects: [...p.projects, { name: '', url: '', summary: '' }],
              }))
            }
          >
            Add project
          </button>
        </section>

        <div className="cta-row">
          <button className="btn accent" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>
    </main>
    </>
  );
}
