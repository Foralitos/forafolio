import { useState, useEffect } from 'react';
import { Link, useLocation } from '@remix-run/react';

interface NavItem {
  name: string;
  href: string;
}

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold tracking-tighter hover:text-violet-600 transition-colors"
          >
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Fora
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 relative group
                  ${
                    isActive(item.href)
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400'
                  }
                `}
              >
                {item.name}
                <span 
                  className={`absolute -bottom-1 left-0 h-0.5 bg-violet-600 transition-all duration-200
                    ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}
                  `} 
                />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-violet-600 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-600"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'
                }`}
              />
              <span
                className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200
                ${
                  isActive(item.href)
                    ? 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:text-violet-600 hover:bg-violet-50 dark:hover:text-violet-400 dark:hover:bg-violet-900/20'
                }
              `}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
