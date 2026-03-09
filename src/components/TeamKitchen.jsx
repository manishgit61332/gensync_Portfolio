import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Assets
import ManishImg from '../assets/team/Manish.jpeg';
import AmulyaImg from '../assets/team/Amulya.jpeg';
import AyushSImg from '../assets/team/Ayush_S.jpeg';
import MohitImg from '../assets/team/Mohit.jpeg';
import AayushMImg from '../assets/team/Aayush_Mohan.jpeg';
import AyushTImg from '../assets/team/Ayush_T.jpg';
import ManiImg from '../assets/team/Mani_Kanta.jpeg';
import CreaImg from '../assets/team/Crea.jpeg';

const TEAM_MEMBERS = [
    {
        name: "Manish",
        role: "Head Chef",
        image: ManishImg,
        id: "01",
        quote: "If I can't explain it in one sentence, it's not done."
    },
    {
        name: "Amulya",
        role: "Visual Lead",
        image: AmulyaImg,
        id: "02",
        quote: "Ugly converts, but beautiful endures."
    },
    {
        name: "Ayush S",
        role: "Acquisition",
        image: AyushSImg,
        id: "03",
        quote: "Data doesn't lie, but it can be boring. We make it fun."
    },
    {
        name: "Mohit",
        role: "Operations",
        image: MohitImg,
        id: "04",
        quote: "Creativity without deadlines is just a dream."
    },
    {
        name: "Aayush M",
        role: "Strategy",
        image: AayushMImg,
        id: "05",
        quote: "The best strategy is usually the one you're avoiding."
    },
    {
        name: "Ayush T",
        role: "Production",
        image: AyushTImg,
        id: "06",
        quote: "We lie in pre-production, not post."
    },
    {
        name: "Manikanta",
        role: "Editor & Storyteller",
        image: ManiImg,
        id: "07",
        quote: "Every cut must advance the story."
    },
    {
        name: "Crea",
        role: "Operations Robot",
        image: CreaImg,
        id: "08",
        quote: "Optimizing for maximum Primehood."
    }
];

const TeamMemberCard = ({ member, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: '#111',
                aspectRatio: '3/4',
                cursor: 'pointer',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
                boxShadow: isHovered ? '0 0 20px rgba(255, 119, 1, 0.2)' : 'none',
                border: isHovered ? '1px solid rgba(255, 119, 1, 0.3)' : '1px solid rgba(255,255,255,0.1)'
            }}
        >
            {/* Image */}
            <div style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0
            }}>
                <img
                    src={member.image}
                    alt={member.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
                        transition: 'filter 0.4s ease-out'
                    }}
                />

                {/* Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                    zIndex: 1
                }} />
            </div>

            {/* Content */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '1.5rem',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
            }}>
                <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.25rem'
                }}>
                    Station #{member.id} // {member.role}
                </div>

                <h3 style={{
                    fontSize: '1.5rem',
                    color: '#fff',
                    fontFamily: 'var(--font-heading)',
                    marginBottom: isHovered ? '0.5rem' : '0',
                    transition: 'margin-bottom 0.4s ease-out'
                }}>
                    {member.name}
                </h3>

                {/* Quote Reveal */}
                <div style={{
                    height: isHovered ? 'auto' : '0',
                    opacity: isHovered ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.4s ease-out',
                    transform: isHovered ? 'translateY(0)' : 'translateY(10px)'
                }}>
                    <p style={{
                        fontSize: '0.9rem',
                        color: 'var(--color-orange)',
                        fontStyle: 'italic',
                        lineHeight: 1.4,
                        marginTop: '0.5rem'
                    }}>
                        "{member.quote}"
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const TeamKitchen = () => {
    return (
        <section className="section-padding" style={{ backgroundColor: 'transparent', position: 'relative' }}>
            <div className="container">
                {/* Header */}
                <div style={{ marginBottom: '4rem', maxWidth: '800px' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            fontSize: 'clamp(3rem, 6vw, 5rem)',
                            fontFamily: 'var(--font-heading)',
                            color: '#fff',
                            marginBottom: '1rem',
                            lineHeight: 0.9
                        }}
                    >
                        The Kitchen.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        style={{
                            fontSize: '1.25rem',
                            color: 'rgba(255,255,255,0.6)',
                            fontFamily: 'var(--font-heading)'
                        }}
                    >
                        Meet the team building your brand
                    </motion.p>
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '2rem'
                }}>
                    {TEAM_MEMBERS.map((member, index) => (
                        <TeamMemberCard key={member.id} member={member} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamKitchen;
