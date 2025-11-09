import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

interface NPCDialogBoxProps {
  avatarSrc: string;
  dialogs: string[];
  speed?: number;
  delayBetweenDialogs?: number;
  onComplete?: () => void;
  compact?: boolean;
}

export const NPCDialogBox = ({
  avatarSrc,
  dialogs,
  speed = 50,
  delayBetweenDialogs = 2000,
  onComplete,
  compact = false
}: NPCDialogBoxProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [hasStarted, setHasStarted] = useState(false);
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const currentDialog = dialogs[currentDialogIndex];
  const isLastDialog = currentDialogIndex === dialogs.length - 1;

  // Start the dialog when component becomes visible
  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
      setIsTyping(true);
    }
  }, [isInView, hasStarted]);

  // Trigger onComplete when story ends
  useEffect(() => {
    if (!isTyping && isLastDialog && onComplete && hasStarted) {
      // Small delay before scrolling to projects
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isTyping, isLastDialog, onComplete, hasStarted]);

  const handleClick = () => {
    if (!isLastDialog && !isTyping) {
      // Move to next dialog on click
      setCurrentDialogIndex(prev => prev + 1);
      setIsTyping(true);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full mx-auto ${compact ? 'max-w-2xl' : 'max-w-4xl'}`}
    >
      {/* Dialog Box Container */}
      <div
        onClick={handleClick}
        className={`relative ${!isTyping && !isLastDialog ? 'cursor-pointer hover:scale-[1.01] transition-transform duration-200' : ''}`}
      >
        {/* 16-bit style border */}
        <div className={`relative bg-gray-900/95 backdrop-blur-sm shadow-2xl ${compact ? 'border-4' : 'border-8'} border-white`}>
          {/* Inner border for 16-bit effect */}
          <div className={`border-2 border-gray-700 ${compact ? 'p-4 md:p-6' : 'p-8 md:p-12'}`}>
            <div className={`flex ${compact ? 'gap-4' : 'gap-6 md:gap-10'}`}>
              {/* NPC Avatar - only show if not compact */}
              {!compact && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex-shrink-0"
                >
                  <div className="w-24 h-24 md:w-40 md:h-40 border-6 border-white bg-gray-800 overflow-hidden">
                    <img
                      src={avatarSrc}
                      alt="NPC Avatar"
                      className="w-full h-full object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Dialog Text */}
              <div className={`flex-1 flex flex-col justify-center ${compact ? 'min-h-[80px] md:min-h-[100px]' : 'min-h-[160px] md:min-h-[200px]'}`}>
                <div className={`font-pixel text-white leading-relaxed ${compact ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}>
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
                          sequence={[
                            currentDialog,
                            () => setIsTyping(false)
                          ]}
                          wrapper="span"
                          speed={speed as any}
                          cursor={false}
                        />
                        {!isTyping && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="inline-block ml-1"
                          >
                            ▼
                          </motion.span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <span className="text-white/40">...</span>
                  )}
                </div>

                {/* Progress indicator */}
                <div className="flex gap-1 mt-4">
                  {dialogs.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 ${
                        index <= currentDialogIndex
                          ? 'bg-white'
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corner decorations for 16-bit effect */}
        <div className={`absolute bg-white ${compact ? '-top-1 -left-1 w-4 h-4' : '-top-2 -left-2 w-6 h-6'}`} />
        <div className={`absolute bg-white ${compact ? '-top-1 -right-1 w-4 h-4' : '-top-2 -right-2 w-6 h-6'}`} />
        <div className={`absolute bg-white ${compact ? '-bottom-1 -left-1 w-4 h-4' : '-bottom-2 -left-2 w-6 h-6'}`} />
        <div className={`absolute bg-white ${compact ? '-bottom-1 -right-1 w-4 h-4' : '-bottom-2 -right-2 w-6 h-6'}`} />
      </div>

      {/* Instructions */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={`text-center text-white/60 font-pixel ${compact ? 'text-xs md:text-sm mt-3' : 'text-sm md:text-base mt-6'}`}
      >
        {!hasStarted ? 'Waiting...' : isTyping ? 'Reading...' : !isLastDialog ? 'Click to continue' : 'Story complete - Scrolling to projects...'}
      </motion.p>
    </motion.div>
  );
};
