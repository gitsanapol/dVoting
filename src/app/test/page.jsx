// src/app/VotePage.jsx
"use client";
import { useState, useEffect } from "react";

export default function VotePage() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votes, setVotes] = useState({});
  const contractAddress = process.env.CONTRACT_ADDRESS;

  // Hardcoded candidates
  const candidates = [
    { id: 1, name: "Candidate 1" },
    { id: 2, name: "Candidate 2" },
    { id: 3, name: "Candidate 3" },
  ];

  const handleVote = async () => {
    if (selectedCandidate !== null) {
      try {
        const response = await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidateId: selectedCandidate }),
        });
        const data = await response.json();
        if (response.ok) {
          alert(`Vote recorded for candidate ID: ${selectedCandidate}`);
          updateVoteCounts();
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Vote submission failed:", error);
      }
    }
  };

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

  useEffect(() => {
    updateVoteCounts();
  }, []);

  const fetchVoteCounts = async (candidateId) => {
    try {
      const response = await fetch(`/api/voteCount?candidateId=${candidateId}`);
      if (!response.ok) {
        throw new Error(`Error fetching vote count: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Votes for candidate ${candidateId}:`, data.voteCount);
    } catch (error) {
      console.error("Failed to fetch vote counts:", error);
    }
  };

  return (
    <div>
      <h1>Vote for Your Candidate</h1>
      {candidates.map((candidate) => (
        <div key={candidate.id}>
          <input
            type="radio"
            name="candidate"
            value={candidate.id}
            onChange={() => setSelectedCandidate(candidate.id)}
          />
          {candidate.name} (Votes: {votes[candidate.id] || 0})
        </div>
      ))}
      <button onClick={handleVote} disabled={selectedCandidate === null}>
        Submit Vote
      </button>
    </div>
  );
}
