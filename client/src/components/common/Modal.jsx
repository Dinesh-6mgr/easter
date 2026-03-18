import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${sizes[size]} z-50 px-4 max-h-[90vh] flex flex-col`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 flex-shrink-0">
                <h2 className="text-2xl font-bold gradient-text">{title}</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" aria-label="Close">
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
