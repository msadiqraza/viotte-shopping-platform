// --- src/components/layout/Footer.tsx ---
import React from "react"; // Already imported
import { NewsletterSignup } from "../landing/NewsletterSignup"; // This path will need adjustment if NewsletterSignup moves

interface FooterProps {
  onNavigate?: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const handleFooterLink = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    onNavigate?.(page);
  };

  return (
    <footer className="bg-green-800 text-green-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-2">
            <NewsletterSignup /> {/* This component is defined in the Landing Page Components canvas */}
            <h5 className="text-md font-semibold text-white mb-2">
              Contact Us:{" "}
              <a href="mailto:contact@yourstore.site" className="hover:text-orange-400 font-normal transition-colors">
                contact@yourstore.site
              </a>
            </h5>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Company</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" onClick={(e) => handleFooterLink(e, "about")} className="hover:text-orange-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/blog" onClick={(e) => handleFooterLink(e, "blog")} className="hover:text-orange-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/store" onClick={(e) => handleFooterLink(e, "store")} className="hover:text-orange-400 transition-colors">
                  Our Store
                </a>
              </li>
              <li>
                <a href="/career" onClick={(e) => handleFooterLink(e, "career")} className="hover:text-orange-400 transition-colors">
                  Career
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Support</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/policies" onClick={(e) => handleFooterLink(e, "policies")} className="hover:text-orange-400 transition-colors">
                  Policies
                </a>
              </li>
              <li>
                <a href="/terms" onClick={(e) => handleFooterLink(e, "terms")} className="hover:text-orange-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" onClick={(e) => handleFooterLink(e, "privacy")} className="hover:text-orange-400 transition-colors">
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
