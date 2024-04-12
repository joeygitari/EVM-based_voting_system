import React, { useState, useEffect } from 'react';
import VotingService from './VotingService';
import {
  Button,
  TextField,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Grid,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ElectionCreationForm = () => {
  const [electionName, setElectionName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [positionName, setPositionName] = useState('');
  const [selectedElection, setSelectedElection] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const electionCount = await VotingService.getElectionCount();
        const electionDetails = [];

        for (let i = 1; i <= electionCount; i++) {
          const details = await VotingService.getElection(i);
          electionDetails.push({
            id: i,
            name: details.name,
            isOpen: details.isOpen,
            startTime: details.startTime,
            endTime: details.endTime,
            positionNames: details.positionNames || [],
            isExpanded: false,
          });
        }

        setElections(electionDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching elections:', error);
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const handleCreateElection = async () => {
    try {
      const startTimeTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimeTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

      await VotingService.createElection(
        electionName,
        startTimeTimestamp,
        endTimeTimestamp
      );
      console.log('Election created');
      setElectionName('');
      setStartTime('');
      setEndTime('');
      const electionCount = await VotingService.getElectionCount();
      const newElection = await VotingService.getElection(electionCount);
      setElections([...elections, newElection]);
    } catch (error) {
      console.error('Error creating election:', error);
    }
  };

  const handleCreatePosition = async (electionId) => {
    try {
      await VotingService.createPosition(electionId, positionName);
      console.log('Position created:', positionName);
      const updatedElection = await VotingService.getElection(electionId);
      setSelectedElection(updatedElection);
      setPositionName('');
    } catch (error) {
      console.error('Error creating position:', error);
    }
  };

  const handleToggleElection = async (election) => {
    const updatedElections = elections.map((e) => {
      if (e.id === election.id) {
        return { ...e, isExpanded: !e.isExpanded };
      }
      return e;
    });
    setElections(updatedElections);

    if (!election.isExpanded) {
      try {
        const electionDetails = await VotingService.getElection(election.id);
        setSelectedElection(electionDetails);
      } catch (error) {
        console.error('Error fetching election details:', error);
      }
    } else {
      setSelectedElection(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Create Election
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Election Name"
            fullWidth
            value={electionName}
            onChange={(e) => setElectionName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Time"
            type="datetime-local"
            fullWidth
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="End Time"
            type="datetime-local"
            fullWidth
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleCreateElection}>
            Create Election
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Created Elections
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        elections.map((election) => (
          <Accordion
            key={election.id}
            expanded={election.isExpanded}
            onChange={() => handleToggleElection(election)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{election.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Start Time"
                    secondary={new Date(Number(election.startTime) * 1000).toLocaleString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="End Time"
                    secondary={new Date(Number(election.endTime) * 1000).toLocaleString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Status"
                    secondary={election.isOpen ? 'Open' : 'Closed'}
                  />
                </ListItem>
              </List>

              <Typography variant="h6" gutterBottom>
                Create Position
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Position Name"
                    fullWidth
                    value={positionName}
                    onChange={(e) => setPositionName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={() => handleCreatePosition(election.id)}
                  >
                    Create Position
                  </Button>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
                Positions
              </Typography>
              <List>
                {selectedElection &&
                  selectedElection.positionNames.map((position, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={position} />
                    </ListItem>
                  ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default ElectionCreationForm;