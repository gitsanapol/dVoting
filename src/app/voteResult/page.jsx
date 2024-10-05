"use client"

import { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Utility function to hash student ID
async function hashStudentId(studentId) {
  const encoder = new TextEncoder();
  const data = encoder.encode(studentId);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function VoteResultPage() {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});
  const [voteLog, setVoteLog] = useState([]);
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

  // Function to fetch the vote log from the blockchain
  const handleFetchVoteLog = async () => {
    try {
      const response = await fetch("/api/getVoteLog");
      const data = await response.json();

      // Hash the student IDs in the vote log
      const hashedVoteLog = await Promise.all(
        data.map(async (vote) => ({
          candidateId: vote.candidateId,
          studentId: await hashStudentId(vote.studentId),
        }))
      );

      setVoteLog(hashedVoteLog);
    } catch (error) {
      console.error("Failed to fetch vote log:", error);
    }
  };

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

        {/* Button to fetch and display vote log */}
        <div className='text-center my-5'>
          <button
            onClick={handleFetchVoteLog}
            className='bg-blue-500 text-white p-2 rounded-md'
          >
            Show Vote Log
          </button>
        </div>

        {/* Display vote log */}
        {voteLog.length > 0 && (
          <div className='mt-5'>
            <h4 className='text-2xl my-3'>Vote Log</h4>
            <table className='min-w-full border border-gray-300 mt-5 mx-auto'>
              <thead>
                <tr>
                  <th className='border border-gray-300 p-2'>Hashed Student ID</th>
                  <th className='border border-gray-300 p-2'>Voted Candidate ID</th>
                </tr>
              </thead>
              <tbody>
                {voteLog.map((vote, index) => (
                  <tr key={index}>
                    <td className='border border-gray-300 p-2'>{vote.studentId}</td>
                    <td className='border border-gray-300 p-2'>{vote.candidateId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
