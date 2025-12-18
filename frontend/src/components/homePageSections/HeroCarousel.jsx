import { useEffect, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const HeroCarousel = () => {
  // 1. Configuration Constants
  const CLOUDINARY_BASE = 'https://res.cloudinary.com/dxekcj7uv/image/upload';

  const slides = [
    {
      id: 1,
      publicId: 'akhil-yerabati-Q2uV5TkjNz8-unsplash_buo0xv',
      desktopTransform: 'e_sharpen,c_fill,g_center,w_1920,q_auto:good,f_auto',
      mobileTransform:
        'e_sharpen,c_fill,g_center,w_800,h_1000,q_auto:good,f_auto',
    },
    {
      id: 2,
      publicId: 'ryan-quintal-sYY94OQzOmw-unsplash_rcrjj8',
      desktopTransform: 'e_sharpen,c_fill,g_center,w_1920,q_auto:good,f_auto',
      mobileTransform:
        'e_sharpen,c_fill,g_center,w_800,h_1000,q_auto:good,f_auto',
    },
    {
      id: 3,
      publicId: 'dennis-brendel-YLNMXzXk8zs-unsplash_jloack',
      desktopTransform: 'e_sharpen,c_fill,g_center,w_1920,q_auto:good,f_auto',
      mobileTransform:
        'e_sharpen,c_fill,g_center,w_800,h_1000,q_auto:good,f_auto',
    },
    {
      id: 4,
      publicId: 'ady-teenagerinro-V8MNPJe8Nt8-unsplash_koht73',
      desktopTransform: 'e_sharpen,c_fill,g_center,w_1920,q_auto:good,f_auto',
      mobileTransform:
        'e_sharpen,c_fill,g_center,w_800,h_1000,q_auto:good,f_auto',
    },
    {
      id: 5,
      publicId: 'adam-przeniewski-qPpq1EVs8vw-unsplash_ts9yxj',
      desktopTransform: 'e_sharpen,c_fill,g_center,w_1920,q_auto:good,f_auto',
      mobileTransform:
        'e_sharpen,c_fill,g_center,w_800,h_1000,q_auto:good,f_auto',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // 2. Responsive Listener
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // 3. Navigation Logic
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    setCurrentIndex(isFirstSlide ? slides.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    setCurrentIndex(isLastSlide ? 0 : currentIndex + 1);
  };

  return (
    <section className='relative w-full h-[70vh] md:h-[calc(100vh-80px)] group overflow-hidden bg-white'>
      {/* The "Track" that holds all slides */}
      <div
        className='flex h-full transition-transform duration-700 ease-in-out'
        style={{
          transform: `translateX(-${(100 / slides.length) * currentIndex}%)`,
          width: `${slides.length * 100}%`,
        }}
      >
        {slides.map(slide => {
          const transform = isMobile
            ? slide.mobileTransform
            : slide.desktopTransform;
          const imageUrl = `${CLOUDINARY_BASE}/${transform}/${slide.publicId}`;

          return (
            <div
              key={slide.id}
              className='h-full bg-center bg-cover flex-shrink-0'
              style={{
                backgroundImage: `url(${imageUrl})`,
                width: `${100 / slides.length}%`,
              }}
            />
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <div className='absolute inset-0 flex items-center justify-between px-4 md:px-8 pointer-events-none'>
        <button
          onClick={prevSlide}
          className='pointer-events-auto text-white/70 hover:text-white transition-transform active:scale-90'
        >
          <HiChevronLeft className='text-[40px] md:text-[60px]' />
        </button>
        <button
          onClick={nextSlide}
          className='pointer-events-auto text-white/70 hover:text-white transition-transform active:scale-90'
        >
          <HiChevronRight className='text-[40px] md:text-[60px]' />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`cursor-pointer transition-all duration-300 rounded-full border border-white/20
              ${
                currentIndex === index
                  ? 'w-3 h-3 bg-black/60 scale-125'
                  : 'w-3 h-3 bg-black/20 hover:bg-black/40'
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
