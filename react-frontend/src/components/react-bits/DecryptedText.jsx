import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import './DecryptedText.css';

/**
 * React Bits - DecryptedText
 * Cybernetic cryptographic text scramble/decryption reveal effect.
 * Perfect for Link-Guard's autonomous defense intelligence & military ledger look.
 */
export default function DecryptedText({
  text = '',
  speed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = '0123456789ABCDEF!@#$%^&*()_+-=<>[]{}',
  className = '',
  parentClassName = '',
  encryptedClassName = 'encrypted-char',
  animateOn = 'mount', // 'mount' | 'hover' | 'view'
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');
  }, [useOriginalCharsOnly, text, characters]);

  const computeOrder = useCallback((len) => {
    const order = [];
    if (len <= 0) return order;
    if (revealDirection === 'start') {
      for (let i = 0; i < len; i++) order.push(i);
      return order;
    }
    if (revealDirection === 'end') {
      for (let i = len - 1; i >= 0; i--) order.push(i);
      return order;
    }
    // center outward
    const middle = Math.floor(len / 2);
    let offset = 0;
    while (order.length < len) {
      if (offset % 2 === 0) {
        const idx = middle + offset / 2;
        if (idx >= 0 && idx < len) order.push(idx);
      } else {
        const idx = middle - Math.ceil(offset / 2);
        if (idx >= 0 && idx < len) order.push(idx);
      }
      offset++;
    }
    return order;
  }, [revealDirection]);

  const startAnimation = useCallback(() => {
    if (!text) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsAnimating(true);
    const order = computeOrder(text.length);
    let pointer = 0;
    let iteration = 0;
    const currentRevealed = new Set();
    setRevealedIndices(new Set(currentRevealed));

    intervalRef.current = setInterval(() => {
      iteration++;

      if (sequential) {
        if (pointer < order.length) {
          const charToReveal = order[pointer];
          currentRevealed.add(charToReveal);
          setRevealedIndices(new Set(currentRevealed));
          pointer++;
        }
      } else {
        // Random reveal
        const unrevealed = order.filter(idx => !currentRevealed.has(idx));
        if (unrevealed.length > 0 && iteration % 2 === 0) {
          const randomIndex = unrevealed[Math.floor(Math.random() * unrevealed.length)];
          currentRevealed.add(randomIndex);
          setRevealedIndices(new Set(currentRevealed));
        }
      }

      // Generate scrambled frame
      const frame = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return text[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');

      setDisplayText(frame);

      // Finished check
      if (currentRevealed.size >= text.length || iteration > text.length * 3 + maxIterations) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDisplayText(text);
        setRevealedIndices(new Set(Array.from({ length: text.length }, (_, i) => i)));
        setIsAnimating(false);
      }
    }, speed);
  }, [text, computeOrder, sequential, maxIterations, speed, availableChars]);

  useEffect(() => {
    if (animateOn === 'mount') {
      startAnimation();
    } else if (animateOn === 'view' && containerRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      }, { threshold: 0.2 });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animateOn, startAnimation]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover' && !isAnimating) {
      startAnimation();
    }
  };

  return (
    <span
      ref={containerRef}
      className={`decrypted-text-wrap ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={className}>
        {displayText.split('').map((char, index) => {
          const isRevealed = revealedIndices.has(index);
          return (
            <span
              key={index}
              className={isRevealed ? 'decrypted-char' : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
