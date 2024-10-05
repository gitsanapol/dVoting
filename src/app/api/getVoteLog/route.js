import { ethers } from "ethers";
import VotingABI from "../../../../lib/VotingABI.json";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const contractAddress = process.env.CONTRACT_ADDRESS;
const votingContract = new ethers.Contract(contractAddress, VotingABI.abi, provider);

export async function GET(req) {
    try {
      const voteLog = await votingContract.getVoteLog();
      // Format the vote log to be a simple array of objects
      const formattedLog = voteLog.map(vote => ({
        candidateId: vote.candidateId.toString(), // Convert BigNumber to string
        studentId: vote.studentId,
      }));
      return new Response(JSON.stringify(formattedLog), { status: 200 });
    } catch (error) {
      console.error("Error fetching vote log:", error);
      return new Response(JSON.stringify({ error: "Error fetching vote log" }), { status: 500 });
    }
  }
  
