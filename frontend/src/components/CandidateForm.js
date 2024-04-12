import React, { useState, useEffect } from 'react';
import VotingService from './VotingService';
import { Button, TextField, Typography, Box, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CandidateRegistrationForm = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [candidateName, setCandidateName] = useState('');

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const electionCount = await VotingService.getElectionCount();
        const electionDetails = [];

        for (let i = 1; i <= electionCount; i++) {
          const details = await VotingService.getElection(i);
          electionDetails.push({
            id: i,
            name: details.name,
            positionNames: details.positionNames || [],
          });
        }

        setElections(electionDetails);
      } catch (error) {
        console.error('Error fetching elections:', error);
      }
    };

    fetchElections();
  }, []);

  const handleCandidateRegistration = async () => {
    try {
      await VotingService.registerCandidate(Number(selectedElection), selectedPosition, candidateName);
      console.log('Candidate registered');
      setSelectedElection('');
      setSelectedPosition('');
      setCandidateName('');
    } catch (error) {
      console.error('Error registering candidate:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Candidate Registration
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Election</InputLabel>
            <Select value={selectedElection} onChange={(e) => setSelectedElection(e.target.value)}>
              {elections.map((election) => (
                <MenuItem key={election.id} value={election.id}>
                  {election.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Position</InputLabel>
            <Select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
              {selectedElection &&
                elections
                  .find((election) => election.id === Number(selectedElection))
                  ?.positionNames.map((position) => (
                    <MenuItem key={position} value={position}>
                      {position}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Candidate Name"
            fullWidth
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleCandidateRegistration}>
            Register
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CandidateRegistrationForm;