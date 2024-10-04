import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); // Replace with your RPC URL
const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = [
  "function totalVotesFor(uint candidateId) public view returns (uint)"
];

const contract = new ethers.Contract(contractAddress, abi, provider);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get("candidateId");

  if (!candidateId) {
    return new Response(JSON.stringify({ error: "Candidate ID is required" }), { status: 400 });
  }

  try {
    const voteCount = await contract.totalVotesFor(candidateId);
    return new Response(JSON.stringify({ count: voteCount.toString() }), { status: 200 });
  } catch (error) {
    console.error("Error fetching vote count:", error);
    return new Response(JSON.stringify({ error: "Error fetching vote count" }), { status: 500 });
  }
}
