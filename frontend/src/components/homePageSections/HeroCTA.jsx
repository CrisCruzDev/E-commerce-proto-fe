import { useState, useEffect } from 'react';

// 1. Configuration
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dxekcj7uv/image/upload';

const HeroCTA = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const config = {
    desktopId: 'hero-bg_xqpdep',
    mobileId: 'hero-mobile-bg_p8nvl3',
    desktopTransform: 'c_fill,g_south,w_1920,q_auto:good,f_auto',
    mobileTransform: 'c_fill,g_center,w_800,h_900,q_auto:good,f_auto',
  };

  const imageUrl = `${CLOUDINARY_BASE}/${
    isMobile ? config.mobileTransform : config.desktopTransform
  }/${isMobile ? config.mobileId : config.desktopId}`;

  return (
    <section className='relative w-full h-[40vh] md:h-[55vh] xl:h-[80vh] flex items-center overflow-hidden bg-[#262626]'>
      {/* Background Image Layer */}
      <div
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundColor: '#262626', // Acts as a placeholder while loading
        }}
        className='absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-bottom md:bg-center transition-all duration-1000'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/20 md:to-transparent pointer-events-none' />

      {/* Content Overlay */}
      <div className='relative z-10 px-6 md:px-12 xl:px-[120px] w-full max-w-[1440px] mx-auto'>
        <div className='flex flex-col xl:flex-row items-center xl:items-end justify-center gap-8 md:gap-14 xl:gap-20'>
          {/* Text Container */}
          <h2 className='text-white font-bebas text-[54px] md:text-[80px] lg:text-[110px] xl:text-[120px] leading-[1.125] md:leading-[1.125] tracking-tighter md:tracking-tight transform scale-y-110 origin-left'>
            Shop the latest Apple
            <br /> Product on the
            <br /> Market.
          </h2>

          {/* CTA Button */}
          <button className='bg-yellow hover:bg-[#f0d800] text-black font-bebas text-xl md:text-2xl px-10 py-3 rounded-sm transition-all duration-300 active:scale-95 shadow-xl cursor-pointer'>
            BUY NOW
          </button>
        </div>
      </div>

      {/* Mobile-only Gradient for better text contrast */}
      <div className='absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent md:hidden' />
    </section>
  );
};

export default HeroCTA;
