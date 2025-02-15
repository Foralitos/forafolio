import { motion } from 'framer-motion';
import { Star } from 'phosphor-react';

const experiences = [
  {
    year: '2022',
    title: 'Etherfuse Hackathon',
    challenge: 'My First Blockchain Hackathon',
    description: 'I participated in my first hackathon developing an application that allowed storing and displaying legal documentation through QR codes using blockchain technology. Although we didn\'t win, the experience was invaluable.',
    impact: 'This hackathon opened the doors to the blockchain world and taught me the importance of working under pressure and as a team.',
    image: '/about/experience1.jpg',
    alt: 'Etherfuse Hackathon',
    technologies: ['Blockchain', 'React', 'Web3.js']
  },
  {
    year: '2024',
    title: 'Escuelita Maker',
    challenge: 'Startup Development',
    description: 'During my time at Escuelita Maker, I developed two significant projects: Planeadito, a digital catalog connecting suppliers across Mexico with potential customers, and Hablar con Santa, a phone call service with Santa Claus that brought joy to many children.',
    impact: 'The experience not only improved my technical skills but also taught me the art of effective pitching and product selling. The most valuable aspect was the incredible community I found, which has become a permanent part of my professional life.',
    image: '/landing/escuelita.jpg',
    alt: 'Escuelita Maker Projects',
    technologies: ['Next.js', 'Tailwind CSS', 'MongoDB', 'Bland']
  },
  {
    year: '2024',
    title: 'AI Hackathon Juárez',
    challenge: 'Real Estate Price Prediction',
    description: 'I participated in an Artificial Intelligence hackathon in Ciudad Juárez, where I developed a price prediction model for houses on sale. The project allowed me to deepen my knowledge in machine learning and data analysis.',
    impact: 'This experience helped me better understand the potential of AI in real-world applications and motivated me to continue exploring this field.',
    image: '/landing/iacenter.jpg',
    alt: 'AI Hackathon Juárez',
    technologies: ['Machine Learning', 'Python', 'Data Analysis', 'Next.js']
  },
];

export const About = () => {
  return (
    <section className="relative py-24 bg-gray-950 overflow-hidden">
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
            My Development Journey
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Each project has been a unique chapter in my journey, filled with challenges that have helped me grow both as a developer and as a professional.
          </p>
        </motion.div>

        {/* Story Timeline */}
        <div className="space-y-32">
          {experiences.map((experience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className={`relative flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-12 lg:gap-16`}
            >
              {/* Image Section */}
              <div className="relative w-full lg:w-1/2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[16/10] rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 mix-blend-overlay" />
                  <img
                    src={experience.image}
                    alt={experience.alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Year Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="bg-violet-500 bg-opacity-90 backdrop-blur-sm px-4 py-1 rounded-full"
                    >
                      <span className="text-white font-semibold">{experience.year}</span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Content Section */}
              <div className="relative w-full lg:w-1/2">
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {/* Title and Challenge */}
                  <div className="mb-6">
                    <motion.h3 
                      className="text-2xl sm:text-3xl font-bold text-white mb-3"
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {experience.title}
                    </motion.h3>
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex items-center gap-2 text-violet-400"
                    >
                      <Star weight="fill" className="w-5 h-5" />
                      <span className="text-lg font-medium">{experience.challenge}</span>
                    </motion.div>
                  </div>

                  {/* Description */}
                  <motion.p 
                    className="text-gray-400 leading-relaxed mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {experience.description}
                  </motion.p>

                  {/* Impact */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mb-6 p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg"
                  >
                    <p className="text-violet-300 italic">
                      &quot;{experience.impact}&quot;
                    </p>
                  </motion.div>

                  {/* Technologies */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex flex-wrap gap-2"
                  >
                    {experience.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gray-800/50 rounded-full text-gray-300 text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </motion.div>
                </motion.div>
              </div>

              {/* Connecting Line for Desktop */}
              {index < experiences.length - 1 && (
                <div className="absolute hidden lg:block w-px h-32 bg-gradient-to-b from-violet-500/50 to-transparent left-1/2 -bottom-32 transform -translate-x-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
