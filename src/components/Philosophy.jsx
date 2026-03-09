import React from 'react';
import { motion } from 'framer-motion';
import { useSectionColor } from '../context/ScrollColorContext';

const ThinkingPoint = ({ title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        style={{ marginBottom: '2.5rem' }}
    >
        <h3 style={{
            fontSize: '1.2rem',
            color: '#fff',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-heading)'
        }}>
            {title}
        </h3>
        <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.6,
            maxWidth: '600px'
        }}>
            {description}
        </p>
    </motion.div>
);

const Philosophy = () => {
    const setGlobalTheme = useSectionColor();

    return (
        <motion.section
            onViewportEnter={() => setGlobalTheme('#000000', '#FFFFFF', 1.5)}
            viewport={{ margin: "-10% 0px -10% 0px" }}
            className="section-padding"
            style={{ backgroundColor: 'transparent', overflow: 'hidden' }}
        >
            <div className="container" style={{ maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'clamp(2rem, 4vw, 4rem)' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    style={{ maxWidth: '400px' }}
                >
                    <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                        How we think about <span style={{ color: 'var(--color-orange)' }}>Modern Content & AI.</span>
                    </h2>
                    <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                        Tools are free. Taste is expensive. We use AI to accelerate, not to think.
                    </p>
                </motion.div>

                {/* Points */}
                <div>
                    <ThinkingPoint
                        title="Why most AI content feels generic"
                        description="Because it averages everything. We force the models to be specific, opinionated, and distinctive."
                        delay={0.2}
                    />
                    <ThinkingPoint
                        title="Why taste matters more than tools"
                        description="Everyone has the same software. The differentiator is the human eye that curates the output."
                        delay={0.3}
                    />
                    <ThinkingPoint
                        title="Why execution speed without clarity fails"
                        description="Moving fast in the wrong direction is just efficiently burning cash. We define the 'North Star' first."
                        delay={0.4}
                    />
                    <ThinkingPoint
                        title="Why we build systems, not just assets"
                        description="A video is an asset. A workflow that produces 10 videos a month is a system. We build the engine."
                        delay={0.5}
                    />
                </div>

            </div>
        </motion.section>
    );
};

export default Philosophy;
