"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

// Sustituye a NPCDialogBox. La lógica es la misma —máquina de escribir, avance
// por click, aviso al terminar— pero el envoltorio dejó de ser una caja 8-bit
// con bordes duros y esquinas blancas: ahora es una tarjeta de vidrio como la
// del navbar, para que conviva con el fondo pintado en vez de pelearse con él.
export const DialogBox = ({
  dialogs,
  speed = 30,
  onComplete,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  // useInView con {once:true} ya se queda en true para siempre, así que
  // "arrancó" es exactamente "está a la vista" y "está escribiendo" se deriva
  // de si la máquina de escribir terminó. React 19 marca como error hacer esto
  // con setState dentro de un useEffect.
  const [typingDone, setTypingDone] = useState(false);

  const hasStarted = isInView;
  const isTyping = hasStarted && !typingDone;

  const currentDialog = dialogs[currentDialogIndex];
  const isLastDialog = currentDialogIndex === dialogs.length - 1;

  useEffect(() => {
    if (!isTyping && isLastDialog && onComplete && hasStarted) {
      const timer = setTimeout(() => onComplete(), 1500);
      return () => clearTimeout(timer);
    }
  }, [isTyping, isLastDialog, onComplete, hasStarted]);

  const handleClick = () => {
    if (!isLastDialog && !isTyping) {
      setCurrentDialogIndex(prev => prev + 1);
      setTypingDone(false);
    }
  };

  const avanzable = !isTyping && !isLastDialog;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div
        onClick={handleClick}
        className={`relative rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md shadow-2xl transition-colors duration-300 ${
          avanzable ? 'cursor-pointer hover:bg-black/50 hover:border-white/30' : ''
        }`}
      >
        <div className="px-6 py-6 md:px-10 md:py-8">
          {/* Texto */}
          <div className="min-h-[88px] md:min-h-[76px] font-mondwest text-white/95 text-lg md:text-2xl leading-relaxed">
            {hasStarted ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDialogIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <TypeAnimation
                    sequence={[currentDialog, () => setTypingDone(true)]}
                    wrapper="span"
                    speed={speed}
                    cursor={false}
                  />
                  {!isTyping && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="inline-block ml-2 align-middle text-white/70 text-base"
                    >
                      ▾
                    </motion.span>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <span className="text-white/30">…</span>
            )}
          </div>

          {/* Progreso: puntos discretos en vez de la barra segmentada 8-bit */}
          <div className="flex items-center gap-2 mt-6">
            {dialogs.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentDialogIndex
                    ? 'w-6 bg-white/90'
                    : index < currentDialogIndex
                      ? 'w-1.5 bg-white/50'
                      : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pie */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-white/50 text-xs md:text-sm mt-4 tracking-wide"
      >
        {!hasStarted
          ? ''
          : isTyping
            ? ''
            : !isLastDialog
              ? 'Click para continuar'
              : 'Bajando a los proyectos…'}
      </motion.p>
    </motion.div>
  );
};
