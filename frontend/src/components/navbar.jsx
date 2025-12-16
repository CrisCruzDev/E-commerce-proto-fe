import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CiShoppingCart } from 'react-icons/ci';
import { HiMenu, HiX } from 'react-icons/hi';

import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';
import toast from 'react-hot-toast';
import { LogoSvg } from './svg/LogoSvg';
import { LoginIcon } from './svg/LoginIcon';
import { CartIcon } from './svg/CartIcon';
import { useLogout } from '../hooks/useAuth';

const Navbar = () => {
  const user = useAuthStore(s => s.user);
  const mobileOpen = useUIStore(s => s.mobileOpen);
  const setMobileOpen = useUIStore(s => s.setMobileOpen);
  const setScrollTo = useUIStore(s => s.setScrollTo);
  const openRequestKey = useUIStore(s => s.openRequestKey);

  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash, setMobileOpen]);

  // Outside click handler for dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSmoothNav = path => {
    const [base, hash] = path.split('#');

    if (location.pathname === base && hash) {
      setScrollTo(hash);
      navigate(`${base}#${hash}`);
      return;
    }

    navigate(path);
  };

  const navLinks = [
    { name: 'Products', path: '/#product-section', adminOnly: false },
    { name: 'Add product', path: '/create', adminOnly: true },
  ];

  const tooltipForAddProduct = () => {
    if (!user) return 'Log in to add products.';
    if (!isAdmin) return 'Admin access required.';
    return null;
  };

  const isLinkActive = path => {
    const [base, hash] = path.split('#');
    if (location.pathname !== base) return false;
    if (hash && location.hash !== `#${hash}`) return false;
    return true;
  };

  return (
    <>
      {/* Switch bar (only visible to regular users) */}
      {isUser && (
        <button
          onClick={openRequestKey}
          className='py-1 w-full bg-black text-white text-center text-sm font-medium hover:bg-black/90 transition cursor-pointer'
        >
          Switch to Admin
        </button>
      )}

      <nav className='sticky top-0 z-40 bg-white h-20 border-b border-gray-200'>
        <div className='h-full flex items-center justify-between px-6'>
          {/* Logo */}
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

          {/* Desktop links */}
          <div className='hidden md:flex space-x-10'>
            {navLinks.map(link => {
              const active = isLinkActive(link.path);
              const needsAdmin = link.adminOnly;
              const disabled =
                (needsAdmin && !isAdmin) || (!user && link.adminOnly);
              const tooltip = needsAdmin ? tooltipForAddProduct() : null;

              if (disabled) {
                return (
                  <div key={link.name} className='relative group inline-block'>
                    <button className='text-black/30 cursor-not-allowed'>
                      {link.name}
                    </button>

                    <div className='absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-1 rounded-md shadow-lg z-20'>
                      {tooltip}
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

          {/* Right side icons */}
          <div className='flex items-center space-x-4'>
            {/* LOGIN ICON / DROPDOWN */}
            {user ? (
              <div ref={dropdownRef} className='relative'>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className='flex items-center cursor-pointer'
                >
                  <LoginIcon className='w-7 h-7' />
                </button>

                {/* DROPDOWN MENU */}
                {dropdownOpen && (
                  <div className='absolute right-0 mt-3 w-40 bg-white shadow-lg border border-gray-200 rounded-xs z-50 origin-top-right animate-dropdownFadeScale'>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      disabled={isLoggingOut}
                      className={`w-full text-left px-4 py-2 text-sm transition-opacity duration-200 cursor-pointer ${
                        isLoggingOut
                          ? 'opacity-40 pointer-events-none'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to='/login'>
                <LoginIcon className='w-7 h-7 cursor-pointer' />
              </Link>
            )}

            <Link to='/cart'>
              <CartIcon
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

        {/* Mobile menu */}
        {mobileOpen && (
          <div className='md:hidden fixed top-25 left-0 w-full h-[calc(100vh-5rem)] bg-black/80 backdrop-blur-md flex flex-col items-center pt-20 space-y-12'>
            {navLinks.map(link => {
              const active = isLinkActive(link.path);
              const needsAdmin = link.adminOnly;
              const disabled =
                (needsAdmin && !isAdmin) || (!user && needsAdmin);
              const tooltip = tooltipForAddProduct();

              if (disabled) {
                return (
                  <button
                    key={link.name}
                    className='text-white/40 text-4xl cursor-not-allowed'
                    onClick={() => {
                      toast.error(tooltip);
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
