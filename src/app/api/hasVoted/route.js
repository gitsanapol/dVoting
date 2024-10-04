import { ethers } from "ethers";
import VotingABI from "../../../../lib/VotingABI.json";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const contractAddress = process.env.CONTRACT_ADDRESS;
const votingContract = new ethers.Contract(contractAddress, VotingABI.abi, provider);

// Named export for GET requests
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return new Response(JSON.stringify({ error: "Student ID is required" }), { status: 400 });
    }

    const hasVoted = await votingContract.hasStudentVoted(studentId);
    return new Response(JSON.stringify({ hasVoted }), { status: 200 });
  } catch (error) {
    console.error("Error checking voting status:", error);
    return new Response(JSON.stringify({ error: "Error checking voting status" }), { status: 500 });
  }
}
