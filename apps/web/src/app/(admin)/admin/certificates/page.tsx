'use client';

import { AdminShell } from '../../../../components/admin/AdminShell';
import { useApiResource } from '../../../../hooks/useApiResource';

type Cert = {
  id: string;
  code: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  programTitle: string;
  issuedAt: string;
};

export default function AdminCertificatesPage() {
  const { data, loading, error } = useApiResource<{ items: Cert[] }>('/admin/certificates', {
    errorMessage: 'Failed to load certificates',
  });
  const items = data?.items ?? [];

  return (
    <AdminShell
      title="Certificates"
      lead="Issued program-completion certificates across the platform."
      loading={loading}
      error={error}
      stats={[{ value: items.length, label: 'Issued' }]}
    >
      {items.length === 0 ? (
        <p className="admin-empty">No certificates issued yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Program</th>
                <th>Recipient</th>
                <th>Code</th>
                <th>Issued</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td>
                    <p className="admin-table__title">{c.programTitle}</p>
                    {c.title && c.title !== c.programTitle ? (
                      <p className="admin-table__sub">{c.title}</p>
                    ) : null}
                  </td>
                  <td>
                    <p className="admin-table__title">{c.recipientName}</p>
                    <p className="admin-table__sub">{c.recipientEmail}</p>
                  </td>
                  <td>
                    <span className="admin-table__slug">{c.code}</span>
                  </td>
                  <td>{new Date(c.issuedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-table__actions">
                      <a className="btn btn-secondary" href={`/certificates/verify/${c.code}`}>
                        Verify
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
