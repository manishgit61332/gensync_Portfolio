import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Import images
import team1 from '../assets/team_cutout_1.png';
import team2 from '../assets/team_cutout_2.png';
import team3 from '../assets/team_cutout_3.png';
import team4 from '../assets/team_cutout_4.png';

const TEAM = [
    { name: 'Manish', role: 'Head Chef', img: team1, quote: "Trends fade. Taste lasts." },
    { name: 'Amulya', role: 'Design', img: team2, quote: "Chaos needs structure." },
    { name: 'Ayush S', role: 'Acquisition', img: team3, quote: "Numbers don't lie." },
    { name: 'Mohit', role: 'Business', img: team4, quote: "Reputation is currency." },
    { name: 'Aayush M', role: 'Strategy', img: team1, quote: "Find the signal." },
    { name: 'Ayush T', role: 'Video', img: team4, quote: "Make them feel it." },
];

const TeamKitchen = () => {
    return (
        <section
            style={{
                backgroundColor: '#050505',
                color: '#fff',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '8rem 4vw',
                position: 'relative',
            }}
        >
            {/* Section Header */}
            <div style={{ maxWidth: '1400px', margin: '0 auto 6rem auto', width: '100%' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        margin: 0,
                        marginBottom: '1rem'
                    }}
                >
                    The Kitchen.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 0.6, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1rem',
                        maxWidth: '500px',
                        letterSpacing: '1px'
                    }}
                >
                    Meet the team building your brand
                </motion.p>
            </div>

            {/* Team Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                    gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    width: '100%',
                }}
            >
                {TEAM.map((member, index) => (
                    <TeamCard key={index} member={member} index={index} />
                ))}
            </div>
        </section>
    );
};

const TeamCard = ({ member, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

    // Magnetic effect - track mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for magnetic effect
    const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 200 });
    const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 200 });

    // Transform mouse position to rotation
    const rotateX = useTransform(smoothMouseY, [-100, 100], [5, -5]);
    const rotateY = useTransform(smoothMouseX, [-100, 100], [-5, 5]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
    };

    // Touch support for mobile
    const handleTouchStart = () => {
        setIsHovered(true);
    };

    const handleTouchEnd = () => {
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
                position: 'relative',
                perspective: '1000px',
            }}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
                <div
                    style={{
                        position: 'relative',
                        height: 'clamp(450px, 60vh, 550px)', // Responsive height
                        borderRadius: '20px',
                        overflow: 'hidden',
                        backgroundColor: '#111',
                        border: isHovered ? '1px solid var(--color-orange)' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: isHovered ? '0 20px 60px rgba(255, 107, 0, 0.3)' : '0 10px 30px rgba(0,0,0,0.3)',
                        transition: 'border 0.4s ease, box-shadow 0.4s ease',
                        cursor: 'pointer',
                    }}
                >
                    {/* Background Image */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${member.img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                        initial={{ filter: 'grayscale(100%)' }}
                        animate={{
                            filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
                            scale: isHovered ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />

                    {/* Gradient Overlay */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                        }}
                    />

                    {/* Content */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '2.5rem',
                            zIndex: 2,
                        }}
                    >
                        {/* Ticket Number */}
                        <motion.div
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: isHovered ? 1 : 0.5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.75rem',
                                    marginBottom: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '3px',
                                    color: isHovered ? 'var(--color-orange)' : '#999',
                                    transition: 'color 0.3s ease',
                                }}
                            >
                                STATION #{String(index + 1).padStart(2, '0')}
                            </p>
                        </motion.div>

                        {/* Name */}
                        <motion.h3
                            style={{
                                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                margin: 0,
                                lineHeight: 0.9,
                                fontFamily: 'var(--font-heading)',
                                marginBottom: '0.5rem',
                            }}
                            animate={{
                                color: isHovered ? 'var(--color-orange)' : '#fff',
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {member.name}
                        </motion.h3>

                        {/* Role */}
                        <p
                            style={{
                                fontSize: '1rem',
                                opacity: 0.7,
                                fontFamily: 'var(--font-body)',
                                marginBottom: '1.5rem',
                            }}
                        >
                            {member.role}
                        </p>

                        {/* Quote - Smooth reveal */}
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                                height: isHovered ? 'auto' : 0,
                                opacity: isHovered ? 1 : 0,
                            }}
                            transition={{
                                duration: 0.5,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            style={{
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    paddingTop: '1rem',
                                    borderTop: '1px solid rgba(255, 107, 0, 0.3)',
                                }}
                            >
                                <p
                                    style={{
                                        fontStyle: 'italic',
                                        fontSize: '1.1rem',
                                        color: 'rgba(255,255,255,0.9)',
                                        lineHeight: 1.6,
                                        fontFamily: 'var(--font-body)',
                                    }}
                                >
                                    "{member.quote}"
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hover Glow Effect */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            position: 'absolute',
                            inset: -1,
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, rgba(255,107,0,0.1), transparent)',
                            pointerEvents: 'none',
                            zIndex: 1,
                        }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TeamKitchen;
