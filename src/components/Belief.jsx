import React from 'react';
import { motion } from 'framer-motion';

const Belief = () => {
    return (
        <section className="section-padding" style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '80vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{ maxWidth: '900px' }}
                >
                    {/* THESIS */}
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>
                        Most products don’t fail because they’re bad—<br />
                        <span style={{ opacity: 0.6 }}>they fail because no one understands them fast enough.</span>
                    </h2>

                    <p style={{ fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '700px', opacity: 0.9 }}>
                        We partner with founders in SaaS, tech and venture to craft the narratives and design systems that make <span style={{ color: '#D4AF37', fontStyle: 'italic' }}>complexity contagious.</span>
                    </p>

                    {/* PROOF POINTS */}
                    <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1 }}>17M+</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '0.5rem' }}>Organic Views Delivered</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1 }}>15+</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '0.5rem' }}>Founders Served</div>
                        </div>

                        {/* DEEP DIVE LINK */}
                        <a href="#work" style={{ marginLeft: 'auto', color: '#D4AF37', textDecoration: 'none', borderBottom: '1px solid #D4AF37', paddingBottom: '2px', fontSize: '0.9rem' }}>
                            See what that actually looks like &darr;
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Belief;
