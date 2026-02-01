import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, Shield } from 'lucide-react';

export function FloatingElements() {
  const floatingVariants = {
    animate: (custom: number) => ({
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 360],
      transition: {
        duration: 5 + custom,
        repeat: Infinity,
        ease: "easeInOut",
        delay: custom * 0.5,
      }
    })
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Icon 1 */}
      <motion.div
        custom={0}
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-[10%] opacity-20 dark:opacity-10"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      {/* Floating Icon 2 */}
      <motion.div
        custom={1}
        variants={floatingVariants}
        animate="animate"
        className="absolute top-40 right-[15%] opacity-20 dark:opacity-10"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
          <Zap className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      {/* Floating Icon 3 */}
      <motion.div
        custom={2}
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-40 left-[20%] opacity-20 dark:opacity-10"
      >
        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
          <TrendingUp className="w-7 h-7 text-white" />
        </div>
      </motion.div>

      {/* Floating Icon 4 */}
      <motion.div
        custom={3}
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-20 right-[25%] opacity-20 dark:opacity-10"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
      </motion.div>

      {/* Floating Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/3 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-30"
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"
      />
    </div>
  );
}
