// src/pages/AboutUsPage.tsx
import React, { useState } from "react";
import { MapPin, Phone, Mail as MailIcon, Send, Building2, Users, Target, Lightbulb, CheckCircle } from "lucide-react";
// Assume a mock service function for contact form submission
// import { sendContactMessage } from '../services/api'; // You would create this in project_services_v1
// Assume ContactFormData type
// import { ContactFormData } from '../types'; // You would add this to project_types_v1

// Placeholder for ContactFormData type (add to src/types/index.ts)
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Placeholder for sendContactMessage (add to src/services/api.ts)
const sendContactMessage = async (formData: ContactFormData): Promise<{ success: boolean; message: string }> => {
  console.log("Contact form submitted (mock):", formData);
  // Simulate API call
  return new Promise((resolve) =>
    setTimeout(() => {
      if (formData.email.includes("@")) {
        // Simple validation
        resolve({ success: true, message: "Thank you for your message! We'll get back to you soon." });
      } else {
        resolve({ success: false, message: "Failed to send message. Please try again." });
      }
    }, 1000)
  );
};

export const AboutUsPage: React.FC<{ onNavigate?: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<ContactFormData>({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitContactForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "idle", message: "" });
    try {
      const response = await sendContactMessage(formData);
      if (response.success) {
        setFormStatus({ type: "success", message: response.message });
        setFormData({ name: "", email: "", subject: "", message: "" }); // Reset form
      } else {
        setFormStatus({ type: "error", message: response.message });
      }
    } catch (error: any) {
      setFormStatus({ type: "error", message: error.message || "An unexpected error occurred." });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-stone-50">
      {/* Hero Section for About Us */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building2 size={64} className="mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">About YourStore</h1>
          <p className="text-lg sm:text-xl opacity-90 leading-relaxed">
            Discover who we are, our mission, and the values that drive our passion for delivering the best to you.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
                <Lightbulb size={32} className="mr-3 text-green-600" /> Our Journey
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Founded with a vision to redefine the online shopping experience, YourStore began as a small idea fueled by a passion for quality and customer
                satisfaction. We envisioned a place where customers could not only find exceptional products but also feel a genuine connection to the brand.
              </p>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Over the years, through dedication and the unwavering support of our valued customers, we've grown from a humble beginning into a trusted online
                destination. Our journey has been one of constant learning, innovation, and a relentless pursuit of excellence in everything we do.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We believe that shopping should be more than just a transaction; it should be an experience. That's why we meticulously curate our collections
                and strive to provide a seamless, enjoyable, and secure platform for you.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="https://placehold.co/600x450/e2e8f0/334155?text=Our+Beginnings"
                alt="Our Beginnings"
                className="rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 sm:py-24 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">Our Mission & Core Values</h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">The principles that guide every decision we make and action we take.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
              <Target size={40} className="mx-auto mb-5 text-green-600" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To provide an unparalleled online shopping experience by offering a diverse range of high-quality products, exceptional customer service, and a
                commitment to integrity and innovation.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
              <Users size={40} className="mx-auto mb-5 text-green-600" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Customer First</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our customers are at the heart of everything. We listen, adapt, and strive to exceed expectations, ensuring satisfaction and building lasting
                relationships.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
              <CheckCircle size={40} className="mx-auto mb-5 text-green-600" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Quality & Integrity</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We are dedicated to offering products that meet the highest standards of quality and conducting our business with transparency, honesty, and
                ethical practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact-us" className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <MailIcon size={48} className="mx-auto mb-4 text-green-600" />
            <h2 className="text-3xl font-bold text-slate-800">Get In Touch</h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, please don't hesitate to reach out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Contact Form */}
            <div className="bg-stone-50 p-8 rounded-xl shadow-xl border border-stone-200">
              <h3 className="text-2xl font-semibold text-slate-800 mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmitContactForm} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    required
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                  ></textarea>
                </div>
                {formStatus.message && (
                  <p
                    className={`text-sm p-3 rounded-md ${
                      formStatus.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : formStatus.type === "error"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : ""
                    }`}
                  >
                    {formStatus.message}
                  </p>
                )}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-md transition-colors duration-150 disabled:opacity-70"
                  >
                    <Send size={18} className="mr-2" /> {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Details & Map */}
            <div className="space-y-8">
              <div className="bg-green-50 p-8 rounded-xl shadow-lg border border-green-200">
                <h3 className="text-2xl font-semibold text-slate-800 mb-5">Contact Information</h3>
                <div className="space-y-4 text-slate-700">
                  <div className="flex items-start">
                    <MapPin size={24} className="flex-shrink-0 mr-3 mt-1 text-green-600" />
                    <div>
                      <h4 className="font-medium">Our Office</h4>
                      <p className="text-sm">123 YourStore Street, Wah, Punjab, Pakistan</p>
                      <p className="text-sm">(This is a placeholder address)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone size={24} className="flex-shrink-0 mr-3 mt-1 text-green-600" />
                    <div>
                      <h4 className="font-medium">Call Us</h4>
                      <p className="text-sm hover:text-green-700">
                        <a href="tel:+923001234567">+92 300 1234567</a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MailIcon size={24} className="flex-shrink-0 mr-3 mt-1 text-green-600" />
                    <div>
                      <h4 className="font-medium">Email Us</h4>
                      <p className="text-sm hover:text-green-700">
                        <a href="mailto:support@yourstore.site">support@yourstore.site</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Placeholder for Map */}
              <div className="bg-slate-200 h-64 rounded-xl shadow-md flex items-center justify-center text-slate-500">
                <MapPin size={40} className="opacity-50" />
                <span className="ml-2">Map Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
