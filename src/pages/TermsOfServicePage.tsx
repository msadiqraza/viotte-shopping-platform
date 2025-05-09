// -----------------------------------------------------------------------------
// 8. pages/TermsOfServicePage.tsx
// -----------------------------------------------------------------------------
// Create this file in your `src/pages/TermsOfServicePage.tsx` directory

import React from 'react';
import { GenericContentPage } from './GenericContentPage';

export const TermsOfServicePage: React.FC = () => {
    return (
      <GenericContentPage title="Terms of Service" lastUpdated="April 15, 2025">
        <p>Welcome to YourStore! These terms and conditions outline the rules and regulations for the use of YourStore's Website, located at [YourWebsite.com].</p>
        <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use YourStore if you do not agree to take all of the terms and conditions stated on this page.</p>
        
        <h2>1. Interpretation and Definitions</h2>
        <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
        
        <h2>2. Intellectual Property Rights</h2>
        <p>Other than the content you own, under these Terms, YourStore and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>
        
        <h2>3. Restrictions</h2>
        <p>You are specifically restricted from all of the following:</p>
        <ul>
          <li>publishing any Website material in any other media;</li>
          <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
          <li>publicly performing and/or showing any Website material;</li>
          <li>using this Website in any way that is or may be damaging to this Website;</li>
          {/* ... more restrictions */}
        </ul>
  
        <h2>4. Your Content</h2>
        <p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant YourStore a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
        <p>Your Content must be your own and must not be invading any third-party’s rights. YourStore reserves the right to remove any of Your Content from this Website at any time without notice.</p>
        
        {/* ... more sections like Limitation of liability, Indemnification, Severability, Variation of Terms, Assignment, Entire Agreement, Governing Law & Jurisdiction */}
        
        <h2>5. Governing Law & Jurisdiction</h2>
        <p>These Terms will be governed by and interpreted in accordance with the laws of the State of [Your State/Country], and you submit to the non-exclusive jurisdiction of the state and federal courts located in [Your State/Country] for the resolution of any disputes.</p>
      </GenericContentPage>
    );
  };