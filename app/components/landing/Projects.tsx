import { motion } from 'framer-motion';
import { ArrowUpRight } from 'phosphor-react';

const projects = [
  {
    title: 'Planeadito',
    description: 'Digital catalog connecting suppliers across Mexico with potential customers, facilitating B2B commerce.',
    image: '/projects/planeadito.png',
    tags: ['Next.js', 'MongoDB', 'Tailwind CSS'],
    liveUrl: 'https://planeadito.com',
  },
  {
    title: 'Talk to Santa',
    description: 'Santa Claus calling service that brought joy to hundreds of children during the holiday season.',
    image: '/projects/santa-mockup.png',
    tags: ['Next.js', 'Node.js', 'Bland'],
    liveUrl: 'https://hablarconsanta.com',
  },
  {
    title: 'Predep',
    description: 'Sports prediction application that uses artificial intelligence to analyze and predict sports event results.',
    image: '/projects/predep-mockup.png',
    tags: ['Next.js', 'Tailwind CSS', 'MongoDB'],
    liveUrl: 'https://predep.vercel.app/',
  },
  {
    title: 'Aura',
    description: 'Modern and elegant business portfolio design with fluid animations and optimized user experience.',
    image: '/projects/Aura-mockup.png',
    tags: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://aura-ui.vercel.app',
  },
  {
    title: 'Luxe',
    description: 'Elegant and modern design for a jewelry store, with fluid animations and a refined user experience.',
    image: '/projects/Luxe-mockup.png',
    tags: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://luxe-jewelry.vercel.app',
  }
];

export const Projects = () => {
  return (
    <section id="projects" className="relative py-24 bg-gray-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900/50 to-gray-950 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,rgba(99,102,241,0)_100%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Proyectos Destacados
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Una selección de mis mejores proyectos, cada uno representando un desafío único y una solución innovadora.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.a
              key={index}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative block h-full"
            >
              {/* Project Card */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="relative h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-800 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="relative p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                      {project.title}
                    </h3>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                      className="text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowUpRight weight="bold" className="w-5 h-5" />
                    </motion.div>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-gray-800/50 rounded-full text-gray-300 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/0 via-violet-600/20 to-violet-600/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
              </motion.div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
