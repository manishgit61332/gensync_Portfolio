import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import ServiceDetail from './pages/ServiceDetail';
import TeamKitchen from './components/TeamKitchen'; // Ensure this is available if used directly

import SmoothScroll from './components/SmoothScroll';

const App = () => {
  return (
    <SmoothScroll>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/service/:slug" element={<ServiceDetail />} />
      </Routes>
    </SmoothScroll>
  );
};

export default App;
