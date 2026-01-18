import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

export default function SuccessAnimation() {
  return (
    <div className="relative mb-6">
      {/* Outer Ring Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="absolute inset-0 w-20 h-20 -m-4 rounded-full bg-success/20"
      />

      {/* Inner Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.1,
        }}
        className="relative w-12 h-12 bg-success rounded-full flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
        >
          <CheckCircle2 className="w-7 h-7 text-white" strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos((i * Math.PI) / 3) * 40,
            y: Math.sin((i * Math.PI) / 3) * 40,
          }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: "easeOut",
          }}
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-success rounded-full"
        />
      ))}
    </div>
  );
}
