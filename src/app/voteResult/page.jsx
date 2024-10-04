"use client";

import { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VoteResultPage() {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.replace("/login");
    }
  }, [session, router]);

  useEffect(() => {
    // Fetch candidates from the SQL server
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

  // Function to fetch the vote counts for each candidate
  const updateVoteCounts = async () => {
    try {
      const results = {};
      for (const candidate of candidates) {
        const response = await fetch(`/api/voteCount?candidateId=${candidate.studentId}`);
        const data = await response.json();
        results[candidate.studentId] = data.count;
      }
      setVotes(results);
    } catch (error) {
      console.error("Failed to fetch vote counts:", error);
    }
  };

  useEffect(() => {
    if (candidates.length > 0) {
      updateVoteCounts();
    }
  }, [candidates]);

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar session={session} />
      <div className='container mx-auto'>
        <h3 className='text-3xl my-3'>Vote Result</h3>
        <hr className='my-3'/>
        <div className='text-center text-xl my-5'>
          <p>Student ID: {session?.user?.studentId}</p>
          <p>Email: {session?.user?.email}</p>
        </div>

        <div className='flex-auto'>
          <div className='text-center'>
            <p>1. Voting U-President KMUTNB</p>
            <p>Start date: 01 Sep 2024</p>
            <p>End date: 07 Sep 2024</p>
          </div>
        </div>

        {/* Table for displaying candidates and vote counts */}
        <table className='min-w-full border border-gray-300 mt-5 mx-auto'>
          <thead>
            <tr>
              <th className='border border-gray-300 p-2'>No</th>
              <th className='border border-gray-300 p-2'>Student ID</th>
              <th className='border border-gray-300 p-2'>Name</th>
              <th className='border border-gray-300 p-2'>Votes</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={candidate.studentId}>
                <td className='border border-gray-300 p-2'>{index + 1}</td>
                <td className='border border-gray-300 p-2'>{candidate.studentId}</td>
                <td className='border border-gray-300 p-2'>{candidate.name}</td>
                <td className='border border-gray-300 p-2'>{votes[candidate.studentId] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
