import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VotingService from './VotingService';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Info, Lock, Email, Phone, PersonAdd, ArrowBack, CheckCircle, Error } from '@mui/icons-material';

const BackgroundContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(45deg, #2c3e50 0%, #3498db 100%)',
}));

const RegistrationContainer = styled(Paper)(({ theme }) => ({
  maxWidth: 600,
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  textAlign: 'center',
  fontWeight: 'bold',
}));

const FormContainer = styled('form')(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  background: 'linear-gradient(45deg, #3498db 0%, #2980b9 100%)',
  color: theme.palette.common.white,
  '&:hover': {
    background: 'linear-gradient(45deg, #2980b9 0%, #3498db 100%)',
  },
}));

const InfoText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));

const LoginLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const CandidateLink = styled(Link)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const SuccessDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogTitle-root': {
    background: theme.palette.success.main,
    color: theme.palette.common.white,
    textAlign: 'center',
  },
  '& .MuiDialogContent-root': {
    textAlign: 'center',
  },
  '& .MuiDialogActions-root': {
    justifyContent: 'center',
  },
}));

const ErrorDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogTitle-root': {
    background: theme.palette.error.main,
    color: theme.palette.common.white,
    textAlign: 'center',
  },
  '& .MuiDialogContent-root': {
    textAlign: 'center',
  },
  '& .MuiDialogActions-root': {
    justifyContent: 'center',
  },
}));

const VoterRegistrationForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const connectToMetamask = async () => {
    try {
      await VotingService.connectToMetamask();
      setIsConnected(true);
      await fetchRegistrationStatus();
    } catch (error) {
      console.error('Failed to connect to Metamask:', error);
    }
  };

  const fetchRegistrationStatus = async () => {
    try {
      const metamaskAddress = await VotingService.signer.getAddress();
      const voter = await VotingService.getVoter(metamaskAddress);
      setRegistrationStatus(voter.approved ? 'Approved' : 'Pending');
    } catch (error) {
      console.error('Error fetching registration status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      setErrorMessage('Please connect to Metamask first');
      setOpenErrorDialog(true);
      return;
    }
    setIsLoading(true);
    try {
      const metamaskAddress = await VotingService.signer.getAddress();
      await VotingService.registerVoter(
        firstName,
        lastName,
        registrationNumber,
        email,
        phoneNumber,
        metamaskAddress
      );
      setFirstName('');
      setLastName('');
      setRegistrationNumber('');
      setEmail('');
      setPhoneNumber('');
      setOpenSuccessDialog(true);
      await fetchRegistrationStatus();
    } catch (error) {
      console.error('Error registering voter:', error);
      let message = 'Failed to register voter. Please try again.';
      if (error.message.includes('Voter is already registered and approved')) {
        message = 'Voter is already registered and approved.';
      } else if (error.message.includes('Voter is already registered and pending approval')) {
        message = 'Voter is already registered and pending approval.';
      } else if (error.message.includes('Cannot register voters after the election has started')) {
        message = 'Registration is not allowed after the election has started.';
      }
      setErrorMessage(message);
      setOpenErrorDialog(true);
    }
    setIsLoading(false);
  };

  const handleSuccessDialogClose = () => {
    setOpenSuccessDialog(false);
  };

  const handleErrorDialogClose = () => {
    setOpenErrorDialog(false);
  };

  return (
    <BackgroundContainer>
      <RegistrationContainer>
        <Box display="flex" alignItems="center" marginBottom={4}>
          <IconButton component={Link} to="/login" edge="start">
            <ArrowBack />
          </IconButton>
          <Title variant={isMobile ? 'h5' : 'h4'}>Voter Registration</Title>
        </Box>
        <Divider />
        {!isConnected ? (
          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={connectToMetamask}
              startIcon={<img src="/metamask-icon.png" alt="Metamask" width={24} />}
            >
              Connect to Metamask
            </Button>
          </Box>
        ) : (
          <>
            <Box mt={4}>
              <Typography variant="h6">Registration Status:</Typography>
              {registrationStatus === 'Approved' ? (
                <Alert severity="success" sx={{ marginTop: theme.spacing(1) }}>
                  Your registration has been approved. 
                  Click on the link below this registration form to login and participate in the election.
                </Alert>
              ) : registrationStatus === 'Pending' ? (
                <Alert severity="info" sx={{ marginTop: theme.spacing(1) }}>
                  Your registration is pending approval. 
                  Please wait for the election admin to review your registration.
                  Keep an eye on this page to check your satus.
                </Alert>
              ) : (
                <Alert severity="warning" sx={{ marginTop: theme.spacing(1) }}>
                  You are not registered, please register in the form below.
                </Alert>
              )}
            </Box>
            <FormContainer onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Enter your first name">
                          <IconButton edge="end">
                            <Info />
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Enter your last name">
                          <IconButton edge="end">
                            <Info />
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="registrationNumber"
                    name="registrationNumber"
                    label="Registration Number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Enter your voter registration number">
                          <IconButton edge="end">
                            <Lock />
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Enter your email address">
                          <IconButton edge="end">
                            <Email />
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Enter your phone number">
                          <IconButton edge="end">
                            <Phone />
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <SubmitButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PersonAdd />}
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </SubmitButton>
            </FormContainer>
          </>
        )}
        <InfoText variant="body1">
          Already registered?{' '}
          <LoginLink to="/login">Go to Login</LoginLink>
        </InfoText>
        <InfoText variant="body1">
          Or{' '}
          <CandidateLink to="/CandidateForm">Go to Candidate Registration form page</CandidateLink>
        </InfoText>
      </RegistrationContainer>

      <SuccessDialog open={openSuccessDialog} onClose={handleSuccessDialogClose}>
        <DialogTitle>
          <CheckCircle fontSize="large" />
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6">You are registered successfully!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </SuccessDialog>

      <ErrorDialog open={openErrorDialog} onClose={handleErrorDialogClose}>
        <DialogTitle>
          <Error fontSize="large" />
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6">{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </ErrorDialog>
    </BackgroundContainer>
  );
};

export default VoterRegistrationForm;