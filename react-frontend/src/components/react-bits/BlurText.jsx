import React, { useEffect, useRef, useState } from 'react';
import './BlurText.css';

/**
 * React Bits - BlurText
 * Words or characters smoothly emerge from a cinematic blur to sharp clarity.
 */
export default function BlurText({
  text = '',
  delay = 50,
  className = '',
  animateBy = 'words', // 'words' | 'letters'
  direction = 'top', // 'top' | 'bottom'
  threshold = 0.1,
  color = 'inherit',
  onAnimationComplete
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
          if (onAnimationComplete) {
            setTimeout(onAnimationComplete, elements.length * delay + 500);
          }
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, elements.length, delay, onAnimationComplete]);

  return (
    <span ref={ref} className={`blur-text-container ${className}`} style={{ color }}>
      {elements.map((segment, index) => (
        <span
          key={index}
          className={`blur-text-unit ${inView ? 'in-view' : ''} direction-${direction}`}
          style={{
            animationDelay: `${index * delay}ms`,
            marginRight: animateBy === 'words' ? '0.28em' : '0'
          }}
        >
          {segment}
        </span>
      ))}
    </span>
  );
}
