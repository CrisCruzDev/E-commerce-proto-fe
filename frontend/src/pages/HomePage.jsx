import { useLayoutEffect, useRef } from 'react';
import { useUIStore } from '../store/ui';
import HeroCarousel from '../components/homePageSections/HeroCarousel';
import HeroCTA from '../components/homePageSections/HeroCTA';
import FeaturedProducts from '../components/homePageSections/FeaturedProducts';

const HomePage = () => {
  const productRef = useRef(null);
  const scrollTo = useUIStore(s => s.scrollTo);
  const consumeScrollTo = useUIStore(s => s.consumeScrollTo);

  useLayoutEffect(() => {
    if (!scrollTo) return;

    if (scrollTo === 'product-section' && productRef.current) {
      productRef.current.scrollIntoView({ behavior: 'smooth' });
      consumeScrollTo();
    }
  }, [scrollTo]);

  return (
    <main className='w-full'>
      {/* Carousel */}
      <HeroCarousel />

      {/* Hero CTA Section */}
      <section id='hero-cta' className='w-full bg-[#1a1a1a]'>
        <HeroCTA />
      </section>

      {/* Featured Products Section */}
      <FeaturedProducts />
    </main>
  );
};

export default HomePage;
