import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/Button';
import { Phone, Clock, AlertTriangle } from 'lucide-react';

export interface CrisisReferral {
  name: string;
  phone: string;
  hours: string;
}

export interface ValidationAlert {
  is_safe: boolean;
  reason: string;
  message: string;
  crisis_referrals?: Record<string, CrisisReferral>;
}

interface SafetyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  validationData: ValidationAlert | null;
}

export function SafetyAlertModal({ isOpen, onClose, validationData }: SafetyAlertModalProps) {
  if (!validationData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-tzipur-surface rounded-[32px] overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 shrink-0 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              <h3 className="text-[18px] font-bold text-tzipur-brown mb-4 leading-snug">
                {validationData.message}
              </h3>
              
              {validationData.crisis_referrals && Object.keys(validationData.crisis_referrals).length > 0 && (
                <div className="w-full mt-4 space-y-4 mb-4 text-right">
                  {Object.entries(validationData.crisis_referrals).map(([key, referral]) => (
                    <div key={key} className="bg-tzipur-cream rounded-2xl p-4 flex flex-col gap-3">
                      <h3 className="font-bold text-tzipur-brown">{referral.name}</h3>
                      
                      <div className="flex items-center gap-2.5 text-tzipur-brown/80">
                        <Phone className="w-[18px] h-[18px] shrink-0" />
                        <a href={`tel:${referral.phone}`} className="text-tzipur-sky font-bold hover:underline leading-none flex items-center pt-1" dir="ltr">
                          {referral.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2.5 text-tzipur-brown/80">
                        <Clock className="w-[18px] h-[18px] shrink-0" />
                        <span className="leading-none pt-0.5">{referral.hours}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="w-full">
                <Button variant="primary" fullWidth onClick={onClose}>
                  הבנתי, תודה
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
