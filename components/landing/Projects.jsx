"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FolderSimple, LinkSimple, Trash } from 'phosphor-react';
import { ProjectCover } from './ProjectCover';

// La ventana de Proyectos, sencilla: un título grande, una frase y la
// cuadrícula. Cada proyecto es su captura flotando (sin caja alrededor) con
// título, descripción y el dominio debajo. La captura y el título abren la
// página del proyecto; el dominio abre el sitio real.

export const STATUS = {
  live: { label: 'Live', dot: 'bg-green-500' },
  paused: { label: 'Paused', dot: 'bg-amber-400' },
  archived: { label: 'Archived', dot: 'bg-zinc-400' },
  dead: { label: 'Dead', dot: 'bg-red-500' },
};

// Va en el `toolbar` de la ventana (fijo, fuera del scroll), como la barra de
// ruta de Finder con el conteo de elementos.
export function ProjectsToolbar({ count, trash = false }) {
  const Icono = trash ? Trash : FolderSimple;
  return (
    <div className="flex items-center gap-2 rounded-lg bg-desk-line/[0.05] px-3 py-2 text-[14px] ring-1 ring-inset ring-desk-line/10">
      <Icono size={16} weight="duotone" className={trash ? 'text-desk-fg/50' : 'text-blue-500'} />
      {trash ? 'Trash' : 'All projects'}
      {typeof count === 'number' && (
        <span className="ml-auto font-neuebit text-[15px] tracking-wider text-desk-fg/45">
          {count} ITEMS
        </span>
      )}
    </div>
  );
}

// "https://www.sportmetrics.app/" → "sportmetrics.app"; sin sitio, el repo.
function enlaceDe(project) {
  const url = project.liveUrl || project.repoUrl;
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    const texto = host === 'github.com' || host === 'npmjs.com' ? `${host}${u.pathname.replace(/\/$/, '')}` : host;
    return { url, texto };
  } catch {
    return null;
  }
}

const INTRO =
  "I've built a lot over the years; these are the ones that taught me the most and that I'm proudest of.";

// La Papelera reusa la misma cuadrícula con su propio título y las portadas
// deslavadas, como archivos borrados que todavía se pueden abrir.
export const Projects = ({ projects, title = 'projects.', intro = INTRO, faded = false }) => {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-14 pt-10 md:px-12 md:pt-14">
      <header className="max-w-2xl">
        <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">{title}</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-desk-fg/65">{intro}</p>
      </header>

      {projects.length === 0 ? (
        <p className="mt-12 text-[15px] text-desk-fg/60">Nothing here yet.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const enlace = enlaceDe(project);
            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.05 }}
              >
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div className={`aspect-[16/10] overflow-hidden rounded-2xl shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)] ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1 ${faded ? 'opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0' : ''}`}>
                    <ProjectCover
                      project={project}
                      autoPlay={false}
                      titleClassName="text-4xl"
                      className="transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold tracking-tight">{project.title}</h2>
                  <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-desk-fg/65">
                    {project.summary || project.description}
                  </p>
                </Link>
                {enlace ? (
                  <a
                    href={enlace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-[14px] text-desk-fg/45 hover:text-blue-500"
                  >
                    <LinkSimple size={15} />
                    {enlace.texto}
                  </a>
                ) : null}
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
};
