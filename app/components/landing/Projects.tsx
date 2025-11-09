import { motion } from 'framer-motion';
import { useCDMXTime } from '~/hooks/useCDMXTime';

const projects = [
  {
    title: 'Furbo',
    description: 'AI WhatsApp agent for sports predictions and real-time news updates.',
    image: '/projects/Furbo.png',
    tags: ['Next.js', 'MongoDB', 'Tailwind CSS', 'OpenAI', 'WhatsApp', 'LangGraph'],
    liveUrl: 'https://furbo.app',
  },
  {
    title: 'ElAtletico',
    description: 'Sports newsletter application that uses artificial intelligence to write and research sports match notes.',
    image: '/projects/atletico.png',
    tags: ['Next.js', 'Tailwind CSS', 'MongoDB', 'OpenAI', 'N8N'],
    liveUrl: 'https://elatletico.news/',
  },
  {
    title: 'Hablar con Santa',
    description: 'Santa Claus calling service that brought joy to hundreds of children during the holiday season.',
    image: '/projects/santa-mockup.png',
    tags: ['Next.js', 'Node.js', 'Bland'],
    liveUrl: 'https://hablarconsanta.com',
  },
 
 
  {
    title: 'FORAUI',
    description: 'A comprehensive Tailwind CSS component and animation library offering elegant UI elements with fluid motion effects for modern web applications.',
    image: '/projects/whiteforaui.png',
    tags: ['Next.js', 'Tailwind CSS',],
    liveUrl: 'https://foraui.vercel.app',
  }
];

export const Projects = () => {
  const { isDaytime } = useCDMXTime();

  // Dynamic colors based on time
  const bgColor = isDaytime ? 'bg-gray-50' : 'bg-gray-950';
  const textPrimary = isDaytime ? 'text-gray-900' : 'text-white';
  const textSecondary = isDaytime ? 'text-gray-600' : 'text-gray-400';
  const cardBg = isDaytime ? 'bg-white/95' : 'bg-gray-900/95';
  const cardBorder = isDaytime ? 'border-gray-900' : 'border-white';
  const innerBorder = isDaytime ? 'border-gray-300' : 'border-gray-700';
  const imageBorder = isDaytime ? 'border-gray-900' : 'border-white';
  const tagBorder = isDaytime ? 'border-gray-300' : 'border-gray-600';
  const tagBg = isDaytime ? 'bg-gray-100/50' : 'bg-gray-800/50';
  const tagText = isDaytime ? 'text-gray-700' : 'text-gray-300';
  const buttonBorder = isDaytime ? 'border-gray-900' : 'border-white';
  const buttonBg = isDaytime ? 'bg-gray-900/10' : 'bg-white/10';
  const buttonHoverBg = isDaytime ? 'hover:bg-gray-900' : 'hover:bg-white';
  const buttonHoverText = isDaytime ? 'hover:text-white' : 'hover:text-gray-900';
  const glowColor = isDaytime ? 'bg-gray-900/20' : 'bg-white/20';
  const cornerColor = isDaytime ? 'bg-gray-900' : 'bg-white';

  return (
    <section id="projects" className={`relative py-24 ${bgColor} overflow-hidden transition-colors duration-500`}>
      {/* Background Elements */}
      <div className={`absolute inset-0 ${isDaytime ? 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100' : 'bg-gradient-to-br from-gray-950 via-gray-900/50 to-gray-950'} -z-10 transition-colors duration-500`} />
      <div className={`absolute inset-0 ${isDaytime ? 'bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,rgba(99,102,241,0)_100%)]' : 'bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,rgba(99,102,241,0)_100%)]'} transition-opacity duration-500`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Pixel Art Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className={`font-pixel text-2xl md:text-3xl ${textPrimary} mb-6 tracking-wider transition-colors duration-500`}>
            MY PROJECTS
          </h2>
          <div className={`w-full max-w-md mx-auto h-1 ${isDaytime ? 'bg-gray-900' : 'bg-white'} mb-6 transition-colors duration-500`} />
          <p className={`${textSecondary} max-w-2xl mx-auto text-sm md:text-base transition-colors duration-500`}>
            A selection of my best projects, each representing a unique challenge and an innovative solution.
          </p>
        </motion.div>

        {/* Projects Grid - Pixel Art Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-full"
            >
              {/* Pixel Art Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="relative h-full"
              >
                {/* Card with pixel art borders */}
                <div className={`relative ${cardBg} backdrop-blur-sm border-4 ${cardBorder} shadow-2xl h-full transition-colors duration-500`}>
                  {/* Inner border */}
                  <div className={`border-2 ${innerBorder} p-4 md:p-6 h-full flex flex-col transition-colors duration-500`}>
                    {/* Image Container */}
                    <div className={`relative aspect-[4/3] border-2 ${imageBorder} mb-4 overflow-hidden ${isDaytime ? 'bg-gray-100' : 'bg-gray-800'} transition-colors duration-500`}>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>

                    {/* Title */}
                    <h3 className={`font-pixel ${textPrimary} text-sm md:text-base mb-3 tracking-wide transition-colors duration-500`}>
                      {project.title.toUpperCase()}
                    </h3>

                    {/* Description */}
                    <p className={`${textSecondary} text-xs md:text-sm leading-relaxed mb-4 flex-grow transition-colors duration-500`}>
                      {project.description}
                    </p>

                    {/* Tags - Retro Style */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`px-2 py-1 border-2 ${tagBorder} ${tagBg} ${tagText} text-xs font-mono transition-colors duration-500`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button - Arcade Style */}
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`border-2 ${buttonBorder} ${buttonBg} ${buttonHoverBg} ${buttonHoverText} ${textPrimary} text-center py-2 transition-colors duration-200`}
                      >
                        <span className="font-pixel text-xs md:text-sm">▶ VIEW PROJECT</span>
                      </motion.div>
                    </a>
                  </div>
                </div>

                {/* Corner decorations */}
                <div className={`absolute -top-1 -left-1 w-4 h-4 ${cornerColor} transition-colors duration-500`} />
                <div className={`absolute -top-1 -right-1 w-4 h-4 ${cornerColor} transition-colors duration-500`} />
                <div className={`absolute -bottom-1 -left-1 w-4 h-4 ${cornerColor} transition-colors duration-500`} />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${cornerColor} transition-colors duration-500`} />

                {/* Pixel glow effect on hover */}
                <div className={`absolute -inset-2 ${glowColor} opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10`} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
