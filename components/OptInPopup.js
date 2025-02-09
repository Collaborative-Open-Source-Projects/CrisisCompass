"use client";
import { useState, useEffect } from "react";

export default function OptInPopup({ onConsentGiven }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem("smsConsent");
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = () => {
    localStorage.setItem("smsConsent", "true");
    setIsVisible(false);
    onConsentGiven();
  };

  return (
    isVisible && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-lg font-semibold text-[#003366]">Stay Updated!</h2>
          <p className="text-gray-700 mt-2">
            Subscribe to SMS notifications for real-time updates.
          </p>
          <button
            onClick={handleConsent}
            className="mt-4 px-4 py-2 bg-[#003366] text-white rounded-md hover:bg-blue-700"
          >
            Accept SMS Updates
          </button>
        </div>
      </div>
    )
  );
}
