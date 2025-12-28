import React from 'react';
import { motion } from 'framer-motion';

const Belief = () => {
    return (
        <section
            className="section-padding"
            style={{
                backgroundColor: 'var(--color-mint)',
                color: 'var(--color-black)',
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
            }}
        >
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{ maxWidth: '900px' }}
                >
                    {/* THESIS */}
                    <h2 className="font-heading text-lg" style={{ marginBottom: '2rem', color: 'var(--color-black)' }}>
                        Most products don’t fail because they’re bad—<br />
                        <span style={{ opacity: 0.7 }}>they fail because no one understands them fast enough.</span>
                    </h2>

                    <p className="text-md font-body" style={{ marginBottom: '3rem', maxWidth: '700px', opacity: 0.9, color: 'var(--color-black)' }}>
                        We partner with founders in SaaS, tech and venture to craft the narratives and design systems that make <span className="font-italic" style={{ color: 'var(--color-orange)' }}>complexity compelling and clear.</span>
                    </p>

                    {/* PROOF POINTS - Dark border for mint bg */}
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '2rem' }}>
                        <div>
                            <div className="text-xl font-heading" style={{ lineHeight: 1 }}>23M+</div>
                            <div className="text-sm font-sans" style={{ opacity: 0.6, marginTop: '0.5rem' }}>Organic Views Delivered</div>
                        </div>
                        <div>
                            <div className="text-xl font-heading" style={{ lineHeight: 1 }}>15+</div>
                            <div className="text-sm font-sans" style={{ opacity: 0.6, marginTop: '0.5rem' }}>Founders Served</div>
                        </div>

                        {/* DEEP DIVE LINK - Dark color */}
                        <a href="#work" style={{ marginLeft: 'auto', color: 'var(--color-orange)', textDecoration: 'none', borderBottom: '1px solid var(--color-orange)', paddingBottom: '2px', fontSize: '0.9rem' }}>
                            See what that actually looks like &darr;
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Belief;
