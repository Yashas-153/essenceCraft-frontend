import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, BookOpen, Leaf, TestTube, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearnAboutOils = () => {
  const navigate = useNavigate();

  const learningResources = [
    {
      icon: BookOpen,
      title: 'Essential Oil Guide',
      description: 'Learn the basics of essential oils, their properties, and how to use them safely and effectively.',
      link: '/learn/guide'
    },
    {
      icon: Leaf,
      title: 'Sourcing & Sustainability',
      description: 'Discover how we source our botanicals ethically and our commitment to environmental stewardship.',
      link: '/learn/sustainability'
    },
    {
      icon: TestTube,
      title: 'Quality & Testing',
      description: 'Understand our rigorous GC-MS testing process and what makes our oils therapeutic grade.',
      link: '/learn/quality'
    },
    {
      icon: Heart,
      title: 'Wellness Benefits',
      description: 'Explore the therapeutic benefits of essential oils for mind, body, and emotional wellbeing.',
      link: '/learn/wellness'
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-stone-50 to-white" id="learn-about-oils">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-medium text-emerald-700 tracking-widest uppercase">Education</span>
            <div className="w-12 h-0.5 bg-emerald-600 mt-2 mx-auto"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
            Learn About <span className="font-semibold">Essential Oils</span>
          </h2>
          
          <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Empower yourself with knowledge about essential oils — from sourcing and quality 
            to safe usage and therapeutic benefits.
          </p>
        </div>

        {/* Learning cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {learningResources.map((resource, index) => (
            <div 
              key={index}
              className="bg-white rounded-sm border border-stone-200 p-8 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(resource.link)}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <resource.icon className="w-8 h-8 text-emerald-700" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-stone-900 mb-3 group-hover:text-emerald-700 transition-colors">
                {resource.title}
              </h3>
              <p className="text-stone-600 leading-relaxed text-sm mb-4">
                {resource.description}
              </p>

              {/* Read more link */}
              <div className="flex items-center text-emerald-700 text-sm font-medium group-hover:gap-2 transition-all">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Featured content */}
        <div className="bg-gradient-to-br from-emerald-50 to-stone-50 rounded-sm p-12 border border-emerald-100">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-light text-stone-900 mb-4">
              New to Essential Oils?
            </h3>
            <p className="text-lg text-stone-700 mb-8 leading-relaxed">
              Start with our comprehensive beginner's guide covering everything from basic usage 
              to safety precautions and oil blending fundamentals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/learn/beginners-guide')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 rounded-sm"
              >
                Beginner's Guide
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/learn')}
                className="border-2 border-stone-300 hover:bg-stone-50 px-8 rounded-sm"
              >
                Browse All Resources
              </Button>
            </div>
          </div>
        </div>

        {/* Quick tips */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-700 font-bold text-lg">1</span>
            </div>
            <h4 className="font-semibold text-stone-900 mb-2">Always Dilute</h4>
            <p className="text-sm text-stone-600">Essential oils are highly concentrated. Always dilute with a carrier oil before topical use.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-700 font-bold text-lg">2</span>
            </div>
            <h4 className="font-semibold text-stone-900 mb-2">Store Properly</h4>
            <p className="text-sm text-stone-600">Keep oils in dark glass bottles away from heat and sunlight to preserve potency.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-700 font-bold text-lg">3</span>
            </div>
            <h4 className="font-semibold text-stone-900 mb-2">Patch Test First</h4>
            <p className="text-sm text-stone-600">Test on a small skin area before widespread use to check for sensitivities.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearnAboutOils;