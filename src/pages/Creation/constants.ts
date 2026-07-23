import { Zap, Flame, ShieldOff, CloudLightning, Hand, Eye, Waves, Cloud, type LucideIcon } from 'lucide-react';

export interface FastTrack {
  id: string;
  icon: LucideIcon;
  labelKey: string;
}

export const fastTracks: FastTrack[] = [
  { id: 'startle', icon: Zap, labelKey: 'creation.tracks.startle' },
  { id: 'anger', icon: Flame, labelKey: 'creation.tracks.anger' },
  { id: 'withdrawal', icon: ShieldOff, labelKey: 'creation.tracks.withdrawal' },
  { id: 'anxiety', icon: CloudLightning, labelKey: 'creation.tracks.anxiety' },
  { id: 'touch_aversion', icon: Hand, labelKey: 'creation.tracks.touch_aversion' },
  { id: 'hypervigilance', icon: Eye, labelKey: 'creation.tracks.hypervigilance' },
  { id: 'emotional_overflow', icon: Waves, labelKey: 'creation.tracks.emotional_overflow' },
  { id: 'dissociation', icon: Cloud, labelKey: 'creation.tracks.dissociation' },
];
