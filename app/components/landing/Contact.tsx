import { motion } from 'framer-motion';
import { EnvelopeSimple, Calendar } from 'phosphor-react';
import { useCDMXTime } from '~/hooks/useCDMXTime';

export const Contact = () => {
  const { isDaytime } = useCDMXTime();

  // Dynamic colors based on time
  const bgColor = isDaytime ? 'bg-gray-50' : 'bg-gray-950';
  const textPrimary = isDaytime ? 'text-gray-900' : 'text-white';
  const textSecondary = isDaytime ? 'text-gray-600' : 'text-gray-400';
  const cardBg = isDaytime ? 'bg-white/95' : 'bg-gray-900/95';
  const cardBorder = isDaytime ? 'border-gray-900' : 'border-white';
  const innerBorder = isDaytime ? 'border-gray-300' : 'border-gray-700';
  const cornerColor = isDaytime ? 'bg-gray-900' : 'bg-white';
  const dividerColor = isDaytime ? 'bg-gray-900' : 'bg-white';
  const emailBorder = isDaytime ? 'border-gray-900' : 'border-white';
  const emailBg = isDaytime ? 'bg-gray-100/50' : 'bg-gray-800/50';
  const emailHoverBg = isDaytime ? 'hover:bg-gray-200/50' : 'hover:bg-gray-700/50';
  const buttonBorder = isDaytime ? 'border-gray-900' : 'border-white';
  const buttonBg = isDaytime ? 'bg-gray-900' : 'bg-white';
  const buttonText = isDaytime ? 'text-white' : 'text-gray-900';
  const buttonHoverBg = isDaytime ? 'hover:bg-gray-800' : 'hover:bg-gray-200';
  const linkColor = isDaytime ? 'text-gray-900' : 'text-white';
  const linkHoverColor = isDaytime ? 'hover:text-gray-600' : 'hover:text-gray-300';
  const glowColor = isDaytime ? 'bg-gray-900/20' : 'bg-white/20';

  return (
    <section id="contact" className={`relative py-24 ${bgColor} overflow-hidden transition-colors duration-500`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative group"
        >
          {/* Pixel glow effect */}
          <div className={`absolute -inset-2 ${glowColor} opacity-0 group-hover:opacity-100 blur-md -z-10 transition-opacity duration-300`} />

          {/* Outer border */}
          <div className={`relative ${cardBg} backdrop-blur-sm border-4 ${cardBorder} transition-colors duration-500`}>
            {/* Corner decorations */}
            <div className={`absolute -top-1 -left-1 w-4 h-4 ${cornerColor} transition-colors duration-500`} />
            <div className={`absolute -top-1 -right-1 w-4 h-4 ${cornerColor} transition-colors duration-500`} />
            <div className={`absolute -bottom-1 -left-1 w-4 h-4 ${cornerColor} transition-colors duration-500`} />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${cornerColor} transition-colors duration-500`} />

            {/* Inner border */}
            <div className={`border-2 ${innerBorder} p-8 transition-colors duration-500`}>
              <h2 className={`font-pixel text-2xl md:text-3xl ${textPrimary} mb-4 text-center tracking-wider transition-colors duration-500`}>
                CONTACT ME
              </h2>

              {/* Divider */}
              <div className={`w-full max-w-md mx-auto h-1 ${dividerColor} mb-8 transition-colors duration-500`} />

              <p className={`${textSecondary} text-sm md:text-base mb-8 text-center transition-colors duration-500`}>
                You can reach me via email or through my social media.{' '}
                <a
                  href="https://linkedin.com/in/foradelgado"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkColor} ${linkHoverColor} underline transition-colors duration-200`}
                >
                  LinkedIn
                </a>
                {' '}or{' '}
                <a
                  href="https://x.com/ElforaDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkColor} ${linkHoverColor} underline transition-colors duration-200`}
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
                className={`flex items-center justify-center gap-2 mb-8 border-2 ${emailBorder} ${emailBg} ${emailHoverBg} py-4 px-6 transition-colors duration-500`}
              >
                <EnvelopeSimple className={`w-6 h-6 ${textPrimary} transition-colors duration-500`} />
                <a
                  href="mailto:elfora.dev@gmail.com"
                  className={`text-lg md:text-xl ${textPrimary} transition-colors duration-500 font-mono`}
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
                  className={`inline-flex items-center gap-3 px-6 py-3 border-2 ${buttonBorder} ${buttonBg} ${buttonText} ${buttonHoverBg} transition-all duration-200`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-pixel text-xs md:text-sm tracking-wide">▶ SCHEDULE A CALL</span>
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
