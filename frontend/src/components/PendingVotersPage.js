import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PendingVotersPage.css';
import VotingService from './VotingService';

const PendingVotersPage = () => {
  const [pendingVoters, setPendingVoters] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Connecting to Metamask from PendingVotersPage...');
        await VotingService.connectToMetamask();
        console.log('Connected to Metamask, fetching pending voters...');
        fetchPendingVoters();
      } catch (error) {
        console.error('Failed to connect to Metamask:', error);
      }
    };
    initialize();
  }, []);

  const fetchPendingVoters = async () => {
    try {
      console.log('Fetching pending voters...');
      const pendingVoterAddresses = await VotingService.getPendingVoters();
      console.log('Pending voter addresses:', pendingVoterAddresses);

      const pendingVoterDetails = await Promise.all(
        pendingVoterAddresses.map(async (address) => {
          const voter = await VotingService.getVoter(address);
          return voter;
        })
      );

      console.log('Pending voter details:', pendingVoterDetails);
      setPendingVoters(pendingVoterDetails);
    } catch (error) {
      console.error('Failed to fetch pending voters:', error);
    }
  };

  const approveVoter = async (address) => {
    try {
      console.log('Approving voter with address:', address);
      await VotingService.approveVoter(address);
      console.log('Voter approved');
      fetchPendingVoters();
    } catch (error) {
      console.error('Failed to approve voter:', error);
    }
  };

  const rejectVoter = async (address) => {
    try {
      console.log('Rejecting voter with address:', address);
      await VotingService.rejectVoter(address);
      console.log('Voter rejected');
      fetchPendingVoters();
    } catch (error) {
      console.error('Failed to reject voter:', error);
    }
  };

  return (
    <div className="admin-page-container">
      <h2 className="admin-page-title">Pending Voters</h2>
      <div className="admin-page-content">
        <Link to="/AdminPage" className="admin-page-link">
          Back to Admin Home
        </Link>
        {pendingVoters.length === 0 ? (
          <p>No pending voters found.</p>
        ) : (
          <table className="voter-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Registration Number</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingVoters.map((voter, index) => (
                <tr key={index}>
                  <td>{voter.firstName}</td>
                  <td>{voter.lastName}</td>
                  <td>{voter.registrationNumber}</td>
                  <td>{voter.email}</td>
                  <td>{voter.phoneNumber}</td>
                  <td>{voter.metamaskAddress}</td>
                  <td>
                    <button onClick={() => approveVoter(voter.metamaskAddress)}>
                      Approve
                    </button>
                    <button onClick={() => rejectVoter(voter.metamaskAddress)}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PendingVotersPage;