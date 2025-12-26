import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import logo from '../assets/logo-transparent.png';
import Particles from './Particles';

const GlitchWord = () => {
    const [text, setText] = React.useState("Cults");
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        let interval;
        if (isHovered) {
            interval = setInterval(() => {
                // Toggle between Cults and the Edgy Variant
                setText(prev => prev === "Cults" ? "Cu*ts" : "Cults");
            }, 500); // 0.5s interval as requested
        } else {
            setText("Cults");
        }
        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <span
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                cursor: 'pointer',
                position: 'relative',
                display: 'inline-block',
                // Min-width prevents layout shift (approximated for "Cults")
                minWidth: '5ch',
                color: isHovered ? 'var(--color-orange)' : '#fff', // Orange highlight on hover
                transition: 'color 0.2s',
            }}
        >
            {text}.
        </span>
    );
};

const LiquidChar = ({ char, config }) => {
    const defaultConfig = { y: -15, scaleY: 1.4, scaleX: 0.8, color: 'var(--color-orange)' };
    const styles = config || defaultConfig;

    return (
        <motion.span
            style={{ display: 'inline-block', position: 'relative' }}
            whileHover={{
                ...styles,
                transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
            {char === " " ? "\u00A0" : char}
        </motion.span>
    );
};

const LiquidText = ({ text, config }) => {
    // Split by words to allow browser line-wrapping between words
    const words = text.split(" ");
    return (
        <span style={{ display: 'inline' }}>
            {words.map((word, wIndex) => (
                <React.Fragment key={wIndex}>
                    <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                        {word.split('').map((char, cIndex) => (
                            <LiquidChar key={cIndex} char={char} config={config} />
                        ))}
                    </span>
                    {/* Add space between words */}
                    {wIndex < words.length - 1 && " "}
                </React.Fragment>
            ))}
        </span>
    );
};



const Hero = () => {
    // Custom Cursor Logic
    // Initialize at center to match Preloader (approx) if window exists
    const initialX = typeof window !== 'undefined' ? window.innerWidth / 2 : -100;
    const initialY = typeof window !== 'undefined' ? window.innerHeight / 2 : -100;
    const cursorX = useMotionValue(initialX);
    const cursorY = useMotionValue(initialY);
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);
    const [isHoveringHero, setIsHoveringHero] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    return (
        <section
            className="hero-section"
            onMouseEnter={() => setIsHoveringHero(true)}
            onMouseLeave={() => setIsHoveringHero(false)}
            style={{
                minHeight: '100svh', // improved mobile height
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-black)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'none', // Hide default cursor
                paddingTop: '80px', // Navbar clearance
            }}
        >
            {/* Custom Logo Cursor */}
            <motion.img
                src={logo}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: '64px',
                    height: '64px',
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    pointerEvents: 'none',
                    zIndex: 9999,
                    marginLeft: -32,
                    marginTop: -32,
                    opacity: isHoveringHero ? 1 : 0
                }}
            />

            {/* AMBIENT VISUALS: Particles */}
            {/* AMBIENT VISUALS: Particles removed (Global now) */}

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="container text-center"
                style={{ position: 'relative', zIndex: 1 }}
            >
                {/* METRIC SAFETY: Moved to Top (Eyebrow) to declutter flow */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ marginBottom: '1rem', display: 'inline-block', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.7, color: 'var(--color-mint)' }}
                >
                    <LiquidText text="Trusted by 15+ Visionaries & Founders" config={{ y: -5, scaleY: 1.2, scaleX: 0.9, color: 'var(--color-mint)' }} />
                </motion.div>

                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', marginBottom: '2rem', lineHeight: 1.1 }}>
                    <span style={{ color: '#fff' }}>
                        <LiquidText text="We Engineer" /> <GlitchWord />
                    </span>
                </h1>

                <div style={{ marginTop: '2rem', fontFamily: 'var(--font-body)', opacity: 0.9, maxWidth: '650px', marginInline: 'auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
                    <p style={{ marginBottom: '1.5rem', opacity: 0.7 }}>
                        <LiquidText text="Back then, building something decent was enough." config={{ y: -15, scaleY: 1.3, scaleX: 0.85, color: '#fff' }} /><br />
                        <LiquidText text="In 2019, your product just had to work. Fewer competitors. Slower cycles." config={{ y: -15, scaleY: 1.3, scaleX: 0.85, color: '#fff' }} />
                    </p>
                    <p style={{ marginBottom: '1.5rem', opacity: 0.7 }}>
                        <LiquidText text="Today? Anyone with Wi-Fi and ChatGPT can launch a 'startup' in an afternoon." config={{ y: -15, scaleY: 1.3, scaleX: 0.85, color: '#fff' }} />
                        <LiquidText text="Code, content, even charisma... all cloned in minutes." config={{ y: -15, scaleY: 1.3, scaleX: 0.85, color: '#fff' }} />
                    </p>
                    <p style={{ marginBottom: '1.5rem', fontSize: '1.4rem', color: '#fff', fontWeight: 500, lineHeight: 1.3 }}>
                        <LiquidText text="So how do you stand out now?" config={{ y: -20, scaleY: 1.4, scaleX: 0.8, color: 'var(--color-orange)' }} /><br />
                        <LiquidText text="Story. Vision. Personality. Obsession." config={{ y: -20, scaleY: 1.4, scaleX: 0.8, color: 'var(--color-orange)' }} />
                    </p>
                    <p style={{ opacity: 0.9 }}>
                        <LiquidText text="That's what spreads. That's what sticks." config={{ y: -15, scaleY: 1.3, scaleX: 0.85, color: '#fff' }} /><br />
                        <LiquidText text="We help you build that." config={{ y: -15, scaleY: 1.3, scaleX: 0.85, color: '#fff' }} />
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                style={{
                    marginTop: 'auto', // Push to bottom naturally
                    marginBottom: 'var(--spacing-md)',
                    fontSize: '0.9rem',
                    opacity: 0.6,
                    zIndex: 1,
                    cursor: 'pointer',
                    letterSpacing: '0.5px'
                }}
                onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            >
                ↓ See what that actually looks like
            </motion.div>
        </section>
    );
};

export default Hero;
