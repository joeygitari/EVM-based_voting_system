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
} from '@mui/material';
import { AccessTime, CheckCircle, HowToVote } from '@mui/icons-material';

const ElectionDetails = ({ electionId }) => {
  console.log('ElectionDetails component rendered with electionId:', electionId);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    const fetchElectionDetails = async () => {
      if (electionId) {
        try {
          setLoading(true);
          const electionDetails = await VotingService.getElection(electionId);
          if (electionDetails) {
            setElection(electionDetails);
          } else {
            setElection(null);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching election details:', error);
          setElection(null);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
  
    fetchElectionDetails();
  }, [electionId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!election) {
    return <Typography>Election not found.</Typography>;
  }

  return (
    <Box py={4}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h4" align="center" gutterBottom>
                {election.name}
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Chip
                    avatar={<Avatar><AccessTime /></Avatar>}
                    label={`Start: ${new Date(election.startTime * 1000).toLocaleString()}`}
                    variant="outlined"
                  />
                </Grid>
                <Grid item>
                  <Chip
                    avatar={<Avatar><AccessTime /></Avatar>}
                    label={`End: ${new Date(election.endTime * 1000).toLocaleString()}`}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HowToVote />}
                fullWidth
              >
                Vote Now
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Positions
          </Typography>
          <List>
            {election.positionNames.map((positionName) => (
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
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Candidates
          </Typography>
          <Grid container spacing={2}>
            {election.positionNames.map((positionName) => (
              <Grid item xs={12} key={positionName}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {positionName}
                    </Typography>
                    {/* Display candidates for each position */}
                    <List>
                      {/* Placeholder candidates */}
                      <ListItem>
                        <ListItemText primary="Candidate 1" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Candidate 2" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ElectionDetails;