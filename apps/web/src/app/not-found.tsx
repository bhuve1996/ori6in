import { BRAND } from '../lib/media';
import { FlowConnector } from '../components/FlowConnector';

export default function NotFound() {
  return (
    <main id="main-content" className="not-found" tabIndex={-1}>
      <div className="not-found__media" aria-hidden="true" />
      <div className="not-found__inner">
        <img src={BRAND.owl} alt="" className="not-found__owl" width={120} height={120} />
        <p className="not-found__kicker">Lost the path</p>
        <h1 className="not-found__code">404</h1>
        <p className="not-found__title">This page isn&apos;t on the map</p>
        <p className="not-found__lead">
          The link may be old, mistyped, or only available after you sign in. Pick a
          place below — no dead ends.
        </p>

        <div className="not-found__flow" aria-hidden="true">
          <span>Home</span>
          <FlowConnector tone="dark" />
          <span>Programs</span>
          <FlowConnector tone="dark" />
          <span>Mentors</span>
        </div>

        <div className="cta-row">
          <a className="btn btn-accent" href="/">
            Back home
          </a>
          <a className="btn btn-secondary" href="/programs">
            Browse programs
          </a>
          <a className="btn btn-secondary" href="/mentors">
            Meet mentors
          </a>
          <a className="btn btn-secondary" href="/login">
            Log in
          </a>
        </div>
      </div>
    </main>
  );
}
