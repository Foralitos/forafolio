"use client";

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CaretLeft, CaretRight, GithubLogo, X } from 'phosphor-react';
import { STATUS } from './Projects';
import { ProjectCover } from './ProjectCover';

// Visor de capturas en grande. Escape lo cierra SIN cerrar la ventana: el
// escritorio (Desktop.jsx) también escucha Escape en window, así que aquí se
// escucha en fase de captura y se corta la propagación.
function Lightbox({ imagenes, indice, onClose, onMove }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onMove(1);
      else if (e.key === 'ArrowLeft') onMove(-1);
      else return;
      e.stopImmediatePropagation();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose, onMove]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm md:p-12"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagenes[indice]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
      />
      <button type="button" aria-label="Close" onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
        <X size={18} weight="bold" />
      </button>
      {imagenes.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); onMove(-1); }}
            className="absolute left-4 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => { e.stopPropagation(); onMove(1); }}
            className="absolute right-4 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25"
          >
            <CaretRight size={20} weight="bold" />
          </button>
          <p className="absolute bottom-4 text-[13px] text-white/70">
            {indice + 1} / {imagenes.length}
          </p>
        </>
      )}
    </motion.div>
  );
}

function Fila({ label, children }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 text-[13px]">
      <dt className="text-desk-fg/50">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

// html llega ya renderizado y sanitizado desde el servidor (renderMarkdown).
export function ProjectDetail({ project, html }) {
  const [abierta, setAbierta] = useState(null);
  const galeria = project.gallery;
  const estado = STATUS[project.status] ?? STATUS.live;
  const stack = project.stack.length ? project.stack : project.tags;

  const cerrar = useCallback(() => setAbierta(null), []);
  const mover = useCallback(
    (paso) => setAbierta((i) => (i + paso + galeria.length) % galeria.length),
    [galeria.length]
  );

  return (
    <article className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">
      {/* Encabezado */}
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[13px] text-desk-fg/55">
            <span className={`h-2 w-2 rounded-full ${estado.dot}`} />
            {estado.label}
            {project.year ? <span>· {project.year}</span> : null}
          </p>
          <h1 className="mt-2 font-mondwest text-5xl leading-none md:text-7xl">{project.title}</h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-desk-fg/70">
            {project.summary || project.description}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-blue-500 px-4 py-2 text-[13px] font-medium text-white hover:bg-blue-600"
            >
              Visit site <ArrowUpRight size={14} weight="bold" />
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-desk-line/10 px-4 py-2 text-[13px] font-medium hover:bg-desk-line/15"
            >
              <GithubLogo size={15} weight="fill" /> GitHub
            </a>
          ) : null}
        </div>
      </header>

      {/* Video o portada */}
      <div className="panel mt-8 overflow-hidden rounded-2xl">
        {project.video ? (
          <video
            src={project.video}
            poster={project.image || undefined}
            controls
            playsInline
            className="aspect-video w-full bg-black"
          />
        ) : (
          <div className="aspect-video w-full">
            <ProjectCover project={project} titleClassName="text-6xl md:text-8xl" />
          </div>
        )}
      </div>

      {/* Galería */}
      {galeria.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {galeria.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setAbierta(i)}
              className="panel group aspect-[4/3] overflow-hidden rounded-xl"
              aria-label={`Open screenshot ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </button>
          ))}
        </div>
      )}

      {/* Historia + ficha */}
      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_260px]">
        <div>
          {html ? (
            <div className="prose-blog max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p className="text-[16px] leading-relaxed text-desk-fg/75">{project.description}</p>
          )}
        </div>

        <aside className="md:sticky md:top-6 md:self-start">
          <dl className="panel divide-y divide-desk-line/[0.08] rounded-2xl px-5 py-2">
            {project.year ? <Fila label="Year">{project.year}</Fila> : null}
            {project.role ? <Fila label="Role">{project.role}</Fila> : null}
            <Fila label="Status">
              <span className="inline-flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${estado.dot}`} />
                {estado.label}
              </span>
            </Fila>
            {stack.length > 0 && (
              <div className="py-3">
                <dt className="text-[13px] text-desk-fg/50">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {stack.map((t) => (
                    <span key={t} className="rounded-full bg-desk-line/[0.07] px-2 py-0.5 text-[11px] font-medium">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </div>

      <AnimatePresence>
        {abierta !== null && (
          <Lightbox imagenes={galeria} indice={abierta} onClose={cerrar} onMove={mover} />
        )}
      </AnimatePresence>
    </article>
  );
}
