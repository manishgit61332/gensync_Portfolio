import React from 'react';
import { motion } from 'framer-motion';

const StepCard = ({ number, title, subtitle, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        style={{
            position: 'relative',
            padding: '2rem',
            background: 'rgba(255,255,255,0.02)',
            borderLeft: '1px solid var(--color-orange)',
            marginBottom: '2rem',
            marginLeft: '1rem' // For the connecting line effect
        }}
    >
        <div style={{
            position: 'absolute',
            left: '-1rem',
            top: '0',
            bottom: '0',
            width: '1px',
            background: 'linear-gradient(to bottom, var(--color-orange), transparent)',
            opacity: 0.3
        }} />

        <span style={{
            fontSize: '4rem',
            fontWeight: 400,
            opacity: 0.1,
            position: 'absolute',
            right: '1rem',
            top: '0',
            fontFamily: 'var(--font-heading)',
            color: '#fff'
        }}>
            {number}
        </span>

        <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.5rem' }}>
            {title}
        </h3>
        <p style={{ color: 'var(--color-orange)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            {subtitle}
        </p>
        <p style={{ color: 'var(--color-light-gray)', lineHeight: 1.6 }}>
            {description}
        </p>
    </motion.div>
);

import { useSectionColor } from '../context/ScrollColorContext';

const SystemFramework = () => {
    const setGlobalTheme = useSectionColor();
    const steps = [
        {
            number: "01",
            title: "Context First",
            subtitle: "Deep Dive",
            description: "We deeply understand your product, market, and constraints before touching visuals."
        },
        {
            number: "02",
            title: "Clarity over Creativity",
            subtitle: "Strategy Defined",
            description: "Strategy and messaging come before aesthetics. We clarify the 'what' and 'why' first."
        },
        {
            number: "03",
            title: "Execution with Taste",
            subtitle: "Production Standards",
            description: "Design, motion, content, AI workflows built to production standards in days, not months."
        },
        {
            number: "04",
            title: "Iteration, not Guesswork",
            subtitle: "Feedback Loops",
            description: "We refine based on feedback and real-world performance. We don't guess, we calibrate."
        }
    ];

    return (
        <motion.section
            onViewportEnter={() => setGlobalTheme('#050507', '#FFFFFF', 1.5)}
            viewport={{ margin: "-10% 0px -10% 0px" }}
            id="protocol"
            className="section-padding"
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '6rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
                        How We <span style={{ color: 'var(--color-orange)' }}>Actually Work</span>
                    </h2>
                    <p style={{ color: 'var(--color-light-gray)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                        Founders trust process, not promises. Here's ours.
                    </p>
                </div>

                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                    {/* TIMELINE LINE */}
                    <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background: 'linear-gradient(to bottom, transparent, var(--color-orange), transparent)',
                        opacity: 0.5
                    }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                style={{ position: 'relative', paddingLeft: '2rem' }}
                            >
                                {/* DOT */}
                                <div style={{
                                    position: 'absolute',
                                    left: '-2.4rem', // Center on line
                                    top: '0.5rem',
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: 'var(--color-black)',
                                    border: '2px solid var(--color-orange)',
                                    borderRadius: '50%',
                                    zIndex: 2
                                }} />

                                <span style={{
                                    fontSize: '0.85rem',
                                    fontFamily: 'var(--font-heading)',
                                    color: 'var(--color-orange)',
                                    marginBottom: '0.5rem',
                                    display: 'block',
                                    opacity: 0.8
                                }}>
                                    Step {step.number}
                                </span>

                                <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.5rem' }}>
                                    {step.title}
                                </h3>

                                <p style={{ color: 'var(--color-light-gray)', lineHeight: 1.6, fontSize: '1.1rem', maxWidth: '600px' }}>
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default SystemFramework;
