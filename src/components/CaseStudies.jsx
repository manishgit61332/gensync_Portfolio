import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const projects = [
    {
        id: 0,
        title: 'Project Alpha',
        category: 'Fintech',
        color: '#C27B7F',
        img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
        link: '#',
        problem: 'A Series-A fintech struggled to communicate its mission to investors.',
        move: 'Complete narrative workshop & rebranding.',
        shift: 'Raised $4M, reached 20k waitlist users.'
    },
    {
        id: 1,
        title: 'Nebula AI',
        category: 'SaaS',
        color: '#7B8FC2',
        img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
        link: '#',
        problem: 'Powerful AI tool looked like another generic wrapper.',
        move: 'High-contrast "Dark Mode" identity & viral launch video.',
        shift: '1.2M views on X, 500+ paying users in month 1.'
    },
    {
        id: 2,
        title: 'Velvet',
        category: 'Consumer',
        color: '#C2A87B',
        img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
        link: '#',
        problem: 'Luxury brand felt inaccessible to Gen Z.',
        move: 'TikTok-first content strategy & "Drop" mechanic.',
        shift: 'Sold out 3 consecutive drops in <10 mins.'
    },
    {
        id: 3,
        title: 'Nexus',
        category: 'Infrastructure',
        color: '#7BC29D',
        img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
        link: '#',
        problem: 'Complex dev-tooling was confusing non-technical stakeholders.',
        move: 'Simplified 3D interactive visualizations.',
        shift: 'Sales cycle reduced by 40%.'
    }
];

