// -----------------------------------------------------------------------------
// 7. pages/PoliciesPage.tsx
// -----------------------------------------------------------------------------
// Create this file in your `src/pages/PoliciesPage.tsx` directory

import React from 'react'; // Already imported if in same file, else uncomment
import { GenericContentPage } from './GenericContentPage'; // Assuming it's in the same folder

export const PoliciesPage: React.FC = () => {
	return (
	  <GenericContentPage title="Our Policies" lastUpdated="May 1, 2025">
		<section id="shipping-policy">
		  <h2>Shipping Policy</h2>
		  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.</p>
		  <h3>Processing Times</h3>
		  <p>Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
		  <h3>Shipping Rates & Delivery Estimates</h3>
		  <p>Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis.</p>
		</section>
		<section id="return-policy" className="mt-8 pt-8 border-t border-slate-200">
		  <h2>Return & Refund Policy</h2>
		  <p>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</p>
		  <h3>Conditions for Return</h3>
		  <ul>
			<li>Item must be in original condition.</li>
			<li>Return must be initiated within 30 days of purchase.</li>
			<li>Proof of purchase is required.</li>
		  </ul>
		  <h3>Refund Process</h3>
		  <p>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</p>
		</section>
		{/* Add more policy sections as needed */}
	  </GenericContentPage>
	);
  };