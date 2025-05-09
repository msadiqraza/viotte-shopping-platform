// -----------------------------------------------------------------------------
// 11. pages/JoinAsSellerPage.tsx
// Description: Page for users to apply to become sellers.
// -----------------------------------------------------------------------------
// Create this file in your `src/pages/JoinAsSellerPage.tsx` directory

import React from 'react';
import { Store, TrendingUp, ShieldCheck, MessageSquare, UserPlus } from 'lucide-react';
import { FormInput } from './CheckoutPage';

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex items-start p-4">
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-sky-500 text-white">
        {icon}
      </div>
    </div>
    <div className="ml-4">
      <h4 className="text-lg leading-6 font-medium text-slate-900">{title}</h4>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  </div>
);

export const JoinAsSellerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero Section */}
      <section className="relative bg-slate-800 py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
            <img src="https://placehold.co/1920x1080/1e293b/475569?text=Marketplace+Background" alt="Marketplace" className="w-full h-full object-cover opacity-30" onError={(e) => (e.currentTarget.src = 'https://placehold.co/1920x1080/cccccc/ffffff?text=Background')}/>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Sell on YourStore & Grow Your Business
          </h1>
          <p className="text-xl text-sky-300 mb-10 leading-relaxed">
            Reach millions of customers, leverage our powerful platform, and take your brand to new heights.
          </p>
          <a
            href="#application-form"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-10 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Start Selling Today
          </a>
        </div>
      </section>

      {/* Why Sell With Us Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl">Why Partner with YourStore?</h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              We provide the tools, support, and audience you need to succeed in the competitive e-commerce landscape.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
            <BenefitCard 
              icon={<Store size={28}/>} 
              title="Expansive Customer Base" 
              description="Tap into our large and growing community of active shoppers looking for quality products like yours."
            />
            <BenefitCard 
              icon={<TrendingUp size={28}/>} 
              title="Powerful Selling Tools" 
              description="Utilize our intuitive dashboard, analytics, and marketing features to manage and scale your operations."
            />
            <BenefitCard 
              icon={<ShieldCheck size={28}/>} 
              title="Secure & Reliable Platform" 
              description="Benefit from our secure payment processing, fraud protection, and robust infrastructure."
            />
            <BenefitCard 
              icon={<MessageSquare size={28}/>} 
              title="Dedicated Seller Support" 
              description="Our expert support team is here to help you every step of the way, from onboarding to optimization."
            />
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="application-form" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl">
            <div className="text-center mb-10">
              <UserPlus size={48} className="mx-auto text-sky-500 mb-4"/>
              <h2 className="text-3xl font-bold text-slate-800">Join Our Seller Community</h2>
              <p className="mt-2 text-slate-600">Fill out the form below to start your selling journey.</p>
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput label="Your Full Name" id="sellerName" placeholder="John Doe" required />
                <FormInput label="Business Name" id="businessName" placeholder="My Awesome Shop" required />
              </div>
              <FormInput label="Email Address" id="sellerEmail" type="email" placeholder="you@example.com" required fullWidth/>
              <FormInput label="Phone Number" id="sellerPhone" type="tel" placeholder="+1 234 567 8900" required fullWidth/>
              <div>
                <label htmlFor="businessDetails" className="block text-sm font-medium text-slate-700 mb-1">Tell us about your business and products</label>
                <textarea
                  id="businessDetails"
                  name="businessDetails"
                  rows={4}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="Briefly describe your business, product categories, and why you want to sell on YourStore."
                  required
                ></textarea>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="agreeTerms" name="agreeTerms" type="checkbox" className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300 rounded" required />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="font-medium text-slate-700">I agree to the <a href="#" onClick={(e) => e.preventDefault()} className="text-sky-600 hover:underline">Seller Terms and Conditions</a>.</label>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-transform duration-150 ease-in-out transform hover:scale-102"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};