import { motion } from 'framer-motion';

const STYLES = {
  golden: { emoji: '🥚', label: 'Golden Egg', size: '3rem'  },
  bomb:   { emoji: '💣', label: 'Bomb',        size: '2.8rem' },
  normal: { emoji: '🥚', label: 'Egg',         size: '2.5rem' },
};

// How long an egg lives at each level (must match useGameLogic lifespan formula)
const lifespanAt = (level) => Math.max(2500, 4000 - (level - 1) * 350);

const Egg = ({ egg, onClick }) => {
  const { emoji, label, size } = STYLES[egg.type] || STYLES.normal;
  const lifespan = lifespanAt(egg.level ?? 1);
  const age = Date.now() - egg.createdAt;
  // 0 → full, 1 → expired
  const progress = Math.min(age / lifespan, 1);

  const animStyle = egg.type === 'bomb'
    ? 'eggShake 0.35s ease-in-out infinite alternate'
    : egg.type === 'golden'
    ? 'eggPulse 1s ease-in-out infinite alternate'
    : 'eggBob 1.6s ease-in-out infinite alternate';

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 16, duration: 0.18 }}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.7 }}
      onClick={onClick}
      aria-label={label}
      style={{
        position: 'absolute',
        left: `${egg.x}%`,
        top: `${egg.y}%`,
        transform: 'translate(-50%, -50%)',
        fontSize: size,
        cursor: 'pointer',
        userSelect: 'none',
        background: 'none',
        border: 'none',
        padding: 0,
        lineHeight: 1,
        animation: animStyle,
      }}
    >
      {emoji}

      {/* Golden glow */}
      {egg.type === 'golden' && (
        <motion.span
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.5, 0.9] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FDE68Aaa 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}

      {/* Bomb urgency ring — pulses red faster as it ages */}
      {egg.type === 'bomb' && (
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.35, 1] }}
          transition={{ duration: Math.max(0.25, 0.7 - progress * 0.45), repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #EF444466 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}
    </motion.button>
  );
};

export default Egg;
