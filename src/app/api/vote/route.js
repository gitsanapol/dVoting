import { ethers } from "ethers";
import VotingABI from "../../../../lib/VotingABI.json";

// Provide a consistent provider and wallet initialization
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); // Update with your RPC URL
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

let votingContract;

const initializeContract = () => {
  // Ensure the contract is initialized only once
  if (!votingContract) {
    const adminWallet = new ethers.Wallet(adminPrivateKey, provider);
    votingContract = new ethers.Contract(contractAddress, VotingABI.abi, adminWallet);
  }
};

export async function POST(req) {
  try {
    // Ensure the contract is initialized before using it
    initializeContract();

    const { candidateId, studentId } = await req.json();

    if (candidateId === undefined || !studentId) {
      return new Response(JSON.stringify({ error: "Candidate ID and Student ID are required" }), { status: 400 });
    }

    // Log candidateId and studentId to debug further
    console.log("Candidate ID received:", candidateId);
    console.log("Student ID received:", studentId);

    // Convert candidateId to number if it isn't already
    const candidateIdNum = Number(candidateId);

    // Call the vote function with candidateId and studentId
    const tx = await votingContract.vote(candidateIdNum, studentId);
    await tx.wait(); // Wait for the transaction to be mined

    return new Response(JSON.stringify({ success: true, message: "Vote recorded successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return new Response(JSON.stringify({ error: "Error submitting vote" }), { status: 500 });
  }
}
