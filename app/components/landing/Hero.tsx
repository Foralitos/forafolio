import { ArrowRight, Code } from 'phosphor-react';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <motion.section 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen pt-20 overflow-hidden bg-gray-950"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900/50 to-gray-950 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2 mb-6"
            >
              <Code weight="bold" className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-medium text-gray-400">
                Full Stack Developer
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
            >
              Transforming ideas into{' '}
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400"
              >
                digital experiences
              </motion.span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-400 mb-8 leading-relaxed"
            >
              Full Stack Developer specialized in creating modern and elegant web applications.
              Focused on user experience and performance.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/projects"
                  className="group flex items-center gap-2 px-6 py-3 bg-violet-500 text-white rounded-full font-medium hover:bg-violet-600 transition-all duration-300"
                >
                  View Projects
                  <ArrowRight 
                    weight="bold"
                    className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
                  />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="group flex items-center gap-2 px-6 py-3 border border-gray-800 hover:border-violet-500 rounded-full font-medium text-gray-300 hover:text-violet-400 transition-all duration-300"
                >
                  Contact
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <motion.a
                whileHover={{ scale: 1.2,}}
                whileTap={{ scale: 0.9 }}
                href="https://github.com/ForaAngel"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-violet-400 transition-colors duration-300"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2,  }}
                whileTap={{ scale: 0.9 }}
                href="https://www.linkedin.com/in/angel-delgado-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-violet-400 transition-colors duration-300"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </motion.a>
            </motion.div>
          </div>

          {/* Right Content - Image Container */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="relative aspect-square w-full max-w-lg mx-auto">
              {/* Decorative Border */}
              <motion.div
                animate={{ rotate: [0, 6, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-violet-500/20 rounded-3xl"
              />
              <motion.div
                animate={{ rotate: [0, -2, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-indigo-500/20 rounded-3xl"
              />
              
              {/* Image Container */}
              <motion.div 
                
                transition={{ duration: 0.3 }}
                className="relative h-full rounded-2xl overflow-hidden"
              >
                <img
                  src="/landing/foralitos.jpg"
                  alt="Fora"
                  className="w-full h-full object-cover mix-blend-luminosity"
                />
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="absolute -right-4 -bottom-4 p-4 bg-gray-900 rounded-2xl shadow-xl border border-gray-800"
              >
                <div className="flex items-center gap-2">
                  <Code weight="fill" className="w-5 h-5 text-violet-400" />
                  <span className="text-sm font-medium text-gray-300">
                    +2 years of experience
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
