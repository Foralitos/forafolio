import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ScrollDownIndicatorProps {
  targetSection?: string;
}

export const ScrollDownIndicator = ({ targetSection = '#about' }: ScrollDownIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide indicator after scrolling 100px
      setIsVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const element = document.getElementById(targetSection.replace('#', ''));
    if (element) {
      const yOffset = -80; // Navbar offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 ${
        isVisible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <button
        onClick={handleClick}
        className="flex flex-col items-center gap-2 group cursor-pointer"
        aria-label="Scroll down"
      >
        {/* Text */}
        <span className="text-white/60 text-sm font-medium group-hover:text-white/90 transition-colors duration-300">
          Scroll
        </span>

        {/* Animated Arrows */}
        <div className="relative">
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center"
          >
            {/* Double Chevron */}
            <svg
              className="w-6 h-6 text-white/60 group-hover:text-white transition-colors duration-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>

        {/* Line decoration */}
        <motion.div
          animate={{
            scaleY: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
        />
      </button>
    </motion.div>
  );
};
