"use client"

import Image from "next/image";
import { useEffect } from "react";

export default function Home() {

  const test = async () => {
    const response = await fetch('/api/fema/resilience-zones?county=NewHavenCounty');
    console.log(await response.json());
  }

  useEffect(() => {
    // test();
  }, []);

  return (
    <></>
  );
}
