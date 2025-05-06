"use client"

import React from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  type?: 'heading1' | 'heading2' | 'paragraph';
  className?: string;
  splitType?: 'letters' | 'words' | 'none';
  animationType?: 'fade' | 'slide' | 'elastic' | 'wave';
  overflow?: boolean;
}

const AnimatedText = ({
  text,
  type = 'heading2',
  className = '',
  splitType = 'letters',
  animationType = 'fade',
  overflow = false,
}: AnimatedTextProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Different transforms based on scroll position
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [20, 0, 0, -20]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.9, 1, 1, 0.95]);
  
  // Animation variants for different animation types
  const getAnimationVariants = () => {
    switch (animationType) {
      case 'fade':
        return {
          hidden: { opacity: 0, y: 10 },
          visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
              delay: i * 0.05,
              duration: 0.5,
              ease: [0.2, 0.65, 0.3, 0.9],
            },
          }),
        } as Variants;
      case 'slide':
        return {
          hidden: { opacity: 0, y: 20, x: -10 },
          visible: (i: number) => ({
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
              delay: i * 0.03,
              duration: 0.6,
              ease: [0.2, 0.65, 0.3, 0.9],
            },
          }),
        } as Variants;
      case 'elastic':
        return {
          hidden: { opacity: 0, scale: 0.5 },
          visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            transition: {
              delay: i * 0.04,
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              damping: 10,
            },
          }),
        } as Variants;
      case 'wave':
        return {
          hidden: { y: 0 },
          visible: (i: number) => ({
            y: [0, -12, 0],
            transition: {
              delay: i * 0.05,
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              repeatDelay: 4,
            },
          }),
        } as Variants;
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        } as Variants;
    }
  };

  // Determine the HTML tag based on type
  const renderTag = () => {
    switch (type) {
      case 'heading1':
        return 'h1';
      case 'heading2':
        return 'h2';
      case 'paragraph':
        return 'p';
      default:
        return 'div';
    }
  };

  // Split text based on splitType
  const renderContent = () => {
    const Tag = renderTag();
    const variants = getAnimationVariants();
    
    if (splitType === 'none') {
      return (
        <motion.div
          ref={ref}
          className={`animated-text-container ${overflow ? '' : 'overflow-hidden'}`}
          style={{ opacity, y, scale }}
        >
          <Tag className={className}>
            <motion.span
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {text}
            </motion.span>
          </Tag>
        </motion.div>
      );
    }
    
    // Split by words
    if (splitType === 'words') {
      const words = text.split(' ');
      
      return (
        <motion.div
          ref={ref}
          className={`animated-text-container ${overflow ? '' : 'overflow-hidden'}`}
          style={{ opacity, y, scale }}
        >
          <Tag className={className}>
            {words.map((word, index) => (
              <span className="inline-block" key={index}>
                <motion.span
                  className="inline-block"
                  variants={variants}
                  initial="hidden"
                  whileInView="visible"
                  custom={index}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {word}
                </motion.span>
                {index !== words.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </Tag>
        </motion.div>
      );
    }
    
    // Split by letters
    const letters = text.split('');
    
    return (
      <motion.div
        ref={ref}
        className={`animated-text-container ${overflow ? '' : 'overflow-hidden'}`}
        style={{ opacity, y, scale }}
      >
        <Tag className={className}>
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block"
              variants={variants}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true, amount: 0.2 }}
              style={{ display: 'inline-block', whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </Tag>
      </motion.div>
    );
  };

  return renderContent();
};

export default AnimatedText; 