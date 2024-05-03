import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BackgroundContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: `url('/home2.webp') no-repeat center center fixed`,
  backgroundSize: 'cover',
  padding: theme.spacing(8, 4),
  position: 'relative',
  overflow: 'hidden',
}));

const animateTextLoop = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  20% {
    opacity: 1;
    transform: translateX(0);
  }
  80% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
`;

const TitleText = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  textAlign: 'center',
  fontWeight: 'bold',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  fontSize: '3rem',
  textTransform: 'uppercase',
  letterSpacing: '0.2rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const ColoredText = styled('span')(({ theme, color }) => ({
  color: color,
  fontWeight: 'bold',
  animation: `${animateTextLoop} 8s linear infinite`,
}));

const WhiteText = styled('span')(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const OrangeText = styled('span')(({ theme }) => ({
  color: '#ff9800',
  fontWeight: 'bold',
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
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
  transition: 'transform 0.3s, background-color 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const LearnMoreButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.info.main,
  color: theme.palette.common.white,
  fontSize: '0.9rem',
  fontWeight: 'bold',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s, background-color 0.3s',
  position: 'absolute',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  '&:hover': {
    backgroundColor: theme.palette.info.dark,
    transform: 'scale(1.05)',
  },
}));

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [animatedText, setAnimatedText] = useState('');
  const [animatedLetterIndex, setAnimatedLetterIndex] = useState(0);
  const [typingCursor, setTypingCursor] = useState(false);
  const [showTypingCursor, setShowTypingCursor] = useState(false);

  const animatedWords = ['Transparent', 'Secure', 'Efficient', 'Immutable'];
  const colorPalette = ['#ff5722', '#4caf50', '#2196f3', '#9c27b0'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    let animationInterval;
    let cursorInterval;

    const animateText = () => {
      const currentWord = animatedWords[currentWordIndex];

      if (animatedLetterIndex < currentWord.length) {
        setAnimatedText((prevText) => prevText + currentWord[animatedLetterIndex]);
        setAnimatedLetterIndex((prevIndex) => prevIndex + 1);
        setShowTypingCursor(true);
      } else if (animatedLetterIndex === currentWord.length) {
        setShowTypingCursor(false);
        cursorInterval = setInterval(() => {
          setTypingCursor((prevState) => !prevState);
        }, 500);

        setTimeout(() => {
          clearInterval(cursorInterval);
          animationInterval = setInterval(() => {
            setAnimatedText((prevText) => {
              if (prevText.length === 1) {
                clearInterval(animationInterval);
                setCurrentWordIndex((prevIndex) => (prevIndex + 1) % animatedWords.length);
                setAnimatedLetterIndex(0);
                setShowTypingCursor(true);
                return '';
              }
              return prevText.slice(0, -1);
            });
          }, 100);
        }, 1500);
      }
    };

    animateText();

    return () => {
      clearInterval(animationInterval);
      clearInterval(cursorInterval);
    };
  }, [animatedLetterIndex, currentWordIndex]);

  return (
    <BackgroundContainer>
      <Box sx={{ mt: -8 }}>
        <TitleText variant={isMobile ? 'h4' : 'h2'}>
          DECENTRALIZED STUDENTS E-VOTING SYSTEM WITH <WhiteText>BLOCKCHAIN</WhiteText>
        </TitleText>
        <TitleText variant={isMobile ? 'h4' : 'h2'}>
          <OrangeText>BLOCKCHAIN</OrangeText> <WhiteText> IS </WhiteText>
          <ColoredText color={colorPalette[currentWordIndex]}>{animatedText}</ColoredText>
          {showTypingCursor && <span style={{ animation: `${animateTextLoop} 1s linear infinite` }}>{typingCursor ? '|' : ''}</span>}
        </TitleText>
      </Box>
      <LearnMoreButton
        component={Link}
        to="/VoterEducation"
        variant="contained"
        endIcon={<ArrowForwardIcon />}
      >
        Learn More
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