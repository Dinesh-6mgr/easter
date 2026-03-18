import { AnimatePresence, motion } from 'framer-motion';
import Egg from './Egg';

const GameArea = ({ eggs, onEggClick, isPlaying }) => (
  <div className="relative bg-gradient-to-b from-sky-200 to-green-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl min-h-[480px] overflow-hidden select-none">
    {/* Decorative background */}
    <div className="absolute inset-0 pointer-events-none opacity-10 text-6xl">
      <span className="absolute top-6 left-8">🌿</span>
      <span className="absolute bottom-8 right-8">🌸</span>
      <span className="absolute top-16 right-16">🐰</span>
      <span className="absolute bottom-16 left-16">🌷</span>
    </div>

    {/* Grass */}
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-green-500 to-transparent opacity-30 pointer-events-none" />

    {/* Overlay when not playing */}
    {!isPlaying && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10 rounded-3xl"
      >
        <div className="text-center text-white px-4">
          <p className="text-5xl mb-4">🥚</p>
          <h3 className="text-3xl font-bold mb-2">Ready to Hunt?</h3>
          <p className="text-lg opacity-80">Click Start Game to begin!</p>
        </div>
      </motion.div>
    )}

    {/* Eggs */}
    <AnimatePresence>
      {eggs.map((egg) => (
        <Egg key={egg.id} egg={egg} onClick={() => onEggClick(egg.id, egg.type)} />
      ))}
    </AnimatePresence>
  </div>
);

export default GameArea;
