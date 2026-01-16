import React from 'react';
import { motion } from 'framer-motion';
import { useSectionColor } from '../context/ScrollColorContext';

const Footer = () => {
    const setGlobalTheme = useSectionColor();
    return (
        <motion.section
            onViewportEnter={() => setGlobalTheme('#000000', '#FFFFFF', 1.5)}
            viewport={{ margin: "-10% 0px -10% 0px" }}
            id="contact"
            className="section-padding"
            style={{ color: 'var(--color-white)', marginTop: '4rem' }}
        >
            <div className="container text-center">
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: 'var(--spacing-lg)', lineHeight: 1.1, color: '#fff' }}>
                    You have a great product.<br />
                    <span style={{ color: '#aaa' }}>Now give it the story it deserves.</span>
                </h2>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: 'var(--spacing-xl)' }}>
                    <button
                        onClick={() => document.getElementById('thali')?.scrollIntoView({ behavior: 'smooth' })}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            backgroundColor: '#fff',
                            color: '#000',
                            border: 'none',
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Start Building
                    </button>

                </div>

                <motion.div
                    style={{ padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', cursor: 'default' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Ready to start?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                        <a href="mailto:contact@gensync.in">contact@gensync.in</a>
                        <a href="#">LinkedIn</a>
                        <a href="#">X / Twitter</a>
                    </div>
                </motion.div>

                <p style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5 }}>
                    © {new Date().getFullYear()} Gensync. Designed by Gensync.
                </p>
            </div>
        </motion.section>
    );
};

export default Footer;
