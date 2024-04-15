import React, { useState, useEffect } from 'react';
import VotingService from './VotingService';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  RadioGroup,
  Radio,
  FormControlLabel,
  LinearProgress,
} from '@mui/material';
import { AccessTime, HowToVote } from '@mui/icons-material';

const ElectionDetails = () => {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [election, setElection] = useState(null);
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdownTime, setCountdownTime] = useState(null);
  const [electionStatus, setElectionStatus] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const electionCount = await VotingService.getElectionCount();
        const electionPromises = [];

        for (let i = 1; i <= electionCount; i++) {
          electionPromises.push(VotingService.getElection(i));
        }

        const electionData = await Promise.all(electionPromises);
        setElections(electionData);
        setSelectedElectionId(electionData[0]?.id || null);
      } catch (error) {
        console.error('Error fetching elections:', error);
        setError('Failed to fetch elections. Please try again.');
      }
    };

    fetchElections();
  }, []);

  useEffect(() => {
    const fetchElectionDetails = async () => {
      if (!selectedElectionId) return;

      try {
        setLoading(true);

        const electionDetails = await VotingService.getElection(selectedElectionId);
        const positionNames = await VotingService.getPositionNames(selectedElectionId);

        const candidatesData = await Promise.all(
          positionNames.map(async (positionName) => {
            const candidateDetails = await VotingService.getCandidates(selectedElectionId, positionName);
            return { positionName, candidates: candidateDetails };
          })
        );

        setElection(electionDetails);
        setPositions(positionNames);
        setCandidates(
          candidatesData.reduce((obj, { positionName, candidates }) => {
            obj[positionName] = candidates;
            return obj;
          }, {})
        );
        setLoading(false);
      } catch (error) {
        console.error('Error fetching election details:', error);
        setError('Failed to fetch election details. Please try again.');
        setLoading(false);
      }
    };

    const startCountdown = () => {
      if (!election) return;

      const currentTime = Math.floor(Date.now() / 1000);
      const startTime = Number(election.startTime);
      const endTime = Number(election.endTime);

      if (currentTime < startTime) {
        setElectionStatus('Upcoming');
        setCountdownTime(startTime - currentTime);
      } else if (currentTime >= startTime && currentTime < endTime) {
        setElectionStatus('Ongoing');
        setCountdownTime(endTime - currentTime);
      } else {
        setElectionStatus('Ended');
        setCountdownTime(null);
      }
    };

    fetchElectionDetails();
    startCountdown();
    const countdownInterval = setInterval(startCountdown, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [selectedElectionId]);

  const handleElectionChange = (event) => {
    setSelectedElectionId(event.target.value);
  };

  const handleCandidateSelect = (positionName, candidateId) => {
    setSelectedCandidates((prevSelectedCandidates) => ({
      ...prevSelectedCandidates,
      [positionName]: candidateId,
    }));
  };

  const handleVote = async () => {
    try {
      await Promise.all(
        Object.entries(selectedCandidates).map(([positionName, candidateId]) =>
          VotingService.vote(selectedElectionId, positionName, candidateId)
        )
      );
      setSelectedCandidates({});
      alert('Vote cast successfully!');
    } catch (error) {
      console.error('Error casting vote:', error);
      setError('Failed to cast vote. Please try again.');
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(null);
  };

  const formatTime = (time) => {
    const days = Math.floor(time / (24 * 60 * 60));
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = Math.floor(time % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!election) {
    return (
      <Box py={4}>
        <Typography variant="h5" align="center" color="textSecondary">
          No election found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box py={4}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
                    {election.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Select Election</InputLabel>
                    <Select value={selectedElectionId} onChange={handleElectionChange} label="Select Election">
                      {elections.map((election) => (
                        <MenuItem key={election.id} value={election.id}>
                          {election.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2} justifyContent="center" mt={2}>
                <Grid item>
                  <Chip
                    avatar={
                      <Avatar>
                        <AccessTime />
                      </Avatar>
                    }
                    label={`Start: ${new Date(Number(election.startTime) * 1000).toLocaleString()}`}
                    variant="outlined"
                    color="primary"
                  />
                </Grid>
                <Grid item>
                  <Chip
                    avatar={
                      <Avatar>
                        <AccessTime />
                      </Avatar>
                    }
                    label={`End: ${new Date(Number(election.endTime) * 1000).toLocaleString()}`}
                    variant="outlined"
                    color="secondary"
                  />
                </Grid>
              </Grid>
              {electionStatus && (
                <Box mt={2}>
                  <Typography variant="h6" align="center" gutterBottom>
                    {electionStatus} Election
                  </Typography>
                  {countdownTime !== null && (
                    <Box mt={1}>
                      <LinearProgress variant="determinate" value={(countdownTime / (Number(election.endTime) - Number(election.startTime))) * 100} />
                      <Typography variant="body2" align="center" mt={1}>
                        {formatTime(countdownTime)} remaining
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" startIcon={<HowToVote />} fullWidth disabled={electionStatus !== 'Ongoing'}>
                {electionStatus === 'Ongoing' ? 'Vote Now' : `Voting ${electionStatus === 'Upcoming' ? 'starts' : 'ended'} on ${new Date(electionStatus === 'Upcoming' ? Number(election.startTime) * 1000 : Number(election.endTime) * 1000).toLocaleString()}`}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        {positions.length > 0 && (
          <Grid item xs={12} md={8}>
            <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
              Positions and Candidates
            </Typography>
            <Grid container spacing={2}>
              {positions.map((positionName) => (
                <Grid item xs={12} key={positionName}>
                  <Paper elevation={2}>
                    <Box p={2}>
                      <Typography variant="h6" gutterBottom>
                        {positionName}
                      </Typography>
                      <RadioGroup
                        value={selectedCandidates[positionName] || ''}
                        onChange={(event) => handleCandidateSelect(positionName, event.target.value)}
                      >
                        {candidates[positionName]?.map((candidate) => (
                          <FormControlLabel
                            key={candidate.id}
                            value={candidate.id}
                            control={<Radio />}
                            label={candidate.name}
                          />
                        ))}
                      </RadioGroup>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={handleVote}>
                Cast Vote
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" elevation={6} variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ElectionDetails;