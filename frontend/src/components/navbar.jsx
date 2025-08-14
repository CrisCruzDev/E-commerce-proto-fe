import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CiShoppingCart } from 'react-icons/ci'
import { HiMenu, HiX } from 'react-icons/hi' // New icons for the hamburger menu
import { LogoSvg } from './LogoSvg'

const Navbar = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false) // New state for mobile menu

  // New useEffect hook to handle body overflow when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navLinks = [
    { name: 'Products', path: '/#product-section' },
    { name: 'Add product', path: '/create' },
  ]

  const activeColor = 'text-[rgba(255,70,57,1)]'
  const inactiveColor = 'text-black'

  return (
    <nav className='sticky top-0 w-full h-20 z-40 bg-white backdrop-blur-lg border-b-[0.5px] border-gray-200'>
      <div className='h-full w-full px-4 sm:px-6 lg:px-8'>
        <div className='h-full flex justify-between items-center'>
          <Link to='/' className='flex items-center h-full'>
            <LogoSvg />
          </Link>

          {/* Desktop/Tablet Navigation - Hidden on small screens */}
          <div className='h-full hidden md:flex items-center space-x-8 flex-grow justify-center'>
            {navLinks.map((link) => {
              const isHashLink = link.path.includes('#')
              const linkPath = link.path.split('#')[0]
              const isActive = location.pathname === linkPath

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => {
                    if (
                      isHashLink &&
                      location.pathname === linkPath &&
                      location.hash === '#product-section'
                    ) {
                      e.preventDefault()
                      const el = document.getElementById('product-section')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className={`h-full flex items-center relative transition-all duration-100 group hover:text-black ${
                    isActive
                      ? 'text-[rgba(255,70,57,1)] scale-105'
                      : 'text-black/50'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0.5 left-0 h-[2px] bg-[rgba(255,48,34,1)] ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  ></span>
                </Link>
              )
            })}
          </div>

          <div className='flex items-center space-x-3'>
            <Link to='/cart'>
              <CiShoppingCart
                className={`w-7 h-7 ${
                  location.pathname === '/cart' ? activeColor : inactiveColor
                }`}
              />
            </Link>

            {/* Hamburger Icon for Mobile - Visible on small screens */}
            <div className='flex md:hidden'>
              <button
                onClick={() => setIsOpen(!isOpen)}
                type='button'
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-black'
                aria-controls='mobile-menu'
                aria-expanded={isOpen}
              >
                <span className='sr-only'>Open main menu</span>
                {isOpen ? (
                  <HiX
                    className='block h-6 w-6 text-[#FF4639]'
                    aria-hidden='true'
                  />
                ) : (
                  <HiMenu
                    className='block h-6 w-6 text-[#FF4639]'
                    aria-hidden='true'
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content - Hidden by default, toggles on click */}
      <div
        className={`${
          isOpen ? 'fixed inset-0 pt-20 h-screen md:hidden' : 'hidden'
        }`}
      >
        <div className='flex flex-col items-center justify-center h-full bg-gray-800/50 backdrop-blur-2xl px-2 pt-15 pb-3 space-y-1'>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)} // Close menu on click
                className={`block py-10 text-5xl font-thin ${
                  isActive
                    ? 'font-medium border-b-2 border-white text-white'
                    : 'text-gray-500'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
