// -----------------------------------------------------------------------------
// 12. pages/CareerPage.tsx
// Description: Page listing job openings and company culture.
// -----------------------------------------------------------------------------
// Create this file in your `src/pages/CareerPage.tsx` directory

import React, { useState } from 'react';
import { JobOpening } from '../types'; // Assuming types are in src/types
import { Briefcase as BriefcaseIcon, MapPin, Users as UsersIcon, Search as SearchIconCareer, ChevronRight, TrendingUp, Heart } from 'lucide-react'; // Renamed icons

const placeholderJobs: JobOpening[] = [
  { id: '1', title: 'Senior Frontend Developer', department: 'Engineering', location: 'Remote', description: 'Join our talented engineering team to build and enhance our cutting-edge e-commerce platform using modern web technologies.', type: 'Full-time' },
  { id: '2', title: 'Product Marketing Manager', department: 'Marketing', location: 'New York, NY', description: 'Develop and execute marketing strategies to drive product adoption and growth. Strong analytical and communication skills required.', type: 'Full-time' },
  { id: '3', title: 'Customer Support Specialist', department: 'Customer Experience', location: 'Austin, TX', description: 'Provide exceptional support to our customers, resolving inquiries and ensuring a positive experience.', type: 'Part-time' },
  { id: '4', title: 'Data Scientist', department: 'Analytics', location: 'Remote', description: 'Analyze large datasets to extract actionable insights, build predictive models, and contribute to data-driven decision-making.', type: 'Full-time' },
];

const JobCard: React.FC<{ job: JobOpening }> = ({ job }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col sm:flex-row justify-between items-start sm:items-center">
    <div>
      <h3 className="text-xl font-semibold text-sky-600 hover:text-sky-700 mb-1">
        <a href="#">{job.title}</a>
      </h3>
      <div className="flex flex-wrap items-center text-sm text-slate-500 gap-x-4 gap-y-1 mb-3">
        <span className="flex items-center"><BriefcaseIcon size={14} className="mr-1.5"/> {job.department}</span>
        <span className="flex items-center"><MapPin size={14} className="mr-1.5"/> {job.location}</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          {job.type}
        </span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed hidden sm:block">{job.description.substring(0, 100)}...</p>
    </div>
    <a 
      href="#" 
      className="mt-4 sm:mt-0 sm:ml-6 inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600 transition-colors whitespace-nowrap"
    >
      Apply Now <ChevronRight size={18} className="ml-1 -mr-1"/>
    </a>
  </div>
);

export const CareerPage: React.FC = () => {
  const [jobs] = useState<JobOpening[]>(placeholderJobs);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BriefcaseIcon size={64} className="mx-auto mb-6 text-sky-400"/>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Join Our Team</h1>
          <p className="text-lg sm:text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
            We're building the future of e-commerce and looking for passionate, innovative individuals to help us achieve our mission. Explore exciting career opportunities at YourStore.
          </p>
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Why YourStore?</h2>
            <p className="mt-2 text-lg text-slate-600">Be part of a dynamic, inclusive, and forward-thinking company.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <UsersIcon size={40} className="mx-auto mb-4 text-sky-500"/>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Collaborative Culture</h3>
              <p className="text-slate-600 text-sm">Work with talented and diverse teams in an environment that fosters creativity and teamwork.</p>
            </div>
            <div className="p-6">
              <TrendingUp size={40} className="mx-auto mb-4 text-sky-500"/>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Growth Opportunities</h3>
              <p className="text-slate-600 text-sm">We invest in your development with learning resources, mentorship, and clear career paths.</p>
            </div>
            <div className="p-6">
              <Heart size={40} className="mx-auto mb-4 text-sky-500"/>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Impactful Work</h3>
              <p className="text-slate-600 text-sm">Contribute to projects that make a real difference for millions of users and shape the e-commerce landscape.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Job Listings Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 text-center">Current Openings</h2>
            {/* Filters (UI Only) */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-grow">
                <input 
                  type="search" 
                  placeholder="Search job titles or keywords" 
                  className="w-full py-3 px-4 pl-10 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIconCareer className="text-slate-400" size={20} />
                </div>
              </div>
              <select className="py-3 px-4 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Customer Experience</option>
                <option>Analytics</option>
              </select>
              <select className="py-3 px-4 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white">
                <option>All Locations</option>
                <option>Remote</option>
                <option>New York, NY</option>
                <option>Austin, TX</option>
              </select>
            </div>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BriefcaseIcon size={48} className="mx-auto text-slate-400 mb-4"/>
              <h3 className="text-xl font-semibold text-slate-700">No Openings Currently</h3>
              <p className="text-slate-500 mt-2">Please check back later or join our talent network!</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action / Talent Network */}
      <section className="py-16 bg-sky-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See a Role For You?</h2>
          <p className="text-lg opacity-90 mb-8">
            We're always looking for talented individuals. Join our talent network to stay updated on future opportunities that match your skills and interests.
          </p>
          <button className="bg-white text-sky-600 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-slate-100 transition-colors duration-300 text-lg">
            Join Our Talent Network
          </button>
        </div>
      </section>
    </div>
  );
};