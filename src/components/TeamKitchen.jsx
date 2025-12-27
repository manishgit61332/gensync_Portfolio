import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TEAM_MEMBERS = [
    { name: 'Manish', role: 'Head Chef', title: 'Founder & Creative Director', chat: "Trends fade. I care if it holds up in 2 years." },
    { name: 'Amulya', role: 'Design Head', title: 'Structure & Restraint', chat: "If it looks clever but confuses people, it’s bad design." },
    { name: 'Ayush Singh', role: 'Client Acquisition', title: 'Realism & Clarity', chat: "If a client can’t explain why they’re buying, we pause the project." },
    { name: 'Mohit Silla', role: 'Business & PR', title: 'Relationship Builder', chat: "Reputation compounds faster than ads. We protect it." },
    { name: 'Aayush Mohan', role: 'Creative Strategist', title: 'Systems Thinker', chat: "Every piece of content is either noise or signal." },
    { name: 'Ayush Tripathi', role: 'Video & Storytelling', title: 'Emotion with Discipline', chat: "A good cut isn’t flashy. It just feels inevitable." },
    { name: 'CREA', role: 'Operations (Robot)', title: 'Silent Efficiency', chat: "Tasks executed. No opinions formed." },
];

const TeamKitchen = () => {
    const [activeMember, setActiveMember] = useState(null);

    return (
        <section className="section-padding" style={{ backgroundColor: '#050505', color: '#fff' }}>
            <div className="container">
                <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
                        Meet the Kitchen.
                    </h2>
                    <p style={{ opacity: 0.7 }}>No freelancers. No bloat. Just the chefs.</p>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {TEAM_MEMBERS.map((member, index) => (
                        <div key={index} style={{ position: 'relative', marginBottom: '1rem' }}>
                            <motion.div
                                onClick={() => setActiveMember(activeMember === index ? null : index)}
                                style={{
                                    padding: '1.5rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: activeMember === index ? 'rgba(255,255,255,0.03)' : 'transparent',
                                    transition: 'background-color 0.3s'
                                }}
                                whileHover={{ paddingLeft: '2rem' }}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{member.name}</h3>
                                    <span style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{member.role}</span>
                                </div>
                                <div style={{ opacity: 0.6, fontStyle: 'italic', fontSize: '0.9rem' }}>{member.title}</div>
                            </motion.div>

                            <AnimatePresence>
                                {activeMember === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{
                                            padding: '1.5rem 2rem',
                                            backgroundColor: '#111',
                                            borderLeft: '2px solid #D4AF37',
                                            margin: '0.5rem 0 1.5rem 0'
                                        }}>
                                            <p style={{ fontFamily: 'monospace', color: '#D4AF37' }}>
                                                <span style={{ opacity: 0.5, marginRight: '1rem' }}>{member.name}:</span>
                                                "{member.chat}"
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    <div style={{ padding: '1.5rem', textAlign: 'center', opacity: 0.5, fontStyle: 'italic', marginTop: '2rem' }}>
                        + A rotating crew of specialist freelancers held to the same standards.
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TeamKitchen;
