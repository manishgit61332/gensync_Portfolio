import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import ServiceDetail from './pages/ServiceDetail';
import SmoothScroll from './components/SmoothScroll';
import GlobalAtmosphere from './components/GlobalAtmosphere';
import SEOHead from './components/SEOHead';
import { ScrollColorProvider } from './context/ScrollColorContext';
import './index.css';

const App = () => {
  return (
    <ScrollColorProvider>
      <div style={{ width: '100%', position: 'relative' }}>
        <SmoothScroll>
          <GlobalAtmosphere />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Routes>
              <Route path="/" element={
                <>
                  <SEOHead
                    title="GenSync — Strategy, Design & AI-Powered Creative Studio | gensync.in"
                    description="We help founders turn complex ideas into clear, high-trust products and content. Strategy, branding, web design, video production & AI-assisted execution from $600."
                  />
                  <Home />
                </>
              } />
              <Route path="/checkout" element={
                <>
                  <SEOHead
                    title="Checkout — GenSync"
                    description="Review your selected GenSync services and proceed to book your project."
                  />
                  <Checkout />
                </>
              } />
              <Route path="/service/:slug" element={
                <>
                  <SEOHead
                    title="Service Details — GenSync"
                    description="Explore GenSync service details, pricing, and deliverables."
                  />
                  <ServiceDetail />
                </>
              } />
            </Routes>
          </div>
        </SmoothScroll>
      </div>
    </ScrollColorProvider>
  );
};

export default App;
