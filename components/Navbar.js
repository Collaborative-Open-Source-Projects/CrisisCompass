import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBars,
  faTimes,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/incident-report", label: "Incident Reporting" },
    { href: "/resource-management", label: "Resource Management" },
    { href: "/communication-center", label: "Communication Center" },
  ];

  return (
    <nav className="relative bg-white shadow-lg">
      <div className="px-6 py-4">
        {/* Desktop and Mobile Header */}
        <div className="flex justify-between items-center">
          <Link href="/home">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="CrisisCompass Logo"
                width={50}
                height={50}
                className="rounded-2xl"
              />
              <h1 className="text-[#003366] text-xl font-bold">CrisisCompass</h1>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className="p-3 bg-[#003366] text-white rounded-full hover:bg-blue-700"
              aria-label="User Profile"
            >
              <FontAwesomeIcon icon={faUser} size="lg" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#003366] hover:text-blue-700"
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button
                  className="px-4 py-2 text-[#003366] hover:text-blue-700"
                  aria-label={link.label}
                >
                  {link.label}
                </button>
              </Link>
            ))}
            <div className="relative">
              <button
                className="flex items-center justify-center p-3 bg-[#003366] text-white rounded-full hover:bg-blue-700"
                aria-label="User Profile"
                onClick={() => setShowOverlay(!showOverlay)}
              >
                <FontAwesomeIcon icon={faUser} size="lg" />
              </button>
              {showOverlay && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md p-2 z-50">
                  <Link href="/profile">
                    <button className="w-full px-4 py-2 text-[#003366] hover:bg-gray-100 text-left">
                      View Profile
                    </button>
                  </Link>
                  <button
                    className="w-full px-4 py-2 text-[#003366] hover:bg-gray-100 text-left"
                    onClick={() => (window.location.href = "/")}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <button
                    className="w-full px-4 py-2 text-[#003366] hover:bg-gray-100 text-left"
                    aria-label={link.label}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile User Overlay */}
        {showOverlay && (
          <div className="md:hidden absolute right-6 mt-2 w-32 bg-white shadow-md rounded-md p-2 z-50">
            <Link href="/profile">
              <button 
                className="w-full px-4 py-2 text-[#003366] hover:bg-gray-100 text-left"
                onClick={() => setShowOverlay(false)}
              >
                View Profile
              </button>
            </Link>
            <button
              className="w-full px-4 py-2 text-[#003366] hover:bg-gray-100 text-left"
              onClick={() => (window.location.href = "/")}
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;