import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

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
    return (
        <section className="section-padding" style={{ backgroundColor: '#050505', color: '#fff', position: 'relative' }}>
            <div className="container">
                <div style={{ marginBottom: '6rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-heading)' }}>
                        The Kitchen.
                    </h2>
                    <p style={{ opacity: 0.6, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                        Sensor Array Active
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2px', // Tight grid
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {TEAM.map((member, i) => (
                        <SensorCell key={i} member={member} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const SensorCell = ({ member, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Initial State: Blurry, Dark, "Unfocused"
    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                aspectRatio: '1/1',
                backgroundColor: '#000',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'crosshair',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {/* GRID LINES */}
            <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

            {/* CROSSHAIR CORNERS */}
            <div style={{ position: 'absolute', top: 10, left: 10, width: 10, height: 10, borderTop: '1px solid #333', borderLeft: '1px solid #333' }} />
            <div style={{ position: 'absolute', bottom: 10, right: 10, width: 10, height: 10, borderBottom: '1px solid #333', borderRight: '1px solid #333' }} />

            {/* IMAGE: Unfocused by default */}
            <motion.img
                src={member.img}
                animate={{
                    filter: isHovered ? 'blur(0px) grayscale(0%)' : 'blur(10px) grayscale(100%)',
                    scale: isHovered ? 1.1 : 0.9,
                    opacity: isHovered ? 1 : 0.3
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ width: '80%', height: '80%', objectFit: 'contain' }}
            />

            {/* HUD OVERLAY (Only on Focus) */}
            <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    fontFamily: 'monospace',
                    color: '#D4AF37',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    textShadow: '0 0 10px rgba(212,175,55,0.5)'
                }}
            >
                <div>ID: {member.name}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>ROLE: {member.role}</div>
            </motion.div>

        </motion.div>
    );
};

export default TeamKitchen;
