"use client"; 

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function IncidentReport() {
  const [formData, setFormData] = useState({
    incidentType: "",
    description: "",
    location: "",
    file: null,
    date: "",
    time: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormStatus("success");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex justify-between items-center px-6 py-4 bg-white">
        {/* Add a navbar or links if needed */}
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#003366] mb-6">
            Incident Reporting -{" "}
            <span className="font-serif italic">John Doe</span>
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Report any incidents quickly and effectively using the form below.
            Provide the necessary details for efficient processing and response.
          </p>
        </div>

        {/* Incident Reporting Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-[#003366] mb-6">
            Submit an Incident Report
          </h3>

          {/* Form Start */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Incident Type */}
            <div>
              <label
                htmlFor="incidentType"
                className="block text-gray-700 font-medium mb-2"
              >
                Incident Type
              </label>
              <select
                id="incidentType"
                name="incidentType"
                value={formData.incidentType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                required
              >
                <option value="">Select Incident Type</option>
                <option value="fire">Fire</option>
                <option value="flood">Flood</option>
                <option value="accident">Accident</option>
                <option value="medical">Medical Emergency</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Incident Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Incident Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                placeholder="Provide a detailed description of the incident..."
                required
              ></textarea>
            </div>

            {/* Incident Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-gray-700 font-medium mb-2"
              >
                Incident Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                placeholder="Enter the location of the incident"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label
                  htmlFor="date"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Incident Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  required
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="time"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Incident Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label
                htmlFor="fileUpload"
                className="block text-gray-700 font-medium mb-2"
              >
                Upload Incident Image/Document (Optional)
              </label>
              <input
                type="file"
                id="fileUpload"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-[#003366] text-white px-6 py-3 rounded-lg hover:bg-[#002244] transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
              <Link href="/" passHref>
                <span className="text-gray-600 underline hover:text-[#003366]">
                  Cancel
                </span>
              </Link>
            </div>
          </form>

          {/* Form Submission Feedback */}
          {formStatus && (
            <div
              className={`mt-6 text-center p-4 rounded-lg ${
                formStatus === "success"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {formStatus === "success"
                ? "Report submitted successfully!"
                : "There was an issue with your submission."}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="text-center bg-[#e1effd] p-8 rounded-lg mt-12">
          <h3 className="text-xl font-semibold text-[#003366] mb-4">
            Need Help with Reporting?
          </h3>
          <p className="text-gray-600">
            If you need assistance with filling out the report or have any
            questions, refer to our help section or contact support.
          </p>
        </div>
      </main>
    </div>
  );
}
