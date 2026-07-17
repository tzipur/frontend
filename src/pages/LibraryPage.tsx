import { motion } from 'framer-motion';

export default function LibraryPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[100dvh] p-8 text-center"
    >
      <h1 className="font-serif text-3xl text-tzipur-brown mb-4">הספרייה שלנו</h1>
      <p className="text-tzipur-muted text-lg">
        כל הסיפורים של המשפחה
      </p>
    </motion.div>
  );
}
