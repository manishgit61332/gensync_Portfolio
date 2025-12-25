import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo-transparent.png';

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show navbar after scrolling 100px
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
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
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 1000,
                        padding: '1rem 0',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <img src={logo} alt="Gensync Logo" style={{ height: '30px' }} />
                            <span style={{ fontWeight: 700, letterSpacing: '-0.5px' }}>Gensync</span>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <button onClick={() => scrollToSection('work')} style={{ color: '#fff', fontSize: '0.9rem' }}>Work</button>
                            <button onClick={() => scrollToSection('thali')} style={{ color: '#fff', fontSize: '0.9rem' }}>Build Thali</button>
                            <button onClick={() => scrollToSection('contact')} style={{ color: '#fff', fontSize: '0.9rem' }}>Contact</button>
                        </div>
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
};

export default Navbar;
