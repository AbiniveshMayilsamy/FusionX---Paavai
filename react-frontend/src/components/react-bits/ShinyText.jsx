import React from 'react';
import './ShinyText.css';

/**
 * React Bits - ShinyText
 * Metallic / glowing sweep animation across text.
 * Tailored for Link-Guard's Champagne Gold and Cyber Muted palettes.
 */
export default function ShinyText({
  text,
  children,
  disabled = false,
  speed = 3,
  className = '',
  color = 'var(--primary-gold, #d9ba84)',
  shineColor = '#ffffff',
  style = {}
}) {
  const content = text !== undefined ? text : children;

  return (
    <span
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{
        '--shine-speed': `${speed}s`,
        '--shine-base': color,
        '--shine-glow': shineColor,
        ...style
      }}
    >
      {content}
    </span>
  );
}
