"use client"

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function page() {

  const [selectedCandidate, setSelectedCandidate] = useState(null);

    const { data: session } = useSession();
    const router = useRouter();
    useEffect(() => {
      if (session === null) {
        router.replace("/login");
      }
    }, [session, router]);
    if (!session) {
      return <p>Loading...</p>;
    }

    // Hardcoded candidates
    const candidates = [
      { studentID: 'c01', name: 'John' },
      { studentID: 'c02', name: 'Jane' },
      { studentID: 'c03', name: 'Doe' },
    ];



    const handleCandidateChange = (event) => {
      setSelectedCandidate(event.target.value); // Update the selected candidate
    };

    
  return (
    <div>
        <Navbar session={session} />
        <div className='container mx-auto'>
            <h3 className='text-3xl my-3'>Vote Page</h3>
            <hr className='my-3'/>
            <div className='text-center text-xl my-5'>
              <p>studentID: {session?.user?.studentID}</p>
              <p>Email: {session?.user?.email}</p>
            </div>

            <div className='flex-auto'>
              <div className='text-center'>
              <p>1.Voting U-Presient KMUTNB</p>
              <p>start date: 01 Sep 2024</p>
              <p>end date: 07 Sep 2024</p>
              </div>
            </div>
            {/* Table for displaying student data */}
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
                            <tr key={candidate.studentID}>
                                <td className='border border-gray-300 p-2 text-center'>
                                    <input
                                        type='radio'
                                        name='candidate' // Grouping radio buttons by name
                                        value={candidate.studentID} // Value to identify the candidate
                                        checked={selectedCandidate === candidate.studentID} // Check if this candidate is selected
                                        onChange={handleCandidateChange} // Handle change
                                    />
                                </td>
                                <td className='border border-gray-300 p-2'>{candidate.studentID}</td>
                                <td className='border border-gray-300 p-2'>{candidate.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Button to submit the vote */}
                <div className='text-center my-5'>
                    <button
                        onClick={() => alert(`You voted for candidate ID: ${selectedCandidate}`)}
                        className='bg-blue-500 text-white p-2 rounded-md'
                        disabled={!selectedCandidate} // Disable button if no candidate is selected
                    >
                        Submit Vote
                    </button>
                </div>
            
        </div>
    </div>
  )
}
