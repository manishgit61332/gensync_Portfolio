import React, { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll = ({ children }) => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential Ease-out (Natural)
            direction: 'vertical',
            gestureDirection: 'vertical',
            autoRaf: false,
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 2,
        });

        window.lenis = lenis;
        let rafId;

        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            lenis.destroy();
            if (window.lenis === lenis) {
                window.lenis = null;
            }
        };
    }, []);

    return (
        <div className="smooth-scroll-wrapper">
            {children}
        </div>
    );
};

export default SmoothScroll;
