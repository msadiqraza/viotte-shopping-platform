// -----------------------------------------------------------------------------
// 5. pages/AboutUsPage.tsx
// Description: Page describing the company.
// -----------------------------------------------------------------------------
// Create this file in your `src/pages/AboutUsPage.tsx` directory

import React from 'react';
import { Target, Award, Heart } from 'lucide-react';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-center w-12 h-12 bg-sky-100 text-sky-600 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);

export const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">About YourStore</h1>
          <p className="text-lg sm:text-xl opacity-90 leading-relaxed">
            We're passionate about bringing you the best products with an unparalleled shopping experience. Discover our story, mission, and the values that drive us.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Journey</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Founded in [Year], YourStore started with a simple idea: to make high-quality products accessible to everyone, everywhere. What began as a small venture has grown into a thriving online marketplace, thanks to our loyal customers and dedicated team.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We believe in innovation, customer satisfaction, and a seamless shopping experience. Our journey is one of continuous improvement and commitment to excellence.
            </p>
          </div>
          <div>
            <img 
              src="https://placehold.co/600x400/e2e8f0/334155?text=Our+Team+Working" 
              alt="Our Team" 
              className="rounded-lg shadow-xl"
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Available')}
            />
          </div>
        </div>
      </section>

      {/* Mission and Values Section */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Our Mission & Values</h2>
            <p className="mt-2 text-lg text-slate-600">What we stand for and strive to achieve.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Target size={28}/>} 
              title="Our Mission" 
              description="To provide an exceptional online shopping experience by offering a wide selection of quality products, competitive prices, and outstanding customer service."
            />
            <FeatureCard 
              icon={<Heart size={28}/>} 
              title="Customer First" 
              description="Our customers are at the heart of everything we do. We listen, we care, and we strive to exceed expectations."
            />
            <FeatureCard 
              icon={<Award size={28}/>} 
              title="Quality & Integrity" 
              description="We are committed to offering products that meet high standards of quality and conducting our business with utmost integrity and transparency."
            />
          </div>
        </div>
      </section>

      {/* Team Section (Optional Placeholder) */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Meet Our Team (Optional)</h2>
          <p className="text-lg text-slate-600 mb-12">The passionate individuals behind YourStore.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="text-center">
                <img src={`https://placehold.co/200x200/cbd5e1/475569?text=Team+Member+${i}`} alt={`Team Member ${i}`} className="w-32 h-32 rounded-full mx-auto mb-4 shadow-md" onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x200/cccccc/ffffff?text=N/A')}/>
                <h4 className="text-lg font-semibold text-slate-700">Person {i}</h4>
                <p className="text-sm text-sky-600">Role/Title</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
