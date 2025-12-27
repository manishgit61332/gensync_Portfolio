import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const navigate = useNavigate();
    return (
        // SOLID COLOUR: Maroon. No gradients.
        <section className="section-padding" style={{ backgroundColor: 'var(--color-maroon)', color: 'var(--color-pink)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Simple Models. <span style={{ color: 'var(--color-orange)' }}>Complex Output.</span></h2>
                    <p style={{ opacity: 0.9, marginTop: '1rem', fontSize: '1.2rem', maxWidth: '700px', marginInline: 'auto' }}>
                        Get senior design & narrative expertise at a fraction of the cost of a full-time hire.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Retainer Model */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        style={{ padding: '2rem', border: '1px solid rgba(255, 159, 159, 0.3)', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.2)' }}
                    >
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>The Partner</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>$4,000<span style={{ fontSize: '1rem', fontWeight: 'normal', opacity: 0.7 }}>/mo</span></div>
                        <p style={{ marginBottom: '2rem', opacity: 0.9 }}>Best for early-stage startups needing a full design & dev team.</p>

                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', gap: '0.5rem' }}><Check size={20} /> Unlimited Design Requests</li>
                            <li style={{ display: 'flex', gap: '0.5rem' }}><Check size={20} /> Webflow Development</li>
                            <li style={{ display: 'flex', gap: '0.5rem' }}><Check size={20} /> 48h Turnaround</li>
                            <li style={{ display: 'flex', gap: '0.5rem' }}><Check size={20} /> Pause or Cancel Anytime</li>
                        </ul>

                        <button
                            onClick={() => navigate('/checkout', {
                                state: {
                                    selectedServices: [{ name: 'The Partner (Retainer)', price: 4000 }],
                                    totalBudget: 4000
                                }
                            })}
                            style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--color-orange)', color: '#000', fontWeight: 'bold', borderRadius: '8px', marginTop: '2rem', cursor: 'pointer' }}
                        >
                            Start Your Story
                        </button>
                    </motion.div>

                    {/* Project Model */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        style={{ padding: '2rem', border: '1px solid rgba(255, 159, 159, 0.3)', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.2)' }}
                    >
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>The Sprint</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>Custom</div>
                        <p style={{ marginBottom: '2rem', opacity: 0.9 }}>For specific, high-impact projects with defined scope.</p>

                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', gap: '0.5rem' }}><Check size={20} /> One-off Branding</li>
                            <li style={{ display: 'flex', gap: '0.5rem' }}><Check size={20} /> MVP Build</li>
                            <li style={{ display: 'flex', gap: '0.5rem' }}><Check size={20} /> Deck Design</li>
                            <li style={{ display: 'flex', gap: '0.5rem' }}><Check size={20} /> Fixed Pricing</li>
                        </ul>

                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{ width: '100%', padding: '1rem', backgroundColor: 'transparent', border: '1px solid var(--color-orange)', color: 'var(--color-orange)', fontWeight: 'bold', borderRadius: '8px', marginTop: '2rem', cursor: 'pointer' }}
                        >
                            Book Call
                        </button>
                    </motion.div>
                </div>

                {/* SOLID COLOUR BLOCK: Dark Overlay (Solid-ish) */}
                <div style={{
                    marginTop: 'var(--spacing-lg)',
                    padding: '3rem 2rem',
                    borderRadius: '24px',
                    backgroundColor: 'rgba(0,0,0,0.2)', // Lightened from 0.4
                    textAlign: 'center',
                    border: 'none', // Removed border as per 'no lines' request
                }}>
                    <h3 style={{ marginBottom: '2rem', color: '#fff', fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Why no headcount?</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem' }}>
                        <div>
                            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>$120k+</span>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-pink)', marginTop: '0.5rem', opacity: 0.8 }}>Avg Senior Designer Salary</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>~20%</span>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-pink)', marginTop: '0.5rem', opacity: 0.8 }}>Recruiting Fees</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>0%</span>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-pink)', marginTop: '0.5rem', opacity: 0.8 }}>Equity Given Up</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
