import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const SERVICE_DATA = {
    'web-experiences': {
        title: 'Web Experiences',
        desc: 'We build digital cathedrals.',
        video: 'https://cdn.coverr.co/videos/coverr-typing-on-a-macbook-pro-4340/1080p.mp4', // Placeholder
        images: [
            'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2064&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
        ]
    },
    'product-commercials': {
        title: 'Product Commercials',
        desc: 'Visceral. Loud. Impossible to ignore.',
        video: 'https://cdn.coverr.co/videos/coverr-drone-shot-of-a-harbor-at-night-5374/1080p.mp4',
        images: [
            'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1974&auto=format&fit=crop'
        ]
    },
    'branding': {
        title: 'Branding',
        desc: 'It’s not a logo. It’s a religion.',
        video: 'https://cdn.coverr.co/videos/coverr-street-art-1579/1080p.mp4',
        images: [
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop'
        ]
    },
    'social-campaigns': {
        title: 'Social & Campaigns',
        desc: 'Feed-stopping chaos.',
        video: 'https://cdn.coverr.co/videos/coverr-people-walking-in-a-crowded-street-4573/1080p.mp4',
        images: [
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop'
        ]
    }
};

const ServiceDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const data = SERVICE_DATA[slug] || SERVICE_DATA['web-experiences'];
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);

    return (
        <div ref={containerRef} style={{ backgroundColor: '#000', color: '#fff', minHeight: '300vh' }}>
            {/* HERO VIDEO */}
            <div style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <video
                    src={data.video}
                    autoPlay muted loop playsInline
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
                />
                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        style={{ fontSize: '10vw', fontFamily: 'var(--font-heading)', lineHeight: 0.8 }}
                    >
                        {data.title}
                    </motion.h1>
                    <p style={{ fontSize: '1.5rem', marginTop: '2rem', fontStyle: 'italic' }}>{data.desc}</p>
                </div>

                <button
                    onClick={() => navigate('/')}
                    style={{ position: 'absolute', top: '2rem', left: '2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 20, mixBlendMode: 'difference' }}
                >
                    <ArrowLeft /> Back
                </button>
            </div>

            {/* MASONRY CHAOS */}
            <div className="container" style={{ padding: '10rem 0', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
                <motion.div style={{ gridColumn: '2 / span 5', y: y1 }}>
                    <img src={data.images[0]} style={{ width: '100%', borderRadius: '8px' }} />
                    <p style={{ marginTop: '1rem', opacity: 0.6 }}>01_Strategy</p>
                </motion.div>

                <motion.div style={{ gridColumn: '8 / span 4', paddingTop: '20vh', y: y2 }}>
                    <img src={data.images[1] || data.images[0]} style={{ width: '100%', borderRadius: '8px' }} />
                    <p style={{ marginTop: '1rem', opacity: 0.6 }}>02_Execution</p>
                </motion.div>

                <motion.div style={{ gridColumn: '4 / span 6', paddingTop: '10vh' }}>
                    <h2 style={{ fontSize: '4rem', fontFamily: 'var(--font-heading)', textAlign: 'center' }}>The Process.</h2>
                    <p style={{ fontSize: '1.2rem', lineHeight: 1.6, textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
                        We don't follow templates. We break them down and rebuild from the core truth of the brand. It's messy, it's loud, and it works.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ServiceDetail;
