import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * 3D Floating Assets with Mouse-Parallax tilt effects.
 * Renders hyper-realistic, minimalist SVG representations of kitchen elements
 * that shift and rotate in response to cursor position.
 */
export function FloatingAsset3D({ type, delay = 0, speed = 6 }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate coordinates relative to screen center (-1 to 1)
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Soft floating bounce animation
  const bounceY = {
    animate: {
      y: [0, -12, 0],
      rotate: [0, 1.5, -1.5, 0],
      transition: {
        duration: speed,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }
    }
  };

  const getAssetSVG = () => {
    switch (type) {
      case 'whisk':
        return (
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className="drop-shadow-lg">
            <defs>
              <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="50%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="handleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            {/* Whisk wires loops */}
            <path d="M 50 15 C 32 15, 30 55, 50 65" stroke="url(#metalGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 50 15 C 68 15, 70 55, 50 65" stroke="url(#metalGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 50 15 C 40 15, 38 55, 50 65" stroke="url(#metalGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 50 15 C 60 15, 62 55, 50 65" stroke="url(#metalGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 50 15 C 50 15, 50 55, 50 65" stroke="url(#metalGrad)" strokeWidth="2.0" fill="none" strokeLinecap="round" />
            {/* Metallic neck band */}
            <rect x="46" y="65" width="8" height="3" rx="1" fill="#475569" />
            {/* Whisk handle */}
            <path d="M 47 68 L 53 68 L 51 92 L 49 92 Z" fill="url(#handleGrad)" />
            <circle cx="50" cy="93" r="2.5" fill="#475569" />
          </svg>
        );
      case 'oil':
        return (
          <svg width="110" height="150" viewBox="0 0 100 140" fill="none" className="drop-shadow-xl">
            <defs>
              <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#A3E635" stopOpacity="0.75" />
                <stop offset="40%" stopColor="#D9F99D" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#4D7C0F" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="oilLevelGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            {/* Spout */}
            <path d="M 48 10 L 52 10 L 50 0 Z" fill="#94A3B8" />
            {/* Neck */}
            <rect x="45" y="10" width="10" height="20" rx="1" fill="url(#glassGrad)" />
            <rect x="44" y="24" width="12" height="4" fill="#D97706" />
            {/* Geometric Faceted Body */}
            <path d="M 45 30 L 55 30 L 75 55 L 75 125 L 68 135 L 32 135 L 25 125 L 25 55 Z" fill="url(#glassGrad)" stroke="#4D7C0F" strokeWidth="1" />
            {/* Olive oil inside */}
            <path d="M 28 65 L 72 65 L 72 123 L 66 132 L 34 132 L 28 123 Z" fill="url(#oilLevelGrad)" opacity="0.8" />
            {/* Light reflection highlights */}
            <path d="M 32 58 L 48 35 L 50 35 L 35 58 Z" fill="#FFFFFF" opacity="0.25" />
          </svg>
        );
      case 'scoop':
        return (
          <svg width="130" height="100" viewBox="0 0 130 100" fill="none" className="drop-shadow-lg">
            <defs>
              <linearGradient id="copperGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDBA74" />
                <stop offset="60%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#9A3412" />
              </linearGradient>
              <linearGradient id="flourGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FAFAFA" />
                <stop offset="100%" stopColor="#E2E8F0" />
              </linearGradient>
            </defs>
            {/* Handle */}
            <path d="M 68 50 L 125 46 C 128 46, 128 54, 125 54 L 68 50 Z" fill="url(#copperGrad)" stroke="#9A3412" strokeWidth="1" />
            <circle cx="120" cy="50" r="2.5" fill="#F8FAFC" />
            {/* Cup Outer Bowl */}
            <circle cx="45" cy="50" r="32" fill="url(#copperGrad)" stroke="#9A3412" strokeWidth="1.5" />
            {/* Scoop Inner Content (Flour) */}
            <ellipse cx="43" cy="48" rx="27" ry="24" fill="url(#flourGrad)" />
            {/* Rim Highlight */}
            <ellipse cx="45" cy="50" rx="30" ry="26" stroke="#FDBA74" strokeWidth="1.5" fill="none" opacity="0.7" />
          </svg>
        );
      case 'grain':
        return (
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className="drop-shadow-xl">
            <defs>
              <linearGradient id="topFace" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="100%" stopColor="#FDE68A" />
              </linearGradient>
              <linearGradient id="leftFace" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="rightFace" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            {/* Isometric 3D Cube representing grain */}
            <polygon points="50,18 82,34 50,50 18,34" fill="url(#topFace)" />
            <polygon points="18,34 50,50 50,82 18,66" fill="url(#leftFace)" />
            <polygon points="50,50 82,34 82,66 50,82" fill="url(#rightFace)" />
            {/* Grain symbols */}
            <path d="M 32,50 Q 38,55 35,62" stroke="#FEF3C7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <path d="M 68,50 Q 62,55 65,62" stroke="#FEF3C7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={bounceY}
      animate="animate"
      style={{
        x: mouseOffset.x * 24,
        y: mouseOffset.y * 24,
        rotateX: -mouseOffset.y * 18,
        rotateY: mouseOffset.x * 18,
        transformStyle: 'preserve-3d',
      }}
      className="preserve-3d transition-transform duration-300 ease-out select-none"
    >
      {getAssetSVG()}
    </motion.div>
  );
}
