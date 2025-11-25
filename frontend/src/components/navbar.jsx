import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CiShoppingCart } from 'react-icons/ci';
import { HiMenu, HiX } from 'react-icons/hi';
import { LogoSvg } from './LogoSvg';
import { useAuthStore } from '../store/auth';

const Navbar = () => {
  const user = useAuthStore(s => s.user);
  const showSwitch = user?.role === 'user';
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when route OR hash changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  // Scroll to section if hash exists after navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  const handleSmoothNav = path => {
    const [base, hash] = path.split('#');

    // If navigating within homepage sections
    if (location.pathname === base) {
      if (hash) {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      navigate(path);
      return;
    }

    // If coming from another page (ex: /create → #product-section)
    navigate(path);
  };

  const navLinks = [
    { name: 'Products', path: '/#product-section' },
    { name: 'Add product', path: '/create' },
  ];

  const isLinkActive = path => {
    const [base, hash] = path.split('#');
    if (location.pathname !== base) return false;
    if (hash && location.hash !== `#${hash}`) return false;
    return true;
  };

  return (
    <>
      {/* FULL-WIDTH SWITCH BAR */}
      {showSwitch && (
        <button
          onClick={() => console.log('switch')}
          className='
            w-full 
            bg-black text-white 
            py-2 
            text-center 
            text-sm 
            font-medium 
            hover:bg-black/90 
            transition
          '
        >
          Switch to Admin
        </button>
      )}
      <nav className='sticky top-0 z-40 bg-white h-20 border-b border-gray-200'>
        <div className='h-full flex items-center justify-between px-6'>
          {/* LOGO */}
          <Link
            to='/'
            onClick={e => {
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              navigate('/');
            }}
            className='flex items-center h-full'
          >
            <LogoSvg />
          </Link>

          {/* DESKTOP */}
          <div className='hidden md:flex space-x-10'>
            {navLinks.map(link => {
              const active = isLinkActive(link.path);

              return (
                <button
                  key={link.name}
                  onClick={() => handleSmoothNav(link.path)}
                  className={`relative transition-all duration-200 cursor-pointer ${
                    active ? 'text-red-500 scale-105' : 'text-black/60'
                  }`}
                >
                  {link.name}

                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-red-500 transition-all duration-200 ${
                      active ? 'w-full' : 'w-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className='flex items-center space-x-4'>
            <Link to='/cart'>
              <CiShoppingCart
                className={`w-7 h-7 ${
                  location.pathname === '/cart' ? 'text-red-500' : 'text-black'
                }`}
              />
            </Link>

            <button
              className='md:hidden text-red-500'
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <HiX size={30} /> : <HiMenu size={30} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className='md:hidden fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-black/80 backdrop-blur-md flex flex-col items-center pt-10 space-y-12'>
            {navLinks.map(link => {
              const active = isLinkActive(link.path);

              return (
                <button
                  key={link.name}
                  onClick={() => handleSmoothNav(link.path)}
                  className={`text-4xl ${
                    active ? 'text-white font-medium' : 'text-white/70'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
};
export default Navbar;
