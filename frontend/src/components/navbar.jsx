import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CiShoppingCart } from 'react-icons/ci';
import { HiMenu, HiX } from 'react-icons/hi';

import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';
import toast from 'react-hot-toast';
import RequestAdminKeyModal from './adminKeyModal/RequestAdminKeyModal';
import { LogoSvg } from './svg/LogoSvg';

const Navbar = () => {
  const user = useAuthStore(s => s.user);
  const mobileOpen = useUIStore(s => s.mobileOpen);
  const setMobileOpen = useUIStore(s => s.setMobileOpen);
  const setScrollTo = useUIStore(s => s.setScrollTo);
  const openRequestKey = useUIStore(s => s.openRequestKey);
  const showSwitch = user?.role === 'user';
  const isAdmin = user?.role === 'admin';

  const location = useLocation();
  const navigate = useNavigate();

  // Close menu when route OR hash changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash, setMobileOpen]);

  const handleSmoothNav = path => {
    const [base, hash] = path.split('#');

    // If going to a section on the current page
    if (location.pathname === base && hash) {
      setScrollTo(hash); // trigger actual scroll
      navigate(`${base}#${hash}`); // update URL so nav highlight works
      return;
    }

    // Normal navigation
    navigate(path);
  };

  const navLinks = [
    { name: 'Products', path: '/#product-section' },
    { name: 'Add product', path: '/create', adminOnly: true },
  ];

  const isLinkActive = path => {
    const [base, hash] = path.split('#');

    if (location.pathname !== base) return false;
    if (hash && location.hash !== `#${hash}`) return false;
    return true;
  };

  return (
    <>
      {/* SWITCH BAR */}
      {showSwitch && (
        <button
          onClick={openRequestKey}
          className='py-1 w-full bg-black cursor-pointer text-white text-center text-sm font-medium hover:bg-black/90 transition'
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
              } else {
                navigate('/');
              }
            }}
            className='flex items-center h-full'
          >
            <LogoSvg />
          </Link>

          {/* DESKTOP */}
          <div className='hidden md:flex space-x-10'>
            {navLinks.map(link => {
              const active = isLinkActive(link.path);
              const disabled = link.adminOnly && !isAdmin;

              if (disabled) {
                return (
                  <div key={link.name} className='relative group inline-block'>
                    <button
                      disabled
                      className='relative text-black/30 cursor-not-allowed'
                    >
                      {link.name}
                    </button>
                    {/* Tooltip */}
                    <div className='absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-1 rounded-md shadow-lg z-20'>
                      You must be an admin to access this.
                    </div>
                  </div>
                );
              }

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
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <HiX size={30} /> : <HiMenu size={30} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className='md:hidden fixed top-25 left-0 w-full h-[calc(100vh-5rem)] bg-black/80 backdrop-blur-md flex flex-col items-center pt-20 space-y-12'>
            {navLinks.map(link => {
              const active = isLinkActive(link.path);
              const disabled = link.adminOnly && !isAdmin;

              if (disabled) {
                return (
                  <button
                    key={link.name}
                    title='Admin only'
                    className='text-white/40 text-4xl cursor-not-allowed'
                    onClick={() => {
                      toast.error('You must be an admin to add products');
                      setMobileOpen(false);
                    }}
                  >
                    {link.name}
                  </button>
                );
              }

              return (
                <button
                  key={link.name}
                  onClick={() => {
                    handleSmoothNav(link.path);
                    setMobileOpen(false);
                  }}
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
