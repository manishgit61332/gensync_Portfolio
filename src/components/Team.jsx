import React from 'react';
import { motion } from 'framer-motion';

const Team = () => {
    return (
        <section className="section-padding" style={{ backgroundColor: 'var(--color-black)' }}>
            <div className="container">
                <motion.h2
                    className="text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                >
                    Credibility isn't an accident.
                </motion.h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                    <div style={{ borderLeft: '2px solid var(--color-mint)', paddingLeft: 'var(--spacing-sm)', maxWidth: '400px' }}>
                        {/* UPDATED: Veteran Expertise */}
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-mint)', marginBottom: '0.5rem' }}>Deep Domain Expertise</h3>
                        <p style={{ opacity: 0.8 }}>Senior talent only. We don't bill you for our tuition.</p>
                    </div>
                    <div style={{ borderLeft: '2px solid var(--color-orange)', paddingLeft: 'var(--spacing-sm)', maxWidth: '400px' }}>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-orange)', marginBottom: '0.5rem' }}>Distribution First</h3>
                        <p style={{ opacity: 0.8 }}>We don't just make things. We engineer them to be seen. That is our unfair advantage.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Team;
