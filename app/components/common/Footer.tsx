import { motion } from 'framer-motion';
import { useCDMXTime } from '~/hooks/useCDMXTime';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isDaytime } = useCDMXTime();

  // Dynamic colors based on CDMX time
  const bgColor = isDaytime ? 'bg-gray-50' : 'bg-gray-950';
  const textPrimary = isDaytime ? 'text-gray-900' : 'text-white';
  const textSecondary = isDaytime ? 'text-gray-600' : 'text-gray-400';
  const dividerColor = isDaytime ? 'border-gray-900' : 'border-white';

  return (
    <footer className={`relative py-16 ${bgColor} overflow-hidden transition-colors duration-500`}>
      {/* Top Divider - Pixel Art Style */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className={`border-t-4 ${dividerColor} mb-16 transition-colors duration-500`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center space-y-4"
          >
            <h3 className={`text-2xl md:text-3xl font-neuebit ${textPrimary} tracking-wider transition-colors duration-500`}>
              FORA
            </h3>
            <p className={`${textSecondary} text-sm md:text-base leading-relaxed max-w-md font-neuebit transition-colors duration-500`}>
              Creating unique and memorable digital experiences that transform ideas into reality.
            </p>
          </motion.div>
        </motion.div>

        {/* Divider - Pixel Art Style */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className={`border-t-2 ${dividerColor} my-8 transition-colors duration-500`}
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`text-center ${textSecondary} text-sm font-neuebit transition-colors duration-500`}
        >
          <p>&copy; {currentYear} FORA. ALL RIGHTS RESERVED.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
