import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGallery } from '../../features/gallery/gallerySlice';
import Lightbox from '../../components/ui/Lightbox';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import SEO from '../../components/common/SEO';

export default function Gallery() {
  const dispatch = useDispatch();
  const { images, pagination, isLoading, error } = useSelector((s) => s.gallery);
  const [eventRef, setEventRef] = useState('');
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState(null); // index of open image

  useEffect(() => {
    dispatch(fetchGallery({ eventRef, page }));
  }, [dispatch, eventRef, page]);

  const close = useCallback(() => setLightbox(null), []);

  // Freeze background scroll while the lightbox is open
  useLockBodyScroll(lightbox !== null);

  // Trap keyboard focus inside the lightbox; restore focus on close
  const trapRef = useFocusTrap(lightbox !== null);

  // Unique events for the filter chips — derived once per `images` change,
  // not re-computed on every render (typing, hover, lightbox state, etc.)
  const uniqueEvents = useMemo(
    () => [
      ...new Map(images.filter((i) => i.eventRef).map((i) => [i.eventRef._id, i.eventRef])).values(),
    ],
    [images]
  );

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setLightbox((i) => Math.min(i + 1, images.length - 1));
      if (e.key === 'ArrowLeft') setLightbox((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length, close]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO
        title="Gallery"
        description="Photo highlights from Team of Sustainability events — plantation drives, workshops, clean-ups and competitions at VSSUT Burla."
      />
      <h1 className="section-title">Gallery</h1>
      <p className="text-gray-500 mt-2">Moments from our drives, workshops and clean-ups.</p>

      {/* Event filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setEventRef('');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            !eventRef ? 'bg-forest-600 text-white' : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
          }`}
        >
          All Photos
        </button>
        {/* Unique events from loaded images */}
        {uniqueEvents.map((ev) => (
            <button
              key={ev._id}
              onClick={() => {
                setEventRef(ev._id);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                eventRef === ev._id
                  ? 'bg-forest-600 text-white'
                  : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
              }`}
            >
              {ev.title}
            </button>
          )
        )}
      </div>

      {/* Masonry-ish grid */}
      {isLoading && page === 1 ? (
        <Spinner fullPage />
      ) : error && page === 1 ? (
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchGallery({ eventRef, page }))}
        />
      ) : images.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl">📷</span>
          <p className="mt-4 text-gray-500">No photos yet — check back after our next event!</p>
        </div>
      ) : (
        <div className="mt-10 columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
          {images.map((img, i) => (
            <motion.button
              key={img._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => setLightbox(i)}
              className="block w-full rounded-2xl overflow-hidden group relative"
            >
              {/* Placeholder bg + reserved min-height reduce layout shift
                  while the image loads (masonry ratios are unknown until
                  upload dimensions are read) */}
              <img
                src={img.imageUrl}
                alt={img.caption || 'Club moment'}
                loading="lazy"
                decoding="async"
                className="w-full min-h-[160px] bg-forest-100/70 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {img.caption && (
                <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs p-3 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.caption}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Load more */}
      {pagination && pagination.page < pagination.pages && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setPage(page + 1)}
            disabled={isLoading}
            className="px-8 py-3 rounded-xl bg-forest-600 text-white font-semibold hover:bg-forest-700 disabled:opacity-60"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Lightbox — shared infrastructure (ui/Lightbox) */}
      <AnimatePresence>
        {lightbox !== null && images[lightbox] && (
          <Lightbox
            open
            onClose={close}
            label="Image lightbox"
            item={{
              src: images[lightbox].imageUrl,
              alt: images[lightbox].caption || '',
              title: images[lightbox].caption || 'Club moment',
            }}
            onPrev={lightbox > 0 ? () => setLightbox(lightbox - 1) : undefined}
            onNext={
              lightbox < images.length - 1 ? () => setLightbox(lightbox + 1) : undefined
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}