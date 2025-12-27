import React from 'react';
import { motion } from 'framer-motion';

const Belief = () => {
    return (
        <section className="section-padding" style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '80vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '4rem', alignItems: 'center' }} className="belief-grid">

                    {/* LEFT: THE HOOK */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 0.9, letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
                            We<br />
                            Engineer<br />
                            <span style={{ color: '#D4AF37', fontStyle: 'italic' }}>Cults.</span>
                        </h2>
                    </motion.div>

                    {/* RIGHT: THE TRUTH */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                    >
                        <p style={{ fontSize: '1.25rem', lineHeight: 1.5, opacity: 0.9 }}>
                            The Tech Barrier is gone. <br />
                            A 12-year-old with ChatGPT can clone your SaaS in a weekend.
                        </p>

                        <div style={{ paddingLeft: '1.5rem', borderLeft: '2px solid #D4AF37' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                So what's left?
                            </p>
                            <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>
                                Story. Vibes. The <em>"I need to be part of this"</em> feeling.
                            </p>
                        </div>

                        <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                            We don't just build websites. <br />
                            We turn your product into a religion.
                        </p>
                    </motion.div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .belief-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
                }
            `}</style>
        </section>
    );
};

export default Belief;
