import React, { useState } from 'react';

const ProductDetails = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'usage', label: 'How to Use' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'safety', label: 'Safety Info' }
  ];

  return (
    <div className="bg-white rounded-sm shadow-md border border-stone-100 overflow-hidden">
      {/* Tab headers */}
      <div className="border-b border-stone-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-emerald-700 border-b-2 border-emerald-700 bg-emerald-50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="p-8">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <h3 className="text-2xl font-light text-stone-900 mb-4">About This Oil</h3>
            <p className="text-stone-700 leading-relaxed mb-4">
              {product.description}
            </p>
            <p className="text-stone-700 leading-relaxed">
              Our {product.name} is carefully distilled from premium botanicals, ensuring 
              maximum purity and therapeutic benefits. Each batch undergoes rigorous GC-MS 
              testing to guarantee quality and authenticity.
            </p>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="prose max-w-none">
            <h3 className="text-2xl font-light text-stone-900 mb-4">How to Use</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-stone-900 mb-2">Aromatherapy Diffusion</h4>
                <p className="text-stone-700">
                  Add 3-5 drops to your diffuser with water. Diffuse for 30-60 minutes 
                  in well-ventilated spaces.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 mb-2">Topical Application</h4>
                <p className="text-stone-700">
                  Dilute with a carrier oil (2-3 drops per teaspoon) before applying 
                  to skin. Perform a patch test first.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 mb-2">Bath & Shower</h4>
                <p className="text-stone-700">
                  Add 5-10 drops to bath water or shower floor for an aromatic experience.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="prose max-w-none">
            <h3 className="text-2xl font-light text-stone-900 mb-4">Ingredients</h3>
            <div className="bg-stone-50 border border-stone-200 rounded-sm p-6">
              <p className="text-stone-900 font-medium mb-2">100% Pure Essential Oil</p>
              <p className="text-stone-700 mb-4">
                <span className="font-semibold">Botanical Name:</span> {product.name}
              </p>
              <p className="text-stone-700 mb-4">
                <span className="font-semibold">Extraction Method:</span> Steam Distillation
              </p>
              <p className="text-stone-700">
                <span className="font-semibold">Origin:</span> Sustainably sourced from certified organic farms
              </p>
            </div>
            <p className="text-sm text-stone-600 mt-4 italic">
              No additives, no carrier oils, no synthetic fragrances. Just pure botanical essence.
            </p>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="prose max-w-none">
            <h3 className="text-2xl font-light text-stone-900 mb-4">Safety Information</h3>
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
                <p className="text-amber-900 font-medium mb-2">⚠️ Important Safety Guidelines</p>
                <ul className="text-sm text-amber-800 space-y-2 ml-4">
                  <li>For external use only - do not ingest</li>
                  <li>Always dilute before topical application</li>
                  <li>Keep out of reach of children and pets</li>
                  <li>Avoid contact with eyes and mucous membranes</li>
                  <li>Discontinue use if irritation occurs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 mb-2">Pregnancy & Nursing</h4>
                <p className="text-stone-700">
                  Consult with a healthcare professional before use during pregnancy or while nursing.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 mb-2">Storage</h4>
                <p className="text-stone-700">
                  Store in a cool, dark place away from direct sunlight. Keep bottle tightly sealed 
                  when not in use to preserve potency.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;