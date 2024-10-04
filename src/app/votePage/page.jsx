"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VotePage() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false); // State to track if user has already voted
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.replace("/login");
    }
  }, [session, router]);

  useEffect(() => {
    // Fetch candidates from the database
    const fetchCandidates = async () => {
      try {
        const response = await fetch("/api/getStudents");
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    // Check if the user has already voted
    const checkIfVoted = async () => {
      if (session?.user?.studentId) {
        try {
          const response = await fetch(`/api/hasVoted?studentId=${session.user.studentId}`);
          const data = await response.json();
          setHasVoted(data.hasVoted);
        } catch (error) {
          console.error("Failed to check voting status:", error);
        }
      }
    };

    checkIfVoted();
  }, [session]);

  if (!session) {
    return <p>Loading...</p>;
  }

  const handleCandidateChange = (event) => {
    setSelectedCandidate(parseInt(event.target.value)); // Convert to number
  };

  const handleVote = async () => {
    if (selectedCandidate !== null) {
      try {
        const response = await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidateId: selectedCandidate,
            studentId: session?.user?.studentId, // Pass the voter's student ID to the backend
          }),
        });
        const data = await response.json();
        if (response.ok) {
          alert(`Vote recorded for candidate ID: ${selectedCandidate}`);
          setHasVoted(true); // Update the state to reflect that the user has voted
        } else {
          alert(`Error: ${data.error}`);
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Vote submission failed:", error);
      }
    }
  };

  return (
    <div>
      <Navbar session={session} />
      <div className='container mx-auto'>
        <h3 className='text-3xl my-3'>Vote Page</h3>
        <hr className='my-3'/>
        <div className='text-center text-xl my-5'>
          <p>StudentId: {session?.user?.studentId}</p>
          <p>Email: {session?.user?.email}</p>
        </div>
        
        <div className='flex-auto'>
          <div className='text-center'>
            <p>1. Voting U-President KMUTNB</p>
            <p>Start date: 01 Sep 2024</p>
            <p>End date: 07 Sep 2024</p>
          </div>
        </div>

        {/* Table for displaying candidates */}
        <table className='min-w-full border border-gray-300 mt-5 mx-auto'>
          <thead>
            <tr>
              <th className='border border-gray-300 p-2'>Select</th>
              <th className='border border-gray-300 p-2'>Student ID</th>
              <th className='border border-gray-300 p-2'>Name</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.studentId}>
                <td className='border border-gray-300 p-2 text-center'>
                  <input
                    type='radio'
                    name='candidate'
                    value={parseInt(candidate.studentId)} // Ensure it's a number
                    checked={selectedCandidate === parseInt(candidate.studentId)} // Ensure consistent comparison
                    onChange={handleCandidateChange}
                    disabled={hasVoted} // Disable input if the user has already voted
                  />
                </td>
                <td className='border border-gray-300 p-2'>{candidate.studentId}</td>
                <td className='border border-gray-300 p-2'>{candidate.name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Button to submit the vote */}
        <div className='text-center my-5'>
          <button
            onClick={handleVote}
            className='bg-blue-500 text-white p-2 rounded-md'
            disabled={!selectedCandidate || hasVoted} // Disable button if no candidate is selected or if the user has already voted
          >
            Submit Vote
          </button>
          {hasVoted && (
            <p className='text-red-500 mt-3'>You have already voted and cannot vote again.</p>
          )}
        </div>
      </div>
    </div>
  );
}
