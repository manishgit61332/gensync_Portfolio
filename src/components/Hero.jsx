import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSectionColor } from '../context/ScrollColorContext';
import logo from '../assets/logo-transparent.png';

// "Dopamine" Text Reveal Component
const CinematicReveal = ({ children, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(15px)', scale: 1.05, y: 10 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 }}
            transition={{
                duration: 1.2,
                delay: delay,
                ease: [0.16, 1, 0.3, 1] // "Apple" Ease
            }}
        >
            {children}
        </motion.div>
    );
};

const Hero = () => {
    const setGlobalTheme = useSectionColor();

    // Parallax logic
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    return (
        <motion.section
            onViewportEnter={() => setGlobalTheme('#050507', '#FFFFFF', 1.5)}
            viewport={{ margin: "-10% 0px -10% 0px" }} // Trigger slightly inwards
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '8rem 2rem 4rem 2rem',
                position: 'relative',
                zIndex: 1,
            }}>

            {/* Hero-specific Ambient Light (The "Nice Effect") */}
            <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'min(600px, 100vw)',
                    height: 'min(600px, 100vw)',
                    background: 'radial-gradient(circle, rgba(255, 119, 1, 0.05) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: -1
                }}
            />

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

                {/* 1. Eyebrow - Cinematic Reveal - QUALIFIER */}
                <CinematicReveal delay={0.2}>
                    <div style={{
                        marginBottom: '1.5rem',
                        fontSize: '0.8rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: 'var(--color-light-gray)',
                        opacity: 0.7,
                        fontWeight: 500,
                        fontFamily: 'var(--font-body)'
                    }}>
                        Not for brands chasing vanity metrics or trend-hopping.
                    </div>
                </CinematicReveal>

                {/* 2. Headline - Cinematic Reveal */}
                <CinematicReveal delay={0.4}>
                    <h1 style={{
                        marginBottom: '1.5rem',
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        lineHeight: 1.15,
                        color: '#fff',
                        maxWidth: '960px',
                        fontWeight: 400
                    }}>
                        We help founders turn complex ideas into <span style={{ color: 'var(--color-orange)', textShadow: '0 0 20px rgba(255, 119, 1, 0.3)' }}>clear, high-trust products and content.</span>
                    </h1>
                </CinematicReveal>

                {/* 3. Subheadline - Cinematic Reveal */}
                <CinematicReveal delay={0.6}>
                    <p style={{
                        marginBottom: '3.5rem',
                        fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                        lineHeight: 1.5,
                        color: '#e0e0e0',
                        maxWidth: '640px',
                        fontFamily: 'var(--font-body)'
                    }}>
                        Strategy, design, and AI-assisted execution for teams who care about <span className="highlight-orange" style={{ color: '#fff', fontWeight: 600 }}>quality, not noise.</span>
                    </p>
                </CinematicReveal>



                {/* 5. CTA - Cinematic Reveal - UPDATED */}
                <CinematicReveal delay={1.0}>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>

                        {/* PRIMARY CTA - Mailto */}
                        <a href="https://calendly.com/manish-gensync/30min" target="_blank" rel="noopener noreferrer" style={{
                            fontSize: '1rem',
                            color: '#000',
                            backgroundColor: '#fff',
                            padding: '1rem 2rem',
                            borderRadius: '50px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'none',
                            fontFamily: 'var(--font-body)',
                            transition: 'transform 0.2s ease',
                            border: '1px solid #fff'
                        }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Tell us what you're building
                        </a>

                        {/* SECONDARY CTA - Anchor */}
                        <a href="#work" onClick={(e) => { e.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }); }} style={{
                            fontSize: '1rem',
                            color: '#aaa',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            fontFamily: 'var(--font-body)',
                            borderBottom: '1px solid rgba(255,255,255,0.2)',
                            paddingBottom: '2px'
                        }}>
                            View Selected Work
                        </a>
                    </div>
                </CinematicReveal>

            </div>
        </motion.section>
    );
};

export default Hero;
