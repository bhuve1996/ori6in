'use client';

import { memo } from 'react';
import { avatarFor, initialsFor } from '../lib/media';

type Props = {
  name: string;
  seed?: string;
  kind?: 'mentor' | 'student' | 'person';
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  /** When true, hide from AT (parent already names the person). */
  decorative?: boolean;
};

function AvatarInner({ name, seed, kind = 'person', size = 'md', src, decorative }: Props) {
  const image = src ?? avatarFor(seed || name, kind, name);
  const initials = initialsFor(name);

  return (
    <span
      className={`avatar avatar--${size}`}
      {...(decorative
        ? { 'aria-hidden': true as const }
        : { title: name, 'aria-label': name, role: 'img' as const })}
    >
      <img src={image} alt="" loading="lazy" decoding="async" />
      <span className="avatar__fallback" aria-hidden="true">
        {initials}
      </span>
    </span>
  );
}

export const Avatar = memo(AvatarInner);
