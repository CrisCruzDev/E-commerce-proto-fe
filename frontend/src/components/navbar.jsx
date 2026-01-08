import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { ArrowRight, ChevronDown } from 'lucide-react';

// Store & Hooks
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';
import { useLogout } from '../hooks/useAuth';
import toast from 'react-hot-toast';

// Assets/Icons
import { LogoSvg } from './svg/LogoSvg';
import { LoginIcon } from './svg/LoginIcon';
import { CartIcon } from './svg/CartIcon';

// Data
import { PRODUCT_CATEGORIES, FEATURED_BRANDS } from '../data/constants';

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

  // Helper to chunk brands for 3 columns
  const getBrandColumns = () => {
    const sorted = [...FEATURED_BRANDS].sort();
    const chunkSize = Math.ceil(sorted.length / 3);
    return [
      sorted.slice(0, chunkSize),
      sorted.slice(chunkSize, chunkSize * 2),
      sorted.slice(chunkSize * 2),
    ];
  };

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash, setMobileOpen]);

  // Outside click handler for desktop User dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // 🟢 MODIFIED: Removed 'Products' from here to handle it separately with the Dropdown
  const navLinks = [{ name: 'Add product', path: '/create', adminOnly: true }];

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
          className='py-1 w-full bg-primary text-white text-center text-sm font-medium hover:bg-primary/90 transition cursor-pointer'
        >
          Switch to Admin
        </button>
      )}

      <nav className='sticky top-0 z-40 bg-white h-20 border-b border-gray-200'>
        <div className='h-full flex items-center justify-between px-6'>
          {/* Logo Section */}
          <div className='flex-1 flex justify-start'>
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
          </div>

          {/* Desktop Links (Hidden on mobile) */}
          <div className='hidden md:flex space-x-10 flex-none h-full items-center'>
            {/* PRODUCTS MEGA MENU DROPDOWN */}
            <div className='group h-full flex items-center relative'>
              <Link
                to='/products'
                className={`flex items-center gap-1 font-mono tracking-tight transition-all duration-200 cursor-pointer h-full
                    ${
                      location.pathname === '/products'
                        ? 'text-red-500'
                        : 'text-primary hover:text-red-500'
                    }`}
              >
                Products <ChevronDown size={16} />
              </Link>

              {/* Dropdown Panel */}
              <div className='absolute top-full -left-20 w-[600px] bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-8 grid grid-cols-5 gap-8 translate-y-4 group-hover:translate-y-0 z-50'>
                {/* Categories */}
                <div className='col-span-2'>
                  <h3 className='font-bebas text-primary text-2xl border-b-1 border-primary mb-4 pb-1'>
                    Category
                  </h3>
                  <div className='space-y-6'>
                    {PRODUCT_CATEGORIES.map(cat => (
                      <div key={cat.name}>
                        <p className='font-bold font-mono text-xs text-gray-400 mb-2 uppercase tracking-wide'>
                          {cat.name}
                        </p>
                        <div className='flex flex-col gap-1.5 pl-2 border-l-2 border-gray-100'>
                          {cat.subcategories.map(sub => (
                            <Link
                              key={sub}
                              to={`/products?category=${sub}`}
                              className='font-mono text-sm tracking-tight hover:text-primary hover:translate-x-1 transition-transform block text-primary'
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className='col-span-3'>
                  <h3 className='font-bebas text-primary text-2xl border-b-1 border-primary mb-4 pb-1'>
                    Brand
                  </h3>
                  <div className='grid grid-cols-3 gap-4'>
                    {getBrandColumns().map((column, colIndex) => (
                      <div key={colIndex} className='flex flex-col gap-1.5'>
                        {column.map(brand => (
                          <Link
                            key={brand}
                            to={`/products?brand=${brand}`}
                            className='font-bebas text-lg  hover:text-primary truncate block text-primary'
                          >
                            {brand}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                  <Link
                    to='/products'
                    className='inline-block mt-6 text-xs font-mono underline hover:text-primary text-gray-500'
                  >
                    VIEW ALL →
                  </Link>
                </div>
              </div>
            </div>

            {/* Existing Nav Links (Add Product, etc) */}
            {navLinks.map(link => {
              const active = isLinkActive(link.path);
              const needsAdmin = link.adminOnly;
              const disabled =
                (needsAdmin && !isAdmin) || (!user && link.adminOnly);
              const tooltip = needsAdmin ? tooltipForAddProduct() : null;

              if (disabled) {
                return (
                  <div key={link.name} className='relative group inline-block'>
                    <button className='text-primary/20 cursor-not-allowed font-mono tracking-tight'>
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
                  className={`relative transition-all duration-200 cursor-pointer font-mono tracking-tight ${
                    active
                      ? 'text-red-500 scale-105'
                      : 'text-primary hover:text-red-500'
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

          {/* Right Side Icons */}
          <div className='flex-1 flex items-center justify-end space-x-6'>
            <div className='hidden md:flex items-center space-x-6'>
              {user ? (
                <div ref={dropdownRef} className='relative'>
                  <button
                    onClick={() => setDropdownOpen(prev => !prev)}
                    className='flex items-center cursor-pointer'
                  >
                    <LoginIcon className='w-5 h-5' />
                  </button>
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
                  <LoginIcon className='w-5 h-5 cursor-pointer' />
                </Link>
              )}

              <Link to='/cart'>
                <CartIcon
                  className={`w-5 h-5 ${
                    location.pathname === '/cart'
                      ? 'text-red-500'
                      : 'text-[#212121]'
                  }`}
                />
              </Link>
            </div>

            {/* HAMBURGER BUTTON */}
            <button
              className='md:hidden text-primary z-[70] transition-transform active:scale-90'
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <div
          className={`fixed inset-0 bg-primary/60 z-[60] transition-opacity duration-300 md:hidden ${
            mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={`fixed inset-y-0 right-0 z-[65] w-80 bg-white transform transition-transform duration-300 ease-in-out md:hidden shadow-xl flex flex-col ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className='p-6 border-b border-primary mt-20'>
            <h2 className='font-bebas text-4xl tracking-tight text-primary'>
              MENU
            </h2>
          </div>

          {/* Links */}
          <div className='flex-1 overflow-y-auto p-8 space-y-10'>
            <div className='flex flex-col space-y-6'>
              <button
                onClick={() => navigate('/products')}
                className='flex items-center justify-between w-full font-bebas text-3xl text-primary border-b border-primary/10 pb-2'
              >
                PRODUCTS <ArrowRight size={20} className='text-secondary' />
              </button>

              {navLinks.map(link => (
                <button
                  key={link.name}
                  onClick={() => {
                    if (link.adminOnly && !isAdmin) {
                      toast.error(tooltipForAddProduct());
                    } else {
                      navigate(link.path);
                    }
                  }}
                  className='flex items-center justify-between w-full font-bebas text-3xl text-primary border-b border-primary/10 pb-2 opacity-100'
                >
                  {link.name.toUpperCase()}{' '}
                  <ArrowRight size={20} className='text-secondary' />
                </button>
              ))}
            </div>

            {/* Small Detail Links */}
            <div className='space-y-10 pt-4'>
              <Link
                to='/cart'
                className='flex items-center gap-3 font-mono text-md uppercase tracking-wide text-primary'
              >
                <CartIcon className='w-5 h-5' /> View Cart{' '}
                <ArrowRight size={20} className='text-secondary' />
              </Link>
              {user ? (
                <button
                  onClick={logout}
                  className='flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-secondary'
                >
                  Logout Account
                </button>
              ) : (
                <Link
                  to='/login'
                  className='flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-gray-500'
                >
                  <LoginIcon className='w-5 h-5' /> Account Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Footer */}
          <div className='p-8 bg-gray-50'>
            <p className='font-mono text-[10px] text-gray-400 uppercase tracking-widest text-center'>
              ©2025 By criscruzdev
            </p>
          </div>
        </aside>
      </nav>
    </>
  );
};

export default Navbar;
