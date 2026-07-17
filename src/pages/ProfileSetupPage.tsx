import { motion } from 'framer-motion';

export default function ProfileSetupPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[100dvh] p-8 text-center"
    >
      <h1 className="font-serif text-3xl text-tzipur-brown mb-4">הגדרת פרופיל</h1>
      <p className="text-tzipur-muted text-lg">
        ספרו לנו קצת על עצמכם
      </p>
    </motion.div>
  );
}
