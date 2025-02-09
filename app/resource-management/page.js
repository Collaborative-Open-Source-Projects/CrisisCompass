"use client"; // Ensure this file is treated as a client-side component

import { useState } from "react";
import Link from "next/link";

// Dummy data for resources
const initialResources = [
  {
    id: 1,
    type: "Ambulance",
    status: "Available",
    location: "Downtown",
    quantity: 5,
  },
  {
    id: 2,
    type: "Fire Truck",
    status: "In Use",
    location: "Uptown",
    quantity: 2,
  },
  {
    id: 3,
    type: "Medical Kit",
    status: "Available",
    location: "Central",
    quantity: 100,
  },
];

export default function ResourceManagement() {
  const [resources, setResources] = useState(initialResources);
  const [newResource, setNewResource] = useState({
    type: "",
    status: "Available",
    location: "",
    quantity: 0,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editResource, setEditResource] = useState(null);
  const [filters, setFilters] = useState({ type: "", status: "" });

  // Handle adding a new resource
  const handleAddResource = (e) => {
    e.preventDefault();
    setResources([
      ...resources,
      { ...newResource, id: resources.length + 1, status: "Available" },
    ]);
    setNewResource({
      type: "",
      status: "Available",
      location: "",
      quantity: 0,
    });
    setIsAdding(false);
  };

  // Handle resource status change
  const handleStatusChange = (id, status) => {
    setResources(
      resources.map((resource) =>
        resource.id === id ? { ...resource, status } : resource
      )
    );
  };

  // Filter resources based on selected filters
  const filteredResources = resources.filter((resource) => {
    const { type, status } = filters;
    return (
      (type
        ? resource.type.toLowerCase().includes(type.toLowerCase())
        : true) && (status ? resource.status === status : true)
    );
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-[#003366] mb-6">
          Resource Management
        </h2>

        {/* Filter Section */}
        <div className="mb-8 p-6 bg-[#e1effd] rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-[#003366] mb-4">
            Filter Resources
          </h3>
          <div className="flex space-x-6">
            <div className="w-1/3">
              <label htmlFor="type" className="block text-gray-700 mb-2">
                Resource Type
              </label>
              <input
                type="text"
                id="type"
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                placeholder="Filter by type"
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="status" className="block text-gray-700 mb-2">
                Resource Status
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="">All</option>
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resource List */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-[#003366] mb-4">
            Resources
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="text-lg font-semibold text-[#003366] mb-2">
                    {resource.type}
                  </h4>
                  <p className="text-gray-600 mb-2">
                    Location: {resource.location}
                  </p>
                  <p className="text-gray-600 mb-4">
                    Quantity: {resource.quantity}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      resource.status === "In Use"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    Status: {resource.status}
                  </p>
                  <button
                    onClick={() =>
                      handleStatusChange(
                        resource.id,
                        resource.status === "In Use" ? "Available" : "In Use"
                      )
                    }
                    className="mt-4 text-white bg-[#003366] hover:bg-[#002244] px-4 py-2 rounded-lg"
                  >
                    {resource.status === "In Use"
                      ? "Mark as Available"
                      : "Mark as In Use"}
                  </button>
                </div>
              ))
            ) : (
              <p>No resources found.</p>
            )}
          </div>
        </div>

        {/* Add Resource Section */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-[#003366] mb-4">
            Add New Resource
          </h3>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-white bg-[#003366] hover:bg-[#002244] px-6 py-3 rounded-lg mb-6"
          >
            {isAdding ? "Cancel" : "Add Resource"}
          </button>
          {isAdding && (
            <form
              onSubmit={handleAddResource}
              className="bg-white p-8 rounded-lg shadow-md space-y-6"
            >
              <div>
                <label htmlFor="type" className="block text-gray-700 mb-2">
                  Resource Type
                </label>
                <input
                  type="text"
                  id="type"
                  value={newResource.type}
                  onChange={(e) =>
                    setNewResource({ ...newResource, type: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={newResource.location}
                  onChange={(e) =>
                    setNewResource({ ...newResource, location: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  required
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={newResource.quantity}
                  onChange={(e) =>
                    setNewResource({ ...newResource, quantity: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-[#003366] text-white px-6 py-3 rounded-lg hover:bg-[#002244]"
                >
                  Add Resource
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
