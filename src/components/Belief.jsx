import React from 'react';
import { motion } from 'framer-motion';

const Belief = () => {
    return (
        <section className="section-padding" style={{ backgroundColor: 'var(--color-mint)', color: 'var(--color-black)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* UPDATED: Focus on ROI/Scale/Taste */}
                    <h2 style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: 1.1 }}>
                        <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            Most B2B Marketing
                        </motion.span>
                        <br />
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, type: "spring" }}
                            style={{ color: 'var(--color-maroon)', fontStyle: 'italic', display: 'inline-block' }}
                        >
                            is Trash.
                        </motion.span>
                    </h2>

                    <p style={{ fontSize: '1.5rem', lineHeight: 1.4, marginBottom: '2rem' }}>
                        Stop posting generic LinkedIn carousels.<br />
                        Stop hiring "safe" designers.<br />
                        <span style={{ color: '#000', fontWeight: 'bold' }}>We exist to make you dangerous.</span>
                    </p>

                    <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
                        We are not a "full service" agency. We are a growth weapon.<br />
                        <strong>1. World-class Design.</strong> <strong>2. Aggressive Distribution.</strong><br />
                        Everything else is noise.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Belief;
