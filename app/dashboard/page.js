"use client"

import React, { useState } from 'react';
import { Map, AlertCircle, Phone, FileText, Users, Activity, Shield, Calendar } from 'lucide-react';
// import CrisisMap from '@/components/CrisisMap';
import dynamic from 'next/dynamic';

const DisasterPage = dynamic(() => import('@/components/disasterPage').then(module => module.DisastersPage), {
    ssr: false // This ensures the component is not SSR'd
});

function Page() {
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  const emergencies = [
    {
      id: 1,
      title: "Flood Warning",
      location: "River Valley District",
      severity: "High",
      time: "10:30 AM",
      status: "Active",
      affected: "2,000+ residents",
    },
    {
      id: 2,
      title: "Fire Outbreak",
      location: "Industrial Zone B",
      severity: "Critical",
      time: "11:45 AM",
      status: "Active",
      affected: "Industrial complex",
    },
  ];

  const stats = [
    {
      icon: AlertCircle,
      label: "Active Incidents",
      value: "5",
      color: "from-red-500/10 to-red-500/5",
      iconColor: "text-red-500",
      trendValue: "+2 from yesterday",
      trend: "up"
    },
    {
      icon: Users,
      label: "Responders",
      value: "24",
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-500",
      trendValue: "All units deployed",
      trend: "stable"
    },
    {
      icon: Activity,
      label: "Resources Active",
      value: "18",
      color: "from-green-500/10 to-green-500/5",
      iconColor: "text-green-500",
      trendValue: "75% utilization",
      trend: "stable"
    },
    {
      icon: Shield,
      label: "Response Time",
      value: "8 min",
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-500",
      trendValue: "-2 min from avg",
      trend: "down"
    }
  ];

  const contacts = [
    { name: "Emergency Response Team A", number: "555-0123" },
    { name: "Medical Unit Central", number: "555-0124" },
    { name: "Fire Department HQ", number: "555-0125" },
  ];

  return (
    <div className="min-h-screen ">
      {/* Top Stats Bar */}
      <div className=" p-6 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative overflow-hidden bg-gradient-to-br ${stat.color} p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-white/80 backdrop-blur-sm ${stat.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">
                  {stat.label}
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className={`text-xs ${
                  stat.trend === "up" 
                    ? "text-red-500" 
                    : stat.trend === "down" 
                    ? "text-green-500" 
                    : "text-blue-500"
                }`}>
                  {stat.trendValue}
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/5 to-transparent" />
            <div className="absolute bottom-0 right-0 w-24 h-24 transform translate-x-8 translate-y-8">
              <div className={`w-full h-full rounded-full ${stat.color} opacity-20`} />
            </div>
          </div>
        ))}
      </div>
    </div>
      {/* Main Dashboard Content */}
      <div className="max-w-7xl  mx-auto p-6 grid grid-cols-12 gap-6">
        {/* Left Column - Live Updates */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#003366]">Live Updates</h2>
              <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">Live</span>
            </div>
            <div className="space-y-4">
              {emergencies.map((emergency) => (
                <div
                  key={emergency.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedEmergency === emergency.id
                      ? 'bg-[#e1effd] border-l-4 border-[#003366] shadow-md'
                      : 'bg-gray-50 hover:bg-[#e1effd] hover:shadow-md'
                  }`}
                  onClick={() => setSelectedEmergency(emergency.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#003366]">{emergency.title}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      emergency.severity === 'Critical' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {emergency.severity}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-3">
                    <p className="flex items-center gap-2">
                      <Map className="w-4 h-4" />
                      {emergency.location}
                    </p>
                    <p className="text-xs mt-2 text-gray-500">{emergency.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contacts */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-[#003366] mb-6">Emergency Contacts</h2>
            <div className="space-y-4">
              {contacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-[#e1effd] rounded-lg transition-colors duration-300 group">
                  <div>
                    <p className="font-semibold text-[#003366]">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.number}</p>
                  </div>
                  <Phone className="w-5 h-5 text-[#003366] group-hover:scale-110 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column - Map */}
        <div className="col-span-12 lg:col-span-6">
          <div className="p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#003366]">Crisis Map</h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-sm bg-[#e1effd] text-[#003366] rounded-lg hover:bg-[#003366] hover:text-white transition-colors duration-300">
                  Resources
                </button>
                <button className="px-4 py-2 text-sm bg-[#e1effd] text-[#003366] rounded-lg hover:bg-[#003366] hover:text-white transition-colors duration-300">
                  Incidents
                </button>
              </div>
            </div>
            <div className=" h-full rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
              {/* Replace the existing map placeholder with: */}
                <div className="bg-white h-full rounded-lg">
                  <DisasterPage />
                </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-[#003366] mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FileText, label: "New Report" },
                { icon: AlertCircle, label: "Alert Team" },
                { icon: Users, label: "Deploy Unit" },
                { icon: Calendar, label: "Schedule" }
              ].map((action, index) => (
                <button 
                  key={index}
                  className="p-4 bg-[#e1effd] text-[#003366] rounded-xl hover:bg-[#003366] hover:text-white transition-all duration-300 group"
                >
                  <action.icon className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-[#003366] mb-6">Recent Reports</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((report) => (
                <div key={report} className="p-4 bg-gray-50 rounded-lg hover:bg-[#e1effd] cursor-pointer transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#003366]">Situation Report #{report}</p>
                    <FileText className="w-5 h-5 text-gray-500 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Updated 30m ago</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;