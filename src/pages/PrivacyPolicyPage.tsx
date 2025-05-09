// -----------------------------------------------------------------------------
// 9. pages/PrivacyPolicyPage.tsx
// -----------------------------------------------------------------------------
// Create this file in your `src/pages/PrivacyPolicyPage.tsx` directory

import React from 'react';
import { GenericContentPage } from './GenericContentPage';

export const PrivacyPolicyPage: React.FC = () => {
    return (
      <GenericContentPage title="Privacy Policy" lastUpdated="May 5, 2025">
        <p>Your privacy is important to us. It is YourStore's policy to respect your privacy regarding any information we may collect from you across our website, [YourWebsite.com], and other sites we own and operate.</p>
        
        <h2>1. Information We Collect</h2>
        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
        <h3>Log Data</h3>
        <p>Like many site operators, we collect information that your browser sends whenever you visit our Site ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Site that you visit, the time and date of your visit, the time spent on those pages and other statistics.</p>
        <h3>Cookies</h3>
        <p>Cookies are files with a small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive. We use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
        
        <h2>2. Use of Information</h2>
        <p>We may use the information we collect for various purposes, including to:</p>
        <ul>
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
          <li>Process your transactions</li>
          <li>Send you emails</li>
          <li>Find and prevent fraud</li>
        </ul>
        
        <h2>3. Security</h2>
        <p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>
        
        {/* ... more sections like Links to Other Sites, Children's Privacy, Changes to This Privacy Policy, Contact Us */}
        
        <h2>4. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at [Your Contact Email/Link].</p>
      </GenericContentPage>
    );
  };