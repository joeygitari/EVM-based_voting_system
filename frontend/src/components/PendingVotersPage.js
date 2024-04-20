import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VotingService from './VotingService';

const PendingVotersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  background: 'linear-gradient(45deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
}));

const PendingVotersTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.primary.dark,
  textAlign: 'center',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
  animation: 'fadeIn 1s ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const PendingVotersTable = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  animation: 'slideIn 0.5s ease-in-out',
  '@keyframes slideIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const PendingVotersRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const PendingVotersCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const BackLink = styled(Link)(({ theme }) => ({
  marginTop: theme.spacing(4),
  color: theme.palette.primary.main,
  textDecoration: 'none',
  transition: 'color 0.3s',
  '&:hover': {
    color: theme.palette.primary.dark,
  },
}));

const PendingVotersPage = () => {
  const [pendingVoters, setPendingVoters] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <PendingVotersContainer>
      <PendingVotersTitle variant={isMobile ? 'h4' : 'h2'}>
        Pending Voters
      </PendingVotersTitle>
      <BackLink to="/AdminPage">Back to Admin Home</BackLink>
      {pendingVoters.length === 0 ? (
        <Typography variant="body1">No pending voters found.</Typography>
      ) : (
        <PendingVotersTable component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <PendingVotersCell>First Name</PendingVotersCell>
                <PendingVotersCell>Last Name</PendingVotersCell>
                <PendingVotersCell>Registration Number</PendingVotersCell>
                <PendingVotersCell>Email</PendingVotersCell>
                <PendingVotersCell>Phone Number</PendingVotersCell>
                <PendingVotersCell>Address</PendingVotersCell>
                <PendingVotersCell>Actions</PendingVotersCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingVoters.map((voter, index) => (
                <PendingVotersRow key={index}>
                  <PendingVotersCell>{voter.firstName}</PendingVotersCell>
                  <PendingVotersCell>{voter.lastName}</PendingVotersCell>
                  <PendingVotersCell>{voter.registrationNumber}</PendingVotersCell>
                  <PendingVotersCell>{voter.email}</PendingVotersCell>
                  <PendingVotersCell>{voter.phoneNumber}</PendingVotersCell>
                  <PendingVotersCell>{voter.metamaskAddress}</PendingVotersCell>
                  <PendingVotersCell>
                    <ActionButton
                      variant="contained"
                      color="primary"
                      onClick={() => approveVoter(voter.metamaskAddress)}
                    >
                      Approve
                    </ActionButton>
                    <ActionButton
                      variant="contained"
                      color="secondary"
                      onClick={() => rejectVoter(voter.metamaskAddress)}
                    >
                      Reject
                    </ActionButton>
                  </PendingVotersCell>
                </PendingVotersRow>
              ))}
            </TableBody>
          </Table>
        </PendingVotersTable>
      )}
    </PendingVotersContainer>
  );
};

export default PendingVotersPage;