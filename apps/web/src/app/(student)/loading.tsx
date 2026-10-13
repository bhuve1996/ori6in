import { BRAND } from '../../lib/media';

export default function PortalLoading() {
  return (
    <main className="page loading-screen" aria-busy="true" aria-label="Loading portal">
      <div className="owl-loader">
        <div className="owl-loader__ring" />
        <div className="owl-loader__badge">
          <img
            src={BRAND.owl}
            alt="ORI6IN Owl"
            width={52}
            height={52}
            className="owl-loader__img"
          />
        </div>
        <p className="owl-loader__text">Loading portal…</p>
      </div>
    </main>
  );
}
