import { motion } from 'framer-motion';
import { EnvelopeSimple, Calendar } from 'phosphor-react';

export const Contact = () => {
  return (
    <section id="contact" className="relative py-24 bg-gray-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900/50 to-gray-950 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,rgba(99,102,241,0)_100%)]" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm shadow-xl"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-center">
            Contact Me<span className="text-violet-400">.</span>
          </h2>
          
          <p className="text-gray-300 text-lg mb-8 text-center">
            You can reach me via email or through my social media.{' '}
            <a 
              href="https://linkedin.com/in/angel-delgado-dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              LinkedIn
            </a>
            {' '}or{' '}
            <a 
              href="https://x.com/ElforaDev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              Twitter
            </a>
            {' '}if you&apos;d like to connect.
          </p>

          {/* Email Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-12 bg-gray-800/50 py-4 px-6 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <EnvelopeSimple className="w-6 h-6 text-violet-400" />
            <a 
              href="mailto:elfora.dev@gmail.com"
              className="text-xl text-gray-300 hover:text-white transition-colors"
            >
              elfora.dev@gmail.com
            </a>
          </motion.div>

          {/* Calendar Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <motion.a
              href="https://tidycal.com/elforadev/15-minute-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Calendar className="w-5 h-5" />
              Schedule a Call
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
