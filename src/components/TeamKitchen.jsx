import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import team1 from '../assets/team_cutout_1.png';
import team2 from '../assets/team_cutout_2.png';
import team3 from '../assets/team_cutout_3.png';
import team4 from '../assets/team_cutout_4.png';

const TEAM = [
    { name: 'Manish', role: 'Head Chef', img: team1, quote: "Trends fade." },
    { name: 'Amulya', role: 'Design', img: team2, quote: "Structure." },
    { name: 'Ayush S', role: 'Acquisition', img: team3, quote: "Realism." },
    { name: 'Mohit', role: 'Business', img: team4, quote: "Reputation." },
    { name: 'Aayush M', role: 'Strategy', img: team1, quote: "Signal." },
    { name: 'Ayush T', role: 'Video', img: team4, quote: "Emotion." },
];

const TeamKitchen = () => {
    const containerRef = useRef(null);
    const [activeImg, setActiveImg] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Mouse Physics
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { stiffness: 1000, damping: 50 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { setActiveImg(null); setHoveredIndex(null); }}
            className="section-padding"
            style={{
                backgroundColor: '#050505',
                color: '#fff',
                position: 'relative',
                minHeight: '80vh',
                cursor: 'none', // Custom cursor feel
                overflow: 'hidden'
            }}
        >
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-heading)' }}>
                        The Lens.
                    </h2>
                    <p style={{ opacity: 0.6, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                        Hover to inspect
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    {TEAM.map((member, i) => (
                        <motion.div
                            key={i}
                            onMouseEnter={() => { setActiveImg(member.img); setHoveredIndex(i); }}
                            style={{
                                padding: '2rem 0',
                                width: '100%',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 20,
                                mixBlendMode: 'difference' // Cool inversion interaction
                            }}
                            animate={{ opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.3 : 1 }}
                        >
                            <h3 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                                {member.name}
                            </h3>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{member.role}</div>
                                <div style={{ fontSize: '2rem', fontStyle: 'italic', opacity: 0.5 }}>"{member.quote}"</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* THE LENS (Follows Mouse) */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    x,
                    y,
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 5,
                    overflow: 'hidden',
                    display: activeImg ? 'block' : 'none',
                    boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.5), 0 0 50px rgba(212, 175, 55, 0.2)', // Gold Rim
                    backgroundColor: '#000'
                }}
            >
                {/* Image Inside Lens - Counter-translated to simulate "Revealing" the background */}
                <motion.img
                    src={activeImg}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '120%', // Zoomed slightly
                        height: '120%',
                        objectFit: 'cover',
                        transform: 'translate(-50%, -50%)',
                    }}
                />

                {/* HUD Elements inside Lens */}
                <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '10px', height: '10px', backgroundColor: 'red', transform: 'translate(-50%, -50%)', borderRadius: '50%' }} />
            </motion.div>

        </section>
    );
};

export default TeamKitchen;
