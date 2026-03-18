import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ScoreSubmissionModal from './ScoreSubmissionModal';
import VerseCard from '../common/VerseCard';
import leaderboardService from '../../services/leaderboardService';
import { useLanguage } from '../../context/LanguageContext';

const isInTop20 = (score, leaderboard) => {
  if (leaderboard.length < 20) return true;
  const lowestTop20 = leaderboard[leaderboard.length - 1].score;
  return score >= lowestTop20;
};

const GameOverModal = ({ isOpen, onClose, score, onPlayAgain, gameStats }) => {
  const [showSubmit, setShowSubmit] = useState(false);
  const [qualifies, setQualifies] = useState(false);
  const [rank, setRank] = useState(null);
  const [checking, setChecking] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen || score === 0) return;
    setChecking(true);
    leaderboardService.getTopScores()
      .then((res) => {
        const board = res.data || [];
        const qualifiesNow = isInTop20(score, board);
        setQualifies(qualifiesNow);
        if (qualifiesNow) {
          const higherCount = board.filter((s) => s.score > score).length;
          setRank(higherCount + 1);
        }
      })
      .catch(() => { setQualifies(true); setRank(null); })
      .finally(() => setChecking(false));
  }, [isOpen, score]);

  useEffect(() => {
    if (isOpen && !checking && qualifies) {
      const timer = setTimeout(() => setShowSubmit(true), 1800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, checking, qualifies]);

  useEffect(() => {
    if (!isOpen) { setShowSubmit(false); setQualifies(false); setRank(null); }
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen && !showSubmit} onClose={onClose} title={t('gameOver.title')}>
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-6xl"
          >
            {score >= 80 ? '🏆' : score >= 50 ? '🥈' : '🥚'}
          </motion.div>

          <p className="text-4xl font-bold gradient-text">{score}</p>
          <p className="text-gray-500 dark:text-gray-400">{t('gameOver.finalScore')}</p>

          <div className="grid grid-cols-3 gap-3 py-2 text-sm">
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
              <p className="text-2xl">🥚</p>
              <p className="font-bold">{gameStats.normalEggs}</p>
              <p className="text-gray-500">{t('gameOver.normal')}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3">
              <p className="text-2xl">✨</p>
              <p className="font-bold">{gameStats.goldenEggs}</p>
              <p className="text-gray-500">{t('gameOver.golden')}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3">
              <p className="text-2xl">💣</p>
              <p className="font-bold">{gameStats.bombs}</p>
              <p className="text-gray-500">{t('gameOver.bombs')}</p>
            </div>
          </div>

          {checking ? (
            <p className="text-sm text-gray-400 animate-pulse">{t('gameOver.checking')}</p>
          ) : qualifies ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-semibold text-green-600 dark:text-green-400"
            >
              {t('gameOver.qualified', { rank })}
            </motion.p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('gameOver.notQualified')}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onPlayAgain} className="flex-1">
              {t('gameOver.playAgain')}
            </Button>
            {qualifies && !checking && (
              <Button onClick={() => setShowSubmit(true)} className="flex-1">
                {t('gameOver.enterDetails')}
              </Button>
            )}
          </div>

          {/* Motivational verse */}
          <VerseCard category="gameMotivation" showRefresh className="mt-2" />
        </div>
      </Modal>

      <ScoreSubmissionModal
        isOpen={showSubmit}
        rank={rank}
        onClose={() => { setShowSubmit(false); onClose(); }}
        score={score}
      />
    </>
  );
};

export default GameOverModal;
