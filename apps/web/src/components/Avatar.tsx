import { avatarFor, initialsFor } from '../lib/media';

type Props = {
  name: string;
  seed?: string;
  kind?: 'mentor' | 'student' | 'person';
  size?: 'sm' | 'md' | 'lg';
  src?: string;
};

export function Avatar({
  name,
  seed,
  kind = 'person',
  size = 'md',
  src,
}: Props) {
  const image = src ?? avatarFor(seed || name, kind, name);
  const initials = initialsFor(name);

  return (
    <span className={`avatar avatar--${size}`} title={name} aria-label={name} role="img">
      <img src={image} alt="" loading="lazy" decoding="async" />
      <span className="avatar__fallback" aria-hidden="true">
        {initials}
      </span>
    </span>
  );
}
