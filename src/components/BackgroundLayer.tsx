import React from 'react';

export type BackgroundLightMode = 'bright' | 'radiant' | 'frosted' | 'soft_twilight';

interface BackgroundLayerProps {
  mode: BackgroundLightMode;
  onToggleMode: (mode: BackgroundLightMode) => void;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({ mode }) => {
  // Completely cleared of any blue/sky tint: pure, warm, sunlit, crystal-clear overlays
  const overlayConfig = {
    // Default mode: Bright, sunlit, warm cream and peach tones - ZERO blue tint
    bright: {
      imageFilters: 'brightness-[1.14] contrast-[1.04] saturate-[1.06]',
      overlayClass: 'bg-white/10 backdrop-blur-[0px]',
      gradientTint: 'bg-gradient-to-b from-amber-50/10 via-transparent to-pink-50/10',
    },
    // Ultra radiant: Pure, unhindered photograph of the baby
    radiant: {
      imageFilters: 'brightness-[1.20] contrast-[1.05] saturate-[1.10]',
      overlayClass: 'bg-transparent backdrop-blur-none',
      gradientTint: 'bg-transparent',
    },
    // Soft frosted: Gentle, warm ivory daylight without blue
    frosted: {
      imageFilters: 'brightness-[1.10] contrast-[1.02] saturate-[1.02]',
      overlayClass: 'bg-amber-50/25 backdrop-blur-[2.5px]',
      gradientTint: 'bg-gradient-to-b from-white/20 via-transparent to-amber-50/15',
    },
    // Soft twilight: Warm, dim amber/pink evening
    soft_twilight: {
      imageFilters: 'brightness-[0.96] contrast-[1.02]',
      overlayClass: 'bg-neutral-950/35 backdrop-blur-[1px]',
      gradientTint: 'bg-gradient-to-t from-neutral-950/50 via-transparent to-pink-950/15',
    },
  }[mode] || {
    imageFilters: 'brightness-[1.14] contrast-[1.04] saturate-[1.06]',
    overlayClass: 'bg-white/10 backdrop-blur-[0px]',
    gradientTint: 'bg-gradient-to-b from-amber-50/10 via-transparent to-pink-50/10',
  };

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none transition-all duration-700">
      {/* Background Image of the cute baby - perfectly bright, warm, pure colors */}
      <img
        src="/assets/aistudio/images_b21a436d.jpg"
        alt="Cherished Newborn Baby"
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover object-center scale-100 transition-all duration-700 ${overlayConfig.imageFilters}`}
      />

      {/* Crystal Clear Daylight Scrim (No Blue Tint) */}
      <div className={`absolute inset-0 ${overlayConfig.overlayClass} transition-colors duration-500`} />

      {/* Warm Golden / Peach Sunbeam Ambient (Zero Blue) */}
      <div className={`absolute inset-0 ${overlayConfig.gradientTint} transition-opacity duration-500`} />
    </div>
  );
};
