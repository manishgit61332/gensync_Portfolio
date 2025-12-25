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
                        <Eye size={20} /> <CountUp end={50} suffix="M+" /> Organic Views Delivered
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                    {/* Simple Visualization */}
                    <motion.div
                        style={{
                            width: '150px',
                            height: '150px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            // Solid Black
                            backgroundColor: 'var(--color-black)',
                            color: 'var(--color-white)'
                        }}
                        whileHover={{ scale: 1.05 }}
                    >
                        Content Idea
                    </motion.div>

                    <ArrowRight color="var(--color-orange)" size={48} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {['LinkedIn', 'Twitter/X', 'Newsletter', 'Shorts'].map((platform, i) => (
                            <motion.div
                                key={platform}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    padding: '1rem',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    minWidth: '120px'
                                }}
                            >
                                {platform}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <p className="text-center" style={{ marginTop: 'var(--spacing-lg)', maxWidth: '600px', marginInline: 'auto', opacity: 0.8 }}>
                    Most agencies spend 90% of budget on making the video and 10% on posting it. We flip the script.
                </p>
            </div>
        </section>
    );
};

export default Distribution;
