import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const BackgroundContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  background: `url('/home.png') no-repeat center center fixed`,
  backgroundSize: 'cover',
  padding: theme.spacing(8, 4),
}));

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const BlueText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const TitleText = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  textAlign: 'center',
  fontWeight: 'bold',
  marginBottom: theme.spacing(8),
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  animation: `${fadeIn} 1s ease-in-out`,
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: 'auto',
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  minWidth: 200,
  fontSize: '1.2rem',
  fontWeight: 'bold',
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const LearnMoreButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  backgroundColor: theme.palette.info.main,
  color: theme.palette.common.white,
  fontSize: '1.2rem',
  fontWeight: 'bold',
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.info.dark,
    transform: 'scale(1.05)',
  },
}));

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <BackgroundContainer>
      <TitleText variant={isMobile ? 'h4' : 'h2'} sx={{ marginTop: theme.spacing(8) }}>
        <BlueText>DECENTRALIZED</BlueText> STUDENTS e-VOTING SYSTEM WITH{' '}
        <BlueText>BLOCKCHAIN</BlueText>
      </TitleText>
      <LearnMoreButton component={Link} to="/VoterEducation" variant="contained">
        Learn About the System
      </LearnMoreButton>
      <ButtonContainer>
        <CustomButton component={Link} to="/registration" variant="contained" color="primary">
          Register
        </CustomButton>
        <CustomButton component={Link} to="/login" variant="contained" color="secondary">
          Login
        </CustomButton>
      </ButtonContainer>
    </BackgroundContainer>
  );
};

export default HomePage;