// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UniversityVoting {
    struct Candidate {
        string name;
        uint voteCount;
    }

    address public admin;
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    uint public totalCandidates;

    constructor() {
        admin = msg.sender;
    }

    function addCandidate(string memory _name) public {
        require(msg.sender == admin, "Only admin can add candidates.");
        candidates[totalCandidates] = Candidate(_name, 0);
        totalCandidates++;
    }

    function vote(uint candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(candidateId < totalCandidates, "Invalid candidate.");

        candidates[candidateId].voteCount++;
        hasVoted[msg.sender] = true;
    }

    function getCandidate(uint candidateId) public view returns (string memory name, uint voteCount) {
        Candidate storage candidate = candidates[candidateId];
        return (candidate.name, candidate.voteCount);
    }
}
