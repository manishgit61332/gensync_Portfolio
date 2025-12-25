import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ role, quote, company }) => (
    <div
        style={{
            padding: '2rem',
            backgroundColor: '#111',
            borderRadius: '12px',
            border: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            minWidth: '350px', // Fixed width for marquee flow
            height: '100%',
            marginRight: '2rem'
        }}
    >
        <Quote size={24} color="var(--color-mint)" style={{ opacity: 0.5 }} />
        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.9 }}>"{quote}"</p>
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontWeight: 'bold', color: '#fff' }}>{role}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-orange)', opacity: 0.8 }}>{company}</div>
        </div>
    </div>
);

const HallOfFame = () => {
    const testimonials = [
        {
            role: "Founder & CEO",
            company: "Series A Fintech",
            quote: "Gensync didn't just design our site, they engineered our entire narrative. The easiest ROI I've had this year."
        },
        {
            role: "CMO",
            company: "AI Infrastructure",
            quote: "Finally, an agency that understands that 'pretty' isn't enough. The distribution strategy changed our roadmap."
        },
        {
            role: "Director of Marketing",
            company: "SaaS Scaleup",
            quote: "The Thali model is genius. We stopped hiring freelancers and just plugged Gensync in. Velocity went up 3x."
        },
        {
            role: "Founder",
            company: "Stealth Startup",
            quote: "I was skeptical about the 'no headcount' pitch. I'm not anymore. They work faster than my in-house team ever did."
        },
        {
            role: "Head of Growth",
            company: "E-commerce Giant",
            quote: "Their content engineering is legitimate. We learned more about our audience in 2 weeks than in the last 2 years."
        },
        {
            role: "Venture Partner",
            company: "Global VC Firm",
            quote: "I refer all my portfolio companies to Gensync. They fix the 'story problem' faster than anyone."
        }
    ];

    // Double the array to ensure seamless looping
    const marqueeContent = [...testimonials, ...testimonials];

    return (
        <section className="section-padding" style={{ backgroundColor: 'var(--color-black)', color: '#fff', overflow: 'hidden' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}
                >
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Hall of Fame</h2>
                    <p style={{ opacity: 0.7 }}>Don't just take our word for it.</p>
                </motion.div>
            </div>

            {/* Marquee Container with Gradient Masks for Fade Efeect */}
            <div style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                overflow: 'hidden',
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}>
                <motion.div
                    style={{ display: 'flex' }}
                    animate={{ x: '-50%' }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30 // Speed of scroll
                    }}
                    whileHover={{ animationPlayState: 'paused' }} // Pause on hover (if using CCS animation, but for framer we need to pause differently or just rely on slow scroll)
                >
                    {marqueeContent.map((t, i) => (
                        <TestimonialCard key={i} {...t} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HallOfFame;
