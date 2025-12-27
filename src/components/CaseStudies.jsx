import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
    {
        id: 0,
        title: 'Web Experiences.',
        description: 'Immersive sites that convert.',
        bg: '#111',
        img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
        slug: 'web-experiences',
        color: '#E3FFEB' // Mint
    },
    {
        id: 1,
        title: 'Product Commercials.',
        description: 'High-octane visuals.',
        bg: '#1a1a1a',
        img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
        slug: 'product-commercials',
        color: '#FF7701' // Orange
    },
    {
        id: 2,
        title: 'Branding.',
        description: 'Identity systems that stick.',
        bg: '#222',
        img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
        slug: 'branding',
        color: '#FF9F9F' // Pink
    },
    {
        id: 3,
        title: 'Social & Campaigns.',
        description: 'Content that spreads.',
        bg: '#2a2a2a',
        img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
        slug: 'social-campaigns',
        color: '#C27B7F'
    }
];

const CaseStudies = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();

    // 1. SCROLL PHYSICS ENGINE
    // We bind the entire 400vh scroll range to a normalized index
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Map scroll (0 to 1) to Service Index (-1 to 4)
    // Starts negative so the "wave" enters from the right
    const scrollIndex = useTransform(scrollYProgress, [0, 1], [-1, SERVICES.length - 1]);
    const smoothIndex = useSpring(scrollIndex, { stiffness: 150, damping: 20 });

    return (
        <section ref={containerRef} style={{ height: '400vh', position: 'relative', backgroundColor: '#050505' }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* HEADLINE */}
                <div className="container" style={{ paddingTop: '4rem', paddingBottom: '2rem', flexShrink: 0 }}>
                    <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontFamily: 'var(--font-heading)', lineHeight: 0.9 }}>
                        Services.
                    </h2>
                    <p style={{ opacity: 0.6, marginTop: '1rem', maxWidth: '400px' }}>
                        We don't sell hours. We sell outcomes. <br />
                        Scroll to explore.
                    </p>
                </div>

                {/* THE ROPE WAVE (Desktop) */}
                <div className="rope-container" style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%', paddingLeft: '5vw' }}>
                    {SERVICES.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            rawIndex={smoothIndex}
                            navigate={navigate}
                        />
                    ))}
                </div>

                {/* MOBILE FALLBACK (CSS Handles toggling) */}
                <div className="mobile-list" style={{ display: 'none', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                    {SERVICES.map(s => (
                        <div key={s.id} onClick={() => navigate(`/service/${s.slug}`)} style={{ padding: '2rem', backgroundColor: '#111', borderRadius: '12px', borderLeft: `4px solid ${s.color}` }}>
                            <h3 style={{ fontSize: '1.5rem' }}>{s.title}</h3>
                            <p style={{ opacity: 0.7 }}>{s.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 1024px) {
                    .rope-container { display: none !important; }
                    .mobile-list { display: flex !important; }
                    section { height: auto !important; }
                }
            `}</style>
        </section>
    );
};

const ServiceCard = ({ service, rawIndex, navigate }) => {

    // GAUSSIAN WAVE PHYSICS
    // Calculates Width based on distance from the current "Active" Scroll Index
    const widthPercent = useTransform(rawIndex, (idx) => {
        const dist = Math.abs(idx - service.id);
        const sigma = 1.2; // Width of the "wave"
        const maxW = 50;   // Max width % (Active)
        const minW = 10;   // Min width % (Inactive)

        // Gaussian Formula
        const weight = Math.exp(-(dist * dist) / (2 * sigma * sigma));
        return minW + (maxW - minW) * weight;
    });

    const heightPercent = useTransform(widthPercent, [10, 50], [60, 90]);
    const brightness = useTransform(widthPercent, [10, 50], [0.3, 1]);
    const activeScale = useTransform(widthPercent, [10, 50], [0.95, 1]);
    const textOpacity = useTransform(widthPercent, [20, 50], [0, 1]); // Only show text when wide
    const verticalTextOpacity = useTransform(widthPercent, [20, 40], [1, 0]); // Hide vertical text when wide

    return (
        <motion.div
            onClick={() => navigate(`/service/${service.slug}`)}
            style={{
                width: useTransform(widthPercent, w => `${w}%`),
                height: useTransform(heightPercent, h => `${h}%`),
                filter: useTransform(brightness, b => `brightness(${b})`),
                scale: activeScale,
                backgroundColor: service.bg,
                backgroundImage: `url(${service.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '24px',
                marginRight: '20px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: `1px solid rgba(255,255,255,0.1)`
            }}
        >
            {/* Gradient Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)' }} />

            {/* EXPANDED CONTENT */}
            <motion.div style={{ position: 'absolute', bottom: '3rem', left: '3rem', opacity: textOpacity, zIndex: 10 }}>
                <span style={{ color: service.color, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>0{service.id + 1}</span>
                <h3 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', lineHeight: 1, margin: '1rem 0' }}>{service.title}</h3>
                <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '300px' }}>{service.description}</p>
                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: service.color }}>
                    Explore <ArrowUpRight size={20} />
                </div>
            </motion.div>

            {/* COLLAPSED CONTENT (Vertical Type) */}
            <motion.div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: verticalTextOpacity
            }}>
                <h3 style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    fontSize: '2rem',
                    fontFamily: 'var(--font-heading)',
                    whiteSpace: 'nowrap',
                    letterSpacing: '2px',
                    opacity: 0.6
                }}>
                    {service.title}
                </h3>
            </motion.div>

        </motion.div>
    );
};

export default CaseStudies;
