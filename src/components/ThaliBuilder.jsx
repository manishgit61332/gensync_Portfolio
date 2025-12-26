import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Utensils, Info, Layout, PenTool, Video, Laptop, Megaphone, Smartphone, RefreshCw, Eye } from 'lucide-react';

// Enhanced Services List with Preview Colors/Placeholders
const SERVICES = [
    // Staples
    { id: 'web-design', category: 'Staples', name: 'Website Design', price: 1800, time: 14, desc: 'High-converting, premium aesthetic.', icon: <Layout size={20} />, previewColor: '#D4AF37', previewText: 'Minimalist Layouts', textColor: '#000' },
    { id: 'brand-id', category: 'Staples', name: 'Brand Identity', price: 1200, time: 10, desc: 'Logo, colors, typography system.', icon: <PenTool size={20} />, previewColor: '#8B4513', previewText: 'Bold Typography', textColor: '#fff' },
    { id: 'rebranding', category: 'Staples', name: 'Rebranding', price: 2500, time: 20, desc: 'Complete visual overhaul.', icon: <RefreshCw size={20} />, previewColor: '#0a1f0a', previewText: 'Fresh Start', textColor: '#fff' },

    // Content (Flavour)
    { id: 'linkedin', category: 'Flavour', name: 'LinkedIn Content', price: 800, time: 0, desc: 'Thought leadership ghostwriting (Monthly).', icon: <Laptop size={20} />, previewColor: '#D4AF37', previewText: 'Viral Threads', textColor: '#000' },
    { id: 'video-edit', category: 'Flavour', name: 'Video Editing', price: 1000, time: 0, desc: 'Short-form reels & edits (Monthly).', icon: <Video size={20} />, previewColor: '#C5A028', previewText: 'Dynamic Cuts', textColor: '#000' },
    { id: 'commercials', category: 'Flavour', name: 'AI Commercials', price: 1200, time: 7, desc: 'Hyper-realistic product films.', icon: <Megaphone size={20} />, previewColor: '#333', previewText: 'Cinematic AI', textColor: '#fff' },

    // Mobile/Scale (Power)
    { id: 'app-design', category: 'Power', name: 'Mobile App Design', price: 2200, time: 21, desc: 'UI/UX that feels native.', icon: <Smartphone size={20} />, previewColor: '#D4AF37', previewText: 'Smooth UX', textColor: '#000' },
];

