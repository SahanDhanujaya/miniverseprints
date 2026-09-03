'use client';

import { motion } from 'framer-motion';
import {
  fadeUp,
  eyebrow as eyebrowVariant,
  cardReveal,
  staggerContainer,
  staggerItem,
  scaleIn,
  slideLeft,
  slideRight,
  VIEWPORT,
  EASE_OUT_EXPO,
} from './variants';
import type { ElementType, ReactNode } from 'react';
import {
  MessageCircle,
  Shield,
  Compass,
  Layers,
  Sparkles,
  Palette,
  Send,
  Video,
  Star,
  Zap,
  Package,
  Truck,
} from 'lucide-react';

const ICON_MAP: Record<string, ElementType> = {
  MessageCircle,
  Shield,
  Compass,
  Layers,
  Sparkles,
  Palette,
  Send,
  Video,
  Star,
  Zap,
  Package,
  Truck,
};

interface ProcessStep {
  iconName: string;
  title: string;
  desc: string;
}

interface CraftPoint {
  iconName: string;
  title: string;
  desc: string;
}

interface SectionContentProps {
  eyebrow?: string;
  heading?: string;
  subtext?: ReactNode;
  children?: ReactNode;
  // variant modes
  variant?: 'default' | 'cta';
  // Two-column craftsmanship layout
  twoCol?: boolean;
  leftContent?: ReactNode;
  craftPoints?: CraftPoint[];
  // Process grid
  processSteps?: ProcessStep[];
  // CTA
  ctaActions?: ReactNode;
}

const CARD_GLASS = 'rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-xl shadow-[0_4px_40px_rgba(0,0,0,0.5)]';

/**
 * SectionContent — handles ALL scroll-triggered animations for inner section elements.
 * Parent layout (section, max-w-*, padding) is NOT touched at all.
 * Only opacity, translateY, blur, scale are animated — 60 FPS guaranteed.
 */
export default function SectionContent({
  eyebrow,
  heading,
  subtext,
  children,
  variant = 'default',
  twoCol = false,
  leftContent,
  craftPoints,
  processSteps,
  ctaActions,
}: SectionContentProps) {

  // ── CTA variant ────────────────────────────────────────────────────────────
  if (variant === 'cta') {
    return (
      <motion.div
        className={`${CARD_GLASS} p-10 md:p-16 text-center relative overflow-hidden`}
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Decorative glow — pure CSS, not animated */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.04),transparent)] pointer-events-none" />

        <motion.div
          className="relative z-10 max-w-xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {eyebrow && (
            <motion.span
              variants={eyebrowVariant}
              className="inline-block text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.25em] mb-4"
            >
              {eyebrow}
            </motion.span>
          )}
          {heading && (
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
              {heading}
            </motion.h2>
          )}
          {subtext && (
            <motion.p variants={fadeUp} className="text-zinc-400 mb-10 leading-relaxed">
              {subtext}
            </motion.p>
          )}
          {ctaActions && (
            <motion.div variants={fadeUp}>
              {ctaActions}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  }

  // ── Process grid ───────────────────────────────────────────────────────────
  if (processSteps) {
    return (
      <motion.div
        className={`${CARD_GLASS} p-6 md:p-12`}
        variants={cardReveal}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        style={{ willChange: 'transform, opacity' }}
      >
        {(eyebrow || heading) && (
          <motion.div
            className="text-center mb-14"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {eyebrow && (
              <motion.span variants={eyebrowVariant} className="inline-block text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.25em] mb-3">
                {eyebrow}
              </motion.span>
            )}
            {heading && (
              <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-white">
                {heading}
              </motion.h2>
            )}
          </motion.div>
        )}

        {/* Staggered 4-step process grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {processSteps.map((step) => {
            const StepIcon = ICON_MAP[step.iconName];
            return (
              <motion.div
                key={step.title}
                variants={staggerItem}
                style={{ willChange: 'transform, opacity' }}
                className="group text-center p-6 rounded-2xl bg-white/[0.02] border border-white/6 hover:bg-white/[0.05] hover:border-white/12 transition-colors cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-white/[0.08] transition-colors">
                  {StepIcon && <StepIcon className="w-7 h-7 text-zinc-300" />}
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    );
  }

  // ── Two-column craftsmanship ───────────────────────────────────────────────
  if (twoCol) {
    return (
      <motion.div
        className={`${CARD_GLASS} p-6 md:p-10`}
        variants={cardReveal}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {eyebrow && (
            <motion.span variants={eyebrowVariant} className="inline-block text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.25em] mb-3">
              {eyebrow}
            </motion.span>
          )}
          {heading && (
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-3">
              {heading}
            </motion.h2>
          )}
          {subtext && (
            <motion.p variants={fadeUp} className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
              {subtext}
            </motion.p>
          )}
        </motion.div>

        {/* Two-column content — slide in from opposite sides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            style={{ willChange: 'transform, opacity, filter' }}
          >
            {leftContent}
          </motion.div>

          {/* Staggered craft points list */}
          <motion.div
            className="space-y-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {craftPoints?.map((point) => {
              const PointIcon = ICON_MAP[point.iconName];
              return (
                <motion.div
                  key={point.title}
                  variants={staggerItem}
                  style={{ willChange: 'transform, opacity' }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/6"
                >
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 mt-0.5 flex-shrink-0">
                    {PointIcon && <PointIcon className="w-5 h-5 text-zinc-300" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{point.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{point.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // ── Default: glass card with header + optional children ───────────────────
  return (
    <motion.div
      className={`${CARD_GLASS} p-6 md:p-10`}
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Animated text header group */}
      {(eyebrow || heading || subtext) && (
        <motion.div
          className="text-center mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {eyebrow && (
            <motion.span variants={eyebrowVariant} className="inline-block text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.25em] mb-3">
              {eyebrow}
            </motion.span>
          )}
          {heading && (
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-3">
              {heading}
            </motion.h2>
          )}
          {subtext && (
            <motion.p variants={fadeUp} className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
              {subtext}
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Grid / product list / reviews — passed as children, already self-animated */}
      {children}
    </motion.div>
  );
}
