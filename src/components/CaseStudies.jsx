import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, ArrowRight, Play } from 'lucide-react';
import { useSectionColor } from '../context/ScrollColorContext';
import { WORK_FOLDERS } from '../data/workData';

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
    const scrollContentRef = useRef(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const setGlobalTheme = useSectionColor();
    const isVisible = useRef(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const scrollEndPxRef = useRef(0);

    // Dynamically compute how far to scroll based on content width vs viewport
    useEffect(() => {
        const measure = () => {
            if (scrollContentRef.current && !isMobile) {
                const contentWidth = scrollContentRef.current.scrollWidth;
                const viewportWidth = window.innerWidth;
                // How many pixels we need to shift left so the last card is fully visible
                const overflow = contentWidth - viewportWidth;
                scrollEndPxRef.current = overflow > 0 ? -overflow : 0;
            }
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [isMobile]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Softer, heavier spring for "very sticky" ease-in-ease-out feel
    const springScroll = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

    // Horizontal Scroll Transformation — pixel-based, reactive to resize
    const x = useTransform(springScroll, (v) => v * scrollEndPxRef.current);

    // BACKGROUND COLOR LOGIC
    useMotionValueEvent(springScroll, "change", (latest) => {
        if (!isVisible.current || latest > 0.99 || selectedFolder) {
            return;
        }

        const totalSteps = WORK_FOLDERS.length;
        const stepSize = 1 / totalSteps;

        let activeIndex = Math.floor(latest / stepSize);
        if (activeIndex >= totalSteps) activeIndex = totalSteps - 1;

        const stepStart = activeIndex * stepSize;
        const linearProgress = (latest - stepStart) / stepSize;
        const localProgress = linearProgress;

        const currentColor = WORK_FOLDERS[activeIndex].bg;
        const nextColor = (activeIndex < totalSteps - 1) ? WORK_FOLDERS[activeIndex + 1].bg : currentColor;

        const blendedBgColor = lerpColor(currentColor, nextColor, localProgress);

        setGlobalTheme(blendedBgColor, '#FFFFFF', 0);
    });

    // Reset theme when closing
    useEffect(() => {
        if (!selectedFolder) {
            // Re-trigger scroll logic or default to start color
            setGlobalTheme(WORK_FOLDERS[0].bg, '#FFFFFF', 0);
        }
    }, [selectedFolder, setGlobalTheme]);


    return (
        <motion.section
            onViewportEnter={() => isVisible.current = true}
            onViewportLeave={() => isVisible.current = false}
            ref={containerRef}
            id="work"
            style={{
                height: isMobile ? 'auto' : '500vh',
                position: 'relative',
                marginBottom: isMobile ? '4rem' : 0
            }}
        >
            <div style={{
                position: isMobile ? 'relative' : 'sticky',
                top: 0,
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

                <motion.div ref={scrollContentRef} style={{
                    x: isMobile ? 0 : x,
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '2rem' : '4vw',
                    paddingLeft: '5vw',
                    paddingRight: isMobile ? '5vw' : 'calc(100vw - 600px - 5vw)',
                    alignItems: isMobile ? 'stretch' : 'center',
                    height: isMobile ? 'auto' : '100%',
                    willChange: isMobile ? 'auto' : 'transform'
                }}>
                    {WORK_FOLDERS.map((folder, index) => (
                        <ServiceCard
                            key={folder.id}
                            folder={folder}
                            onClick={() => setSelectedFolder(folder)}
                            globalProgress={springScroll}
                            isMobile={isMobile}
                            index={index}
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

            {/* FOLDER OVERLAY */}
            <AnimatePresence>
                {selectedFolder && (
                    <FolderDetailView
                        folder={selectedFolder}
                        onClose={() => setSelectedFolder(null)}
                    />
                )}
            </AnimatePresence>
        </motion.section>
    );
};

const ServiceCard = ({ folder, onClick, globalProgress, isMobile, index }) => {
    // Parallax Logic
    const parallaxX = useTransform(globalProgress, [0, 1], ["-10%", "10%"]);

    const variants = {
        initial: { scale: 1.25, filter: 'brightness(0.6) saturate(0.8)' },
        hover: { scale: 1.35, filter: 'brightness(0.8) saturate(1.1)' }
    };

    return (
        <motion.div
            onClick={() => {
                if (folder.comingSoon) return;
                onClick();
            }}
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
            {/* Image Background */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <motion.div
                    style={{
                        position: 'absolute',
                        inset: '-10%',
                        backgroundImage: `url(${folder.img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        x: isMobile ? 0 : parallaxX,
                        willChange: 'transform'
                    }}
                    variants={variants}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />
            </div>

            {/* Gradient Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%)', pointerEvents: 'none' }} />

            {/* Content */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: isMobile ? '1.5rem' : '3rem', boxSizing: 'border-box', pointerEvents: 'none' }}>
                <span style={{
                    display: 'inline-block',
                    marginBottom: '1rem',
                    color: folder.color,
                    border: `1px solid ${folder.color}`,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>
                    0{index + 1}
                </span>

                <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: isMobile ? '2rem' : '3rem',
                    color: '#fff',
                    margin: '0 0 0.5rem 0',
                    lineHeight: 1
                }}>
                    {folder.subtitle}
                </h3>

                <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    color: 'rgba(255,255,255,0.7)',
                    maxWidth: '80%',
                    marginBottom: '2rem'
                }}>
                    {folder.title}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: folder.comingSoon ? folder.color : '#fff', fontSize: '0.9rem', fontWeight: 500 }}>
                    {/* Logic is handled in onClick, just text change here if needed, but for now standard "Open Folder" or we can make it dynamic */}
                    {folder.comingSoon ? "Coming Soon" : "Open Folder"} {!folder.comingSoon && <ArrowRight size={18} />}
                </div>
            </div>
        </motion.div>
    );
};

const FolderDetailView = ({ folder, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        window.lenis?.stop();
        return () => {
            document.body.style.overflow = 'unset';
            window.lenis?.start();
        };
    }, []);

    return (
        <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                backgroundColor: '#050505',
                overflowY: 'auto'
            }}
        >
            {/* Header / Nav */}
            <div style={{
                padding: '2rem 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                background: 'rgba(5,5,5,0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 10,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div>
                    <div style={{ fontSize: '0.9rem', color: folder.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Folder</div>
                    <h2 style={{ fontSize: '1.5rem', color: '#fff', fontFamily: 'var(--font-heading)' }}>{folder.title}</h2>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: '#fff',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content Container */}
            <div className="container" style={{ padding: '4rem 0' }}>

                {/* Intro */}
                <div style={{ maxWidth: '800px', marginBottom: '4rem' }}>
                    <h3 style={{ fontSize: '2rem', color: '#fff', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>
                        {folder.details}
                    </h3>
                </div>

                {/* Projects Grid */}
                <h4 style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem', fontSize: '0.9rem' }}>Inside this folder</h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: folder.projects.some(p => p.isShort)
                        ? 'repeat(auto-fill, minmax(200px, 1fr))'
                        : 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    marginBottom: '4rem'
                }}>
                    {folder.projects.map((project, idx) => (
                        <ProjectCard key={idx} project={project} folderColor={folder.color} />
                    ))}
                </div>

                {/* More Work List (Text Links) */}
                {folder.moreWork && (
                    <div style={{ marginBottom: '4rem' }}>
                        <h4 style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', fontSize: '0.9rem' }}>More Selected Work</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {folder.moreWork.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1.25rem',
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                    }}
                                >
                                    <div>
                                        <div style={{ color: '#fff', fontWeight: 500, fontSize: '1rem', marginBottom: '0.1rem' }}>{item.title}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{item.type}</div>
                                    </div>
                                    <ArrowUpRight size={18} color={folder.color} />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Testimonials */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '24px',
                    padding: '3rem',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <h4 style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem', fontSize: '0.9rem' }}>Context</h4>
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {folder.testimonials.map((t, i) => (
                            <div key={i}>
                                <p style={{ fontSize: '1.5rem', color: '#fff', fontFamily: 'var(--font-heading)', lineHeight: 1.4, marginBottom: '1rem' }}>
                                    "{t.quote}"
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ color: '#fff', fontWeight: 600 }}>{t.author}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>— {t.role}</span>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                {/* Book a Call CTA */}
                <div style={{
                    marginTop: '3rem',
                    padding: '3rem',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                    border: '1px solid rgba(255,255,255,0.06)',
                    textAlign: 'center'
                }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        This is just a taste
                    </p>
                    <h3 style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '2rem' }}>
                        Book a call to view more.
                    </h3>
                    <a
                        href="https://calendly.com/manish-gensync/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            onClose();
                        }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '1rem 2.5rem',
                            borderRadius: '100px',
                            background: folder.color,
                            color: '#000',
                            fontWeight: 600,
                            fontSize: '1rem',
                            textDecoration: 'none',
                            transition: 'transform 0.3s ease, opacity 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        Book a Call <ArrowRight size={18} />
                    </a>
                </div>

            </div>
        </motion.div>
    );
};

const ProjectCard = ({ project, folderColor }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const isShort = project.isShort;
    const hasEmbed = !!(project.youtubeId || project.driveId || project.instagramId);

    const thumbnailUrl = project.youtubeId
        ? `https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`
        : project.img || null;

    const embedUrl = project.youtubeId
        ? `https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1`
        : project.driveId
            ? `https://drive.google.com/file/d/${project.driveId}/preview`
            : project.instagramId
                ? `https://www.instagram.com/reel/${project.instagramId}/embed`
                : null;

    return (
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    aspectRatio: isShort ? '9/16' : '16/9',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    backgroundColor: '#111',
                    position: 'relative',
                    cursor: hasEmbed && !isPlaying ? 'pointer' : 'default'
                }}
                onClick={() => hasEmbed && !isPlaying && setIsPlaying(true)}
            >
                {isPlaying && embedUrl ? (
                    <iframe
                        src={embedUrl}
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={project.title}
                    />
                ) : (
                    <>
                        {thumbnailUrl ? (
                            <img
                                src={thumbnailUrl}
                                alt={project.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{
                                width: '100%', height: '100%',
                                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {project.title}
                                </span>
                            </div>
                        )}
                        {hasEmbed && (
                            <div
                                style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(0,0,0,0.35)',
                                    transition: 'background 0.3s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
                            >
                                <div style={{
                                    width: '60px', height: '60px',
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.12)',
                                    backdropFilter: 'blur(12px)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <Play size={22} fill="#fff" color="#fff" />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{project.title}</h4>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{project.type}</p>
            {project.pdf && (
                <a
                    href={project.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.8rem',
                        color: folderColor,
                        textDecoration: 'none',
                        border: `1px solid ${folderColor}`,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        transition: 'all 0.3s ease',
                        marginRight: '0.5rem',
                        marginBottom: '0.5rem'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = folderColor;
                        e.currentTarget.style.color = '#000';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = folderColor;
                    }}
                >
                    Case Study <ArrowUpRight size={14} />
                </a>
            )}
            {project.link && (
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.8rem',
                        color: '#fff',
                        textDecoration: 'none',
                        border: `1px solid rgba(255,255,255,0.3)`,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.color = '#000';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#fff';
                    }}
                >
                    Visit Live Site <ArrowUpRight size={14} />
                </a>
            )}
        </div>
    );
};

export default CaseStudies;