const ThaliBuilder = () => {
    // ... (state vars same)
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState([]);
    const [hoveredService, setHoveredService] = useState(null);
    const [showHint, setShowHint] = useState(false);

    const toggleService = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const { totalBudget, totalTime } = useMemo(() => {
        const selected = SERVICES.filter(s => selectedIds.includes(s.id));
        return {
            totalBudget: selected.reduce((sum, s) => sum + s.price, 0),
            totalTime: Math.max(0, ...selected.map(s => s.time)) + (selected.length > 0 ? 3 : 0) // Base setup time
        };
    }, [selectedIds]);

    return (
        <section id="thali" className="section-padding" style={{
            // ... styles
            background: 'linear-gradient(to bottom, #0a1f0a, #1a4d1a)',
            color: 'var(--color-white)',
            position: 'relative',
            paddingTop: 'var(--spacing-xl)',
            borderTop: 'none'
        }}>
            {/* ... container/title/hint code ... */}
            <div className="container">
                {/* Brass/Gold Accent for Title */}
                <h2 className="text-center" style={{ marginBottom: 'var(--spacing-sm)', color: '#D4AF37', fontFamily: 'var(--font-heading)' }}>Build Your Thali.</h2>

                {/* Thali Hint */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <button
                        onClick={() => setShowHint(!showHint)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4AF37', fontSize: '0.9rem', opacity: 0.8 }}
                    >
                        <Info size={16} /> What is a Thali?
                    </button>
                </div>

                <AnimatePresence>
                    {showHint && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', maxWidth: '600px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--spacing-md)' }}
                        >
                            <p style={{ backgroundColor: 'rgba(10, 31, 10, 0.8)', color: '#D4AF37', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #D4AF37' }}>
                                A <strong>Thali</strong> is your entire growth team in a box.<br />
                                Design + Content + Strategy. <br />
                                <strong>No retainers. No equity. Just results.</strong>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: 'var(--spacing-md)', alignItems: 'start' }} className="thali-grid">

                    {/* Menu */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', alignContent: 'start' }}>
                        {SERVICES.map(service => {
                            const isSelected = selectedIds.includes(service.id);
                            return (
                                <motion.div
                                    key={service.id}
                                    layoutId={service.id}
                                    onClick={() => {
                                        toggleService(service.id);
                                        // setHoveredService(service); // No hover needed if hiding preview? Keep purely for internal logic if needed, but removing active "hover" effect request.
                                    }}
                                    // onHoverStart={() => setHoveredService(service)}
                                    // onHoverEnd={() => setHoveredService(null)} 
                                    whileHover={{ y: -5, borderColor: '#D4AF37' }}
                                    style={{
                                        padding: '1.5rem',
                                        borderRadius: '12px',
                                        border: `1px solid ${isSelected ? '#D4AF37' : 'rgba(212, 175, 55, 0.1)'}`,
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.03)',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div style={{
                                            width: '40px', height: '40px',
                                            backgroundColor: isSelected ? '#D4AF37' : 'rgba(212, 175, 55, 0.1)',
                                            color: isSelected ? '#000' : '#D4AF37',
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {service.icon}
                                        </div>
                                        {isSelected ? <X size={20} color="#D4AF37" /> : <Plus size={20} color="#666" />}
                                    </div>

                                    <div>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>{service.category}</span>
                                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.2rem', color: isSelected ? '#D4AF37' : '#fff' }}>{service.name}</h4>
                                        <p style={{ fontSize: '0.9rem', opacity: 0.7, color: '#ccc' }}>{service.desc}</p>
                                    </div>

                                    <div style={{ fontWeight: 'bold', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#D4AF37' }}>${service.price.toLocaleString()}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* The Plate / Receipt / Preview (Desktop Sticky) */}
                    <div className="desktop-preview-panel" style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 900 }}>
                        {/* Hidden Preview Card */}
                        <div style={{ display: 'none' }}></div>

                        <div style={{ backgroundColor: '#fff', color: '#000', padding: '2rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '2px solid #D4AF37' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <Utensils size={24} color="#D4AF37" />
                                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Your Estimate</h3>
                            </div>

                            <div style={{ minHeight: '100px', marginBottom: '2rem' }}>
                                <AnimatePresence mode="popLayout">
                                    {selectedIds.length === 0 && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}>
                                            Your plate is empty. Start adding dishes.
                                        </motion.p>
                                    )}
                                    {SERVICES.filter(s => selectedIds.includes(s.id)).map(s => (
                                        <motion.div
                                            key={s.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            layout
                                            style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed #ddd' }}
                                        >
                                            <span>{s.name}</span>
                                            <span>${s.price.toLocaleString()}</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div style={{ paddingTop: '1rem', borderTop: '2px solid #eee' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                                    <span>Total</span>
                                    <strong>${totalBudget.toLocaleString()}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', opacity: 0.7 }}>
                                    <span>Est. Timeline</span>
                                    <span>~{totalTime} Days</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    const selected = SERVICES.filter(s => selectedIds.includes(s.id));
                                    navigate('/checkout', { state: { selectedServices: selected, totalBudget } });
                                }}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#0a1f0a',
                                    color: '#D4AF37',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    marginTop: '2rem',
                                    fontSize: '1rem',
                                    // Brass Border
                                    border: '1px solid #D4AF37',
                                    transition: 'transform 0.1s',
                                    cursor: 'pointer'
                                }}>
                                Book This Thali
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <style>{`
                    @media (max-width: 900px) {
                        .thali-grid { 
                            grid-template-columns: 1fr !important;
                            display: flex !important;
                            flex-direction: column; 
                        }
                        /* On mobile, let's make the preview text clearer */
                    }
                `}</style>
        </section>
    );
};

export default ThaliBuilder;
