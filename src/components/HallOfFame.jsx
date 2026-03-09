import React from 'react';
import { motion } from 'framer-motion';
import { useSectionColor } from '../context/ScrollColorContext';
import { useNavigate } from 'react-router-dom';

const Testimonial = ({ quote, author, role }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
            textAlign: 'left',
            padding: '2rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}
    >
        <p style={{ fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '1.5rem', opacity: 0.9 }}>"{quote}"</p>
        <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{author}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{role}</div>
        </div>
    </motion.div>
);

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
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div className="container" style={{ maxWidth: '1000px', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                        marginBottom: 'clamp(1.5rem, 4vw, 3rem)',
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-white)'
                    }}>
                        How we <span style={{ color: 'var(--color-orange)' }}>show up.</span>
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: 'clamp(2rem, 4vw, 4rem)',
                        fontFamily: 'var(--font-body)'
                    }}>
                        <Testimonial
                            quote="We'd rather lose a project than overpromise on a timeline. If we say two weeks, it ships in two weeks."
                            author="Manish"
                            role="Founder, Gensync"
                        />
                        <Testimonial
                            quote="We don't send decks full of jargon. We share the work, explain the thinking, and move on."
                            author="Amulya"
                            role="Visual Lead, Gensync"
                        />
                        <Testimonial
                            quote="Every project gets the same standard — whether it's a logo or a full product launch."
                            author="The Team"
                            role="Gensync"
                        />
                    </div>

                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://calendly.com/manish-gensync/30min"
                        target="_blank"
                        rel="noopener noreferrer"
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
                            zIndex: 100000,
                            display: 'inline-block',
                            textDecoration: 'none'
                        }}
                    >
                        If this resonates, let’s talk.
                    </motion.a>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default HallOfFame;
