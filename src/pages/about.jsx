import React from 'react';
import AboutHero from '../components/about/AboutHero';
import OurStory from '../components/about/OurStory';
import OurMission from '../components/about/OurMission';
import OurPromises from '../components/about/OurPromise';
import CallToAction from '../components/common-components/CallToAction';

const About = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <AboutHero />
      <OurStory />
      <OurMission />
      <OurPromises />
      <CallToAction 
        title="Experience the essenceKRAFT difference"
        subtitle="Join thousands who trust our pure, sustainable essential oils"
        primaryButtonText="Shop Our Collection"
        primaryButtonLink="/products"
        secondaryButtonText="Contact Us"
        secondaryButtonLink="/contact"
      />
    </div>
  );
};

export default About;