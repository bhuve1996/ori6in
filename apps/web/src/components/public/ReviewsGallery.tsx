'use client';

import { GOOGLE_REVIEWS, GOOGLE_REVIEWS_META } from '@ori6in/shared';
import { useMemo, useRef, useState, useEffect } from 'react';

export function ReviewsGallery() {
  const [filter, setFilter] = useState<'all' | 'parents' | 'students'>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredReviews = useMemo(() => {
    if (filter === 'parents') {
      return GOOGLE_REVIEWS.filter(
        (r) => r.role.toLowerCase().includes('parent') || r.role.toLowerCase().includes('family')
      );
    }
    if (filter === 'students') {
      return GOOGLE_REVIEWS.filter(
        (r) => !r.role.toLowerCase().includes('parent') && !r.role.toLowerCase().includes('family')
      );
    }
    return GOOGLE_REVIEWS;
  }, [filter]);

  const updateScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate approximate active index based on card width
    const card = el.firstElementChild as HTMLElement | null;
    if (card) {
      const cardWidth = card.offsetWidth + 18; // gap
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(index, filteredReviews.length - 1));
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    updateScrollState();
  }, [filter]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [filteredReviews]);

  const scrollByDirection = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.82;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement | null;
    if (card) {
      el.scrollTo({
        left: card.offsetLeft - el.offsetLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="pub-section reviews-section">
      <div className="reviews-header">
        <div className="reviews-header__lead">
          <p className="type-kicker">Verified Feedback</p>
          <h2>What parents & students say</h2>
          <p className="type-lead">
            Authentic Google reviews from students and families across Bengaluru, pan-India, and our satellite desks.
          </p>
        </div>
        <div className="reviews-badge">
          <div className="reviews-badge__score">
            <span className="reviews-badge__num">{GOOGLE_REVIEWS_META.rating.toFixed(1)}</span>
            <div className="reviews-badge__stars" aria-label="5 out of 5 stars">
              {'★★★★★'}
            </div>
          </div>
          <div className="reviews-badge__meta">
            <strong>{GOOGLE_REVIEWS_META.totalReviews} reviews on Google</strong>
            <a
              href={GOOGLE_REVIEWS_META.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="reviews-badge__link"
            >
              View on Google Maps →
            </a>
          </div>
        </div>
      </div>

      <div className="reviews-controls-bar">
        <div className="reviews-tabs" role="tablist" aria-label="Review filter">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            className={`reviews-tab ${filter === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Reviews ({GOOGLE_REVIEWS.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'parents'}
            className={`reviews-tab ${filter === 'parents' ? 'is-active' : ''}`}
            onClick={() => setFilter('parents')}
          >
            Parents & Families
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'students'}
            className={`reviews-tab ${filter === 'students' ? 'is-active' : ''}`}
            onClick={() => setFilter('students')}
          >
            Students & Candidates
          </button>
        </div>

        <div className="reviews-carousel-arrows">
          <button
            type="button"
            className="reviews-carousel-arrow"
            onClick={() => scrollByDirection('left')}
            disabled={!canScrollLeft}
            aria-label="Previous review"
          >
            ←
          </button>
          <button
            type="button"
            className="reviews-carousel-arrow"
            onClick={() => scrollByDirection('right')}
            disabled={!canScrollRight}
            aria-label="Next review"
          >
            →
          </button>
        </div>
      </div>

      <div
        className="reviews-carousel-container"
        ref={scrollContainerRef}
        tabIndex={0}
        aria-label="Reviews slider"
      >
        {filteredReviews.map((rev) => (
          <article key={rev.id} className="review-card reviews-carousel-item">
            <div className="review-card__header">
              <div className="review-card__avatar">{rev.initials}</div>
              <div className="review-card__author-info">
                <div className="review-card__author-row">
                  <h3 className="review-card__author">{rev.author}</h3>
                  <span className="review-card__verified" title="Verified review">
                    ✓ Google Verified
                  </span>
                </div>
                <p className="review-card__role">{rev.role}</p>
              </div>
            </div>

            <div className="review-card__rating-row">
              <span className="review-card__stars" aria-label={`${rev.rating} stars`}>
                {'★'.repeat(rev.rating)}
              </span>
              <span className="review-card__date">{rev.date}</span>
            </div>

            <p className="review-card__text">“{rev.text}”</p>
          </article>
        ))}
      </div>

      <div className="reviews-carousel-dots" aria-hidden="true">
        {filteredReviews.map((rev, idx) => (
          <button
            key={rev.id}
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
