import React, { useState, useEffect } from 'react';
import VotingService from './VotingService';
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Info as InfoIcon, Close as CloseIcon } from '@mui/icons-material';

const Background = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: theme.spacing(4),
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const FormContainer = styled(Box)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

const CandidateRegistrationForm = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openElectionDetailsDialog, setOpenElectionDetailsDialog] = useState(false);

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
        setOpenErrorSnackbar(true);
      }
    };
    fetchElections();
  }, []);

  const handleCandidateRegistration = async () => {
    try {
      await VotingService.registerCandidate(Number(selectedElection), selectedPosition, candidateName);
      console.log('Candidate registered');
      setOpenSuccessSnackbar(true);
      setSelectedElection('');
      setSelectedPosition('');
      setCandidateName('');
    } catch (error) {
      console.error('Error registering candidate:', error);
      setOpenErrorSnackbar(true);
    }
  };

  const handleCloseSuccessSnackbar = () => {
    setOpenSuccessSnackbar(false);
  };

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
  };

  const handleOpenElectionDetailsDialog = () => {
    setOpenElectionDetailsDialog(true);
  };

  const handleCloseElectionDetailsDialog = () => {
    setOpenElectionDetailsDialog(false);
  };

  return (
    <Background>
      <FormContainer>
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
                    <IconButton onClick={handleOpenElectionDetailsDialog} size="small">
                      <InfoIcon />
                    </IconButton>
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
      </FormContainer>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSuccessSnackbar} severity="success" sx={{ width: '100%' }}>
          Candidate registered successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
          Error occurred. Please try again.
        </Alert>
      </Snackbar>
      <Dialog open={openElectionDetailsDialog} onClose={handleCloseElectionDetailsDialog}>
        <DialogTitle>
          Election Details
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseElectionDetailsDialog}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6">Election Name:</Typography>
          <Typography>{elections.find((election) => election.id === Number(selectedElection))?.name}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Positions:
          </Typography>
          <List>
            {elections
              .find((election) => election.id === Number(selectedElection))
              ?.positionNames.map((position) => (
                <ListItem key={position}>
                  <ListItemText primary={position} />
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseElectionDetailsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Background>
  );
};

export default CandidateRegistrationForm;