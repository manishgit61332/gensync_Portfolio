import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSectionColor } from '../context/ScrollColorContext';

const Pricing = () => {
    const navigate = useNavigate();
    const setGlobalTheme = useSectionColor();

    return (
        <motion.section
            onViewportEnter={() => setGlobalTheme('#000000', '#FFFFFF', 1.5)}
            viewport={{ margin: "-10% 0px -10% 0px" }}
            className="section-padding"
            style={{ backgroundColor: 'transparent', color: '#fff', position: 'relative' }}
        >
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
                        Two ways to <span style={{ color: 'var(--color-orange)' }}>work with us.</span>
                    </h2>
                    <p style={{ opacity: 0.7, fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', maxWidth: '600px', margin: '0 auto' }}>
                        Transparent pricing. No surprises.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {/* The Partner */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        style={{
                            padding: '3rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)'
                        }}
                    >
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>The Partner</h3>
                        <p style={{ color: 'var(--color-orange)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2rem' }}>Ongoing Partnership</p>

                        <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '2rem' }}>
                            $3,000<span style={{ fontSize: '1rem', opacity: 0.5, fontWeight: 400 }}>/mo</span>

                        </div>

                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Check size={18} color="var(--color-orange)" /> <span>Unlimited Design & Copy Requests</span>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Check size={18} color="var(--color-orange)" /> <span>Weekly Strategy Syncs</span>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Check size={18} color="var(--color-orange)" /> <span>Webflow Development Included</span>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Check size={18} color="var(--color-orange)" /> <span>All-Inclusive: Video, AI, Web & Brand</span>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Check size={18} color="var(--color-orange)" /> <span>Priority Support (Slack)</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => navigate('/checkout', { state: { selectedServices: [{ id: 'partner-membership', name: 'The Partner', price: 3000 }], totalBudget: 3000 } })}

                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                backgroundColor: 'var(--color-orange)',
                                color: '#000',
                                fontWeight: 700,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Start Membership
                        </button>
                    </motion.div>

                    {/* The Project */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        style={{
                            padding: '3rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)'
                        }}
                    >
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>The Sprint</h3>
                        <p style={{ color: 'var(--color-orange)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2rem' }}>One-Time Projects</p>

                        <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '2rem' }}>
                            Custom
                        </div>

                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Check size={18} color="var(--color-orange)" /> <span>Brand Identity Overhaul</span>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Check size={18} color="var(--color-orange)" /> <span>Website Redesign & Build</span>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Check size={18} color="var(--color-orange)" /> <span>Pitch Deck Narrative & Design</span>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Check size={18} color="var(--color-orange)" /> <span>Product Launch Campaigns</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => window.open('https://calendly.com/manish-gensync/30min', '_blank', 'noopener,noreferrer')}
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--color-orange)',
                                color: 'var(--color-orange)',
                                fontWeight: 700,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Book a Strategy Call
                        </button>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default Pricing;
