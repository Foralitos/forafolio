import { useState, useEffect } from 'react';
import { List, X } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCDMXTime } from '~/hooks/useCDMXTime';

interface NavItem {
  name: string;
  href: string;
}

const mobileMenuVariants = {
  closed: {
    x: "100%",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      when: "afterChildren"
    }
  },
  open: {
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const mobileItemVariants = {
  closed: { x: 50, opacity: 0 },
  open: { x: 0, opacity: 1 }
};

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { formattedTime } = useCDMXTime();

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = ['home', 'about', 'projects', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
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

  const handleNavClick = (href: string) => {
    const element = document.getElementById(href.replace('#', ''));
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const navItems: NavItem[] = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const isActive = (href: string) => activeSection === href.replace('#', '');

  return (
    <>
      {/* Desktop Navbar - Centered Glass Effect */}
      <div className="absolute top-6 left-0 right-0 z-50 hidden md:block pointer-events-none">
        <div className="flex justify-center items-center w-full px-8">
          {/* Spacer for centering navbar */}
          <div className="flex-1" />

          {/* Centered Navbar */}
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-auto"
          >
            {/* Glass Container */}
            <div className="flex items-center gap-1 px-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            {/* Logo/Home Icon */}
            <button
              onClick={() => handleNavClick('#home')}
              className="px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
              aria-label="Home"
            >
              <svg
                className="w-5 h-5 text-white/90"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-white/20" />

            {/* Nav Items */}
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`px-4 py-2 rounded-full text-sm font-normal transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.name}
              </button>
            ))}
            </div>
          </motion.nav>

          {/* Clock Display */}
          <div className="flex-1 flex justify-end">
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="pointer-events-auto"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-white/70"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-sm font-medium text-white/90">{formattedTime}</span>
                <span className="text-xs font-normal text-white/60">CDMX</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute top-0 w-full z-50 md:hidden bg-gray-950/80 backdrop-blur-md shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('#home')}
              className="flex items-center space-x-2 text-xl font-bold tracking-tighter hover:text-violet-600 transition-colors z-50"
            >
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Fora
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 inline-flex items-center justify-center text-gray-200 hover:text-violet-400 transition-colors duration-200 z-50"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileMenuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <X size={24} weight="bold" />
                  ) : (
                    <List size={24} weight="bold" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg md:hidden z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 right-0 w-full bg-gray-950 md:hidden z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-800 text-gray-200 hover:text-violet-400 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} weight="bold" />
            </button>

            <div className="flex flex-col h-full pt-20 pb-6 px-6">
              <div className="flex-1 flex flex-col justify-center space-y-8">
                {[{ name: 'Home', href: '#home' }, ...navItems].map((item, index) => (
                  <motion.div
                    key={item.name}
                    variants={mobileItemVariants}
                    custom={index}
                    className="overflow-hidden"
                  >
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`group relative overflow-hidden text-3xl font-medium transition-colors duration-300 ease-out w-full text-left ${
                        isActive(item.href) ? 'text-violet-400' : 'text-gray-200'
                      }`}
                    >
                      <motion.span
                        className="relative z-10 block"
                        whileHover={{ x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    </button>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-8 border-t border-gray-800"
              >
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} Fora. All rights reserved.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
