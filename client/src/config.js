const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  MIN_SCORE_TO_SUBMIT: 30,
  GAME_DURATION: 30,
  EGG_VALUES: { normal: 1, golden: 5, bomb: -3 },
  SPAWN_RATES: { normal: 0.6, golden: 0.2, bomb: 0.2 },
  DIFFICULTY_LEVELS: [
    { threshold: 0,  spawnRate: 1000 },
    { threshold: 20, spawnRate: 800  },
    { threshold: 40, spawnRate: 600  },
    { threshold: 60, spawnRate: 400  },
    { threshold: 80, spawnRate: 300  }
  ]
};

export default config;
