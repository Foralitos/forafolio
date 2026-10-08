"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EnvelopeSimple, InstagramLogo, LinkedinLogo } from "phosphor-react";
import { LINKS } from "@/components/desktop/apps";
import { XLogo } from "@/components/desktop/XLogo";
import { GithubMark } from "@/components/desktop/GithubMark";

// La ventana de About como un escrito en primera persona (inspirado en el
// about de Bart): el texto a la izquierda y, a la derecha, una foto real
// inclinada con las redes y el email debajo. Sustituye a la escena del NPC.

const EMAIL = "elfora.dev@gmail.com";

const REDES = [
  { href: LINKS.x, label: "Follow on X", icon: <XLogo size={20} /> },
  { href: LINKS.github, label: "Follow on GitHub", icon: <GithubMark size={20} /> },
  { href: LINKS.linkedin, label: "Follow on LinkedIn", icon: <LinkedinLogo size={22} /> },
  { href: LINKS.instagram, label: "Follow on Instagram", icon: <InstagramLogo size={22} /> },
];

function Proyecto({ slug, children }) {
  return (
    <Link href={`/projects/${slug}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
      {children}
    </Link>
  );
}

export const About = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-12 md:py-14">
      <div className="grid gap-12 md:grid-cols-[1.35fr_1fr]">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="min-w-0"
        >
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
            i&apos;m from chihuahua, building things i hope will change the world.
          </h1>

          <div className="mt-8 space-y-6 text-[17px] leading-[1.8] text-desk-fg/75">
            <p>
              i love building things. not just code: products that someone opens on a random tuesday and
              actually finds useful. my goal right now is simple and a little stubborn: build a product that
              pays my bills, then do it again.
            </p>
            <p>
              most of what i build ends up close to sports. with kira i co-founded{" "}
              <Proyecto slug="sport-metrics">sport metrics</Proyecto>, where we help coaches and analysts get
              the data and video of a game the same day, instead of waiting one or two. before that came{" "}
              <Proyecto slug="klai">klai</Proyecto>, which won the new interfaces track at platanus hack 26,
              and <Proyecto slug="elatletico">el atlético</Proyecto>, a spanish-language sports paper written
              by an ai pipeline that runs on a raspberry pi.
            </p>
            <p>
              i also build the tools i wish existed: <Proyecto slug="justenvs">justenvs</Proyecto>, a mac app
              to keep every project&apos;s .env encrypted; <Proyecto slug="sweeply">sweeply</Proyecto>, an
              open-source cli that frees up disk space without deleting what matters; and{" "}
              <Proyecto slug="koi-school">koi school</Proyecto>, the poker academy i made because i wanted to
              learn without paying for confusing solvers.
            </p>
            <p>
              during the week i work as a developer at{" "}
              <a
                href="https://pidelectronics.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                pid electronics
              </a>
              , take freelance projects and finish my engineering degree in virtual environments and digital
              business. on the side i make videos about english football below the premier league, the
              leagues nobody covers.
            </p>
            <p>
              i learned to ship by being around people who ship: escuelita maker, hackathons in cdmx, friends
              who tell you &quot;just launch it&quot;. most of my best work started as a weekend project with
              them.
            </p>
            <p>if you&apos;re building something, especially in sports or for developers, i&apos;d love to hear about it.</p>
          </div>
        </motion.article>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="min-w-0 md:sticky md:top-8 md:self-start"
        >
          <div className="rotate-[2deg] overflow-hidden rounded-2xl shadow-[0_24px_50px_-20px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:rotate-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/photo-6.webp"
              alt="Fora with two friends at Platanus Hack 26"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <ul className="mt-10 space-y-1">
            {REDES.map((red) => (
              <li key={red.label}>
                <a
                  href={red.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-lg px-1 py-2.5 text-[15px] text-desk-fg/80 transition-colors hover:text-desk-fg"
                >
                  <span className="flex w-6 justify-center text-desk-fg/50">{red.icon}</span>
                  {red.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-desk-line/10 pt-4">
            <a
              href={LINKS.email}
              className="flex items-center gap-4 px-1 py-2.5 text-[15px] text-desk-fg/80 hover:text-desk-fg"
            >
              <span className="flex w-6 justify-center text-desk-fg/50">
                <EnvelopeSimple size={22} />
              </span>
              {EMAIL}
            </a>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};
