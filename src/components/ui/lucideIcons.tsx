"use client";
import React from 'react';
import { 
  Dna, 
  Waves,
  Sprout,
  Recycle,
  ArrowDown, 
  CloudRain, 
  Flower2, 
  Sparkles, 
  Droplets, 
  LucideProps, 
  Eye
} from 'lucide-react';

const icons = {
  dna: Dna,
  waves: Waves,
  sprout: Sprout,
  recycle: Recycle,
  eye: Eye,
  arrowDown: ArrowDown,
  cloudRain: CloudRain,
  flower2: Flower2,
  sparkles: Sparkles,
  droplets: Droplets,
} as const;

export type IconName = keyof typeof icons;

interface LucideIconCustomProps extends LucideProps {
  name: IconName;
}

const LucideIconCustom = ({ name, ...props }: LucideIconCustomProps) => {
  const IconComponent = icons[name];

  if (!IconComponent) return null;

  return <IconComponent {...props} />;
};

export default LucideIconCustom;