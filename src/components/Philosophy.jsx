import React from 'react';
import { motion } from 'framer-motion';

const QuoteBlock = ({ quote, author, interpretation, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}
    >
        <blockquote style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', lineHeight: 1.2 }}>
            "{quote}"
        </blockquote>
        <cite style={{ fontSize: '0.9rem', opacity: 0.6, fontStyle: 'normal' }}>— {author}</cite>
        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', marginTop: 'auto', marginBottom: 'var(--spacing-sm)' }}></div>
        <p style={{ fontSize: '1rem', opacity: 0.8, minHeight: '60px' }}>{interpretation}</p>
    </motion.div>
);

const Philosophy = () => {
    return (
        <section className="section-padding" style={{ backgroundColor: 'var(--color-black)', overflow: 'hidden' }}>
            <div className="container">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-lg)', justifyContent: 'space-between' }}>
                    <QuoteBlock
                        quote="If I was down to my last dollar, I would spend it on public relations."
                        author="Bill Gates"
                        interpretation="Visibility is the only currency that matters when resources are scarce."
                        delay={0.1}
                    />
                    <QuoteBlock
                        quote="You can't connect the dots looking forward; you can only connect them looking backwards."
                        author="Steve Jobs"
                        interpretation="Trust that the obsession with quality (like a calligraphy class) pays off in ways data can't predict."
                        delay={0.3}
                    />
                    {/* UPDATED: Satyajit Ray Quote */}
                    <QuoteBlock
                        quote="The only clichés I want to see are the ones I make myself."
                        author="Satyajit Ray"
                        interpretation="We don't chase trends. We set the standard."
                        delay={0.5}
                    />
                </div>
            </div>
        </section>
    );
};

export default Philosophy;
