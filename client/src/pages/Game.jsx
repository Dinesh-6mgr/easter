import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameArea from '../components/game/GameArea';
import ScoreDisplay from '../components/game/ScoreDisplay';
import TimerBar from '../components/game/TimerBar';
import GameOverModal from '../components/game/GameOverModal';
import useGameLogic from '../hooks/useGameLogic';
import Button from '../components/common/Button';
import config from '../config';
import { useLanguage } from '../context/LanguageContext';

const Game = () => {
  const [showGameOver, setShowGameOver] = useState(false);
  const { score, level, timeLeft, eggs, isPlaying, gameOver, gameStats, startGame, handleEggClick, resetGame } = useGameLogic();
  const { t } = useLanguage();

  useEffect(() => {
    if (gameOver) setShowGameOver(true);
  }, [gameOver]);

  const handlePlayAgain = () => {
    setShowGameOver(false);
    startGame();
  };

  return (
    <div className="min-h-screen py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          {t('game.title')} <span className="gradient-text">{t('game.titleHighlight')}</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('game.subtitle', { min: config.MIN_SCORE_TO_SUBMIT })}
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <ScoreDisplay score={score} level={level} stats={gameStats} />

          <div className="card flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('game.timeLeft')}</p>
              <p className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-easter-blue'}`}>{timeLeft}s</p>
            </div>
            <TimerBar timeLeft={timeLeft} totalTime={config.GAME_DURATION} />
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('game.multiplier')}</p>
              <p className="text-3xl font-bold text-easter-purple">x{level}</p>
            </div>
            <span className="text-4xl">⚡</span>
          </div>
        </div>

        {/* Game area */}
        <GameArea eggs={eggs} onEggClick={handleEggClick} isPlaying={isPlaying} />

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-6">
          {!isPlaying ? (
            <Button size="lg" onClick={startGame}>{t('game.startGame')}</Button>
          ) : (
            <Button variant="outline" size="lg" onClick={resetGame}>{t('game.reset')}</Button>
          )}
        </div>

        {/* Meaning of the game */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex gap-3 items-start bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl px-5 py-4"
        >
          <span className="text-2xl shrink-0 mt-0.5">🥚</span>
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            {t('game.meaning')}
          </p>
        </motion.div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <span className="text-2xl block mb-1">🥚</span>
            <p className="font-semibold">{t('game.normalEgg')}</p>
          </div>
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
            <span className="text-2xl block mb-1">🥚✨</span>
            <p className="font-semibold">{t('game.goldenEgg')}</p>
          </div>
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <span className="text-2xl block mb-1">💣</span>
            <p className="font-semibold">{t('game.bomb')}</p>
          </div>
        </div>
      </div>

      <GameOverModal
        isOpen={showGameOver}
        onClose={() => setShowGameOver(false)}
        score={score}
        onPlayAgain={handlePlayAgain}
        gameStats={gameStats}
      />
    </div>
  );
};

export default Game;
