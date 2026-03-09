import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';

import Belief from '../components/Belief';
import Philosophy from '../components/Philosophy';
import Pricing from '../components/Pricing';
import TeamKitchen from '../components/TeamKitchen';
import SystemFramework from '../components/SystemFramework';
import ThaliBuilder from '../components/ThaliBuilder';
import CaseStudies from '../components/CaseStudies';
import WereEarly from '../components/WereEarly';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Distribution from '../components/Distribution';
import HallOfFame from '../components/HallOfFame';
import Preloader from '../components/Preloader';

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <AnimatePresence>
                {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            </AnimatePresence>

            <Navbar />
            <Hero />
            <CaseStudies />

            <SystemFramework /> {/* Moved up: Process before Work */}
            <TeamKitchen />

            <WereEarly />
            <Belief />
            <Philosophy />
            <Distribution />
            <HallOfFame />
            {/* Narrative Flow: Ethos -> Methodology -> Credibility (Team/Social) -> Proof (Cases) -> Action (Thali) -> Pricing */}


            <ThaliBuilder />
            <Pricing />
            <Footer />
        </>
    );
};

export default Home;
