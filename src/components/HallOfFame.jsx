import React from 'react';
import { motion } from 'framer-motion';
import { useSectionColor } from '../context/ScrollColorContext';
import { useNavigate } from 'react-router-dom';

const HallOfFame = () => {
    const setGlobalTheme = useSectionColor();
    const navigate = useNavigate();

    return (
        <motion.section
            onViewportEnter={() => setGlobalTheme('#000000', '#FFFFFF', 1.5)}
            viewport={{ margin: "-10% 0px -10% 0px" }}
            className="section-padding"
            style={{ 
                backgroundColor: 'transparent', 
                color: '#fff', 
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 style={{ 
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                        marginBottom: '2rem',
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-white)'
                    }}>
                        We’re early.
                    </h2>
                    
                    <div style={{ 
                        fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', 
                        lineHeight: 1.6, 
                        opacity: 0.8,
                        marginBottom: '3rem',
                        fontFamily: 'var(--font-body)'
                    }}>
                        <p style={{ marginBottom: '1rem' }}>We don’t have 47 polished testimonials yet.</p>
                        <p style={{ marginBottom: '1rem' }}>What we do have is real work, real thinking, and founders who come back.</p>
                        <p>If that’s not enough, we’re probably not a fit.</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = 'mailto:contact@gensync.in'}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.2rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--color-white)',
                            color: 'var(--color-white)',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            zIndex: 50
                        }}
                    >
                        If this resonates, let’s talk.
                    </motion.button>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default HallOfFame;
