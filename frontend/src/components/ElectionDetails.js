import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Backdrop,
  Fade,
  Modal,
} from '@mui/material';
import {
  AccessTime,
  HowToVote,
  Home as HomeIcon,
  Event as EventIcon,
  HowToReg as HowToRegIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  ThumbUp as ThumbUpIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const PositionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const CandidateCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const CandidateAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
}));

const ApprovalRatingSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.success.main,
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: theme.palette.success.main,
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
}));

const ElectionDetails = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [election, setElection] = useState(null);
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [approvalRatings, setApprovalRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdownTime, setCountdownTime] = useState(null);
  const [electionStatus, setElectionStatus] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const electionRef = useRef(null);

  const [openPositionDialog, setOpenPositionDialog] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const [openCandidateModal, setOpenCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
        setSnackbarMessage('Failed to fetch elections. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
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
        const positionNames = electionDetails.positionNames || [];

        const candidatesData = await Promise.all(
          positionNames.map(async (positionName) => {
            const candidateDetails = await VotingService.getCandidates(selectedElectionId, positionName);
            return { positionName, candidates: candidateDetails };
          })
        );

        setElection(electionDetails);
        electionRef.current = electionDetails;
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
        setSnackbarMessage('Failed to fetch election details. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        setLoading(false);
      }
    };

    const startCountdown = () => {
      if (!electionRef.current) return;

      const currentTime = Math.floor(Date.now() / 1000);
      const startTime = Number(electionRef.current.startTime);
      const endTime = Number(electionRef.current.endTime);

      if (currentTime < startTime) {
        setElectionStatus('Upcoming');
        setCountdownTime(startTime - currentTime);
      } else if (currentTime >= startTime && currentTime < endTime) {
        setElectionStatus('Ongoing');
        setCountdownTime(endTime - currentTime);
      } else {
        setElectionStatus('Ended');
        setCountdownTime(0);
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

  const handleApprovalRatingChange = (positionName, candidateId, rating) => {
    setApprovalRatings((prevApprovalRatings) => ({
      ...prevApprovalRatings,
      [positionName]: {
        ...prevApprovalRatings[positionName],
        [candidateId]: rating,
      },
    }));
  };

  const handleVote = async () => {
    if (electionStatus !== 'Ongoing') {
      setSnackbarMessage('Voting is not currently open.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const positionNames = Object.keys(selectedCandidates);
      const candidateIds = Object.values(selectedCandidates);
      await VotingService.vote(selectedElectionId, positionNames, candidateIds);
      setSelectedCandidates({});
      setSnackbarMessage('Vote cast successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error casting vote:', error);
      setSnackbarMessage('Failed to cast vote. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const formatTime = (time) => {
    if (time <= 0) {
      return electionStatus === 'Ended' ? 'Ended' : '0d 0h 0m 0s';
    }

    const days = Math.floor(time / (24 * 60 * 60));
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = Math.floor(time % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handlePositionInfoClick = (positionName) => {
    setSelectedPosition(positionName);
    setOpenPositionDialog(true);
  };

  const handleClosePositionDialog = () => {
    setOpenPositionDialog(false);
  };

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenCandidateModal(true);
  };

  const handleCloseCandidateModal = () => {
    setOpenCandidateModal(false);
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
    <Box
      py={4}
      sx={{
        background: 'linear-gradient(45deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
          {election.name}
        </Typography>
        <Box>
          <Tooltip title="Home">
            <IconButton onClick={() => navigate('/')}>
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Election Results">
            <IconButton onClick={() => navigate('/Results')}>
              <HowToRegIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Events">
            <IconButton onClick={() => navigate('/Events')}>
              <EventIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
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
              <Button
                variant="contained"
                color="primary"
                startIcon={<HowToVote />}
                fullWidth
                disabled={electionStatus !== 'Ongoing'}
              >
                {electionStatus === 'Ongoing'
                  ? 'Vote Now'
                  : electionStatus === 'Upcoming'
                  ? `Voting starts on ${new Date(Number(election.startTime) * 1000).toLocaleString()}`
                  : 'Voting has ended'}
                  </Button>
                  </CardActions>
                  </Card>
                  </Grid>
                  {positions && positions.length > 0 && (
                  <Grid item xs={12} md={8}>
                  <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
                  Positions and Candidates
                  </Typography>
                  <Grid container spacing={2}>
                  {positions.map((positionName) => (
                    <Grid item xs={12} key={positionName}>
                      <PositionPaper elevation={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6">{positionName}</Typography>
                          <IconButton onClick={() => handlePositionInfoClick(positionName)}>
                            <InfoIcon />
                          </IconButton>
                        </Box>
                        <RadioGroup
                          value={selectedCandidates[positionName] || ''}
                          onChange={(event) => handleCandidateSelect(positionName, event.target.value)}
                        >
                          {candidates[positionName]?.map((candidate) => (
                            <Box key={candidate.id} display="flex" alignItems="center">
                              <FormControlLabel
                                value={candidate.id}
                                control={<Radio />}
                                label={
                                  <Box display="flex" alignItems="center">
                                    <Typography>{candidate.name}</Typography>
                                    <IconButton onClick={() => handleCandidateClick(candidate)}>
                                      <InfoIcon />
                                    </IconButton>
                                  </Box>
                                }
                              />
                              <Box ml={2}>
                                <ApprovalRatingSlider
                                  value={approvalRatings[positionName]?.[candidate.id] || 0}
                                  onChange={(event, newValue) =>
                                    handleApprovalRatingChange(positionName, candidate.id, newValue)
                                  }
                                  min={0}
                                  max={100}
                                  step={1}
                                  valueLabelDisplay="auto"
                                />
                              </Box>
                            </Box>
                          ))}
                        </RadioGroup>
                      </PositionPaper>
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
                  open={openSnackbar}
                  autoHideDuration={5000}
                  onClose={handleSnackbarClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                  <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                  {snackbarMessage}
                  </Alert>
                  </Snackbar>

                  <Dialog open={openPositionDialog} onClose={handleClosePositionDialog}>
                  <DialogTitle>
                  {selectedPosition} Details
                  <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleClosePositionDialog}
                  aria-label="close"
                  sx={{ position: 'absolute', right: 8, top: 8 }}
                  >
                  <CloseIcon />
                  </IconButton>
                  </DialogTitle>
                  <DialogContent>
                  <Typography variant="body1">
                  This is the description of the {selectedPosition} position. You can provide more details about the responsibilities and requirements of this position here.
                  </Typography>
                  </DialogContent>
                  <DialogActions>
                  <Button onClick={handleClosePositionDialog}>Close</Button>
                  </DialogActions>
                  </Dialog>

                  <Modal
                  open={openCandidateModal}
                  onClose={handleCloseCandidateModal}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                  timeout: 500,
                  }}
                  >
                  <Fade in={openCandidateModal}>
                  <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                  }}
                  >
                  {selectedCandidate && (
                    <CandidateCard>
                      <CandidateAvatar src={`https://i.pravatar.cc/150?img=${selectedCandidate.id}`} />
                      <Typography variant="h6">{selectedCandidate.name}</Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        Candidate for {selectedCandidate.position}
                      </Typography>
                      <Box mt={2}>
                        <Typography variant="body1">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, magna a bibendum bibendum, augue magna tincidunt enim, eget ultricies magna augue eget est. Sed euismod, nulla sit amet aliquam lacinia, nisl nisl aliquam nisl, nec tincidunt nisl lorem eget nisl.
                        </Typography>
                      </Box>
                      <Box mt={2} display="flex" justifyContent="space-between">
                        <Tooltip title="Like">
                          <IconButton>
                            <ThumbUpIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Comment">
                          <IconButton>
                            <QuestionAnswerIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CandidateCard>
                  )}
                  </Box>
                  </Fade>
                  </Modal>
                  </Box>
                  );
                  };

  export default ElectionDetails;