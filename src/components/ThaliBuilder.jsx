import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { Plus, X, Utensils, Info, Layout, PenTool, Video, Laptop, Megaphone, Smartphone, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import { useSectionColor } from '../context/ScrollColorContext';

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

// Services Data (Unchanged)
const SERVICES = [
    // Staples
    { id: 'web-design', category: 'Staples', name: 'Website Design', price: 1200, time: 21, desc: 'High-converting, premium aesthetic.', icon: <Layout size={20} />, previewColor: '#D4AF37', previewText: 'Minimalist Layouts', textColor: '#000' },
    { id: 'brand-id', category: 'Staples', name: 'Brand Identity', price: 800, time: 14, desc: 'Logo, colors, typography system.', icon: <PenTool size={20} />, previewColor: '#8B4513', previewText: 'Bold Typography', textColor: '#fff' },
    { id: 'rebranding', category: 'Staples', name: 'Rebranding', price: 1800, time: 30, desc: 'Complete visual overhaul.', icon: <RefreshCw size={20} />, previewColor: '#0a1f0a', previewText: 'Fresh Start', textColor: '#fff' },

    // Content (Flavour)
    { id: 'linkedin', category: 'Flavour', name: 'LinkedIn Content', price: 600, time: 0, desc: 'Thought leadership ghostwriting (Monthly).', icon: <Laptop size={20} />, previewColor: '#D4AF37', previewText: 'Viral Threads', textColor: '#000' },
    { id: 'video-edit', category: 'Flavour', name: 'Video Editing', price: 800, time: 0, desc: 'Short-form reels & edits (Monthly).', icon: <Video size={20} />, previewColor: '#C5A028', previewText: 'Dynamic Cuts', textColor: '#000' },
    { id: 'commercials', category: 'Flavour', name: 'AI Commercials', price: 600, time: 7, desc: 'Hyper-realistic product films.', icon: <Megaphone size={20} />, previewColor: '#333', previewText: 'Cinematic AI', textColor: '#fff' },

    // Mobile/Scale (Power)
    { id: 'app-design', category: 'Power', name: 'Mobile App Design', price: 2200, time: 30, desc: 'UI/UX that feels native.', icon: <Smartphone size={20} />, previewColor: '#D4AF37', previewText: 'Smooth UX', textColor: '#000' },
];

// --- 3D Tilt Card Component ---
const TiltCard = ({ children, isSelected, onClick, isMobile }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 30 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e) => {
        if (isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        if (isMobile) return;
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                rotateX: isMobile ? 0 : rotateX,
                rotateY: isMobile ? 0 : rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000,
                // On mobile, ensure it feels tappable
                touchAction: 'manipulation'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            whileHover={!isMobile ? { scale: 1.02, zIndex: 10 } : {}}
            whileTap={{ scale: 0.98 }}
            className="tilt-card-wrapper"
        >
            <div style={{ transform: isMobile ? "none" : "translateZ(20px)" }}>
                {children}
            </div>
            {/* Shimmer Effect on Select */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: "200%", opacity: [0, 0.5, 0] }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, width: '50%', height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)',
                            transform: 'skewX(-20deg)',
                            pointerEvents: 'none',
                            zIndex: 20
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Animated Counter for Price ---
const AnimatedPrice = ({ value }) => {
    return (
        <motion.span
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            ${value.toLocaleString()}
        </motion.span>
    );
};

const ThaliBuilder = () => {
    const navigate = useNavigate();
    const setGlobalTheme = useSectionColor();
    const [selectedIds, setSelectedIds] = useState([]);
    const isMobile = useMediaQuery('(max-width: 900px)');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleService = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const { totalBudget, totalTime } = useMemo(() => {
        const selected = SERVICES.filter(s => selectedIds.includes(s.id));
        return {
            totalBudget: selected.reduce((sum, s) => sum + s.price, 0),
            totalTime: Math.max(0, ...selected.map(s => s.time)) + (selected.length > 0 ? 3 : 0)
        };
    }, [selectedIds]);

    // Use filtering logic for Link state also
    const selectedServicesList = useMemo(() => SERVICES.filter(s => selectedIds.includes(s.id)), [selectedIds]);


    return (
        <motion.section
            onViewportEnter={() => setGlobalTheme('#0a1f0a', '#FFFFFF', 1.5)}
            viewport={{ margin: "-10% 0px -10% 0px" }}
            id="thali"
            className="section-padding"
            style={{
                background: 'transparent',
                color: 'var(--color-white)',
                position: 'relative',
                paddingTop: 'var(--spacing-xl)',
                // Add padding bottom on mobile to account for sticky bar
                paddingBottom: isMobile ? '180px' : 'var(--spacing-xl)',
                borderTop: 'none'
            }}>

            <div className="container">
                <h2 className="text-center text-lg" style={{ marginBottom: 'var(--spacing-sm)', color: '#D4AF37', fontFamily: 'var(--font-heading)', fontWeight: 500 }}>Build Your Thali.</h2>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        color: '#D4AF37', fontSize: '0.9rem', opacity: 0.9,
                        backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.5rem 1rem', borderRadius: '50px',
                        textAlign: 'center'
                    }}>
                        <Info size={16} style={{ flexShrink: 0 }} />
                        <span>A <strong>Thali</strong> is a custom platter of services. Pick exactly what you need.</span>
                    </div>
                </div>

                <div style={{
                    // Desktop: Grid with sidebar. Mobile: Single column.
                    display: isMobile ? 'block' : 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) 380px',
                    gap: 'var(--spacing-md)',
                    alignItems: 'start'
                }}>

                    {/* Menu Grid */}
                    <div style={{
                        display: 'grid',
                        // Responsive card sizing
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        alignContent: 'start'
                    }}>
                        {SERVICES.map(service => {
                            const isSelected = selectedIds.includes(service.id);
                            return (
                                <TiltCard key={service.id} isSelected={isSelected} onClick={() => toggleService(service.id)} isMobile={isMobile}>
                                    <div style={{
                                        padding: '1.5rem',
                                        borderRadius: '16px',
                                        border: isSelected ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.05)',
                                        boxShadow: isSelected ? '0 0 15px rgba(212,175,55,0.3)' : 'none',
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? 'rgba(10, 31, 10, 0.9)' : 'rgba(255,255,255,0.03)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        height: '100%'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div style={{
                                                width: '44px', height: '44px',
                                                backgroundColor: isSelected ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                                                color: isSelected ? '#0a1f0a' : '#D4AF37',
                                                borderRadius: '12px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                {service.icon}
                                            </div>
                                            <motion.div
                                                animate={{ rotate: isSelected ? 45 : 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            >
                                                {isSelected ? <X size={20} color="#D4AF37" /> : <Plus size={20} color="#666" />}
                                            </motion.div>
                                        </div>

                                        <div>
                                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>{service.category}</span>
                                            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: isSelected ? '#D4AF37' : '#fff' }}>{service.name}</h4>
                                            <p style={{ fontSize: '0.9rem', opacity: 0.7, color: '#ccc', lineHeight: '1.4' }}>{service.desc}</p>
                                        </div>

                                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: '#D4AF37', fontWeight: '500' }}>${service.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </TiltCard>
                            );
                        })}
                    </div>

                    {/* Desktop: Sidebar Receipt */}
                    {!isMobile && (
                        <div className="desktop-preview-panel" style={{ position: 'sticky', top: '100px', zIndex: 900 }}>
                            <ReceiptPanel
                                selectedIds={selectedIds}
                                totalBudget={totalBudget}
                                totalTime={totalTime}
                                selectedServices={selectedServicesList} // Pass pre-calculated list
                            />
                        </div>
                    )}

                </div>
            </div>

            {/* Mobile: Sticky Bottom Bar - Only show when items are selected */}
            {isMobile && totalBudget > 0 && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#111',
                        borderTop: '1px solid rgba(212, 175, 55, 0.3)',
                        padding: '1rem',
                        zIndex: 1000,
                        boxShadow: '0 -10px 30px rgba(0,0,0,0.8)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', marginRight: '0.5rem' }}>Total</span>
                            <span style={{ fontSize: '1.5rem', color: '#D4AF37', fontWeight: 'bold' }}>
                                <AnimatedPrice value={totalBudget} />
                            </span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                            ~{totalTime} Days
                        </div>
                    </div>

                    {/* Mobile Button Link */}
                    <button
                        onClick={() => navigate('/checkout', { state: { selectedServices: selectedServicesList, totalBudget } })}
                        style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'center',
                            backgroundColor: '#D4AF37',
                            color: '#000',
                            padding: '1rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            userSelect: 'none',
                            position: 'relative',
                            zIndex: 100000,
                            border: 'none',
                            outline: 'none'
                        }}
                    >
                        Book This Thali
                    </button>
                </motion.div>
            )}

        </motion.section>
    );
};

