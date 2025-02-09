import React, { useState } from 'react';
import { Map, AlertCircle, Phone, FileText, Users, Activity, Shield, Calendar } from 'lucide-react';

const CrisisMap = () => {
  const [showResources, setShowResources] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);

  return (
    <div className="relative h-full">
      <svg 
        viewBox="0 0 800 600" 
        className="w-full h-full bg-[#f0f6ff]"
      >
        {/* Map Background Elements */}
        {/* Roads */}
        <path 
          d="M100,100 L700,100 M200,50 L200,550 M600,50 L600,550 M100,300 L700,300 M100,500 L700,500" 
          stroke="#cbd5e1" 
          strokeWidth="4"
          fill="none"
        />
        
        {/* Districts */}
        <path 
          d="M150,150 L250,150 L250,250 L150,250 Z" 
          fill="#e2e8f0" 
          stroke="#94a3b8"
          strokeWidth="2"
        />
        <text x="170" y="210" className="text-xs" fill="#64748b">District A</text>
        
        <path 
          d="M550,150 L650,150 L650,250 L550,250 Z" 
          fill="#e2e8f0" 
          stroke="#94a3b8"
          strokeWidth="2"
        />
        <text x="570" y="210" className="text-xs" fill="#64748b">District B</text>
        
        <path 
          d="M350,350 L450,350 L450,450 L350,450 Z" 
          fill="#e2e8f0" 
          stroke="#94a3b8"
          strokeWidth="2"
        />
        <text x="370" y="410" className="text-xs" fill="#64748b">District C</text>

        {/* Water Bodies */}
        <path 
          d="M50,400 Q200,350 350,400 T650,400" 
          fill="#bfdbfe" 
          stroke="#60a5fa"
          strokeWidth="2"
        />
        <text x="300" y="380" className="text-xs" fill="#1d4ed8">River Valley</text>

        {showIncidents && (
          <>
            {/* Incident Markers */}
            {/* Critical Incident */}
            <g transform="translate(600,200)">
              <circle r="15" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
              <circle r="8" fill="#dc2626" />
              <animateTransform 
                attributeName="transform"
                type="translate"
                values="600,200;600,195;600,200"
                dur="2s"
                repeatCount="indefinite"
              />
            </g>
            <text x="620" y="205" className="text-xs font-bold" fill="#dc2626">Fire Outbreak</text>

            {/* High Alert Incident */}
            <g transform="translate(200,400)">
              <circle r="15" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
              <circle r="8" fill="#d97706" />
              <animateTransform 
                attributeName="transform"
                type="translate"
                values="200,400;200,395;200,400"
                dur="2s"
                repeatCount="indefinite"
              />
            </g>
            <text x="220" y="405" className="text-xs font-bold" fill="#d97706">Flood Warning</text>
          </>
        )}

        {showResources && (
          <>
            {/* Resource Markers */}
            {/* Emergency Response Units */}
            <g transform="translate(400,200)">
              <rect x="-8" y="-8" width="16" height="16" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
              <path d="M-4,-4 L4,-4 L4,4 L-4,4 Z" fill="#2563eb" />
            </g>
            <text x="410" y="205" className="text-xs" fill="#2563eb">Response Team A</text>

            <g transform="translate(300,300)">
              <rect x="-8" y="-8" width="16" height="16" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
              <path d="M-4,-4 L4,-4 L4,4 L-4,4 Z" fill="#2563eb" />
            </g>
            <text x="310" y="305" className="text-xs" fill="#2563eb">Medical Unit</text>

            <g transform="translate(500,400)">
              <rect x="-8" y="-8" width="16" height="16" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
              <path d="M-4,-4 L4,-4 L4,4 L-4,4 Z" fill="#2563eb" />
            </g>
            <text x="510" y="405" className="text-xs" fill="#2563eb">Fire Department</text>
          </>
        )}

        {/* Scale and Legend */}
        <g transform="translate(50,550)">
          <line x1="0" y1="0" x2="100" y2="0" stroke="#64748b" strokeWidth="2" />
          <text x="45" y="20" className="text-xs" fill="#64748b">1 km</text>
        </g>
      </svg>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-3">
        <button 
          onClick={() => setShowResources(!showResources)}
          className={`px-4 py-2 text-sm rounded-lg transition-colors duration-300 ${
            showResources 
              ? 'bg-[#003366] text-white' 
              : 'bg-[#e1effd] text-[#003366]'
          }`}
        >
          Resources
        </button>
        <button 
          onClick={() => setShowIncidents(!showIncidents)}
          className={`px-4 py-2 text-sm rounded-lg transition-colors duration-300 ${
            showIncidents 
              ? 'bg-[#003366] text-white' 
              : 'bg-[#e1effd] text-[#003366]'
          }`}
        >
          Incidents
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <span className="text-xs text-gray-600">Critical Incident</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-orange-600"></div>
          <span className="text-xs text-gray-600">High Alert</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600"></div>
          <span className="text-xs text-gray-600">Response Unit</span>
        </div>
      </div>
    </div>
  );
};

export default CrisisMap;