const CaseStudies = () => {

    // 1. TALLER SECTION = CONTROLLED SCROLL (400vh)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // 2. SMOOTH RAW INDEX (Starts at -2 so the wave "enters" the screen)
    const scrollIndex = useTransform(scrollYProgress, [0, 1], [-2, projects.length - 1]);
    const smoothIndex = useSpring(scrollIndex, { stiffness: 120, damping: 25, mass: 1 });

    // Desktop Accordion Item (Reactive)
    const AccordionItem = ({ project, rawIndex }) => {

        // 3. FLUID "ROPE-WAVE" PHYSICS (Normalized Gaussian)
        // No if/else steps. Pure smooth math.
        const widthPercent = useTransform(rawIndex, (idx) => {
            // Calculate weights for ALL items first
            const weights = projects.map((p) => {
                const dist = Math.abs(idx - p.id);
                // Gaussian Curve:
                // Base weight (min width) = 15
                // Peak amplitude (max expansion) = 80
                // Sigma (width of influence) = 2.0
                const sigma = 1.2;
                const weight = 8 + 60 * Math.exp(-(dist * dist) / (2 * sigma * sigma));
                return weight;
            });

            // Calculate total weight for normalization
            const totalWeight = weights.reduce((acc, w) => acc + w, 0);

            // Get THIS item's normalized %
            const myWeight = weights[project.id];
            return (myWeight / totalWeight) * 100;
        });

        // Smooth derived values based on width %
        const borderRadius = useTransform(widthPercent, [5, 30], [4, 32]);
        const scaleValue = useTransform(widthPercent, [5, 40], [0.95, 1]);

        // Elevation & Depth (User Request)
        // Elevation & Depth (Exaggerated per User Request)
        // Widened curve [5, 45] ensures neighbors lift too, creating a "Wave" shape.
        const yTranslation = useTransform(widthPercent, [5, 45], [0, -80]);
        const cardShadow = useTransform(widthPercent, [5, 45], [
            "0 10px 30px rgba(0,0,0,0.3)",  // Spines have subtle shadow
            "0 100px 200px rgba(0,0,0,0.9)" // Active has massive depth
        ]);



        // Convert percentage to CSS string
        const widthString = useTransform(widthPercent, (w) => `${w}%`);

        // Content Reveal based on width - Overlapped to prevent empty state
        const textOpacity = useTransform(widthPercent, [12, 25], [1, 0]);
        const contentOpacity = useTransform(widthPercent, [20, 40], [0, 1]);

        return (
            <motion.div
                style={{
                    backgroundColor: project.color,
                    backgroundImage: `url(${project.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#fff',
                    height: '650px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: cardShadow,
                    y: yTranslation,
                    zIndex: 10,

                    // EXPLICIT WIDTH SYSTEM (No Flex)
                    width: widthString,
                    flexShrink: 0,
                    flexGrow: 0,
                    borderRadius: borderRadius,
                    marginRight: 0,
                    marginLeft: 0,
                    scale: scaleValue,
                    willChange: 'width, border-radius',
                    transformOrigin: 'center center',
                }}
            >
                {/* Dark Gradient Overlay for Readability */}
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${project.color}DD 0%, rgba(0,0,0,0.6) 100%)`, mixBlendMode: 'multiply' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)', zIndex: 1 }} />

                {/* 1. COLLAPSED STATE: Vertical Text */}
                <motion.div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2rem',
                        opacity: textOpacity,
                        pointerEvents: 'none',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    }}
                >
                    <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, fontSize: '1rem' }}>
                        {project.category}
                    </span>
                    <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'var(--font-heading)', fontSize: '2.5rem', whiteSpace: 'nowrap' }}>
                        {project.title}
                    </span>
                </motion.div>

                {/* 2. EXPANDED STATE: Full Content (On Top of Color) */}
                <motion.div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: contentOpacity,
                        zIndex: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '3rem',
                        justifyContent: 'space-between',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff' }} />
                            <span style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, fontSize: '0.9rem' }}>
                                {project.category}
                            </span>
                        </div>
                        {/* Make the whole card clickable? User said "make the buttons work". The arrow button is best. */}
                        <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                            style={{
                                padding: '0.8rem',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            <ArrowUpRight size={28} />
                        </motion.a>
                    </div>



                    <div>
                        <h3 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', lineHeight: 0.9, marginBottom: '1rem' }}>
                            {project.title}
                        </h3>
                        <p style={{ opacity: 0.9, maxWidth: '500px', fontSize: '1.2rem', lineHeight: 1.4 }}>
                            Engineered for dominance. Rebuilt stacks for market capture.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    return (
        <section id="work" ref={containerRef} style={{ height: '400vh', position: 'relative', backgroundColor: 'var(--color-black)', color: 'var(--color-white)' }}>

            <div className="sticky-wrapper" style={{ position: 'sticky', top: 0, height: '100vh', display: 'block', overflow: 'hidden', padding: '0 2rem', paddingTop: '10rem' }}>

                <h2 style={{ marginBottom: '4rem', fontSize: '3rem', paddingLeft: '1rem', position: 'relative', zIndex: 30 }}>Our Work.</h2>

                {/* DESKTOP: SCROLL-DRIVEN ACCORDION - FULL WIDTH */}
                <div className="desktop-accordion" style={{ display: 'flex', height: '700px', width: '100%', gap: '0' }}>
                    {projects.map((project) => (
                        <AccordionItem
                            key={project.id}
                            project={project}
                            rawIndex={smoothIndex}
                        />
                    ))}
                </div>

                {/* MOBILE: HORIZONTAL SCROLL */}
                <div className="mobile-scroll" style={{ display: 'none', gap: '1rem', overflowX: 'auto', paddingBottom: '2rem' }}>
                    {projects.map((project) => (
                        <div key={project.id} style={{ flex: '0 0 280px', height: '380px', backgroundColor: project.color, color: project.text || '#fff', borderRadius: '16px', padding: '2rem' }}>
                            <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600 }}>{project.category}</span>
                            <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>{project.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 1024px) {
                    .desktop-accordion { display: none !important; }
                    .mobile-scroll { display: flex !important; }
                    section { height: auto !important; }
                    .sticky-wrapper { height: auto !important; position: static !important; display: block !important; padding: 4rem 0 !important; }
                }
            `}</style>
        </section>
    );
};

export default CaseStudies;