// Extracted for cleanliness
const ReceiptPanel = ({ selectedIds, totalBudget, totalTime, selectedServices }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                backgroundColor: 'rgba(20, 20, 20, 0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                color: '#fff',
                padding: '2rem',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
            {/* Glass Reflection */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(212,175,55,0.1)' }}>
                    <Utensils size={20} color="#D4AF37" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', margin: 0 }}>Your Plate</h3>
            </div>

            <div style={{ minHeight: '150px', marginBottom: '2rem' }}>
                <AnimatePresence mode="popLayout" initial={false}>
                    {selectedIds.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{
                                height: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px', color: '#666'
                            }}
                        >
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Your plate is empty</p>
                        </motion.div>
                    )}
                    {SERVICES.filter(s => selectedIds.includes(s.id)).map(s => (
                        <motion.div
                            key={s.id}
                            layout
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                                marginBottom: '0.5rem'
                            }}
                        >
                            <span style={{ fontSize: '0.95rem' }}>{s.name}</span>
                            <span style={{ color: '#D4AF37', fontWeight: '500' }}>${s.price.toLocaleString()}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div style={{ paddingTop: '1.5rem', borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.2rem', alignItems: 'center' }}>
                    <span style={{ opacity: 0.8 }}>Total</span>
                    <strong style={{ fontSize: '1.5rem', color: '#D4AF37' }}>
                        <AnimatedPrice value={totalBudget} />
                    </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', opacity: 0.6 }}>
                    <span>Est. Timeline</span>
                    <span>~{totalTime} Days</span>
                </div>
            </div>

            {/* Configurable Button/Link based on status */}
            {/* Configurable Button/Link based on status */}
            {totalBudget > 0 ? (
                <motion.button
                    onClick={() => navigate('/checkout', { state: { selectedServices, totalBudget } })}
                    animate={{
                        scale: [1, 1.02, 1],
                        borderColor: ['#D4AF37', '#fff', '#D4AF37']
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    style={{
                        display: 'block',
                        width: '100%',
                        backgroundColor: '#D4AF37',
                        color: '#000',
                        padding: '1.1rem',
                        borderRadius: '12px',
                        marginTop: '2rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        border: '1px solid #D4AF37',
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: 100000
                    }}
                >
                    Book This Thali
                </motion.button>
            ) : (
                <button
                    disabled
                    style={{
                        width: '100%',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: '#666',
                        padding: '1.1rem',
                        borderRadius: '12px',
                        marginTop: '2rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        border: '1px solid transparent',
                        cursor: 'not-allowed',
                        opacity: 0.7,
                    }}
                >
                    Select Items
                </button>
            )}

        </motion.div>
    );
};

export default ThaliBuilder;
