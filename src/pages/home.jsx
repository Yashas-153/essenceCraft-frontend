import React from 'react';
import Hero from '@/components/home/hero';
import ShopBestsellers from '@/components/home/bestSeller';
import LearnAboutOils from '@/components/home/LearnAboutOils';
import WholesalePrivateLabel from '@/components/home/WholesalePrivateLabel';

const Home = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Hero />
      <ShopBestsellers />
      <LearnAboutOils />
      <WholesalePrivateLabel />
    </div>
  );
};

export default Home;