// Generated visual assets for Event Pulse categories
import technicalImg from './images/event_category_technical_1790497811978.jpg';
import culturalImg from './images/event_category_cultural_1790497825588.jpg';
import workshopImg from './images/event_category_workshop_1790497837539.jpg';
import sportsImg from './images/event_category_sports_1790497850084.jpg';

export const CATEGORY_IMAGES: Record<string, string> = {
  Technical: technicalImg,
  Cultural: culturalImg,
  Workshop: workshopImg,
  Sports: sportsImg,
};

export const CATEGORY_ACCENTS: Record<string, { badge: string; border: string; glow: string; text: string }> = {
  Technical: {
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    border: 'hover:border-cyan-500/40',
    glow: 'rgba(6, 182, 212, 0.15)',
    text: 'text-cyan-400',
  },
  Cultural: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    border: 'hover:border-amber-500/40',
    glow: 'rgba(245, 158, 11, 0.15)',
    text: 'text-amber-400',
  },
  Workshop: {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    border: 'hover:border-emerald-500/40',
    glow: 'rgba(16, 185, 129, 0.15)',
    text: 'text-emerald-400',
  },
  Sports: {
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    border: 'hover:border-rose-500/40',
    glow: 'rgba(244, 63, 94, 0.15)',
    text: 'text-rose-400',
  },
};

export function getCategoryImage(categoryName?: string): string {
  if (!categoryName) return technicalImg;
  return CATEGORY_IMAGES[categoryName] || technicalImg;
}
