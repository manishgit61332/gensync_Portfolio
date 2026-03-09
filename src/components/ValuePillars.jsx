import React from 'react';
import { motion } from 'framer-motion';

const ValuePillar = ({ title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="value-pillar"
        style={{
            flex: 1,
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            minWidth: '280px' // Mobile responsive
        }}
    >
        <h3 style={{
            color: 'var(--color-orange)',
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-heading)'
        }}>
            {title}
        </h3>
        <p style={{
            color: 'var(--color-light-gray)',
            fontSize: '1rem',
            lineHeight: 1.6,
            opacity: 0.9,
            margin: 0
        }}>
            {description}
        </p>
    </motion.div>
);

import { useSectionColor } from '../context/ScrollColorContext';

const ValuePillars = () => {
    const setGlobalTheme = useSectionColor();
    const pillars = [
        {
            title: "Radical Clarity",
            description: "If a user can't explain your product in 7 seconds, you've lost. We fix your narrative until they can."
        },
        {
            title: "Embedded Distribution",
            description: "We don't just 'post' content. We engineer the viral mechanics and channels ensuring it actually spreads."
        },
        {
            title: "Founders Only",
            description: "No interns. No account managers. You work directly with the strategists who have built and sold stories before."
        }
    ];

    return (
        <motion.section
            onViewportEnter={() => setGlobalTheme('#000000', '#FFFFFF', 1.5)}
            viewport={{ margin: "-10% 0px -10% 0px" }}
            style={{
                padding: '4rem 5%',
                backgroundColor: 'transparent', // Was black
                position: 'relative',
                zIndex: 2
            }}>
            <div className="container" style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem',
                maxWidth: '1200px',
                margin: '0 auto',
                justifyContent: 'center'
            }}>
                {pillars.map((pillar, index) => (
                    <ValuePillar
                        key={index}
                        title={pillar.title}
                        description={pillar.description}
                        delay={0.2 * index}
                    />
                ))}
            </div>
        </motion.section>
    );
};

export default ValuePillars;
