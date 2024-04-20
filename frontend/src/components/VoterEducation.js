import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Link,
  useTheme,
  useMediaQuery,
  Container,
  Divider,
  Tabs,
  Tab,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore as ExpandMoreIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const EducationContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(8, 0),
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.primary.main,
  textAlign: 'center',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '2px',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(4),
  color: theme.palette.secondary.main,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50px',
    height: '3px',
    backgroundColor: theme.palette.secondary.main,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[8],
  },
}));

const FeatureCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '56.25%', // 16:9 aspect ratio
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const StepperContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
}));

const Image = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const ResourceCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ResourceAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  marginRight: theme.spacing(2),
}));

const VoterEducation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const features = [
    {
      title: 'Secure Registration',
      description: 'Register as a voter using your personal information and MetaMask wallet for secure authentication.',
      image: 'https://source.unsplash.com/random/800x600?blockchain,security',
    },
    {
      title: 'Easy Voting Process',
      description: 'Cast your vote with just a few clicks using our user-friendly interface.',
      image: 'https://source.unsplash.com/random/800x600?voting,easy',
    },
    {
      title: 'Transparent Results',
      description: 'View real-time election results and track the progress of your favorite candidates.',
      image: 'https://source.unsplash.com/random/800x600?results,transparent',
    },
  ];

  const steps = [
    {
      label: 'Register with MetaMask',
      description: (
        <>
          <Typography paragraph>
            To get started, you need to install the MetaMask browser extension. MetaMask is a digital wallet that allows you to securely manage your Ethereum accounts and interact with decentralized applications like our voting system.
          </Typography>
          <Typography paragraph>
            Follow these steps to install MetaMask:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Visit the official MetaMask website at https://metamask.io" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Click on the 'Download' button and select the browser extension for your preferred web browser (Chrome, Firefox, or Brave)." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Follow the installation instructions provided by MetaMask to add the extension to your browser." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Once installed, click on the MetaMask icon in your browser's toolbar to create a new wallet or import an existing one." />
            </ListItem>
          </List>
        </>
      ),
    },
    {
      label: 'Complete Voter Registration',
      description: (
        <>
          <Typography paragraph>
            After installing MetaMask, you need to complete the voter registration process to participate in the election. The registration process ensures that only eligible voters can cast their votes.
          </Typography>
          <Typography paragraph>
            Here's how to complete your voter registration:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Navigate to the voter registration page on our voting system website." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Fill out the registration form with your personal information, including your full name, email address, and student ID number." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Connect your MetaMask wallet to the registration page by clicking on the 'Connect Wallet' button and following the prompts in the MetaMask extension." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Review your registration details and submit the form." />
            </ListItem>
          </List>
        </>
      ),
    },
    {
      label: 'Wait for Approval',
      description: (
        <>
          <Typography paragraph>
            After submitting your voter registration form, your information will be reviewed by the election administrators to ensure your eligibility to vote.
          </Typography>
          <Typography paragraph>
            Here's what happens during the approval process:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="The election administrators will verify your registration details against the official student records." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="If your registration is approved, you will receive a confirmation email with further instructions." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="If there are any issues with your registration, the administrators will contact you to resolve them." />
            </ListItem>
          </List>
        </>
      ),
    },
    {
      label: 'Connect MetaMask and Vote',
      description: (
        <>
          <Typography paragraph>
            Once your voter registration is approved and the election begins, you can cast your vote using the voting system website.
          </Typography>
          <Typography paragraph>
            Follow these steps to connect MetaMask and vote:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Open the voting system website and navigate to the voting page." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Click on the 'Connect Wallet' button to connect your MetaMask wallet to the voting page." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Review the candidates and their positions on the ballot." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Select your preferred candidates and submit your vote." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="MetaMask will prompt you to confirm the transaction. Review the details and click 'Confirm' to cast your vote." />
            </ListItem>
          </List>
        </>
      ),
    },
    {
      label: 'View Results',
      description: (
        <>
          <Typography paragraph>
            After the election ends, the results will be tallied and made available on the voting system website. You can view the real-time results and see the outcome of the election.
          </Typography>
          <Typography paragraph>
            Here's how to view the election results:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Open the voting system website and navigate to the results page." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="The results page will display the vote counts and percentages for each candidate." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="You can also view the results for specific positions and see the winners of each contest." />
            </ListItem>
          </List>
        </>
      ),
    },
  ];

  const resources = [
    {
      title: 'Introduction to Blockchain',
      description: 'Learn the basics of blockchain technology and how it works.',
      link: 'https://www.investopedia.com/terms/b/blockchain.asp',
    },
    {
      title: 'Ethereum and Smart Contracts',
      description: 'Explore Ethereum, smart contracts, and their role in decentralized applications.',
      link: 'https://ethereum.org/en/developers/docs/smart-contracts/',
    },
    {
      title: 'Cryptography in Blockchain',
      description: 'Understand the cryptographic principles that secure blockchain networks.',
      link: 'https://blockgeeks.com/guides/cryptocurrencies-cryptography/',
    },
    {
      title: 'Decentralized Voting Systems',
      description: 'Discover how decentralized voting systems leverage blockchain for secure and transparent elections.',
      link: 'https://www.forbes.com/sites/forbestechcouncil/2018/11/27/how-blockchain-could-improve-election-transparency-and-security/',
    },
  ];

  return (
    <EducationContainer>
      <Container maxWidth="lg">
        <Title variant={isMobile ? 'h4' : 'h2'}>KNOW YOUR SYSTEM</Title>
        <Typography variant="body1" align="center" paragraph>
          Learn about our decentralized voting system and how to participate in secure and transparent elections.
        </Typography>

        <SectionTitle variant="h4">Key Features</SectionTitle>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard>
                <FeatureCardMedia image={`${feature.image}&sig=${index}`} title={feature.title} />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        <SectionTitle variant="h4">How to Participate</SectionTitle>
        <StepperContainer>
          <Stepper orientation={isMobile ? 'vertical' : 'horizontal'} activeStep={-1}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  {step.description}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </StepperContainer>

        <SectionTitle variant="h4">Educational Resources</SectionTitle>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Blockchain" />
          <Tab label="Cryptography" />
          <Tab label="Ethereum" />
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          <Typography variant="body1" paragraph>
            Blockchain is a decentralized, distributed ledger technology that records transactions across a network of computers. It provides a secure and transparent way to store and transfer data without the need for intermediaries.
          </Typography>
          <Typography variant="body1" paragraph>
            In the context of voting systems, blockchain enables secure and tamper-proof recording of votes, ensuring the integrity and transparency of the election process.
          </Typography>
          <Box mt={4}>
            {resources.slice(0, 2).map((resource, index) => (
              <ResourceCard key={index}>
                <ResourceAvatar>
                <Typography variant="h6">{index + 1}</Typography>
                </ResourceAvatar>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {resource.description}
                  </Typography>
                  <Button
                    component={Link}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    color="primary"
                  >
                    Learn More
                  </Button>
                </Box>
              </ResourceCard>
            ))}
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <Typography variant="body1" paragraph>
            Cryptography plays a crucial role in securing blockchain networks and ensuring the confidentiality and integrity of transactions. It involves the use of mathematical algorithms to encrypt and decrypt data.
          </Typography>
          <Typography variant="body1" paragraph>
            In the context of voting systems, cryptographic techniques such as public-key cryptography and zero-knowledge proofs are employed to protect voter privacy and prevent tampering of votes.
          </Typography>
          <Box mt={4}>
            {resources.slice(2, 3).map((resource, index) => (
              <ResourceCard key={index}>
                <ResourceAvatar>
                  <Typography variant="h6">{index + 3}</Typography>
                </ResourceAvatar>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {resource.description}
                  </Typography>
                  <Button
                    component={Link}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    color="primary"
                  >
                    Learn More
                  </Button>
                </Box>
              </ResourceCard>
            ))}
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <Typography variant="body1" paragraph>
            Ethereum is a decentralized, open-source blockchain platform that enables the development of smart contracts and decentralized applications (dApps). It provides a programmable ecosystem for building and deploying secure and transparent applications.
          </Typography>
          <Typography variant="body1" paragraph>
            In the context of voting systems, Ethereum's smart contract functionality allows for the creation of self-executing contracts that enforce the rules and logic of the election process, ensuring fairness and automating vote counting.
          </Typography>
          <Box mt={4}>
            {resources.slice(3).map((resource, index) => (
              <ResourceCard key={index}>
                <ResourceAvatar>
                  <Typography variant="h6">{index + 4}</Typography>
                </ResourceAvatar>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {resource.description}
                  </Typography>
                  <Button
                    component={Link}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    color="primary"
                  >
                    Learn More
                  </Button>
                </Box>
              </ResourceCard>
            ))}
          </Box>
        </TabPanel>

        <SectionTitle variant="h4">Decentralized Voting with Blockchain</SectionTitle>
        <Typography variant="body1" paragraph>
          Our voting system leverages the power of blockchain technology to ensure secure, transparent, and tamper-proof elections. By using a decentralized network, we eliminate the need for a central authority and provide a trustless environment for conducting fair elections.
        </Typography>
        <ImageContainer>
          <Image src="https://source.unsplash.com/random/1200x600?blockchain,voting" alt="Blockchain Voting" />
        </ImageContainer>

        <SectionTitle variant="h4">Importance of Voter Education</SectionTitle>
        <Typography variant="body1" paragraph>
          Voter education plays a crucial role in ensuring active and informed participation in the electoral process. By providing comprehensive information about the voting system, registration process, and election procedures, we empower voters to make well-informed decisions and exercise their democratic rights effectively.
        </Typography>
        <ImageContainer>
          <Image src="https://source.unsplash.com/random/1200x600?education,voting" alt="Voter Education" />
        </ImageContainer>

        <SectionTitle variant="h4">Frequently Asked Questions</SectionTitle>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">What is MetaMask and why do I need it?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              MetaMask is a browser extension that allows you to securely interact with the Ethereum blockchain. It acts as a digital wallet and enables you to sign transactions and manage your Ethereum accounts. MetaMask is required to register and vote in our decentralized voting system.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">How do I install MetaMask?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              You can install MetaMask by visiting the official website at{' '}
              <Link href="https://metamask.io" target="_blank" rel="noopener noreferrer">
                https://metamask.io
              </Link>{' '}
              and following the installation instructions for your browser.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Is my vote secure and anonymous?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              Yes, your vote is secured using blockchain technology and cryptographic algorithms. The voting process ensures that your vote remains anonymous and cannot be tampered with.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Box mt={8} textAlign="center">
          <Button variant="contained" color="primary" size="large" component={Link} to="/VoterRegistrationForm">
            Register Now
          </Button>
        </Box>
      </Container>
    </EducationContainer>
  );
};

export default VoterEducation;