import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import Particles from '../components/Particles';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedServices = [], totalBudget = 0 } = location.state || {};

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If no state, redirect home
    if (!location.state) {
        return (
            <div style={{ padding: '4rem', color: '#fff', textAlign: 'center' }}>
                <h2>No thali selected.</h2>
                <button onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Go Back</button>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Construct Email Body
        const serviceList = selectedServices.map(s => `- ${s.name} ($${s.price})`).join('\n');
        const subject = `New Thali Inquiry from ${email}`;
        const body = `
New Inquiry for Gensync Thali:

Selected Services:
${serviceList}

Total Estimated Budget: $${totalBudget.toLocaleString()}

Contact Details:
Email: ${email}
Phone: ${phone}

(This is an automated inquiry from the website checkout)
        `;

        // Mailto Link
        const mailtoLink = `mailto:contact@gensync.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Simulate "Sending" then open mailto
        setTimeout(() => {
            window.location.href = mailtoLink;
            setIsSubmitting(false);
            alert("Redirecting to your email client to send the inquiry...");
        }, 1000);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'var(--font-body)', position: 'relative' }}>
            <Particles color="rgba(212, 175, 55, 0.2)" count={20} />

            <div className="container" style={{ paddingTop: '4rem', maxWidth: '800px' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        color: 'rgba(255,255,255,0.6)', marginBottom: '2rem',
                        background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    <ArrowLeft size={20} /> Back to Builder
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '2rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Checkout</h1>
                    <p style={{ opacity: 0.7, marginBottom: '2rem' }}>Review your Thali and secure your slot.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                        {/* Order Summary */}
                        <div>
                            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>Order Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                {selectedServices.map(s => (
                                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                        <span>{s.name}</span>
                                        <span style={{ color: '#D4AF37' }}>${s.price.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.2)' }}>
                                <span>Total Estimate</span>
                                <span style={{ color: '#D4AF37' }}>${totalBudget.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="founder@startup.com"
                                    style={{
                                        width: '100%', padding: '1rem',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px', color: '#fff'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone/WhatsApp (Optional)</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    style={{
                                        width: '100%', padding: '1rem',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px', color: '#fff'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    padding: '1rem',
                                    backgroundColor: '#D4AF37',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    opacity: isSubmitting ? 0.7 : 1
                                }}
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm Inquiry'}
                            </button>
                            <p style={{ fontSize: '0.8rem', opacity: 0.5, textAlign: 'center' }}>
                                This will open your default email client with the details pre-filled.
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .container > div > div { grid-template-columns: 1fr !important; gap: 2rem !important; }
                }
            `}</style>
        </div>
    );
};

export default Checkout;
