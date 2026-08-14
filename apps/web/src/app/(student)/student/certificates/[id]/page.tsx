'use client';

import { useParams } from 'next/navigation';
import { useApiResource } from '../../../../../hooks/useApiResource';
import { PortalShell } from '../../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../../lib/media';

type Cert = {
  id: string;
  code: string;
  title: string;
  recipientName: string;
  programTitle: string;
  issuedAt: string;
};

export default function StudentCertificateDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: cert, loading, error } = useApiResource<Cert>(
    `/student/certificates/${params.id}`,
    { errorMessage: 'Certificate not found' },
  );

  return (
    <PortalShell
      banner={{
        image: BANNERS.student,
        title: cert?.programTitle ?? 'Certificate',
        lead: 'Print or share your verification code.',
      }}
      back={{ href: '/student/certificates', label: 'Certificates' }}
      loading={loading}
      error={error}
    >
      {cert ? (
        <>
          <article className="certificate-sheet">
            <p className="certificate-sheet__kicker">ORI6IN</p>
            <h1 className="certificate-sheet__title">{cert.title}</h1>
            <p className="certificate-sheet__body">
              This certifies that <strong>{cert.recipientName}</strong> has successfully completed
              the program <strong>{cert.programTitle}</strong>.
            </p>
            <p className="meta">
              Issued {new Date(cert.issuedAt).toLocaleDateString()} · Code {cert.code}
            </p>
            <p className="meta">
              Verify at{' '}
              <a href={`/certificates/verify/${cert.code}`}>
                /certificates/verify/{cert.code}
              </a>
            </p>
          </article>
          <div className="cta-row">
            <button type="button" className="btn btn-accent" onClick={() => window.print()}>
              Print / Save PDF
            </button>
          </div>
        </>
      ) : null}
    </PortalShell>
  );
}
