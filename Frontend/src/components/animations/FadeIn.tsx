import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  ...props
}: FadeInProps) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
    none: { y: 0, x: 0 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction]
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
