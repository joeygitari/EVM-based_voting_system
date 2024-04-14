import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VotingService from './VotingService';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grow,
  Fade,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  Icon,
  Grid,
  Container,
  Card,
  CardContent,
  CardActions,
  Avatar,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircleOutline, ErrorOutline, HowToVote, LockOutlined } from '@mui/icons-material';

const BackgroundContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(45deg, #2c3e50 0%, #3498db 100%)',
}));

const LoginContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.primary.dark,
  textAlign: 'center',
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
}));

const WelcomeMessage = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
  textAlign: 'center',
  maxWidth: 600,
  lineHeight: 1.6,
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(45deg, #3498db 0%, #2980b9 100%)',
  color: theme.palette.common.white,
  '&:hover': {
    background: 'linear-gradient(45deg, #2980b9 0%, #3498db 100%)',
  },
}));

const AccountInfo = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const AccountAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const DisconnectButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  background: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    background: theme.palette.error.dark,
  },
}));

const Instructions = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const InstructionsTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const RegistrationLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ownerAccount = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

const PopupModal = ({ message, voterName }) => {
  return (
    <Dialog
      open
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{message}</DialogTitle>
      <DialogContent>
        {voterName && (
          <Typography variant="h6" gutterBottom>
            Welcome, {voterName}!
          </Typography>
        )}
        <Typography variant="body1">
          Connecting you
          <CircularProgress size={20} sx={{ marginLeft: 1 }} />
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

const DisconnectModal = ({ onClose }) => {
  return (
    <Dialog
      open
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">Disconnect from MetaMask</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          To disconnect from MetaMask, please switch networks or disconnect manually within the MetaMask extension/app.
        </Typography>
        <Button variant="contained" color="primary" onClick={onClose}>
          Okay
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [voterName, setVoterName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isConnected) {
        setIsLoading(true);
        setShowModal(true);

        if (accountAddress.toLowerCase() === ownerAccount.toLowerCase()) {
          setTimeout(() => {
            navigate('/AdminPage');
          }, 6000);
        } else {
          try {
            const voter = await VotingService.getVoter(accountAddress);

            if (voter && voter.approved) {
              const voterFullName = `${voter.firstName} ${voter.lastName}`;
              setVoterName(voterFullName);
              setTimeout(() => {
                navigate('/ElectionDetails', {
                  state: {
                    voterAddress: accountAddress,
                    voterName: voterFullName,
                  },
                });
              }, 3000);
            } else {
              setIsLoading(false);
              setShowModal(false);
            }
          } catch (error) {
            console.error('Error checking voter approval:', error);
            setIsLoading(false);
            setShowModal(false);
          }
        }
      }
    };

    checkUserRole();
  }, [isConnected, accountAddress, navigate]);

  const handleLogin = async () => {
    try {
      await VotingService.connectToMetamask();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Connected account:', accounts[0]);
      setIsConnected(true);
      setAccountAddress(accounts[0]);
    } catch (err) {
      console.warn('Failed to connect to MetaMask:', err);
    }
  };

  const handleDisconnect = async () => {
    setIsConnected(false);
    setAccountAddress('');
    setShowDisconnectModal(true);
  };

  const handleCloseDisconnectModal = () => {
    setShowDisconnectModal(false);
  };

  return (
    <BackgroundContainer>
      <LoginContainer maxWidth="sm">
        <Grow in timeout={1000}>
          <Title variant={isMobile ? 'h4' : 'h2'}>
            Welcome to the Voting DApp
          </Title>
        </Grow>
        <Fade in timeout={1500}>
          <WelcomeMessage variant="body1">
            This application allows you to securely cast your vote using the Ethereum blockchain. To get started, please connect your registered MetaMask wallet.
          </WelcomeMessage>
        </Fade>
        <ButtonContainer>
          <LoginButton
            variant="contained"
            size="large"
            onClick={handleLogin}
            startIcon={<HowToVote />}
          >
            {isConnected ? 'Connected' : 'Connect Wallet'}
          </LoginButton>
          {isConnected && (
            <Grow in timeout={500}>
              <AccountInfo>
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <AccountAvatar>
                        <LockOutlined />
                      </AccountAvatar>
                    </Grid>
                    <Grid item>
                      <Typography variant="body1">
                        Connected Account:
                      </Typography>
                      <TextField
                        value={accountAddress}
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <DisconnectButton
                    variant="contained"
                    size="small"
                    onClick={handleDisconnect}
                    startIcon={<ErrorOutline />}
                  >
                    Disconnect
                  </DisconnectButton>
                </CardActions>
              </AccountInfo>
            </Grow>
          )}
        </ButtonContainer>
        {!isConnected && (
          <Fade in timeout={2000}>
            <Instructions>
              <InstructionsTitle variant="h6">
                Instructions
              </InstructionsTitle>
              <Divider sx={{ marginBottom: theme.spacing(2) }} />
              <List>
                <ListItemStyled>
                  <ListItemIcon>
                    <CheckCircleOutline color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Download and install the MetaMask browser extension or mobile app." />
                </ListItemStyled>
                <ListItemStyled>
                  <ListItemIcon>
                    <CheckCircleOutline color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="You must be a registered voter, else, your account will be connected but directed nowhere." />
                </ListItemStyled>
                <ListItemStyled>
                  <ListItemIcon>
                    <CheckCircleOutline color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Import your Ethereum wallet." />
                </ListItemStyled>
                <ListItemStyled>
                  <ListItemIcon>
                    <CheckCircleOutline color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Click the 'Connect Wallet' button above to connect your wallet." />
                </ListItemStyled>
              </List>
            </Instructions>
          </Fade>
        )}
        {isLoading && showModal && (
          <PopupModal
            message={
              accountAddress.toLowerCase() === ownerAccount.toLowerCase()
                ? 'Welcome Admin'
                : 'Voting is your right'
            }
            voterName={voterName}
          />
        )}
        {showDisconnectModal && (
          <DisconnectModal onClose={handleCloseDisconnectModal} />
        )}
        <Typography variant="body2">
          Not registered?{' '}
          <RegistrationLink to="/VoterRegistrationForm">
            Go to Registration Page
          </RegistrationLink>
        </Typography>
      </LoginContainer>
    </BackgroundContainer>
  );
};

export default Login;