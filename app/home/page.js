"use client"
import Image from "next/image";
import Link from "next/link";

export default function Home() {
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

  const userName = "John Doe";

  return (

    <>
      <div className="min-h-screen bg-white">

        <nav className="flex justify-between items-center px-6 py-4 bg-white">
        
  
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#003366] mb-6">
              Welcome to CrisisCompass , <span className="font-serif italic">{userName}  </span>
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

       
      </div>
    </>
  );
}
