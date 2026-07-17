import { motion } from 'framer-motion';

export default function CreationPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[100dvh] p-8 text-center"
    >
      <h1 className="font-serif text-3xl text-tzipur-brown mb-4">יצירת סיפור</h1>
      <p className="text-tzipur-muted text-lg">
        ספרו לנו מה קרה, ואנחנו נהפוך את זה לסיפור
      </p>
    </motion.div>
  );
}
