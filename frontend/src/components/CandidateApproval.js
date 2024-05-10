import React, { useState, useEffect } from 'react';
import VotingService from './VotingService';
import { Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { ArrowBack, CheckCircle, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StyledTableContainer = styled(TableContainer)({
  maxWidth: 800,
  margin: 'auto',
  marginTop: 20,
  borderRadius: 10,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
});

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  backgroundColor: '#f5f5f5',
});

const StyledButton = styled(Button)({
  marginLeft: 10,
});

const CandidateApprovalPage = () => {
  const [registeredCandidates, setRegisteredCandidates] = useState([]);
  const navigate = useNavigate();

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

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Box sx={{ background: 'linear-gradient(45deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
        <IconButton onClick={handleGoBack}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" align="center" gutterBottom>
          Candidate Approval
        </Typography>
        <Box sx={{ width: 40 }} /> {/* Empty space to maintain centering */}
      </Box>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Candidate Name</StyledTableCell>
              <StyledTableCell>Election</StyledTableCell>
              <StyledTableCell>Position</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registeredCandidates.map((candidate) => (
              <TableRow key={`${candidate.electionId}-${candidate.positionName}-${candidate.id}`}>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.electionName}</TableCell>
                <TableCell>{candidate.positionName}</TableCell>
                <TableCell>
                  <Tooltip title="Approve Candidate">
                    <IconButton
                      color="primary"
                      onClick={() => handleApproveCandidate(candidate.electionId, candidate.positionName, candidate.id)}
                    >
                      <CheckCircle />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject Candidate">
                    <IconButton color="error">
                      <Cancel />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
};

export default CandidateApprovalPage;