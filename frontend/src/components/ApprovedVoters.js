import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PendingVotersPage.css';
import VotingService from './VotingService';

const ApprovedVotersPage = () => {
  const [approvedVoters, setApprovedVoters] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Connecting to Metamask from ApprovedVotersPage...');
        await VotingService.connectToMetamask();
        console.log('Connected to Metamask, fetching approved voters...');
        fetchApprovedVoters();
      } catch (error) {
        console.error('Failed to connect to Metamask:', error);
      }
    };
    initialize();
  }, []);

  const fetchApprovedVoters = async () => {
    try {
      console.log('Fetching approved voters...');
      let index = 0;
      const approvedVoterDetails = [];

      while (true) {
        try {
          const voterAddress = await VotingService.getApprovedVoters(index);
          const voter = await VotingService.getVoter(voterAddress);
          approvedVoterDetails.push(voter);
          index++;
        } catch (error) {
          console.log('Reached end of approved voters');
          break;
        }
      }

      console.log('Approved voter details:', approvedVoterDetails);
      setApprovedVoters(approvedVoterDetails);
    } catch (error) {
      console.error('Failed to fetch approved voters:', error);
    }
  };
  return (
    <div className="admin-page-container">
      <h2 className="admin-page-title">Approved Voters</h2>
      <div className="admin-page-content">
        <Link to="/AdminPage" className="admin-page-link">
          Back to Admin Home
        </Link>
        {approvedVoters.length === 0 ? (
          <p>No approved voters found.</p>
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
              </tr>
            </thead>
            <tbody>
              {approvedVoters.map((voter, index) => (
                <tr key={index}>
                  <td>{voter.firstName}</td>
                  <td>{voter.lastName}</td>
                  <td>{voter.registrationNumber}</td>
                  <td>{voter.email}</td>
                  <td>{voter.phoneNumber}</td>
                  <td>{voter.metamaskAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ApprovedVotersPage;