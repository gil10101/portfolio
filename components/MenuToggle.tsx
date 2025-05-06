"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface MenuToggleProps {
  isOpen: boolean
  toggle: () => void
}

export default function MenuToggle({ isOpen, toggle }: MenuToggleProps) {
  return (
    <motion.div
      className={`menu-toggle ${isOpen ? 'open' : ''}`}
      onClick={toggle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span></span>
    </motion.div>
  )
} 