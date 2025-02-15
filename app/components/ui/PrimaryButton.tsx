import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'phosphor-react';

interface PrimaryButtonProps {
  to: string;
  children: React.ReactNode;
  showArrow?: boolean;
}

export const PrimaryButton = ({ to, children, showArrow = true }: PrimaryButtonProps) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={to}
        className="group flex items-center gap-2 px-6 py-3 bg-violet-500 text-white rounded-full font-medium hover:bg-violet-600 transition-all duration-300"
      >
        {children}
        {showArrow && (
          <ArrowRight 
            weight="bold"
            className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
          />
        )}
      </Link>
    </motion.div>
  );
}; 