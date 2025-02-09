"use client"
import React , {useState} from 'react'

import Image from "next/image";
import Link from "next/link";
import OptInPopup from "@/components/OptInPopup";

export default function Home() {
  const [consentGiven, setConsentGiven] = useState(false);
  const handleConsent = () => {
    setConsentGiven(true);
  };
  const features = [
    {
      title: "Emergency Response",
      description: "Access live updates and critical information during emergencies to ensure a swift response.",
    },
    {
      title: "Resource Management",
      description: "Manage and allocate resources effectively to support response efforts and aid distribution.",
    },
    {
      title: "Communication Center",
      description: "Stay connected with team members and stakeholders through integrated messaging and alerts.",
    }
  ];
  return (
    <>
    <div className="min-h-screen bg-white">
    {!consentGiven && <OptInPopup onConsentGiven={handleConsent} />}
      <nav className="flex justify-between items-center px-6 py-4 bg-white">
        <div className="flex items-center">
        <Image
  src="/logo.png"  
  alt="CrisisCompass Logo"
  width={50}
  height={50}
  className="rounded-2xl "
/>
          <h1 className="text-[#003366] text-xl font-bold">CrisisCompass</h1>
        </div>
        <div className="flex gap-4">
        <Link 
  href="/login" 
  className="px-4 py-2 bg-[#003366] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  aria-label="Get Started"
>
  Get Started
</Link>
          <button 
            className="px-4 py-2 text-[#003366] hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Learn More"
          >
            Learn More
          </button>
        </div>
      </nav>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#003366] mb-6">
            Welcome to CrisisCompass
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            CrisisCompass is your ultimate platform for managing emergencies and resources effectively. 
            Designed for emergency personnel and responders, it provides live updates, resource management, 
            and communication tools to help navigate crises efficiently.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-[#e1effd] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-[#003366] mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-[#003366] mb-4">
              Incident Reporting
            </h3>
            <p className="text-gray-600">
              Report incidents with ease using our detailed reporting forms and file upload capabilities.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-[#003366] mb-4">
              User Profile & Authentication
            </h3>
            <p className="text-gray-600">
              Manage your account, set roles, and customize your profile for personalized access.
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center bg-[#e1effd] p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-[#003366] mb-4">
            Help & FAQs
          </h3>
          <p className="text-gray-600">
            Find guides on how to use CrisisCompass, or contact us for further assistance.
          </p>
        </div>
      </main>

 {/* Footer */}
 <footer className="bg-gray-50 mt-12 py-6 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 hover:text-[#003366]">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-[#003366]">Terms of Service</a>
          </div>
          <div className="text-gray-600">
            © 2025 CrisisCompass
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
