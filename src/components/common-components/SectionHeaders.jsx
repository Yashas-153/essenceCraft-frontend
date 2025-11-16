import React from 'react';

const SectionHeader = ({ 
  label, 
  title, 
  subtitle, 
  align = 'center',
  accentColor = 'emerald'
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const colorClasses = {
    emerald: 'text-emerald-700 bg-emerald-600',
    amber: 'text-amber-700 bg-amber-600',
    stone: 'text-stone-700 bg-stone-600'
  };

  const alignClass = alignClasses[align] || alignClasses.center;
  const colorClass = colorClasses[accentColor] || colorClasses.emerald;
  const [textColor, bgColor] = colorClass.split(' ');

  return (
    <div className={alignClass}>
      {/* Label */}
      {label && (
        <div className={`inline-block mb-4 ${align === 'center' ? 'mx-auto' : ''}`}>
          <span className={`text-sm font-medium ${textColor} tracking-widest uppercase`}>
            {label}
          </span>
          <div className={`w-12 h-0.5 ${bgColor} mt-2 ${align === 'center' ? 'mx-auto' : ''}`}></div>
        </div>
      )}

      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6 leading-tight">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className={`text-lg text-stone-600 leading-relaxed ${align === 'center' ? 'max-w-3xl mx-auto' : 'max-w-3xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;