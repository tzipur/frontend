import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, User, Calendar, Smile, Star, Plus, Trash2, ChevronDown } from 'lucide-react';
import { mockChildProfiles } from '../../lib/mockData';
import type { ChildProfile } from '../../types';

const ages = [4, 5, 6, 7, 8];

const animals = [
  { emoji: '🐻', name: 'דוב', id: 'bear' },
  { emoji: '🦊', name: 'שועל', id: 'fox' },
  { emoji: '🐰', name: 'ארנב', id: 'rabbit' },
  { emoji: '🐦', name: 'ציפור', id: 'bird' },
  { emoji: '🐢', name: 'צב', id: 'turtle' },
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
  const { t } = useTranslation();
  
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(mockChildProfiles);
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  const [childToDelete, setChildToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (childrenList.length === 0) {
      handleAddChild();
    }
  }, []);

  useEffect(() => {
    setChildrenList(prev => prev.filter(c => c.id === expandedChildId || c.nickname.trim() !== ''));
  }, [expandedChildId]);

  const handleAddChild = () => {
    const newId = `child-${Date.now()}`;
    const newChild: ChildProfile = {
      id: newId,
      nickname: '',
      age: 4,
      favoriteAnimal: 'bear',
      hobby: ''
    };
    const newList = [...childrenList, newChild];
    setChildrenList(newList);
    setExpandedChildId(newId);
  };

  const updateChild = (id: string, field: keyof ChildProfile, value: any) => {
    const newList = childrenList.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    setChildrenList(newList);
    
    let mockChild = mockChildProfiles.find(c => c.id === id);
    if (!mockChild) {
      const updatedChild = newList.find(c => c.id === id);
      if (updatedChild && updatedChild.nickname.trim() !== '') {
        mockChildProfiles.push(updatedChild);
        mockChild = updatedChild;
      }
    }
    if (mockChild) {
      (mockChild as any)[field] = value;
    }
  };

  const handleDeleteChild = (id: string) => {
    setChildToDelete(id);
  };

  const confirmDeleteChild = (id: string) => {
    const newList = childrenList.filter(c => c.id !== id);
    setChildrenList(newList);
    const index = mockChildProfiles.findIndex(c => c.id === id);
    if (index > -1) mockChildProfiles.splice(index, 1);
    
    if (expandedChildId === id) {
      setExpandedChildId(null);
    }
    setChildToDelete(null);
  };

  const isFormValid = (child: ChildProfile) => {
    const isDuplicate = childrenList.some(c => c.id !== child.id && c.nickname.trim() !== '' && c.nickname.trim().toLowerCase() === child.nickname.trim().toLowerCase());
    return !isDuplicate && child.nickname.trim() !== '' && !!child.age && !!child.favoriteAnimal && !!child.hobby && child.hobby.trim() !== '';
  };

  const isAllValid = childrenList.length > 0 && childrenList.every(isFormValid);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col p-6 bg-tzipur-cream/30"
    >
      <header className="flex items-center justify-between pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-tzipur-sky leading-tight">{t('profile.title')}</h1>
          <p className="text-tzipur-brown/70 font-medium mt-1">{t('profile.subtitle', 'בואו נכיר את הילד/ה')}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full text-tzipur-brown/50 hover:text-tzipur-sky hover:bg-white shadow-sm border border-transparent hover:border-tzipur-sky/20 transition-all bg-white shrink-0"
        >
          <X size={20} />
        </button>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-4">
        <div className="space-y-4">
          {childrenList.map(child => {
            const isExpanded = expandedChildId === child.id;
            const childAnimal = animals.find(a => a.id === child.favoriteAnimal || a.name === child.favoriteAnimal) || animals[0];
            const isDuplicateName = child.nickname.trim() !== '' && childrenList.some(c => c.id !== child.id && c.nickname.trim().toLowerCase() === child.nickname.trim().toLowerCase());

            return (
              <div key={child.id} className={`bg-white rounded-[32px] shadow-sm border ${isExpanded ? 'border-tzipur-sky/40' : 'border-tzipur-border/60'} overflow-hidden transition-colors`}>
                {/* Accordion Header */}
                <button 
                  onClick={() => setExpandedChildId(isExpanded ? null : child.id)}
                  className="w-full p-5 flex items-center justify-between text-right"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-tzipur-sky/5 rounded-2xl flex items-center justify-center shrink-0 border border-tzipur-sky/10">
                      <span className="text-3xl leading-none select-none">{childAnimal.emoji}</span>
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${child.nickname ? 'text-tzipur-brown' : 'text-tzipur-brown/50'}`}>
                        {child.nickname || t('profile.newChild', 'ילד חדש')}
                      </h3>
                      {!isExpanded && (
                        <p className="text-tzipur-brown/60 text-sm font-medium mt-0.5">
                          {t('profile.age.label')} {child.age} {child.hobby ? `• ${child.hobby}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pr-2">
                    <ChevronDown className={`text-tzipur-brown/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Accordion Body (Form) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-2 border-t border-tzipur-border/30 space-y-8">
                        {/* Nickname Input */}
                        <div className="space-y-3 mt-2">
                          <label className="flex items-center gap-2 text-base font-bold text-tzipur-sky">
                            <User size={18} strokeWidth={2.5} />
                            <span>{t('profile.nickname.label')}<span className="text-red-500 ms-1">*</span></span>
                          </label>
                          <input
                            type="text"
                            placeholder={t('profile.nickname.placeholder')}
                            value={child.nickname}
                            onChange={(e) => updateChild(child.id, 'nickname', e.target.value)}
                            className={`w-full bg-tzipur-cream/50 border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 transition text-tzipur-brown font-medium placeholder:text-tzipur-brown/50 placeholder:font-normal ${
                              isDuplicateName 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-tzipur-border focus:border-tzipur-sky focus:ring-tzipur-sky/20'
                            }`}
                          />
                          {isDuplicateName && (
                            <p className="text-red-500 text-sm font-medium mt-1">{t('profile.duplicateName', 'שם זה כבר קיים, נא לבחור שם אחר')}</p>
                          )}
                        </div>

                        {/* Age Selector */}
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-base font-bold text-tzipur-sky">
                            <Calendar size={18} strokeWidth={2.5} />
                            <span>{t('profile.age.label')}<span className="text-red-500 ms-1">*</span></span>
                          </label>
                          <div className="grid grid-cols-5 gap-2.5">
                            {ages.map((age) => (
                              <button
                                key={age}
                                onClick={() => updateChild(child.id, 'age', age)}
                                className={`aspect-square rounded-2xl border-2 font-bold text-lg flex items-center justify-center transition-all ${
                                  child.age === age
                                    ? 'border-tzipur-sky bg-tzipur-sky text-white shadow-md shadow-tzipur-sky/20 scale-105'
                                    : 'border-tzipur-border bg-tzipur-cream/50 text-tzipur-brown hover:border-tzipur-sky hover:bg-tzipur-cream'
                                }`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Animal Selector */}
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-base font-bold text-tzipur-sky">
                            <Smile size={18} strokeWidth={2.5} />
                            <span>{t('profile.animal.label')}<span className="text-red-500 ms-1">*</span></span>
                          </label>
                          <div className="grid grid-cols-5 gap-2.5">
                            {animals.map((animal) => (
                              <button
                                key={animal.id}
                                onClick={() => updateChild(child.id, 'favoriteAnimal', animal.id)}
                                className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-all ${
                                  (child.favoriteAnimal === animal.id || child.favoriteAnimal === animal.name)
                                    ? 'border-tzipur-sky bg-tzipur-sky/10 shadow-md shadow-tzipur-sky/10 scale-105'
                                    : 'border-tzipur-border bg-tzipur-cream/50 hover:border-tzipur-sky hover:bg-tzipur-cream'
                                }`}
                              >
                                <span className="text-3xl leading-none select-none">{animal.emoji}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Hobby Input */}
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-base font-bold text-tzipur-sky">
                            <Star size={18} strokeWidth={2.5} />
                            <span>{t('profile.hobby.label')}<span className="text-red-500 ms-1">*</span></span>
                          </label>
                          <input
                            type="text"
                            placeholder={t('profile.hobby.placeholder')}
                            value={child.hobby}
                            onChange={(e) => updateChild(child.id, 'hobby', e.target.value)}
                            className="w-full bg-tzipur-cream/50 border border-tzipur-border rounded-2xl px-5 py-4 focus:outline-none focus:border-tzipur-sky focus:ring-2 focus:ring-tzipur-sky/20 transition text-tzipur-brown font-medium placeholder:text-tzipur-brown/50 placeholder:font-normal"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-tzipur-border/30">
                          {child.nickname.trim() !== '' ? (
                            <button
                              onClick={() => handleDeleteChild(child.id)}
                              className="flex items-center gap-2 text-red-500/80 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors font-bold text-sm"
                            >
                              <Trash2 size={18} strokeWidth={2.5} />
                              {t('profile.delete')}
                            </button>
                          ) : <div />}
                          <button
                            onClick={() => setExpandedChildId(null)}
                            disabled={!child.nickname.trim() || isDuplicateName}
                            className="bg-tzipur-sky/10 text-tzipur-sky hover:bg-tzipur-sky/20 px-6 py-2.5 rounded-xl transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {t('profile.save')}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          <button
            onClick={handleAddChild}
            className="w-full bg-transparent border-2 border-dashed border-tzipur-border hover:border-tzipur-sky/50 hover:bg-tzipur-sky/5 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 text-tzipur-brown/60 hover:text-tzipur-sky font-bold transition-all mt-6"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-tzipur-border/50">
              <Plus size={24} strokeWidth={3} />
            </div>
            {t('profile.addChild')}
          </button>
        </div>
      </main>

      <footer className="pt-6 pb-2 mt-auto shrink-0 z-10 flex flex-col gap-3">
        <button
          onClick={() => navigate('/create')}
          className="w-full bg-tzipur-sky text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-shadow active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
          disabled={!isAllValid}
        >
          {t('profile.startCreating')}
        </button>
        <button
          onClick={() => navigate('/library')}
          className="w-full bg-white text-tzipur-sky py-4 rounded-2xl font-bold text-lg border-2 border-tzipur-sky/20 hover:bg-tzipur-sky/5 transition-colors active:scale-[0.98] transition-transform"
        >
          {t('profile.goToLibrary')}
        </button>
        <button
          onClick={() => {
            if (window.confirm(t('profile.deleteProfileConfirm', 'האם אתה בטוח שברצונך למחוק את הפרופיל?'))) {
              navigate('/');
            }
          }}
          className="w-full text-red-500/80 hover:text-red-500 hover:bg-red-50 py-3 mt-2 rounded-2xl font-bold text-base transition-colors"
        >
          {t('profile.deleteProfile', 'מחיקת פרופיל')}
        </button>
      </footer>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {childToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-tzipur-brown/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-xl space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <Trash2 size={28} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-xl text-tzipur-brown">{t('profile.deleteConfirmTitle')}</h3>
                <p className="text-tzipur-brown/70 leading-relaxed font-medium">
                  {t('profile.deleteConfirmMessage')}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setChildToDelete(null)}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-tzipur-brown/70 bg-tzipur-cream hover:bg-tzipur-border/50 transition-colors"
                >
                  {t('profile.cancel')}
                </button>
                <button
                  onClick={() => confirmDeleteChild(childToDelete)}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20 transition-colors"
                >
                  {t('profile.confirmDelete')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
