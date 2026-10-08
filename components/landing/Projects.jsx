"use client";

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'phosphor-react';

// Grilla de proyectos dentro de la ventana de vidrio. Las tarjetas son "papel"
// (.panel en globals.css): casi sólidas, para que se lean sobre cualquier
// parte del wallpaper. Los colores salen de los tokens del escritorio, así que
// el modo día/noche ya no necesita clases condicionales aquí.
export const Projects = ({ projects }) => {
  return (
    <section className="px-5 py-8 md:px-8 md:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Projects</h1>
        <p className="mt-1 text-[15px] text-desk-fg/65">
          A few things I&apos;ve built and shipped.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="text-[15px] text-desk-fg/60">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.a
              key={project.liveUrl || index}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="panel group flex flex-col overflow-hidden rounded-2xl transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="aspect-[16/10] overflow-hidden bg-desk-line/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-[15px] font-semibold leading-snug">{project.title}</h2>
                  <ArrowUpRight
                    size={16}
                    weight="bold"
                    className="mt-0.5 shrink-0 text-desk-fg/40 transition-colors group-hover:text-blue-500"
                  />
                </div>
                <p className="mt-1.5 line-clamp-3 flex-1 text-[13px] leading-relaxed text-desk-fg/65">
                  {project.description}
                </p>
                {project.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-desk-line/[0.07] px-2 py-0.5 text-[11px] font-medium text-desk-fg/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
};
