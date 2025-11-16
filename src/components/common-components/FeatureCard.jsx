import React from 'react';
import { Check } from 'lucide-react';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  description, 
  features, 
  accentColor = 'emerald' 
}) => {
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      icon: 'text-emerald-700',
      iconBg: 'from-emerald-100 to-emerald-50',
      accent: 'bg-emerald-600',
      checkBg: 'bg-emerald-100',
      checkIcon: 'text-emerald-700'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      icon: 'text-amber-700',
      iconBg: 'from-amber-100 to-amber-50',
      accent: 'bg-amber-600',
      checkBg: 'bg-amber-100',
      checkIcon: 'text-amber-700'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      icon: 'text-green-700',
      iconBg: 'from-green-100 to-green-50',
      accent: 'bg-green-600',
      checkBg: 'bg-green-100',
      checkIcon: 'text-green-700'
    }
  };

  const colors = colorClasses[accentColor] || colorClasses.emerald;

  return (
    <div className="bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-100 group">
      {/* Colored top bar */}
      <div className={`h-1.5 ${colors.accent}`}></div>

      <div className="p-8">
        {/* Icon */}
        <div className="mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${colors.iconBg} rounded-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-8 h-8 ${colors.icon}`} strokeWidth={1.5} />
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-stone-900 mb-1">
            {title}
          </h3>
          <p className="text-sm text-stone-500 italic">
            {subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-stone-600 leading-relaxed mb-6">
          {description}
        </p>

        {/* Features list */}
        {features && features.length > 0 && (
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-5 h-5 ${colors.checkBg} rounded-full flex items-center justify-center mt-0.5`}>
                  <Check className={`w-3 h-3 ${colors.checkIcon}`} strokeWidth={3} />
                </div>
                <span className="text-sm text-stone-700 leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;