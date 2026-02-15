import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import HeroSection from './components/HeroSection/HeroSection';
import FeatureCards from './components/FeatureCards/FeatureCards';
import Testimonials from './components/Testimonials/Testimonials';
import LiveEvents from './components/LiveEvents/LiveEvents';
import UpcomingEvents from './components/UpcomingEvents/UpcomingEvents';
import WhoItsFor from './components/WhoItsFor/WhoItsFor';
import BecomeASpeaker from './components/BecomeASpeaker/BecomeASpeaker';
import PlanAhead from './components/PlanAhead/PlanAhead';
import Engagement from './components/Engagement/Engagement';
import Partners from './components/Partners/Partners';
import Footer from './components/Footer/Footer';
import TicketSection from './components/Ticket/TicketSection';

import LeaderboardPage from './pages/LeaderboardPage';

import ScrollToTop from "./components/ScrollToTop";
import ScrollRestoration from "./components/ScrollRestoration";



function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <Partners />
      <Testimonials />
      <WhoItsFor />
      <LiveEvents />
      <UpcomingEvents />
      <BecomeASpeaker />
      <PlanAhead />
      <Engagement />
    </>
  );
}



function App() {
  return (
    <Router>

      {/* Always open pages from top when route changes */}
      <ScrollRestoration />

      <div className="app">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ticket" element={<TicketSection />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </main>

        <Footer />

        {/* Floating scroll button */}
        <ScrollToTop />

      </div>
    </Router>
  );
}

export default App;
