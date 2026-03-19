import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import config from '../config';
import { useSound } from './useSound';

const REFILL_COUNT = 5;
const BOUNDS = { minX: 5, maxX: 92, minY: 5, maxY: 88 };

// Faster speeds — noticeably harder at every level
const BASE_SPEED = 0.18;
const SPEED_BY_LEVEL = [0.18, 0.27, 0.38, 0.52, 0.68, 0.86];

const randBetween = (a, b) => a + Math.random() * (b - a);

const makeEgg = (level = 1) => {
  const rand = Math.random();
  let type = 'normal';
  if (rand < config.SPAWN_RATES.bomb) type = 'bomb';
  else if (rand < config.SPAWN_RATES.bomb + config.SPAWN_RATES.golden) type = 'golden';

  const speed = SPEED_BY_LEVEL[Math.min(level - 1, SPEED_BY_LEVEL.length - 1)] || BASE_SPEED;
  const angle = Math.random() * Math.PI * 2;

  return {
    id: Date.now() + Math.random(),
    type,
    level,
    x: randBetween(BOUNDS.minX, BOUNDS.maxX),
    y: randBetween(BOUNDS.minY, BOUNDS.maxY),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    createdAt: Date.now(),
  };
};

const makeBatch = (count, level) =>
  Array.from({ length: count }, () => makeEgg(level));

const useGameLogic = () => {
  const [score, setScore]         = useState(0);
  const [level, setLevel]         = useState(1);
  const [timeLeft, setTimeLeft]   = useState(config.GAME_DURATION);
  const [eggs, setEggs]           = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver]   = useState(false);
  const [gameStats, setGameStats] = useState({ normalEggs: 0, goldenEggs: 0, bombs: 0 });

  const scoreRef     = useRef(0);
  const levelRef     = useRef(1);
  const isPlayingRef = useRef(false);
  const rafRef       = useRef(null);
  const spawnRef     = useRef(null);
  const { playSound } = useSound();

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const getCurrentLevel = useCallback((s) => {
    const levels = config.DIFFICULTY_LEVELS;
    for (let i = levels.length - 1; i >= 0; i--) {
      if (s >= levels[i].threshold) return i + 1;
    }
    return 1;
  }, []);

  const getSpawnRate = useCallback((s) => {
    const levels = config.DIFFICULTY_LEVELS;
    for (let i = levels.length - 1; i >= 0; i--) {
      if (s >= levels[i].threshold) return levels[i].spawnRate;
    }
    return levels[0].spawnRate;
  }, []);

  // ── rAF movement loop ──────────────────────────────────────────────────────
  const startMovementLoop = useCallback(() => {
    const tick = () => {
      if (!isPlayingRef.current) return;

      setEggs((prev) => {
        if (prev.length === 0) return prev;
        return prev.map((egg) => {
          let { x, y, vx, vy } = egg;
          x += vx;
          y += vy;

          // Bounce off walls
          if (x <= BOUNDS.minX) { x = BOUNDS.minX; vx = Math.abs(vx); }
          if (x >= BOUNDS.maxX) { x = BOUNDS.maxX; vx = -Math.abs(vx); }
          if (y <= BOUNDS.minY) { y = BOUNDS.minY; vy = Math.abs(vy); }
          if (y >= BOUNDS.maxY) { y = BOUNDS.maxY; vy = -Math.abs(vy); }

          return { ...egg, x, y, vx, vy };
        });
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopMovementLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Spawn helpers ──────────────────────────────────────────────────────────
  const spawnOne = useCallback(() => {
    setEggs((prev) => [...prev, makeEgg(levelRef.current)]);
  }, []);

  const spawnBatch = useCallback((count = REFILL_COUNT) => {
    setEggs((prev) => [...prev, ...makeBatch(count, levelRef.current)]);
  }, []);

  const startSpawnLoop = useCallback((rate) => {
    if (spawnRef.current) clearInterval(spawnRef.current);
    spawnRef.current = setInterval(spawnOne, rate);
  }, [spawnOne]);

  // ── Click handler ──────────────────────────────────────────────────────────
  const handleEggClick = useCallback((eggId, type) => {
    setEggs((prev) => {
      const next = prev.filter((e) => e.id !== eggId);
      if (next.length === 0 && isPlayingRef.current) {
        setTimeout(() => spawnBatch(REFILL_COUNT), 80);
      }
      return next;
    });

    let points = 0;
    if (type === 'golden') {
      points = config.EGG_VALUES.golden;
      playSound('golden');
      setGameStats((s) => ({ ...s, goldenEggs: s.goldenEggs + 1 }));
      if (scoreRef.current >= 30) confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } else if (type === 'bomb') {
      points = config.EGG_VALUES.bomb;
      playSound('bomb');
      setGameStats((s) => ({ ...s, bombs: s.bombs + 1 }));
    } else {
      points = config.EGG_VALUES.normal;
      playSound('collect');
      setGameStats((s) => ({ ...s, normalEggs: s.normalEggs + 1 }));
    }

    setScore((prev) => {
      const next = Math.max(0, prev + points);
      setLevel(getCurrentLevel(next));
      return next;
    });
  }, [playSound, getCurrentLevel, spawnBatch]);

  // ── Game controls ──────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    if (spawnRef.current) clearInterval(spawnRef.current);
    stopMovementLoop();

    setScore(0);
    setLevel(1);
    setTimeLeft(config.GAME_DURATION);
    setGameStats({ normalEggs: 0, goldenEggs: 0, bombs: 0 });
    setGameOver(false);
    setIsPlaying(true);
    playSound('start');

    // Seed the board immediately
    setEggs(makeBatch(REFILL_COUNT + 2, 1));
    startMovementLoop();
    startSpawnLoop(config.DIFFICULTY_LEVELS[0].spawnRate);
  }, [playSound, startMovementLoop, stopMovementLoop, startSpawnLoop]);

  const resetGame = useCallback(() => {
    if (spawnRef.current) clearInterval(spawnRef.current);
    stopMovementLoop();
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setTimeLeft(config.GAME_DURATION);
    setEggs([]);
    setGameStats({ normalEggs: 0, goldenEggs: 0, bombs: 0 });
  }, [stopMovementLoop]);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      setGameOver(true);
      stopMovementLoop();
      if (spawnRef.current) clearInterval(spawnRef.current);
      playSound('gameOver');
      if (scoreRef.current >= 50) confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, playSound, stopMovementLoop]);

  // ── Restart spawn loop when difficulty changes ─────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    startSpawnLoop(getSpawnRate(score));
    return () => { if (spawnRef.current) clearInterval(spawnRef.current); };
  }, [isPlaying, score, getSpawnRate, startSpawnLoop]);

  // ── Stale egg cleanup ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    const cleanup = setInterval(() => {
      const now = Date.now();
      setEggs((prev) => {
        // Lifespan shrinks as level rises: 4s → 2.5s
        const lifespan = Math.max(2500, 4000 - (levelRef.current - 1) * 350);
        const next = prev.filter((e) => now - e.createdAt < lifespan);
        if (next.length === 0 && isPlayingRef.current) {
          setTimeout(() => spawnBatch(REFILL_COUNT), 80);
        }
        return next;
      });
    }, 800);
    return () => clearInterval(cleanup);
  }, [isPlaying, spawnBatch]);

  // Cleanup on unmount
  useEffect(() => () => {
    stopMovementLoop();
    if (spawnRef.current) clearInterval(spawnRef.current);
  }, [stopMovementLoop]);

  return { score, level, timeLeft, eggs, isPlaying, gameOver, gameStats, startGame, handleEggClick, resetGame };
};

export default useGameLogic;
