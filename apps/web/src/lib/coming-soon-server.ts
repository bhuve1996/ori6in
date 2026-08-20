import { cookies } from 'next/headers';
import { COMING_SOON_COOKIE, resolveComingSoon } from './coming-soon';

export async function isComingSoonActive() {
  const store = await cookies();
  return resolveComingSoon(store.get(COMING_SOON_COOKIE)?.value);
}
