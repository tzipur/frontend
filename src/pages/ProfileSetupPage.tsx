import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const ages = [2, 3, 4, 5, 6, 7, 8];

const animals = [
  { emoji: '🐻', name: 'דוב' },
  { emoji: '🦊', name: 'שועל' },
  { emoji: '🐰', name: 'ארנב' },
  { emoji: '🐦', name: 'ציפור' },
  { emoji: '🐢', name: 'צב' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [hobby, setHobby] = useState('');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[100dvh] flex flex-col p-6"
    >
      {/* Header */}
      <header className="flex items-center justify-between py-4 mb-6">
        <h1 className="font-serif text-2xl font-bold">הפרופיל שלנו</h1>
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full text-tzipur-muted hover:text-tzipur-brown hover:bg-tzipur-sand transition-colors"
        >
          <X size={20} />
        </button>
      </header>

      {/* Form */}
      <main className="flex-1 space-y-8 w-full overflow-y-auto">
        {/* Nickname Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-tzipur-muted">
            כינוי עבור הילד/ה
          </label>
          <input
            type="text"
            placeholder="לדוגמה: רוני או רונרון"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full bg-white border border-tzipur-border rounded-xl px-4 py-3 focus:outline-none focus:border-tzipur-sky focus:ring-1 focus:ring-tzipur-sky transition text-tzipur-brown placeholder:text-tzipur-muted/60"
          />
        </div>

        {/* Age Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-tzipur-muted">גיל</label>
          <div className="flex flex-wrap gap-3">
            {ages.map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`w-12 h-12 rounded-full border-2 font-medium text-lg flex items-center justify-center transition-all ${
                  selectedAge === age
                    ? 'border-tzipur-sky bg-[#D7E9F5] text-tzipur-sky'
                    : 'border-tzipur-border bg-white text-tzipur-muted hover:border-tzipur-sky'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* Animal Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-tzipur-muted">
            חיה אהובה (תלווה את הסיפור)
          </label>
          <div className="grid grid-cols-5 gap-2">
            {animals.map((animal) => (
              <button
                key={animal.name}
                onClick={() => setSelectedAnimal(animal.name)}
                className={`aspect-square rounded-xl border-2 text-2xl flex items-center justify-center transition-all ${
                  selectedAnimal === animal.name
                    ? 'border-tzipur-sky bg-[#D7E9F5]'
                    : 'border-tzipur-border bg-white hover:border-tzipur-sky'
                }`}
              >
                {animal.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Hobby Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-tzipur-muted">
            תחביב
          </label>
          <input
            type="text"
            placeholder="לדוגמה: ציור, כדורגל, ריקוד"
            value={hobby}
            onChange={(e) => setHobby(e.target.value)}
            className="w-full bg-white border border-tzipur-border rounded-xl px-4 py-3 focus:outline-none focus:border-tzipur-sky focus:ring-1 focus:ring-tzipur-sky transition text-tzipur-brown placeholder:text-tzipur-muted/60"
          />
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="pt-6 pb-4 mt-auto">
        <button
          onClick={() => navigate('/create')}
          className="w-full bg-tzipur-sky text-white py-4 rounded-2xl font-medium text-lg shadow-md hover:shadow-lg transition-shadow active:scale-[0.98] transition-transform"
        >
          שמירה והמשך
        </button>
      </footer>
    </motion.div>
  );
}
