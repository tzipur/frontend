import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Calendar, Smile, Star, Plus, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import type { ChildProfile } from '../../types';
import { Button } from '../../components/Button';
import { ButtonGroup } from '../../components/ButtonGroup';
import { useProfile, useUpdateProfile } from '../../api';

const ages = [4, 5, 6, 7, 8];

const animals = [
  { emoji: '🐶', id: 'dog' },
  { emoji: '🐱', id: 'cat' },
  { emoji: '🐰', id: 'rabbit' },
  { emoji: '🐻', id: 'bear' },
  { emoji: '🐼', id: 'panda' },
  { emoji: '🦁', id: 'lion' },
  { emoji: '🐘', id: 'elephant' },
  { emoji: '🐒', id: 'monkey' },
  { emoji: '🦊', id: 'fox' },
  { emoji: '🐦', id: 'bird' },
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
  
  const { data: profileData, isLoading: isLoadingProfile } = useProfile();
  const updateMutation = useUpdateProfile();
  
  const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  const [childToDelete, setChildToDelete] = useState<string | null>(null);
  const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);
  const [savedChildIds, setSavedChildIds] = useState<Set<string>>(new Set());
  const [invalidFields, setInvalidFields] = useState<{id: string, fields: string[]} | null>(null);

  useEffect(() => {
    if (profileData?.children) {
      const validChildren = profileData.children as ChildProfile[];
      setChildrenList(validChildren);
      setSavedChildIds(new Set(validChildren.map(c => c.id)));
      if (profileData.children.length === 0) {
        handleAddChild();
      }
    } else if (!isLoadingProfile && childrenList.length === 0) {
      handleAddChild();
    }
  }, [profileData, isLoadingProfile]);

  useEffect(() => {
    setChildrenList(prev => prev.filter(c => c.id === expandedChildId || c.nickname.trim() !== ''));
  }, [expandedChildId]);

  const handleAddChild = () => {
    const newId = `child-${Date.now()}`;
    const newChild: ChildProfile = {
      id: newId,
      nickname: '',
      age: 4,
      favoriteAnimal: 'dog',
      hobby: ''
    };
    setChildrenList(prev => [...prev, newChild]);
    setExpandedChildId(newId);
  };

  const updateChild = (id: string, field: keyof ChildProfile, value: any) => {
    const newList = childrenList.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    setChildrenList(newList);
  };

  const handleDeleteChild = (id: string) => {
    setChildToDelete(id);
  };

  const confirmDeleteChild = (id: string) => {
    const newList = childrenList.filter(c => c.id !== id);
    setChildrenList(newList);
    
    if (expandedChildId === id) {
      setExpandedChildId(null);
    }
    setChildToDelete(null);
    
    const newSaved = new Set(savedChildIds);
    newSaved.delete(id);
    setSavedChildIds(newSaved);
  };

  const handleSaveChild = (child: ChildProfile, isDuplicateName: boolean) => {
    const invalid = [];
    if (child.nickname.trim() === '' || isDuplicateName) invalid.push('nickname');
    if (!child.age) invalid.push('age');
    
    if (invalid.length > 0) {
      setInvalidFields({ id: child.id, fields: invalid });
      setTimeout(() => setInvalidFields(null), 500);
      return;
    }
    
    const newSaved = new Set(savedChildIds);
    newSaved.add(child.id);
    setSavedChildIds(newSaved);
    setExpandedChildId(null);
  };

  const isFormValid = (child: ChildProfile) => {
    const isDuplicate = childrenList.some(c => c.id !== child.id && c.nickname.trim() !== '' && c.nickname.trim().toLowerCase() === child.nickname.trim().toLowerCase());
    return !isDuplicate && child.nickname.trim() !== '' && !!child.age;
  };

  const isAllValid = childrenList.length > 0 && childrenList.every(isFormValid);

  const handleSaveAllAndNavigate = (path: string) => {
    const payload = childrenList.map(c => ({
      ...c,
      id: c.id.startsWith('child-') ? null : c.id
    }));
    
    updateMutation.mutate({ children: payload }, {
      onSuccess: () => navigate(path),
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col p-6 bg-tzipur-cream/30"
    >
      <header className="flex items-center justify-between pb-[clamp(0.5rem,2dvh,1.5rem)] shrink-0">
        <div>
          <h1 className="font-serif text-3xl font-bold text-tzipur-sky leading-tight mb-1">{t('profile.title')}</h1>
          <p className="text-tzipur-brown/70 font-medium">{t('profile.subtitle', 'ספרו לנו על הילדים כדי שנתאים להם את הסיפורים')}</p>
        </div>
        <button
          onClick={() => setShowDeleteProfileModal(true)}
          className="flex items-center justify-center w-10 h-10 rounded-full text-red-500/80 bg-red-50 hover:text-red-500 hover:bg-red-100 shadow-sm border border-red-100 transition-all shrink-0"
          title={t('profile.deleteProfile', 'מחיקת פרופיל')}
        >
          <Trash2 size={20} strokeWidth={2.5} />
        </button>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-4">
        <div className="space-y-[clamp(0.5rem,2dvh,1rem)]">
          {childrenList.map(child => {
            const isExpanded = expandedChildId === child.id;
            const childAnimal = animals.find(a => a.id === child.favoriteAnimal || t(`animals.${a.id}`) === child.favoriteAnimal) || animals[0];
            const isDuplicateName = child.nickname.trim() !== '' && childrenList.some(c => c.id !== child.id && c.nickname.trim().toLowerCase() === child.nickname.trim().toLowerCase());

            return (
              <div key={child.id} className={`bg-white rounded-[32px] shadow-sm border ${isExpanded ? 'border-tzipur-sky/40' : 'border-tzipur-border/60'} overflow-hidden transition-colors`}>
                {/* Accordion Header */}
                <button 
                  onClick={() => setExpandedChildId(isExpanded ? null : child.id)}
                  className="w-full p-[clamp(0.75rem,2dvh,1.25rem)] flex items-center justify-between text-start"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-tzipur-sky/5 rounded-2xl flex items-center justify-center shrink-0 border border-tzipur-sky/10">
                      <span className="text-3xl leading-none select-none">{childAnimal.emoji}</span>
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg mb-0.5 ${child.nickname ? 'text-tzipur-brown' : 'text-tzipur-brown/50'}`}>
                        {child.nickname || t('profile.newChild', 'ילד חדש')}
                      </h3>
                      {!isExpanded && (
                        <p className="text-tzipur-brown/60 text-sm font-medium">
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
                      <div className="p-[clamp(1rem,3dvh,1.5rem)] pt-2 border-t border-tzipur-border/30 space-y-[clamp(1rem,3dvh,2rem)]">
                        {/* Nickname Input */}
                        <motion.div 
                          className="space-y-3"
                          animate={invalidFields?.id === child.id && invalidFields.fields.includes('nickname') ? { x: [-10, 10, -10, 10, 0] } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          <label className="flex items-center gap-2 text-base font-bold text-tzipur-sky">
                            <User size={18} strokeWidth={2.5} />
                            <span>{t('profile.nickname.label')}<span className="text-red-500 ms-1">*</span></span>
                          </label>
                          <input
                            type="text"
                            placeholder={t('profile.nickname.placeholder')}
                            value={child.nickname}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || /^[a-zA-Zא-ת\s]+$/.test(val)) {
                                updateChild(child.id, 'nickname', val);
                              }
                            }}
                            className={`w-full bg-tzipur-cream/50 border rounded-2xl px-5 py-[clamp(0.5rem,1.5dvh,1rem)] focus:outline-none focus:ring-2 transition text-tzipur-brown font-medium placeholder:text-tzipur-brown/50 placeholder:font-normal ${
                              isDuplicateName 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-tzipur-border focus:border-tzipur-sky focus:ring-tzipur-sky/20'
                            }`}
                          />
                          {isDuplicateName && (
                            <p className="text-red-500 text-sm font-medium mt-1">{t('profile.duplicateName', 'שם זה כבר קיים, נא לבחור שם אחר')}</p>
                          )}
                        </motion.div>

                        {/* Age Selector */}
                        <motion.div 
                          className="space-y-3"
                          animate={invalidFields?.id === child.id && invalidFields.fields.includes('age') ? { x: [-10, 10, -10, 10, 0] } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          <label className="flex items-center gap-2 text-base font-bold text-tzipur-sky">
                            <Calendar size={18} strokeWidth={2.5} />
                            <span>{t('profile.age.label')}<span className="text-red-500 ms-1">*</span></span>
                          </label>
                          <div className="grid grid-cols-5 gap-2.5" dir="ltr">
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
                        </motion.div>

                        {/* Animal Selector */}
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-base font-bold text-tzipur-sky">
                            <Smile size={18} strokeWidth={2.5} />
                            <span>{t('profile.animal.label')}</span>
                          </label>
                          <div className="grid grid-cols-5 gap-2.5" dir="ltr">
                            {animals.map((animal) => (
                              <button
                                key={animal.id}
                                onClick={() => updateChild(child.id, 'favoriteAnimal', animal.id)}
                                className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-all ${
                                  (child.favoriteAnimal === animal.id || child.favoriteAnimal === t(`animals.${animal.id}`))
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
                            <span>{t('profile.hobby.label')}</span>
                          </label>
                          <input
                            type="text"
                            placeholder={t('profile.hobby.placeholder')}
                            value={child.hobby}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || /^[a-zA-Zא-ת\s]+$/.test(val)) {
                                updateChild(child.id, 'hobby', val);
                              }
                            }}
                            className="w-full bg-tzipur-cream/50 border border-tzipur-border rounded-2xl px-5 py-[clamp(0.5rem,1.5dvh,1rem)] focus:outline-none focus:border-tzipur-sky focus:ring-2 focus:ring-tzipur-sky/20 transition text-tzipur-brown font-medium placeholder:text-tzipur-brown/50 placeholder:font-normal"
                          />
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-tzipur-border/30">
                          <ButtonGroup>
                            {savedChildIds.has(child.id) ? (
                              <Button variant="destructive" onClick={() => handleDeleteChild(child.id)}>
                                <Trash2 size={18} strokeWidth={2.5} />
                                {t('profile.delete')}
                              </Button>
                            ) : (
                              <Button variant="secondary" onClick={() => confirmDeleteChild(child.id)}>
                                {t('profile.cancel')}
                              </Button>
                            )}
                            <Button variant="primary" onClick={() => handleSaveChild(child, isDuplicateName)}>
                              {t('profile.save')}
                            </Button>
                          </ButtonGroup>
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
            className="w-full bg-transparent border-2 border-dashed border-tzipur-border hover:border-tzipur-sky/50 hover:bg-tzipur-sky/5 rounded-[32px] p-[clamp(1rem,3dvh,1.5rem)] flex flex-col items-center justify-center gap-[clamp(0.5rem,1.5dvh,0.75rem)] text-tzipur-brown/60 hover:text-tzipur-sky font-bold transition-all mt-[clamp(0.75rem,2dvh,1.5rem)]"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-tzipur-border/50">
              <Plus size={24} strokeWidth={3} />
            </div>
            {t('profile.addChild')}
          </button>
        </div>
      </main>

      <footer className="pt-[clamp(0.75rem,2dvh,1.5rem)] pb-2 mt-auto shrink-0 z-10 flex flex-col gap-[clamp(0.5rem,1.5dvh,0.75rem)]">
        <Button variant="primary" fullWidth onClick={() => handleSaveAllAndNavigate('/create')} disabled={!isAllValid || updateMutation.isPending}>
          {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t('profile.startCreating')}
        </Button>
        <Button variant="secondary" fullWidth onClick={() => handleSaveAllAndNavigate('/library')} disabled={updateMutation.isPending}>
          {t('profile.goToLibrary')}
        </Button>
      </footer>

      {/* Delete Profile Confirmation Modal */}
      <AnimatePresence>
        {showDeleteProfileModal && (
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
                <h3 className="font-bold text-xl text-tzipur-brown">{t('profile.deleteProfileConfirmTitle', 'מחיקת פרופיל')}</h3>
                <p className="text-tzipur-brown/70 leading-relaxed font-medium">
                  {t('profile.deleteProfileConfirm', 'האם אתה בטוח שברצונך למחוק את הפרופיל?')}
                </p>
              </div>
              <ButtonGroup>
                <Button variant="secondary" onClick={() => setShowDeleteProfileModal(false)}>
                  {t('profile.cancel')}
                </Button>
                <Button variant="destructive" onClick={() => {
                  localStorage.setItem('user_id', 'null');
                  window.dispatchEvent(new Event('auth_changed'));
                  navigate('/');
                }}>
                  {t('profile.confirmDelete')}
                </Button>
              </ButtonGroup>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <ButtonGroup>
                <Button variant="secondary" onClick={() => setChildToDelete(null)}>
                  {t('profile.cancel')}
                </Button>
                <Button variant="destructive" onClick={() => confirmDeleteChild(childToDelete)}>
                  {t('profile.confirmDelete')}
                </Button>
              </ButtonGroup>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
