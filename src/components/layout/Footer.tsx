// -----------------------------------------------------------------------------
// 10. components/layout/Footer.tsx
// Description: Footer component based on wireframe.
// -----------------------------------------------------------------------------
// Create this file in `src/components/layout/Footer.tsx`

import React from "react";
import { NewsletterSignup } from "../landing/NewsletterSignup"; // Already imported

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-green-800 text-green-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Newsletter (as per wireframe, this section is prominent) */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col space-y-4">
            <NewsletterSignup />
            <label className="text-sm font-semibold text-white mb-2">
              Contact Us:{" "}
              <a
                href="/contact"
                className="hover:text-orange-400 transition-colors font-normal"
              >
                contact@yourstore.site
              </a>
            </label>
          </div>

          {/* Column 2: Links (About, Blog, etc.) */}
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Company</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/about"
                  className="hover:text-orange-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-orange-400 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/join-seller"
                  className="hover:text-orange-400 transition-colors"
                >
                  Join as Seller
                </a>
              </li>
              <li>
                <a
                  href="/career"
                  className="hover:text-orange-400 transition-colors"
                >
                  Career
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Links (Policies, Terms, etc.) */}
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Support</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/policies"
                  className="hover:text-orange-400 transition-colors"
                >
                  Policies
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-orange-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-orange-400 transition-colors"
                >
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-green-700 text-center text-sm text-green-300">
          <p>&copy; {currentYear} LOGO. All rights reserved. </p>
        </div>
      </div>
    </footer>
  );
};
