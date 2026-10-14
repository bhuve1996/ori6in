'use client';

import { ParentReview } from '@ori6in/shared';
import { useRef, useState, useEffect } from 'react';

interface ParentReviewsSectionProps {
  title?: string;
  kicker?: string;
  lead?: string;
  reviews: readonly ParentReview[];
  programmeTag: string;
}

export function ParentReviewsSection({
  title = 'What parents say',
  kicker = 'Parent Perspectives',
  lead = 'Real experiences and outcomes shared by families.',
  reviews,
  programmeTag,
}: ParentReviewsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const firstCard = el.firstElementChild as HTMLElement | null;
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth + 20;
      const idx = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(idx, reviews.length - 1));
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    el.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      el.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [reviews]);

  const scrollByDirection = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const scrollToIndex = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement | null;
    if (card) {
      el.scrollTo({
        left: card.offsetLeft - el.offsetLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="pub-section parent-reviews-section">
      <div className="parent-reviews-header">
        <div>
          <p className="type-kicker">{kicker}</p>
          <h2>{title}</h2>
          <p className="type-lead">{lead}</p>
        </div>
        <div className="parent-reviews-header__actions">
          <div className="parent-reviews-trust-pill">
            <span className="parent-reviews-trust-pill__stars">★★★★★</span>
            <strong>5.0 / 5.0</strong>
            <span>· {reviews.length} Parent Testimonials ({programmeTag})</span>
          </div>
          <div className="reviews-carousel-arrows">
            <button
              type="button"
              className="reviews-carousel-arrow"
              onClick={() => scrollByDirection('left')}
              disabled={!canScrollLeft}
              aria-label="Previous parent review"
            >
              ←
            </button>
            <button
              type="button"
              className="reviews-carousel-arrow"
              onClick={() => scrollByDirection('right')}
              disabled={!canScrollRight}
              aria-label="Next parent review"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        className="parent-reviews-carousel-container"
        ref={scrollRef}
        tabIndex={0}
        aria-label="Parent reviews carousel"
      >
        {reviews.map((r) => (
          <article key={r.id} className="parent-review-card parent-reviews-carousel-item">
            <div className="parent-review-card__top">
              <div className="parent-review-card__avatar">{r.initials}</div>
              <div className="parent-review-card__info">
                <div className="parent-review-card__name-row">
                  <h3 className="parent-review-card__name">{r.parentName}</h3>
                  <span className="parent-review-card__location-pill">
                    <span className="parent-review-card__location-dot">📍</span>
                    {r.location}
                  </span>
                </div>
                <p className="parent-review-card__context">{r.studentContext}</p>
              </div>
            </div>

            <div className="parent-review-card__rating">
              <span className="parent-review-card__stars">{'★'.repeat(r.rating)}</span>
              <span className="parent-review-card__date">{r.date}</span>
            </div>

            <blockquote className="parent-review-card__quote">
              “{r.quote}”
            </blockquote>

            <div className="parent-review-card__highlight">
              <span className="parent-review-card__highlight-label">Milestone achieved:</span>
              <strong>{r.outcomeOrHighlight}</strong>
            </div>
          </article>
        ))}
      </div>

      <div className="reviews-carousel-dots" aria-hidden="true">
        {reviews.map((r, idx) => (
          <button
            key={r.id}
            type="button"
            className={`reviews-carousel-dot ${idx === activeIndex ? 'is-active' : ''}`}
            onClick={() => scrollToIndex(idx)}
            aria-label={`Go to review ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
