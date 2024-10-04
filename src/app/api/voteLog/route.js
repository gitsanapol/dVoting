// src/app/api/voteLog/route.js
import { ethers } from "ethers";
import VotingABI from "../../../../lib/VotingABI.json";  // Make sure the path is correct

const contractAddress = process.env.CONTRACT_ADDRESS;
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const adminWallet = new ethers.Wallet(adminPrivateKey, provider);
const votingContract = new ethers.Contract(contractAddress, VotingABI.abi, adminWallet);  // Access the .abi property

export async function GET() {
  try {
    const voters = await provider.listAccounts();
    const voteLogs = [];

    for (const voter of voters) {
      const candidateId = await votingContract.getVoterChoice(voter);
      if (candidateId !== 0) {
        voteLogs.push({ voter, candidateId });
      }
    }

    return new Response(JSON.stringify(voteLogs), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch vote logs:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch vote logs" }), { status: 500 });
  }
}
