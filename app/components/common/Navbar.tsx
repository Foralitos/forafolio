import { useState, useEffect } from 'react';
import { Link, useLocation } from '@remix-run/react';
import { List, X } from 'phosphor-react';

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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

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
            className="flex items-center space-x-2 text-xl font-bold tracking-tighter hover:text-violet-600 transition-colors z-50"
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
            className="md:hidden rounded-full p-2 inline-flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-violet-600 transition-colors duration-200 z-50"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} weight="bold" />
            ) : (
              <List size={24} weight="bold" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        role="presentation"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setMobileMenuOpen(false);
        }}
        className={`fixed inset-0 bg-black/60 backdrop-blur-lg transition-all duration-500 md:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Content */}
      <div
        className={`fixed inset-y-0 right-0 w-full bg-white dark:bg-gray-900 transform transition-transform duration-500 ease-in-out md:hidden
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-6">
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group relative overflow-hidden text-3xl font-medium transition-colors duration-300 ease-out
                  ${
                    isActive(item.href)
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-gray-900 dark:text-gray-100'
                  }
                `}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <span className="relative z-10 block transform transition-transform duration-500 ease-out group-hover:translate-x-2">
                  {item.name}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Fora. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};
