"use client"

import Image from "next/image";
import { useEffect } from "react";

export default function Home() {

  const test = async () => {
    const response = await fetch('/api/fema/resilience-zones?county=NewHavenCounty');
    console.log(await response.json());
  };

  const test2 = async (long, lat) => {
    const res = await fetch(`/api/hospital?longitude=${long}&latitude=${lat}`);
    console.log(await res.json());
  };

  const test3 = async (long, lat) => {
    const res = await fetch(`/api/transportation?longitude=${long}&latitude=${lat}`);
    console.log(await res.json());
  };

  const test4 = async (long, lat) => {
    const res = await fetch(`/api/accommodation?longitude=${long}&latitude=${lat}`);
    console.log(await res.json());
  };

  const test5 = async (long, lat) => {
    const res = await fetch(`/api/social-services/food?longitude=${long}&latitude=${lat}`);
    console.log(await res.json());
  };

  const test6 = async (long, lat) => {
    const res = await fetch(`/api/social-services/shelter?longitude=${long}&latitude=${lat}`);
    console.log(await res.json());
  };

  useEffect(() => {
    // test();
    // test2(-118.243683, 34.052235);
  }, []);

  return (
    <></>
  );
}
