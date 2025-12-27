import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import Belief from '../components/Belief';
import Philosophy from '../components/Philosophy';
import Pricing from '../components/Pricing';
import TeamKitchen from '../components/TeamKitchen';
import Distribution from '../components/Distribution';
import ThaliBuilder from '../components/ThaliBuilder';
import CaseStudies from '../components/CaseStudies';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import HallOfFame from '../components/HallOfFame';
import Particles from '../components/Particles';
import Preloader from '../components/Preloader';

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <AnimatePresence>
                {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            </AnimatePresence>
            <Particles color="rgba(255, 255, 255, 0.15)" count={40} />
            <Navbar />
            <Hero />
            <CaseStudies /> {/* ID 'work' is inside CaseStudies */}
            <Belief />
            <Philosophy />
            {/* Narrative Flow: Ethos -> Methodology -> Credibility (Team/Social) -> Proof (Cases) -> Action (Thali) -> Pricing */}
            <Distribution />
            <TeamKitchen />
            <HallOfFame />

            <ThaliBuilder /> {/* ID 'thali' is inside ThaliBuilder */}
            <Pricing />
            <Footer /> {/* ID 'contact' is inside Footer */}
        </>
    );
};

export default Home;
