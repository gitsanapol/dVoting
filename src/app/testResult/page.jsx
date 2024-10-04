"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers"; // Import ethers

export default function VoteResultPage() {
  const [votes, setVotes] = useState({});
  const [voteLogs, setVoteLogs] = useState([]);

  const contractAddress = process.env.CONTRACT_ADDRESS; // Replace with deployed contract address

  // Hardcoded candidates
  const candidates = [
    { id: 1, name: "Candidate 1" },
    { id: 2, name: "Candidate 2" },
    { id: 3, name: "Candidate 3" },
  ];

  // Fetch the vote counts for each candidate
  const updateVoteCounts = async () => {
    try {
      const results = {};
      for (const candidate of candidates) {
        const response = await fetch(`/api/voteCount?candidateId=${candidate.id}`);
        const { count } = await response.json();
        results[candidate.id] = count;
      }
      setVotes(results);
    } catch (error) {
      console.error("Failed to fetch vote counts:", error);
    }
  };

  // Fetch the vote log that shows each voter and their selected candidate
  const fetchVoteLog = async () => {
    try {
      const response = await fetch("/api/voteLog");
      const data = await response.json();
  
      console.log("Data returned from API:", data); // Log the data structure for analysis
      
      // Filter out voters who have not voted and access candidateId correctly
      const formattedLogs = data
        .filter((log) => log.candidateId && typeof log.candidateId === "object" && log.candidateId !== 0n)  // Ensure only valid votes
        .map((log) => {
          let candidateId;
  
          if (typeof log.candidateId === "object" && log.candidateId._hex) {
            candidateId = BigInt(log.candidateId._hex).toString(); // Extract value from _hex if present
          } else {
            candidateId = log.candidateId.toString();
          }
  
          return {
            voter: log.voter,
            candidateId: candidateId, // Convert BigInt or object property to string
          };
        });
  
      setVoteLogs(formattedLogs);
    } catch (error) {
      console.error("Failed to fetch vote log:", error);
    }
  };
  
  
  

  // Fetch vote counts when the component mounts
  useEffect(() => {
    updateVoteCounts();
    fetchVoteLog();
  }, []);

  return (
    <div>
      <h1>Vote Results</h1>
      <h2>Vote Counts</h2>
      {candidates.map((candidate) => (
        <div key={candidate.id}>
          {candidate.name}: {votes[candidate.id] || 0} votes
        </div>
      ))}

      <button onClick={fetchVoteLog} className="mt-4">
        Show Vote Log
      </button>

      {voteLogs.length > 0 && (
        <div>
          <h2>Vote Log</h2>
          <ul>
            {voteLogs.map((log, index) => (
              <li key={index}>
                Voter: {log.voter}, Voted for Candidate ID: {log.candidateId}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
