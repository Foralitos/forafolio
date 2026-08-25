"use client";

import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { useCDMXTime } from '@/hooks/useCDMXTime';
import { ScrollDownIndicator } from '../common/ScrollDownIndicator';

export const Hero = () => {
  const { isDaytime } = useCDMXTime();
  const backgroundImage = isDaytime ? '/ForaDay.png' : '/ForaNight.png';

  // En Remix los preloads eran <link> dentro del JSX. App Router no iza esas
  // etiquetas al <head>, así que se declaran con la API de React: mismo efecto
  // (el navegador baja los dos fondos por adelantado) y sin markup inválido.
  ReactDOM.preload('/ForaDay.png', { as: 'image' });
  ReactDOM.preload('/ForaNight.png', { as: 'image' });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-start justify-center overflow-hidden pt-32 md:pt-40"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            imageRendering: 'pixelated'
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Title */}
          <h1 className="font-neuebit text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-6 tracking-wider leading-tight">
            Fora Delgado
          </h1>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-mondwest text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 mb-8 tracking-wide"
          >
            Developer & Digital Creator
          </motion.h2>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <ScrollDownIndicator targetSection="#about" />
    </section>
  );
};
