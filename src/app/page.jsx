"use client"; // Add this line at the top

import Image from "next/image";
import Navbar from "./components/Navbar";
import { useSession } from 'next-auth/react'; // Import useSession from next-auth

export default function Home() {
  const { data: session } = useSession(); // Get the session data

  return (
    <main>
      <Navbar session={session} /> {/* Pass the session to Navbar */}
    </main>
  );
}
