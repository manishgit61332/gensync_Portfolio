import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSectionColor } from '../context/ScrollColorContext';

// Helper: Linear Interpolation for Hex Colors
const lerpColor = (a, b, amount) => {
    const ah = parseInt(a.replace(/#/g, ''), 16),
        bh = parseInt(b.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

const SERVICES = [
    {
        id: 0,
        title: 'Web Experiences.',
        description: 'Immersive sites that convert.',
        bg: '#051408', // Deep Mint Void
        img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
        slug: 'web-experiences',
        color: '#E3FFEB'
    },
    {
        id: 1,
        title: 'Product Commercials.',
        description: 'High-octane visuals.',
        bg: '#1f0b00', // Deep Orange Void
        img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
        slug: 'product-commercials',
        color: '#FF7701'
    },
    {
        id: 2,
        title: 'Branding.',
        description: 'Identity systems that stick.',
        bg: '#1a0507', // Deep Maroon Void
        img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
        slug: 'branding',
        color: '#FF9F9F'
    },
    {
        id: 3,
        title: 'Social & Campaigns.',
        description: 'Content that spreads.',
        bg: '#140505', // Deep Red Void
        img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
        slug: 'social-campaigns',
        color: '#C27B7F'
    }
];

// Hook for media query
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);
    return matches;
};

const CaseStudies = () => {
    const containerRef = useRef(null);
    const scrollRef = useRef(null);
    const [scrollRange, setScrollRange] = useState(0);
    const navigate = useNavigate();
    const setGlobalTheme = useSectionColor();
    const isVisible = useRef(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Measure scroll width for accurate horizontal scrolling
    useEffect(() => {
        if (scrollRef.current) {
            const updateScrollRange = () => {
                if (isMobile) {
                    setScrollRange(0);
                    return;
                }
                const scrollWidth = scrollRef.current.scrollWidth;
                const viewportWidth = window.innerWidth;
                setScrollRange(-(scrollWidth - viewportWidth));
            };

            updateScrollRange();
            window.addEventListener('resize', updateScrollRange);
            return () => window.removeEventListener('resize', updateScrollRange);
        }
    }, [isMobile]);

    // Horizontal Scroll Transformation (Only valid on Desktop)
    // Uses the calculated pixel value instead of percentage for precision
    const x = useTransform(springScroll, [0, 1], ["0px", `${scrollRange}px`]);

    // BACKGROUND COLOR LOGIC
    useMotionValueEvent(springScroll, "change", (latest) => {
        if (!isVisible.current || latest > 0.99) {
            return;
        }

        const totalSteps = SERVICES.length;
        const stepSize = 1 / totalSteps;

        let activeIndex = Math.floor(latest / stepSize);
        if (activeIndex >= totalSteps) activeIndex = totalSteps - 1;

        const stepStart = activeIndex * stepSize;
        const linearProgress = (latest - stepStart) / stepSize;
        const localProgress = linearProgress;

        const currentColor = SERVICES[activeIndex].bg;
        const nextColor = (activeIndex < totalSteps - 1) ? SERVICES[activeIndex + 1].bg : currentColor;

        const blendedBgColor = lerpColor(currentColor, nextColor, localProgress);

        setGlobalTheme(blendedBgColor, '#FFFFFF', 0);
    });

    return (
        <motion.section
            onViewportEnter={() => isVisible.current = true}
            onViewportLeave={() => isVisible.current = false}
            ref={containerRef}
            id="work"
            // Mobile: Auto height, Desktop: 400vh for scroll distance
            style={{
                height: isMobile ? 'auto' : '400vh',
                position: 'relative',
                marginBottom: isMobile ? '4rem' : 0
            }}
        >
            <div style={{
                // Mobile: Normal flow, Desktop: Sticky
                position: isMobile ? 'relative' : 'sticky',
                top: 0,
                // Mobile: Auto height, Desktop: 100vh viewport
                height: isMobile ? 'auto' : '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                perspective: '1000px',
                paddingTop: isMobile ? '4rem' : 0
            }}>

                <h2 style={{
                    position: isMobile ? 'relative' : 'absolute',
                    top: isMobile ? 'auto' : '8vh',
                    left: isMobile ? 'auto' : '5vw',
                    marginBottom: isMobile ? '2rem' : 0,
                    paddingLeft: isMobile ? '5vw' : 0,
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1,
                    color: '#fff',
                    zIndex: 10,
                    mixBlendMode: 'difference'
                }}>
                    Selected Work.
                </h2>

                <motion.div
                    ref={scrollRef}
                    style={{
                        // Mobile: No transformation, Desktop: Horizontal scroll
                        x: isMobile ? 0 : x,
                        display: 'flex',
                        // Mobile: Vertical Column, Desktop: Horizontal Row
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '2rem' : '4vw',
                        paddingLeft: '5vw',
                        paddingRight: '5vw',
                        alignItems: isMobile ? 'stretch' : 'center',
                        // Mobile: Auto height, Desktop: 100% to fill updated viewport
                        height: isMobile ? 'auto' : '100%',
                        willChange: isMobile ? 'auto' : 'transform'
                    }}>
                    {SERVICES.map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            navigate={navigate}
                            globalProgress={springScroll}
                            isMobile={isMobile}
                        />
                    ))}
                </motion.div>

                {/* Mobile Scroll Hint - Only show on Desktop */}
                {!isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        style={{ position: 'absolute', bottom: '3rem', right: '5vw', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Scroll <ArrowUpRight size={16} style={{ transform: 'rotate(45deg)' }} />
                    </motion.div>
                )}

            </div>
        </motion.section>
    );
};

const ServiceCard = ({ service, navigate, globalProgress, isMobile }) => {
    // Parallax Logic: shift bg x based on global progress
    // Updated: Centered range [-10%, 10%] to prevent clipping, coupled with scale 1.25.
    const parallaxX = useTransform(globalProgress, [0, 1], ["-10%", "10%"]);

    // Framer Motion Variants for smooth hover
    const variants = {
        initial: { scale: 1.25, filter: 'brightness(0.6) saturate(0.8)' },
        hover: { scale: 1.35, filter: 'brightness(0.8) saturate(1.1)' } // Slightly larger scale on hover
    };

    return (
        <motion.div
            onClick={() => navigate(`/service/${service.slug}`)}
            initial="initial"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            style={{
                width: isMobile ? '100%' : '80vw',
                maxWidth: '600px',
                height: isMobile ? '50vh' : '70vh',
                maxHeight: '600px',
                flexShrink: 0,
                position: 'relative',
                borderRadius: '32px',
                overflow: 'hidden',
                backgroundColor: 'rgba(20,20,20,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}
        >
            {/* Image Background with Parallax */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <motion.div
                    style={{
                        position: 'absolute',
                        inset: '-10%',
                        backgroundImage: `url(${service.img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        // On mobile, we might want to disable parallaxX if it feels weird, but let's keep it subtle or disable.
                        // Ideally, vertical parallax is better for mobile. 
                        // For now, let's just keep horizontal parallax disabled on Mobile or use a fixed value.
                        x: isMobile ? 0 : parallaxX,
                        willChange: 'transform' // Performance optimization
                    }}
                    variants={variants}
                    transition={{ duration: 0.4, ease: "easeOut" }} // Smooth transition
                    className="card-bg"
                />
            </div>

            {/* Gradient Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%)', pointerEvents: 'none' }} />

            {/* Content */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: isMobile ? '1.5rem' : '3rem', boxSizing: 'border-box', pointerEvents: 'none' }}>
                <span style={{
                    display: 'inline-block',
                    marginBottom: '1rem',
                    color: service.color,
                    border: `1px solid ${service.color}`,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>
                    0{service.id + 1}
                </span>

                <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: isMobile ? '2rem' : '3rem',
                    color: '#fff',
                    margin: '0 0 0.5rem 0',
                    lineHeight: 1
                }}>
                    {service.title}
                </h3>

                <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    color: 'rgba(255,255,255,0.7)',
                    maxWidth: '80%',
                    marginBottom: '2rem'
                }}>
                    {service.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>
                    View Case Study <ArrowUpRight size={18} />
                </div>
            </div>
        </motion.div>
    );
};

export default CaseStudies;
