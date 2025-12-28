import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <section id="contact" className="section-padding" style={{ backgroundColor: 'var(--color-pink)', color: 'var(--color-black)' }}>
            <div className="container text-center">
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: 'var(--spacing-lg)', lineHeight: 1.1 }}>
                    To seek attention is easy.<br />
                    <span style={{ color: 'var(--color-white)' }}>To earn respect takes time.</span>
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
                        Start Your Story
                    </button>
                    <button
                        onClick={() => window.open('https://calendly.com/manish-gensync/30min', '_blank')}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            border: '2px solid var(--color-black)',
                            borderRadius: '50px',
                            cursor: 'pointer'
                        }}
                    >
                        Book a Strategy Call
                    </button>
                </div>

                <motion.div
                    style={{ padding: '2rem', borderTop: '1px solid rgba(0,0,0,0.1)', cursor: 'default' }}
                    initial="hidden"
                    whileHover="visible"
                    animate="hidden"
                    variants={{
                        hidden: { opacity: 0.3, filter: 'blur(5px)' },
                        visible: { opacity: 1, filter: 'blur(0px)' }
                    }}
                >
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Ready to start?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                        <a href="mailto:contact@gensync.com">contact@gensync.com</a>
                        <a href="#">LinkedIn</a>
                        <a href="#">X / Twitter</a>
                    </div>
                </motion.div>

                <p style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5 }}>
                    © {new Date().getFullYear()} Gensync. Designed by Gensync.
                </p>
            </div>
        </section>
    );
};

export default Footer;
