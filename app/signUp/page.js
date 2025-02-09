"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link';

function Page() {
  return (
    <>
    <div className="flex items-center">
      <Link href='/' className='flex items-center ' aria-label='home'>
        <Image
          src="/logo.png"  
          alt="CrisisCompass Logo"
          width={50}
          height={50}
          className="rounded-2xl "
        />
        <h1 className="text-[#003366] text-xl font-bold">CrisisCompass</h1>
      </Link>
    </div>

    <div className="flex h-screen items-center justify-center bg-white">
      <div className="hidden md:block">
        <Image
          src="https://images.pexels.com/photos/73821/train-wreck-steam-locomotive-locomotive-railway-73821.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Train Wreck"
          width={600} 
          height={600} 
          className="rounded-2xl shadow-lg"
        />
      </div>

      <div>
        <div className=" p-20 h-[70vh] lg:w-[30vw] md:w-[95vw] sm:w-[90vw] rounded-lg border border-gray-300 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-bold text-black">Sign Up</h2>

          <form>
            <div className="mb-4">
              <label className="block text-black" htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-[#003366] focus:ring-[#003366]"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-black" htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-[#003366] focus:ring-[#003366]"
                placeholder="Enter your username"
              />
            </div>

            <div className="mb-4">
              <label className="block text-black" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-[#003366] focus:ring-[#003366]"
                placeholder="Enter your password"
              />
            </div>

            <div className="mb-4">
              <label className="block text-black" htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-[#003366] focus:ring-[#003366]"
                placeholder="Confirm your password"
              />
            </div>

            <Link
                                href="/home"
                                aria-label="homepage"
                                className="mt-4 w-full rounded-lg bg-[#003366] p-2 text-white hover:bg-black transition"
                            >
                                <button type="button" className="w-full rounded-lg bg-[#003366] p-2 text-white hover:bg-black transition">
                                    Sign Up
                                </button>
                            </Link>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-[#003366] hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  </>
  )
}

export default Page
