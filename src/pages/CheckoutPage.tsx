// -----------------------------------------------------------------------------
// 4. pages/CheckoutPage.tsx
// Description: Multi-step checkout process page.
// -----------------------------------------------------------------------------
// Create this file in your `src/pages/CheckoutPage.tsx` directory

import React, { useState } from 'react';
import { ShoppingBag, Truck, CreditCard, CheckCircle } from 'lucide-react';

const CheckoutStep: React.FC<{ title: string; icon: React.ReactNode; isActive: boolean; isCompleted: boolean; stepNumber: number }> = 
  ({ title, icon, isActive, isCompleted, stepNumber }) => (
  <div className="flex items-center">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center
      ${isActive ? 'bg-sky-500 text-white' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
      {isCompleted ? <CheckCircle size={24} /> : icon}
    </div>
    <div className="ml-3">
      <div className={`text-xs font-medium ${isActive || isCompleted ? 'text-sky-600' : 'text-slate-500'}`}>Step {stepNumber}</div>
      <div className={`text-sm font-semibold ${isActive || isCompleted ? 'text-slate-800' : 'text-slate-600'}`}>{title}</div>
    </div>
  </div>
);

export const FormInput: React.FC<{ label: string; id: string; type?: string; placeholder?: string; required?: boolean; fullWidth?: boolean }> = 
  ({ label, id, type = "text", placeholder, required, fullWidth }) => (
  <div className={fullWidth ? 'col-span-2' : ''}>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      placeholder={placeholder}
      required={required}
      className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
    />
  </div>
);

export const CheckoutPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

  const steps = [
    { number: 1, title: 'Shipping Details', icon: <Truck size={20} /> },
    { number: 2, title: 'Payment Method', icon: <CreditCard size={20} /> },
    { number: 3, title: 'Review Order', icon: <ShoppingBag size={20} /> },
  ];

  const dummyCartItems = [
    { id: '1', name: 'Elegant Smartwatch', price: 199.99, quantity: 1, imageUrl: 'https://placehold.co/100x100/3498db/ffffff?text=SW' },
    { id: '2', name: 'Wireless Headphones', price: 129.50, quantity: 2, imageUrl: 'https://placehold.co/100x100/2ecc71/ffffff?text=HP' },
  ];
  const subtotal = dummyCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 10.00;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">Checkout</h1>
          <p className="mt-2 text-lg text-slate-600">Complete your purchase securely.</p>
        </header>

        {/* Stepper */}
        <div className="mb-10 p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <CheckoutStep 
                  title={step.title} 
                  icon={step.icon} 
                  isActive={currentStep === step.number} 
                  isCompleted={currentStep > step.number}
                  stepNumber={step.number}
                />
                {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-slate-200 mx-4"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content Area (Forms / Review) */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-lg shadow-xl">
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Shipping Address</h2>
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormInput label="Full Name" id="fullName" placeholder="John Doe" required fullWidth/>
                  <FormInput label="Email" id="email" type="email" placeholder="you@example.com" required fullWidth/>
                  <FormInput label="Address Line 1" id="address1" placeholder="123 Main St" required fullWidth/>
                  <FormInput label="Address Line 2 (Optional)" id="address2" placeholder="Apartment, suite, etc." fullWidth/>
                  <FormInput label="City" id="city" placeholder="New York" required />
                  <FormInput label="State / Province" id="state" placeholder="NY" required />
                  <FormInput label="ZIP / Postal Code" id="zip" placeholder="10001" required />
                  <FormInput label="Country" id="country" placeholder="United States" required />
                  <FormInput label="Phone Number (Optional)" id="phone" type="tel" placeholder="+1 234 567 8900" fullWidth/>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Payment Method</h2>
                <div className="space-y-6">
                  {/* Credit Card Option */}
                  <div>
                    <label className="flex items-center p-4 border border-slate-300 rounded-lg hover:border-sky-500 cursor-pointer transition-colors">
                      <input type="radio" name="paymentMethod" value="creditCard" className="h-5 w-5 text-sky-600 focus:ring-sky-500" defaultChecked/>
                      <CreditCard size={24} className="mx-3 text-slate-600"/>
                      <span className="text-sm font-medium text-slate-700">Credit or Debit Card</span>
                    </label>
                    <div className="mt-4 ml-10 space-y-4">
                      <FormInput label="Card Number" id="cardNumber" placeholder="•••• •••• •••• ••••" required fullWidth/>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormInput label="Expiration Date" id="expiryDate" placeholder="MM / YY" required />
                        <FormInput label="CVV" id="cvv" placeholder="•••" required />
                      </div>
                      <FormInput label="Name on Card" id="cardName" placeholder="John M Doe" required fullWidth/>
                    </div>
                  </div>
                  {/* PayPal Option (UI Only) */}
                  <div>
                     <label className="flex items-center p-4 border border-slate-300 rounded-lg hover:border-sky-500 cursor-pointer transition-colors">
                      <input type="radio" name="paymentMethod" value="paypal" className="h-5 w-5 text-sky-600 focus:ring-sky-500"/>
                      <img src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_SbyPP_mc_vs_dc_ae.jpg" alt="PayPal" className="h-6 mx-3"/>
                      <span className="text-sm font-medium text-slate-700">PayPal</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-6">
                  {dummyCartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 border-b border-slate-200">
                      <div className="flex items-center">
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/cccccc/ffffff?text=N/A')}/>
                        <div>
                          <h4 className="font-medium text-slate-800">{item.name}</h4>
                          <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-slate-700">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Shipping Address</h3>
                    <p className="text-sm text-slate-600">John Doe<br/>123 Main St, Apt 4B<br/>New York, NY 10001<br/>United States</p>
                </div>
                 <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Payment Method</h3>
                    <p className="text-sm text-slate-600">Credit Card ending in •••• 1234</p>
                </div>
                <p className="text-sm text-slate-600">By placing your order, you agree to our <a href="#" onClick={(e) => e.preventDefault()} className="text-sky-600 hover:underline">Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()} className="text-sky-600 hover:underline">Privacy Policy</a>.</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between items-center">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="py-2 px-6 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
              )}
              {currentStep < 3 && (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="ml-auto py-2 px-6 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Next: {steps[currentStep].title}
                </button>
              )}
              {currentStep === 3 && (
                <button
                  onClick={() => alert('Order Placed! (UI Only)')} // Replace with actual order placement logic
                  className="ml-auto py-3 px-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-base font-semibold transition-colors flex items-center"
                >
                  <CheckCircle size={20} className="mr-2"/> Place Order
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="md:col-span-1 bg-white p-6 rounded-lg shadow-xl h-fit sticky top-24">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-3">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {dummyCartItems.map(item => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex items-start">
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded mr-2" onError={(e) => (e.currentTarget.src = 'https://placehold.co/40x40/cccccc/ffffff?text=N/A')}/>
                    <div>
                        <p className="text-slate-700 font-medium">{item.name}</p>
                        <p className="text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-slate-600">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Taxes</span>
                <span>Calculated at next step</span>
              </div>
              <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between text-lg font-semibold text-slate-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6">
                <input type="text" placeholder="Gift card or discount code" className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm"/>
                <button className="mt-2 w-full py-2 px-4 border border-sky-500 text-sky-600 rounded-md text-sm font-medium hover:bg-sky-50 transition-colors">Apply</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};