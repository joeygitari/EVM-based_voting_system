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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { AccessTime, CheckCircle, HowToVote } from '@mui/icons-material';

const ElectionDetails = () => {
  const [election, setElection] = useState(null);
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        setLoading(true);
        const electionId = 1; // Assuming we're fetching the details of the first election
  
        const electionDetails = await VotingService.getElection(electionId);
        const positionNames = await VotingService.getPositionNames(electionId);
  
        const candidatesData = await Promise.all(
          positionNames.map(async (positionName) => {
            const candidateDetails = await VotingService.getCandidates(electionId, positionName);
            return { positionName, candidates: candidateDetails };
          })
        );
  
        setElection(electionDetails);
        setPositions(positionNames);
        setCandidates(candidatesData.reduce((obj, { positionName, candidates }) => {
          obj[positionName] = candidates;
          return obj;
        }, {}));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching election details:', error);
        setError('Failed to fetch election details. Please try again.');
        setLoading(false);
      }
    };
  
    fetchElectionDetails();
  }, []);
  

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(null);
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
              <Typography variant={isMobile ? 'h5' : 'h4'} align="center" gutterBottom>
                {election.name}
              </Typography>
              <Grid container spacing={2} justifyContent="center">
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
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" startIcon={<HowToVote />} fullWidth>
                Vote Now
              </Button>
            </CardActions>
          </Card>
        </Grid>
        {positions.length > 0 && (
          <Grid item xs={12} md={8}>
            <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
              Positions
            </Typography>
            <List>
              {positions.map((positionName) => (
                <ListItem key={positionName}>
                  <ListItemText primary={positionName} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <CheckCircle color="primary" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>
        )}
        {Object.keys(candidates).length > 0 && (
          <Grid item xs={12} md={8}>
            <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
              Candidates
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(candidates).map(([positionName, candidatesList]) => (
                <Grid item xs={12} key={positionName}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant={isMobile ? 'subtitle1' : 'h6'} gutterBottom>
                        {positionName}
                      </Typography>
                      <List dense>
                        {candidatesList.map((candidate) => (
                          <ListItem key={candidate.id}>
                            <ListItemText primary={candidate.name} />
                            <ListItemSecondaryAction>
                              <IconButton edge="end">
                                <CheckCircle color="primary" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
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