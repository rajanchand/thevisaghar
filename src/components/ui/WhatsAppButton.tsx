"use client";

import React from "react";
import { motion } from "framer-motion";
import { WhatsApp } from "./BrandIcons";

export function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/9779851338645"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 left-6 z-[300] w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center group"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsApp size={28} className="text-white flex-shrink-0" />
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/20 animate-ping group-hover:animate-none pointer-events-none" />
    </motion.a>
  );
}
