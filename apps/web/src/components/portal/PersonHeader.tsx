import type { ReactNode } from 'react';
import { Avatar } from '../Avatar';

type Props = {
  name: string;
  seed?: string;
  kind?: 'mentor' | 'student' | 'person';
  children?: ReactNode;
};

export function PersonHeader({ name, seed, kind = 'person', children }: Props) {
  return (
    <div className="person-row" style={{ marginBottom: '1.25rem' }}>
      <Avatar name={name} seed={seed ?? name} kind={kind} size="lg" />
      <div>
        {children ?? (
          <p className="page-lead" style={{ margin: 0 }}>
            Signed in as {name}
          </p>
        )}
      </div>
    </div>
  );
}
