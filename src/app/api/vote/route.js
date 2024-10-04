import { ethers } from "ethers";
import VotingABI from "../../../../lib/VotingABI.json";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); // Update with your RPC URL
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

const adminWallet = new ethers.Wallet(adminPrivateKey, provider);
const votingContract = new ethers.Contract(contractAddress, VotingABI.abi, adminWallet);

export async function POST(req) {
  try {
    const { candidateId, studentId } = await req.json();

    if (candidateId === undefined || !studentId) {
      return new Response(JSON.stringify({ error: "Candidate ID and Student ID are required" }), { status: 400 });
    }

    // Check if the student has already voted using the blockchain
    const hasVoted = await votingContract.hasStudentVoted(studentId);
    if (hasVoted) {
      return new Response(JSON.stringify({ error: "Student has already voted" }), { status: 400 });
    }

    // Call the vote function with candidateId and studentId
    const tx = await votingContract.vote(candidateId, studentId);
    await tx.wait(); // Wait for the transaction to be mined

    return new Response(JSON.stringify({ success: true, message: "Vote recorded successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return new Response(JSON.stringify({ error: "Error submitting vote" }), { status: 500 });
  }
}
