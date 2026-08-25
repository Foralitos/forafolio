"use client";

import ReactDOM from 'react-dom';
import { DialogBox } from './DialogBox';
import { useCDMXTime } from '@/hooks/useCDMXTime';

// NPC dialog texts in English
const npcDialogs = [
  "Hey there, traveler! Welcome to Fora's world...",
  "I'm here to tell you about this talented developer from Mexico City.",
  "Fora's journey started with blockchain and web development, diving into the tech world with curiosity and passion.",
  "They've participated in hackathons like AI competitions, built real products like digital catalogs and phone services...",
  "From creating Planeadito to developing ML models, each project taught something new and valuable.",
  "The coolest part? They're always learning, building, and exploring new technologies.",
  "Ready to see what they've created? Let's check out the projects below!"
];

export const About = () => {
  const { isDaytime } = useCDMXTime();
  // El personaje ya vive pintado dentro del fondo, así que desapareció el
  // sprite 8-bit que flotaba encima (ForaNpc.png) — era lo que rompía el
  // estilo contra la pintura del parque.
  const backgroundImage = isDaytime ? '/AboutDay.webp' : '/AboutNight.webp';

  // Ver Hero.jsx: los <link rel="preload"> del Remix no funcionan dentro del
  // JSX en App Router.
  ReactDOM.preload('/AboutDay.webp', { as: 'image' });
  ReactDOM.preload('/AboutNight.webp', { as: 'image' });

  const handleStoryComplete = () => {
    // Scroll to Projects section when the story finishes
    const projectsElement = document.getElementById('projects');
    if (projectsElement) {
      const yOffset = -80; // Navbar offset
      const y = projectsElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            imageRendering: 'pixelated'
          }}
        />
        {/* Degradado hacia abajo: la tarjeta de vidrio necesita algo de
            oscuridad detrás para que el texto se lea sobre el pasto claro
            de la versión de día. */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Caja de diálogo */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-10 md:pb-14">
        <DialogBox
          dialogs={npcDialogs}
          speed={30}
          onComplete={handleStoryComplete}
        />
      </div>
    </section>
  );
};
