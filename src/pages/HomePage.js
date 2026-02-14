import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DynamicIslandNav from '../components/DynamicIslandNav';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ExpertiseSection from '../components/ExpertiseSection';
import CompaniesSection from '../components/CompaniesSection';
import GlobalPresenceSection from '../components/GlobalPresenceSection';
import LeadershipPhilosophySection from '../components/LeadershipPhilosophySection';
import AchievementsSection from '../components/AchievementsSection';
import ServicesSection from '../components/ServicesSection';
import ContactSection from '../components/ContactSection';

const HomePage = () => {
  const location = useLocation();

  // Handle scroll to section when navigating from other pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          });
        }
      }, 100); // Small delay to ensure page is rendered
    }
  }, [location]);

  return (
    <div className="home-page">
      <DynamicIslandNav />
      <HeroSection />
      <AboutSection />
      <ExpertiseSection />
      <CompaniesSection />
      <GlobalPresenceSection />
      <LeadershipPhilosophySection />
      <AchievementsSection />
      <ServicesSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
