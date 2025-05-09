// -----------------------------------------------------------------------------
// 6. pages/GenericContentPage.tsx (For Policies, Terms, Privacy)
// Description: A generic template for content-heavy pages.
// -----------------------------------------------------------------------------
// Create this file in your `src/pages/GenericContentPage.tsx` directory

import React from 'react';

interface GenericContentPageProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode; // To pass specific content sections
}

export const GenericContentPage: React.FC<GenericContentPageProps> = ({ title, lastUpdated, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-lg shadow-xl">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{title}</h1>
          {lastUpdated && (
            <p className="mt-2 text-sm text-slate-500">Last updated: {lastUpdated}</p>
          )}
        </header>
        <article className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-sky-600 hover:prose-a:text-sky-700 prose-strong:text-slate-700">
          {/* The 'prose' classes from @tailwindcss/typography provide nice default styling for text content.
            Install it if you haven't: npm install -D @tailwindcss/typography
            And add it to your tailwind.config.js plugins: require('@tailwindcss/typography'),
          */}
          {children}
        </article>
      </div>
    </div>
  );
};
