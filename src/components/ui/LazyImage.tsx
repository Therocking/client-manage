import { useState, useRef, useEffect, memo } from 'react';
import { User as UserIcon } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const LazyImage = memo(function LazyImage({ src, alt, className = '' }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden bg-surface-800 ${className}`}>

      {(!loaded || error) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-900/40 to-surface-800">
          <UserIcon className="h-1/2 w-1/2 text-brand-400/40" />
        </div>
      )}

      {inView && !error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
});
