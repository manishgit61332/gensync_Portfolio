import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CursorTrail = () => {
    const cursorRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    // Mouse position state
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth spring animation
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            mouseX.set(e.clientX - 16); // Center the 32px cursor
            mouseY.set(e.clientY - 16);
        };

        const handleMouseDown = () => setIsHovering(true);
        const handleMouseUp = () => setIsHovering(false);

        // Check for hoverable elements
        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        // window.addEventListener('mouseover', handleMouseOver); // Optional: disable specific hover scale if distracting

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            // window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            {/* SVG Filter for Texture/Noise */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="cursor-noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.4" /> {/* Adjust opacity of noise */}
                    </feComponentTransfer>
                    <feComposite operator="in" in2="SourceGraphic" result="monoNoise" />
                    <feBlend in="SourceGraphic" in2="monoNoise" mode="multiply" />
                </filter>
            </svg>

            <motion.div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    x,
                    y,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    // Gradient Sphere Styling
                    background: 'radial-gradient(circle at 30% 30%, var(--color-orange), var(--color-maroon))',
                    boxShadow: '0 0 15px rgba(255, 119, 1, 0.4), inset 2px 2px 5px rgba(255,255,255,0.3)',
                    // Apply Noise Filter
                    filter: 'url(#cursor-noise)',
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                }}
            />
        </>
    );
};

export default CursorTrail;
