import React, { useState, useEffect } from 'react';
import VotingService from './VotingService';
import { Button, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const CandidateApprovalPage = () => {
  const [registeredCandidates, setRegisteredCandidates] = useState([]);

  useEffect(() => {
    const fetchRegisteredCandidates = async () => {
      try {
        const candidates = await VotingService.getRegisteredCandidates();
        console.log("Fetched candidates:", candidates);
        setRegisteredCandidates(candidates);
      } catch (error) {
        console.error("Error fetching registered candidates:", error);
      }
    };
  
    fetchRegisteredCandidates();
  }, []);

  const handleApproveCandidate = async (electionId, positionName, candidateUniqueId) => {
    try {
      const candidateId = candidateUniqueId.split('-')[2]; // Extract the actual candidateId from the unique identifier
      await VotingService.approveCandidate(electionId, positionName, candidateId);
      console.log('Candidate approved');
      setRegisteredCandidates(
        registeredCandidates.filter((candidate) => candidate.id !== candidateUniqueId)
      );
    } catch (error) {
      console.error('Error approving candidate:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Candidate Approval
      </Typography>
      <List>
        {registeredCandidates.map((candidate) => (
          <ListItem key={`${candidate.electionId}-${candidate.positionName}-${candidate.id}`}>
            <ListItemText
              primary={candidate.name}
              secondary={`Election: ${candidate.electionName} | Position: ${candidate.positionName}`}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                handleApproveCandidate(candidate.electionId, candidate.positionName, candidate.id)
              }
            >
              Approve
            </Button>
          </ListItem>
        ))}
    </List>
    </Box>
  );
};

export default CandidateApprovalPage;