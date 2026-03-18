import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGamepad, FaTrophy, FaHistory } from 'react-icons/fa';
import { GiEasterEgg } from 'react-icons/gi';
import { getCurrentEasterMessage } from '../utils/dateMessages';
import Button from '../components/common/Button';
import VerseCard from '../components/common/VerseCard';
import { useLanguage } from '../context/LanguageContext';

const featureIcons = [
  { icon: <FaHistory className="w-8 h-8" />, color: 'from-blue-400 to-purple-400', link: '/timeline' },
  { icon: <FaGamepad className="w-8 h-8" />, color: 'from-green-400 to-yellow-400', link: '/game' },
  { icon: <FaTrophy className="w-8 h-8" />,  color: 'from-yellow-400 to-red-400',   link: '/leaderboard' },
];

const Home = () => {
  const { t } = useLanguage();
  const { message } = getCurrentEasterMessage();
  const features = t('home.features');

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden text-center py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
            className="inline-block mb-8"
          >
            <GiEasterEgg className="w-24 h-24 text-easter-purple" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">{t('home.hero')}</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10"
          >
            {message || t('home.tagline')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/game"><Button size="lg">{t('home.startPlaying')}</Button></Link>
            <Link to="/timeline"><Button variant="outline" size="lg">{t('home.learnStory')}</Button></Link>
          </motion.div>

          {/* Daily verse */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            className="max-w-xl mx-auto mt-10"
          >
            <VerseCard category="general" />
          </motion.div>
        </motion.div>

        <div className="absolute top-20 left-10 opacity-10 animate-bounce-slow pointer-events-none">
          <GiEasterEgg className="w-16 h-16 text-easter-purple" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10 animate-bounce-slow pointer-events-none">
          <GiEasterEgg className="w-20 h-20 text-easter-pink" />
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
        >
          {t('home.adventureTitle')} <span className="gradient-text">{t('home.adventureHighlight')}</span> {t('home.adventureEnd')}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {Array.isArray(features) && features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="card text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }} transition={{ duration: 0.5 }}
                className={`inline-block p-4 rounded-full bg-gradient-to-r ${featureIcons[i].color} text-white mb-4`}
              >
                {featureIcons[i].icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{f.description}</p>
              <Link to={featureIcons[i].link}><Button variant="ghost" size="sm">{t('home.explore')}</Button></Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-easter-purple to-easter-pink rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">{t('home.ctaTitle')}</h2>
          <p className="text-xl mb-8 opacity-90">{t('home.ctaDesc')}</p>
          <Link to="/game"><Button variant="secondary" size="lg">{t('home.playNow')}</Button></Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
