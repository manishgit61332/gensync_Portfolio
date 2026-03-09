import React from 'react';
import { motion } from 'framer-motion';
import { useSectionColor } from '../context/ScrollColorContext';

const WereEarly = () => {
    const setGlobalTheme = useSectionColor();

    return (
        <motion.section
            onViewportEnter={() => setGlobalTheme('#000000', '#FFFFFF', 1.5)}
            viewport={{ margin: "-10% 0px -10% 0px" }}
            className="section-padding"
            style={{
                backgroundColor: 'transparent',
                color: '#fff',
                minHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Texture - Subtle */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at center, rgba(255, 119, 1, 0.05) 0%, transparent 60%)',
                pointerEvents: 'none'
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 style={{
                        fontSize: 'clamp(4rem, 10vw, 8rem)',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 0.85,
                        marginBottom: '2rem',
                        letterSpacing: '-0.02em',
                        background: 'linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.5) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 30px rgba(255,255,255,0.1)'
                    }}>
                        We're <br /><span style={{ color: 'var(--color-orange)', WebkitTextFillColor: 'var(--color-orange)' }}>Early.</span>
                    </h2>

                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100px' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{
                            height: '2px',
                            background: 'var(--color-orange)',
                            margin: '0 auto 2rem auto'
                        }}
                    />

                    <p style={{
                        fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        color: 'rgba(255,255,255,0.8)',
                        fontFamily: 'var(--font-heading)', // Using heading font for elegance here
                        lineHeight: 1.4
                    }}>
                        Most people are waiting for the playbook.<br />
                        <span style={{ color: '#fff' }}>We are writing it.</span>
                    </p>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default WereEarly;
