import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Calendar, Smile, Star, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '../../../components/Button';
import { ButtonGroup } from '../../../components/ButtonGroup';

// Hardcoded for now, could also come from mockData or constants
const ages = [4, 5, 6, 7, 8];
const animals = [
  { id: 'dog', emoji: '🐶' },
  { id: 'cat', emoji: '🐱' },
  { id: 'bird', emoji: '🐦' },
  { id: 'lion', emoji: '🦁' },
  { id: 'elephant', emoji: '🐘' },
  { id: 'monkey', emoji: '🐵' },
  { id: 'dolphin', emoji: '🐬' },
  { id: 'bear', emoji: '🐻' },
  { id: 'dinosaur', emoji: '🦖' },
  { id: 'unicorn', emoji: '🦄' },
];

interface ChildFormAccordionProps {
  index: number;
  childId: string;
  isExpanded: boolean;
  isSaved: boolean;
  form: UseFormReturn<any>;
  onToggleExpand: () => void;
  onSave: () => void;
  onDeleteRequest: () => void;
  onCancelDelete: () => void;
}

export function ChildFormAccordion({
  index,
  isExpanded,
  isSaved,
  form,
  onToggleExpand,
  onSave,
  onDeleteRequest,
  onCancelDelete,
}: ChildFormAccordionProps) {
  const { t } = useTranslation();
  
  const { register, watch, setValue, formState: { errors } } = form;
  
  // Watch values for immediate UI updates (emoji, title, etc)
  const currentNickname = watch(`children.${index}.nickname`);
  const currentAge = watch(`children.${index}.age`);
  const currentHobby = watch(`children.${index}.hobby`);
  const currentAnimalId = watch(`children.${index}.favoriteAnimal`);

  const childAnimal = animals.find(a => a.id === currentAnimalId || t(`animals.${a.id}`) === currentAnimalId) || animals[0];
  
  const childrenErrors = errors.children as any;
  const nicknameError = childrenErrors?.[index]?.nickname;
  const ageError = childrenErrors?.[index]?.age;

  return (
    <div className={`bg-tzipur-surface rounded-[32px] shadow-sm border ${isExpanded ? 'border-tzipur-sky/40' : 'border-tzipur-border/60'} overflow-hidden transition-colors`}>
      {/* Accordion Header */}
      <button 
        type="button"
        onClick={onToggleExpand}
        className="w-full p-[clamp(0.75rem,2dvh,1.25rem)] flex items-center justify-between text-start"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-tzipur-sky/5 rounded-2xl flex items-center justify-center shrink-0 border border-tzipur-sky/10">
            <span className="text-3xl leading-none select-none">{childAnimal.emoji}</span>
          </div>
          <div>
            <h3 className={`font-bold text-lg mb-0.5 ${currentNickname ? 'text-tzipur-brown' : 'text-tzipur-brown/50'}`}>
              {currentNickname || t('profile.newChild', 'ילד חדש')}
            </h3>
            {!isExpanded && (
              <p className="text-tzipur-brown/60 text-sm font-medium">
                {t('profile.age.shortLabel', 'גיל')}: {currentAge}{currentHobby ? ` ${t('profile.hobby.shortLabel', 'תחביב')}: ${currentHobby}` : ''}
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
                animate={nicknameError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <label className="flex items-center gap-2 text-base font-bold text-tzipur-sky">
                  <User size={18} strokeWidth={2.5} />
                  <span>{t('profile.nickname.label')}<span className="text-red-500 ms-1">*</span></span>
                </label>
                <input
                  type="text"
                  placeholder={t('profile.nickname.placeholder')}
                  {...register(`children.${index}.nickname`)}
                  className={`w-full bg-tzipur-cream/50 border rounded-2xl px-5 py-[clamp(0.5rem,1.5dvh,1rem)] focus:outline-none focus:ring-2 transition text-tzipur-brown font-medium placeholder:text-tzipur-brown/50 placeholder:font-normal ${
                    nicknameError 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-tzipur-border focus:border-tzipur-sky focus:ring-tzipur-sky/20'
                  }`}
                />
                {nicknameError && (
                  <p className="text-red-500 text-sm font-medium mt-1">
                    {nicknameError.message === 'profile.duplicateName' 
                      ? t('profile.duplicateName', 'שם זה כבר קיים, נא לבחור שם אחר') 
                      : t(nicknameError.message as string)}
                  </p>
                )}
              </motion.div>

              {/* Age Selector */}
              <motion.div 
                className="space-y-3"
                animate={ageError ? { x: [-10, 10, -10, 10, 0] } : {}}
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
                      type="button"
                      onClick={() => setValue(`children.${index}.age`, age, { shouldValidate: true, shouldDirty: true })}
                      className={`aspect-square rounded-2xl border-2 font-bold text-lg flex items-center justify-center transition-all ${
                        currentAge === age
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
                      type="button"
                      onClick={() => setValue(`children.${index}.favoriteAnimal`, animal.id, { shouldValidate: true, shouldDirty: true })}
                      className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-all ${
                        (currentAnimalId === animal.id || currentAnimalId === t(`animals.${animal.id}`))
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
                  {...register(`children.${index}.hobby`)}
                  className="w-full bg-tzipur-cream/50 border border-tzipur-border rounded-2xl px-5 py-[clamp(0.5rem,1.5dvh,1rem)] focus:outline-none focus:border-tzipur-sky focus:ring-2 focus:ring-tzipur-sky/20 transition text-tzipur-brown font-medium placeholder:text-tzipur-brown/50 placeholder:font-normal"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-tzipur-border/30">
                <ButtonGroup>
                  {isSaved ? (
                    <Button variant="destructive" type="button" onClick={onDeleteRequest}>
                      <Trash2 size={18} strokeWidth={2.5} />
                      {t('profile.delete')}
                    </Button>
                  ) : (
                    <Button variant="secondary" type="button" onClick={onCancelDelete}>
                      {t('profile.cancel')}
                    </Button>
                  )}
                  <Button variant="primary" type="button" onClick={onSave}>
                    {t('profile.save')}
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
