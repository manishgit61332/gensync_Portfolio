import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo-transparent.png';

const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading time (e.g., 2 seconds)
        const duration = 2000;
        const interval = 20;
        const step = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500); // Wait a bit before finishing
                    return 100;
                }
                return prev + step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                backgroundColor: '#000',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                {/* Background Ghost Logo */}
                <img
                    src={logo}
                    style={{
                        width: '100%',
                        height: '100%',
                        opacity: 0.2,
                        filter: 'grayscale(100%)'
                    }}
                />

                {/* Foreground Filling Logo (Masked) */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: `${progress}%`, // Height controls fill
                    overflow: 'hidden',
                    transition: 'height 0.1s linear'
                }}>
                    <img
                        src={logo}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '120px', // Must match container width
                            height: '120px'  // Must match container height
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Preloader;
