"use client";

import { motion } from 'framer-motion';
import { EnvelopeSimple, CalendarBlank, LinkedinLogo } from 'phosphor-react';
import { LINKS } from '@/components/desktop/apps';
import { XLogo } from '@/components/desktop/XLogo';

// La ventana de contacto como una tarjeta de la app Contactos de macOS:
// avatar, nombre, una fila de botones redondos de acción y debajo los datos
// en filas "etiqueta → valor".
const ACCIONES = [
  { label: 'email', href: LINKS.email, icon: <EnvelopeSimple size={18} weight="fill" /> },
  { label: 'call', href: LINKS.agenda, icon: <CalendarBlank size={18} weight="fill" />, external: true },
  { label: 'linkedin', href: LINKS.linkedin, icon: <LinkedinLogo size={18} weight="fill" />, external: true },
  { label: 'x', href: LINKS.x, icon: <XLogo size={18} />, external: true },
];

const DATOS = [
  { label: 'email', value: 'elfora.dev@gmail.com', href: LINKS.email },
  { label: 'calendar', value: 'Book a 15-min call', href: LINKS.agenda, external: true },
  { label: 'linkedin', value: 'in/foradelgado', href: LINKS.linkedin, external: true },
  { label: 'x', value: '@ElforaDev', href: LINKS.x, external: true },
  { label: 'based in', value: 'Chihuahua, Mexico' },
];

const externo = (external) =>
  external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

export const Contact = () => {
  return (
    <section className="flex min-h-full items-start justify-center px-5 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="panel w-full max-w-md rounded-2xl p-6 md:p-8"
      >
        {/* Avatar + nombre */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-zinc-400 to-zinc-500 text-3xl font-medium text-white shadow-inner">
            FD
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Fora Delgado</h1>
          <p className="mt-0.5 text-[13px] text-desk-fg/60">Developer & Digital Creator</p>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-center gap-5">
          {ACCIONES.map(({ label, href, icon, external }) => (
            <a key={label} href={href} {...externo(external)} className="group flex flex-col items-center gap-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white transition-colors group-hover:bg-blue-600">
                {icon}
              </span>
              <span className="text-[11px] text-blue-500">{label}</span>
            </a>
          ))}
        </div>

        {/* Datos */}
        <dl className="mt-7 divide-y divide-desk-line/[0.08] border-t border-desk-line/[0.08]">
          {DATOS.map(({ label, value, href, external }) => (
            <div key={label} className="grid grid-cols-[88px_1fr] gap-3 py-2.5 text-[13px]">
              <dt className="text-right text-desk-fg/50">{label}</dt>
              <dd className="truncate">
                {href ? (
                  <a href={href} {...externo(external)} className="text-blue-500 hover:underline">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
};
