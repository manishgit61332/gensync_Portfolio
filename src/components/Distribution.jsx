import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { Share2, ArrowRight, Eye } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const CountUp = ({ end, suffix = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const spring = useSpring(0, { duration: 2000 });
    const display = useTransform(spring, (current) => Math.round(current) + suffix);

    useEffect(() => {
        if (isInView) spring.set(end);
    }, [isInView, spring, end]);

    return <motion.span ref={ref} style={{ fontWeight: 'bold' }}>{display}</motion.span>;
};

const Distribution = () => {
    return (
        // SOLID COLOUR: Black. No Gradient. No Borders.
        <section className="section-padding" style={{ background: 'var(--color-black)', color: 'var(--color-white)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>We Don't Just Post.<br /><span style={{ color: 'var(--color-orange)' }}>We Dominate.</span></h2>
                    {/* STAT INJECTION: Reach Metric */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.5rem 1.5rem', border: '1px solid var(--color-orange)', borderRadius: '50px', color: 'var(--color-orange)' }}>
                        <Eye size={20} /> <CountUp end={23} suffix="M+" /> Organic Views Delivered
                    </div>
                </div>

                {/* Diagram Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column', // Mobile default (will be overridden by CSS if I could, but here I'll use a wrapper class or inline style hack)
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    marginTop: 'var(--spacing-lg)'
                }}>

                    {/* Responsive Layout Wrapper */}
                    <div className="distribution-diagram" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                        {/* 1. Content Idea */}
                        <motion.div
                            style={{
                                width: '160px',
                                height: '160px',
                                flexShrink: 0, // Prevent squish
                                borderRadius: '50%',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-white)',
                                position: 'relative',
                                boxShadow: '0 0 30px rgba(0,0,0,0.5)'
                            }}
                            whileHover={{ scale: 1.05, borderColor: 'var(--color-orange)', boxShadow: '0 0 50px rgba(255, 119, 1, 0.2)' }}
                        >
                            <span style={{ fontSize: '3rem', lineHeight: 1 }}>💡</span>
                            <span style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 600, opacity: 0.9 }}>Content Idea</span>
                        </motion.div>

                        {/* 2. Arrow (Responsive Rotate) - Flex Centered */}
                        <div className="arrow-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowRight color="var(--color-orange)" size={48} strokeWidth={1.5} />
                        </div>

                        {/* 3. Distribution Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '1.5rem',
                            padding: '2rem',
                            borderRadius: '24px',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            {['LinkedIn', 'Twitter / X', 'Newsletter', 'Shorts'].map((platform, i) => (
                                <motion.div
                                    key={platform}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        padding: '1rem 2rem',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        minWidth: '140px',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        border: '1px solid transparent'
                                    }}
                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}
                                >
                                    {platform}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <style>{`
                    .distribution-diagram {
                        flex-direction: column;
                        gap: 2rem;
                    }
                    .arrow-wrapper {
                        transform: rotate(90deg);
                        width: 60px;
                        height: 60px;
                    }
                    @media (min-width: 900px) { /* Increased breakpoint for safety */
                        .distribution-diagram {
                            flex-direction: row;
                            gap: 3rem; /* Symmetric Gap */
                        }
                        .arrow-wrapper {
                            transform: rotate(0deg);
                            /* No margin, relying on flex gap */
                        }
                    }
                `}</style>

                <p className="text-center" style={{ marginTop: 'var(--spacing-lg)', maxWidth: '600px', marginInline: 'auto', opacity: 0.8 }}>
                    Most agencies spend 90% of budget on making the video and 10% on posting it. We flip the script.
                </p>
            </div>
        </section>
    );
};

export default Distribution;
