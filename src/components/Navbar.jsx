import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo-transparent.png';

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);

        const handleScroll = () => {
            // Always show navbar background if mobile menu is open
            if (window.scrollY > 50 || isMobileMenuOpen) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobileMenuOpen]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300); // Wait for menu close

    };

    return (
        <>
            <AnimatePresence>
                {(isVisible || isMobileMenuOpen || isMobile) && (
                    <motion.nav
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            backgroundColor: isMobileMenuOpen ? 'var(--color-black)' : 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 1000,
                            padding: '1rem 0',
                            borderBottom: isMobileMenuOpen ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: '1px', position: 'relative', zIndex: 1002 }}
                            >
                                <span className="font-sans" style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', color: '#fff' }}>Gen</span>
                                <span className="font-serif" style={{ color: 'var(--color-orange)', fontSize: '1.7rem', fontStyle: 'italic', letterSpacing: '0.02em' }}>Sync</span>
                            </div>

                            {/* Desktop Menu */}
                            {!isMobile && (
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <button onClick={() => scrollToSection('work')} style={{ color: '#fff', fontSize: '0.9rem' }}>Work</button>
                                    <button onClick={() => scrollToSection('thali')} style={{ color: '#fff', fontSize: '0.9rem' }}>Build Thali</button>
                                    <button onClick={() => window.open('https://calendly.com/manish-gensync/30min', '_blank')} style={{ color: '#fff', fontSize: '0.9rem' }}>Contact</button>
                                </div>
                            )}

                            {/* Mobile Hamburger */}
                            {isMobile && (
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    style={{ color: '#fff', zIndex: 1002, position: 'relative' }}
                                >
                                    {isMobileMenuOpen ? (
                                        // Close Icon
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    ) : (
                                        // Menu Icon
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                                    )}
                                </button>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100vh',
                            backgroundColor: 'var(--color-black)',
                            zIndex: 1001,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '2rem'
                        }}
                    >
                        <button onClick={() => scrollToSection('work')} style={{ color: '#fff', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Work</button>
                        <button onClick={() => scrollToSection('thali')} style={{ color: '#fff', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Build Thali</button>
                        <button onClick={() => window.open('https://calendly.com/manish-gensync/30min', '_blank')} style={{ color: '#fff', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Contact</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
