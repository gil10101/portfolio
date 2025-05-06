"use client"

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface KineticTextProps {
  children: ReactNode;
  type?: 'heading' | 'paragraph';
  delay?: number;
  duration?: number;
  className?: string;
  textStyle?: 'wave' | 'stagger' | 'reveal' | 'float';
}

export default function KineticTypography({
  children,
  type = 'paragraph',
  delay = 0,
  duration = 0.5,
  className = '',
  textStyle = 'stagger',
}: KineticTextProps) {
  // Convert children to string if it's a simple text
  const childrenArray = React.Children.toArray(children);
  const isSimpleText = childrenArray.length === 1 && typeof childrenArray[0] === 'string';
  const text = isSimpleText ? String(children) : '';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      },
    },
  };

  const waveVariants = {
    hidden: { y: 0 },
    visible: {
      y: 0,
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      },
    },
  };

  const floatVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut",
      },
    },
  };

  const revealVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        delay,
      },
    },
  };

  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const waveCharVariants = {
    hidden: { y: 0 },
    visible: (i: number) => ({
      y: [0, -10, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse" as const,
        delay: 0.03 * i,
      },
    }),
  };

  // Don't break up into letters if using float or reveal animations
  if (textStyle === 'float' || textStyle === 'reveal' || !isSimpleText) {
    return (
      <motion.div
        className={className}
        variants={textStyle === 'float' ? floatVariants : revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {children}
      </motion.div>
    );
  }

  // Wave and stagger effects work on character level
  return (
    <motion.div
      className={className}
      variants={textStyle === 'wave' ? waveVariants : containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={`${index}-${char}`}
          variants={textStyle === 'wave' ? waveCharVariants : charVariants}
          custom={index}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
} 