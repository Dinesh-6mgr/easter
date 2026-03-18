import { motion } from 'framer-motion';

const STYLES = {
  golden: { emoji: '🥚', color: '#FBBF24', label: 'Golden Egg', size: '2.8rem' },
  bomb:   { emoji: '💣', color: '#EF4444', label: 'Bomb',        size: '2.6rem' },
  normal: { emoji: '🥚', color: '#93C5FD', label: 'Egg',         size: '2.4rem' },
};

const Egg = ({ egg, onClick }) => {
  const { emoji, color, label, size } = STYLES[egg.type] || STYLES.normal;

  return (
    <motion.button
      // Spawn pop-in / exit pop-out — position is handled by rAF in useGameLogic
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.12 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 18, duration: 0.2 }}
      whileHover={{ scale: 1.25 }}
      whileTap={{ scale: 0.75 }}
      onClick={onClick}
      aria-label={label}
      style={{
        position: 'absolute',
        left: `${egg.x}%`,
        top: `${egg.y}%`,
        transform: 'translate(-50%, -50%)',
        fontSize: size,
        color,
        cursor: 'pointer',
        userSelect: 'none',
        background: 'none',
        border: 'none',
        padding: 0,
        lineHeight: 1,
        // Wobble animation via CSS — different per egg type
        animation: egg.type === 'bomb'
          ? 'eggShake 0.5s ease-in-out infinite alternate'
          : egg.type === 'golden'
          ? 'eggPulse 1.2s ease-in-out infinite alternate'
          : 'eggBob 1.8s ease-in-out infinite alternate',
      }}
    >
      {emoji}

      {/* Golden glow ring */}
      {egg.type === 'golden' && (
        <motion.span
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.4, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FDE68A88 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}
    </motion.button>
  );
};

export default Egg;
