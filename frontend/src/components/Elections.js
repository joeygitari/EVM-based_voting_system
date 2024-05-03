import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Modal,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  Event as EventIcon,
  HowToVote as HowToVoteIcon,
  Update as UpdateIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const ErrorPopup = ({ message, onClose }) => (
  <Modal open={true} onClose={onClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        boxShadow: 24,
        p: 4,
        outline: 'none',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Error
      </Typography>
      <Typography>{message}</Typography>
      <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
        OK
      </Button>
    </Box>
  </Modal>
);

const SuccessPopup = ({ message, onClose }) => (
  <Modal open={true} onClose={onClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        boxShadow: 24,
        p: 4,
        outline: 'none',
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <CheckCircleIcon color="success" fontSize="large" />
        <Typography variant="h6" ml={1}>
          Success
        </Typography>
      </Box>
      <Typography>{message}</Typography>
      <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
        OK
      </Button>
    </Box>
  </Modal>
);

const ElectionCreationForm = () => {
  const navigate = useNavigate();
  const [electionName, setElectionName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [positionName, setPositionName] = useState('');
  const [selectedElection, setSelectedElection] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchElections = async () => {
      try {
        await VotingService.connectToMetamask();
        setLoading(true);
        const electionCount = await VotingService.getElectionCount();
        const electionDetails = [];

        for (let i = 1; i <= electionCount; i++) {
          const details = await VotingService.getElection(i);
          electionDetails.push({
            id: i,
            name: details.name,
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
        setErrorMessage('Failed to fetch elections. Please try again.');
        setShowErrorPopup(true);
        setLoading(false);
      }
    };

    fetchElections();

    const handleContractEvents = (eventName, callback) => {
      if (VotingService.contract) {
        VotingService.contract.on(eventName, callback);
      }
    };

    handleContractEvents('ElectionCreated', (electionId, name) => {
      setSuccessMessage(`Election created: ${name}`);
      setShowSuccessPopup(true);
    });

    handleContractEvents('PositionCreated', (electionId, positionName) => {
      setSuccessMessage(`Position created: ${positionName}`);
      setShowSuccessPopup(true);
    });

    handleContractEvents('ElectionTimeExtended', (electionId, newEndTime) => {
      setSuccessMessage(`Election time extended for Election ID: ${electionId}`);
      setShowSuccessPopup(true);
    });

    return () => {
      // Unsubscribe from contract events when the component unmounts
      if (VotingService.contract) {
        VotingService.contract.removeAllListeners('ElectionCreated');
        VotingService.contract.removeAllListeners('PositionCreated');
        VotingService.contract.removeAllListeners('ElectionTimeExtended');
      }
    };
  }, []);

  const handleCreateElection = async () => {
    try {
      const startTimeTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimeTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

      await VotingService.createElection(electionName, startTimeTimestamp, endTimeTimestamp);
      console.log('Election created');
      setElectionName('');
      setStartTime('');
      setEndTime('');
      const electionCount = await VotingService.getElectionCount();
      const newElection = await VotingService.getElection(electionCount);
      setElections([
        ...elections,
        {
          ...newElection,
          startTime: new Date(newElection.startTime * 1000).toISOString().slice(0, 16),
          endTime: new Date(newElection.endTime * 1000).toISOString().slice(0, 16),
        },
      ]);
    } catch (error) {
      console.error('Error creating election:', error);
      setErrorMessage('Failed to create election. Please try again.');
      setShowErrorPopup(true);
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
      setErrorMessage('Failed to create position. Please try again.');
      setShowErrorPopup(true);
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
        setSelectedElection({
          ...electionDetails,
          positionNames: electionDetails.positionNames || [],
        });
      } catch (error) {
        console.error('Error fetching election details:', error);
        setErrorMessage('Failed to fetch election details. Please try again.');
        setShowErrorPopup(true);
      }
    } else {
      setSelectedElection(null);
    }
  };

  const handleExtendElection = async (electionId, newEndTime) => {
    try {
      const newEndTimeTimestamp = Math.floor(new Date(newEndTime).getTime() / 1000);
      await VotingService.extendElectionTime(electionId, newEndTimeTimestamp);
      console.log('Election extended');
      const updatedElection = await VotingService.getElection(electionId);
      setSelectedElection(updatedElection);
    } catch (error) {
      console.error('Error extending election:', error);
      setErrorMessage('Failed to extend election. Please try again.');
      setShowErrorPopup(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Create Election</Typography>
        <Box>
          <Tooltip title="Home">
            <IconButton onClick={() => navigate('/')}>
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Election Details">
            <IconButton onClick={() => navigate('/ElectionDetails')}>
              <HowToVoteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Events">
            <IconButton onClick={() => navigate('/Events')}>
              <EventIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
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
            inputProps={{
              min: startTime,
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
                  <Button variant="contained" onClick={() => handleCreatePosition(election.id)}>
                    Create Position
                  </Button>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
                Positions
              </Typography>
              <List>
                {selectedElection &&
                  selectedElection.positionNames &&
                  selectedElection.positionNames.map((position, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={position} />
                    </ListItem>
                  ))}
              </List>

              <Grid container spacing={2} justifyContent="flex-end" sx={{ marginTop: 2 }}>
                <Grid item>
                  <TextField
                    label="Extend End Time"
                    type="datetime-local"
                    value={selectedElection?.extendedEndTime || ''}
                    onChange={(e) =>
                      setSelectedElection({ ...selectedElection, extendedEndTime: e.target.value })
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item>
                  <Tooltip title="Extend Election">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleExtendElection(election.id, selectedElection?.extendedEndTime)}
                      disabled={!selectedElection?.extendedEndTime}
                      startIcon={<UpdateIcon />}
                    >
                      Extend
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {showErrorPopup && (
        <ErrorPopup message={errorMessage} onClose={() => setShowErrorPopup(false)} />
      )}

      {showSuccessPopup && (
        <SuccessPopup message={successMessage} onClose={handleSuccessPopupClose} />
      )}
    </Box>
  );
};

export default ElectionCreationForm;