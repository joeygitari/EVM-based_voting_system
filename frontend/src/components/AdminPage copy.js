import React, { useState, useEffect } from 'react';
import { JsonRpcProvider, Contract } from 'ethers';
import { useLocation, Navigate } from 'react-router-dom';
import './AdminPage.css'; // Import AdminPage.css for styling
import VotingABI from '../contractjson/Voting.json';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const ownerAccount = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Admin's address

const AdminPage = () => {
  const [votingContract, setVotingContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const location = useLocation(); // Get the current location

  // Function to load the contract
  const loadContract = async () => {
    try {
      const provider = new JsonRpcProvider(process.env.REACT_APP_JSON_RPC_URL);
      const signer = provider.getSigner();
      const contract = new Contract(contractAddress, VotingABI.abi, signer);
      setVotingContract(contract);
    } catch (error) {
      console.error('Error loading contract:', error);
    }
  };

  // Function to fetch candidates
  const fetchCandidates = async () => {
    if (votingContract) {
      try {
        const candidateCount = await votingContract.candidatesCount();
        const candidatesArray = [];
        for (let i = 0; i < candidateCount.toNumber(); i++) {
          const candidate = await votingContract.candidates(i);
          candidatesArray.push(candidate);
        }
        setCandidates(candidatesArray);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    }
  };

  // Load contract on component mount
  useEffect(() => {
    loadContract();
  }, []);

  // Fetch candidates when the contract is set
  useEffect(() => {
    fetchCandidates();
  }, [votingContract]);

  // Handler for adding a new candidate
  const handleAddCandidate = async (event) => {
    event.preventDefault();
    if (!newCandidateName.trim()) return;
    try {
      const tx = await votingContract.addCandidate(newCandidateName);
      await tx.wait();
      setNewCandidateName('');
      await fetchCandidates(); // Refresh the candidate list
      console.log('Candidate added successfully');
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <nav className="navbar">
          <ul className="nav-list">
            <li className="nav-item"><a href="#candidates">Candidates</a></li>
            <li className="nav-item"><a href="#voters">Voters</a></li>
            <li className="nav-item"><a href="#start-election">Start Election</a></li>
            <li className="nav-item"><a href="#approve-voters">Approve Voters</a></li>
            <li className="nav-item"><a href="#reject-voters">Reject Voters</a></li>
          </ul>
        </nav>
      </header>
      <div className="admin-content">
        <section id="candidates">
          <h2 className="section-title">Candidates List</h2>
          <form onSubmit={handleAddCandidate}>
            <input
              type="text"
              value={newCandidateName}
              onChange={(e) => setNewCandidateName(e.target.value)}
              placeholder="Enter candidate name"
              className="candidate-input"
            />
            <button type="submit" className="add-candidate-button">Add Candidate</button>
          </form>
          <ul className="candidates-list">
            {candidates.map((candidate, index) => (
              <li key={index} className="candidate-item">{candidate.name}</li>
            ))}
          </ul>
        </section>
        {/* Other sections for voters, start election, approve/reject voters */}
      </div>
    </div>
  );
};

export default AdminPage;
