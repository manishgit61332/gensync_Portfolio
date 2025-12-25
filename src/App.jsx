import React from 'react';
import Hero from './components/Hero';
import Belief from './components/Belief';
import Philosophy from './components/Philosophy';
import Pricing from './components/Pricing';
import Team from './components/Team';
import Distribution from './components/Distribution';
import ThaliBuilder from './components/ThaliBuilder';
import CaseStudies from './components/CaseStudies';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import HallOfFame from './components/HallOfFame';

import Particles from './components/Particles';

import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Preloader from './components/Preloader';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main>
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <Particles color="rgba(255, 255, 255, 0.15)" count={40} /> {/* Global Background */}
      <Navbar />
      <Hero />
      <div id="work"><CaseStudies /></div>
      <Belief />
      <Philosophy />
      {/* Narrative Flow: Ethos -> Methodology -> Credibility (Team/Social) -> Proof (Cases) -> Action (Thali) -> Pricing */}
      <Distribution />
      <Team />
      <HallOfFame />

      <div id="thali"><ThaliBuilder /></div>
      <Pricing />
      <div id="contact"><Footer /></div>
    </main>
  );
}

export default App;
