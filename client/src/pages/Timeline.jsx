import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import VerseCard from '../components/common/VerseCard';

const eventIcons = ['🌿', '🍞', '✝️', '🪨', '🌅'];

// Map timeline event index to verse category
const eventVerseCategory = ['palmSunday', 'general', 'goodFriday', 'general', 'easter'];

const Timeline = () => {
  const { t } = useLanguage();
  const events = t('timeline.events');

  return (
    <div className="min-h-screen py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('timeline.title')} <span className="gradient-text">{t('timeline.titleHighlight')}</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t('timeline.subtitle')}
        </p>
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        {/* Center line */}
        <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-easter-purple via-easter-pink to-easter-yellow rounded-full" />

        {Array.isArray(events) && events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex items-center mb-16 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            {/* Dot */}
            <div className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-easter-purple to-easter-pink z-10 shadow-lg" />

            {/* Card */}
            <div className={`w-5/12 ${index % 2 === 0 ? 'pr-10' : 'pl-10'}`}>
              <motion.div whileHover={{ scale: 1.03 }} className="card">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{eventIcons[index]}</span>
                  <h3 className="text-xl font-bold">{event.day}</h3>
                </div>
                <p className="text-xs text-gray-400 mb-2">{event.date}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{event.description}</p>
                <p className="text-xs italic text-easter-purple dark:text-easter-pink mb-3">{event.verse}</p>
                <VerseCard
                  category={eventVerseCategory[index]}
                  className="mt-2"
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Easter Sunday banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mt-16 max-w-3xl mx-auto"
      >
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-12 text-center text-white">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            className="text-6xl mb-4"
          >
            🌅
          </motion.div>
          <h2 className="text-4xl font-bold mb-4">{t('timeline.risen')}</h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto">{t('timeline.verse')}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Timeline;
