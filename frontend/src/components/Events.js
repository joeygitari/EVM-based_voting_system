import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  Collapse,
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Grid,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  HowToVote as HowToVoteIcon,
  Event as EventIcon,
  LocationCity as LocationCityIcon,
} from '@mui/icons-material';
import VotingService from './VotingService';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  title: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    justifyContent: 'center',
  },
  searchInput: {
    marginRight: theme.spacing(2),
    flexGrow: 1,
  },
  tableContainer: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
  },
  table: {
    minWidth: 650,
  },
  eventDetails: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
  eventDetailItem: {
    marginBottom: theme.spacing(1),
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  cardContent: {
    flexGrow: 1,
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  iconButton: {
    marginLeft: 'auto',
  },
}));

const EventTracker = () => {
  const classes = useStyles();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventNames = [
          'VoterRegistered',
          'VoterApproved',
          'VoterRejected',
          'ElectionCreated',
          'PositionCreated',
          'CandidateRegistered',
          'CandidateApproved',
          'CandidateRejected',
          'VoteCast',
          'RegisteredAddressesReset',
          'ElectionTimeExtended',
        ];

        const allEvents = await Promise.all(
          eventNames.map((eventName) => VotingService.queryEvents(eventName))
        );

        const enrichedEvents = await Promise.all(
          allEvents.flat().map(async (event) => {
            const { event: eventName, args, blockNumber, transactionHash } = event;
            const block = await VotingService.provider.getBlock(blockNumber);
            const timestamp = new Date(block.timestamp * 1000).toLocaleString();
            const transaction = await VotingService.provider.getTransaction(transactionHash);
            const from = transaction.from;

            let action = '';
            let details = {};
            let icon = null;

            if (eventName === 'VoterRegistered') {
              action = 'Voter Registered';
              icon = <PersonIcon />;
              const voter = await VotingService.getVoter(args.voterAddress);
              details = {
                'Voter Address': args.voterAddress,
                'First Name': voter.firstName,
                'Last Name': voter.lastName,
                Email: voter.email,
                'Phone Number': voter.phoneNumber,
                'Metamask Address': voter.metamaskAddress,
                Approved: voter.approved ? 'Yes' : 'No',
                Voted: voter.voted ? 'Yes' : 'No',
              };
            } else if (eventName === 'VoterApproved') {
              action = 'Voter Approved';
              icon = <PersonIcon />;
              const voter = await VotingService.getVoter(args.voterAddress);
              details = {
                'Voter Address': args.voterAddress,
                'First Name': voter.firstName,
                'Last Name': voter.lastName,
                Email: voter.email,
              };
            } else if (eventName === 'VoterRejected') {
              action = 'Voter Rejected';
              icon = <PersonIcon />;
              details = {
                'Voter Address': args.voterAddress,
                Email: args.email,
              };
            } else if (eventName === 'VoteCast') {
              action = 'Vote Cast';
              icon = <HowToVoteIcon />;
              const voter = await VotingService.getVoter(args.voterAddress);
              const election = await VotingService.getElection(args.electionId);
              const candidate = await VotingService.getCandidate(args.electionId, args.candidateId);
              details = {
                'Voter Address': args.voterAddress,
                'First Name': voter.firstName,
                'Last Name': voter.lastName,
                Email: voter.email,
                'Election ID': args.electionId.toString(),
                'Election Name': election.name,
                Position: args.positionName,
                'Candidate ID': args.candidateId.toString(),
                'Candidate Name': candidate.name,
              };
            } else if (eventName === 'CandidateRegistered') {
              action = 'Candidate Registered';
              icon = <PersonIcon />;
              const election = await VotingService.getElection(args.electionId);
              details = {
                'Election ID': args.electionId.toString(),
                'Election Name': election.name,
                Position: args.positionName,
                'Candidate Name': args.candidateName,
                'Candidate Address': args.addr,
                Approved: 'No',
              };
            } else if (eventName === 'CandidateApproved') {
              action = 'Candidate Approved';
              icon = <PersonIcon />;
              const election = await VotingService.getElection(args.electionId);
              details = {
                'Election ID': args.electionId.toString(),
                'Election Name': election.name,
                Position: args.positionName,
                'Candidate Name': args.candidateName,
              };
            } else if (eventName === 'CandidateRejected') {
              action = 'Candidate Rejected';
              icon = <PersonIcon />;
              const election = await VotingService.getElection(args.electionId);
              details = {
                'Election ID': args.electionId.toString(),
                'Election Name': election.name,
                Position: args.positionName,
                'Candidate Name': args.candidateName,
              };
            } else if (eventName === 'ElectionCreated') {
              action = 'Election Created';
              icon = <EventIcon />;
              details = {
                'Election ID': args.electionId.toString(),
                Name: args.name,
                'Start Time': new Date(args.startTime.toNumber() * 1000).toLocaleString(),
                'End Time': new Date(args.endTime.toNumber() * 1000).toLocaleString(),
              };
            } else if (eventName === 'PositionCreated') {
              action = 'Position Created';
              icon = <LocationCityIcon />;
              const election = await VotingService.getElection(args.electionId);
              details = {
                'Election ID': args.electionId.toString(),
                'Election Name': election.name,
                Position: args.positionName,
              };
            } else if (eventName === 'RegisteredAddressesReset') {
              action = 'Registered Addresses Reset';
              icon = <PersonIcon />;
              details = {
                Message: 'Registered addresses have been reset',
              };
            } else if (eventName === 'ElectionTimeExtended') {
              action = 'Election Time Extended';
              icon = <EventIcon />;
              const election = await VotingService.getElection(args.electionId);
              details = {
                'Election ID': args.electionId.toString(),
                'Election Name': election.name,
                'New End Time': new Date(args.newEndTime.toNumber() * 1000).toLocaleString(),
              };
            }

            return {
              ...event,
              timestamp,
              from,
              action,
              details,
              icon,
            };
          })
        );

        setEvents(enrichedEvents);
        setFilteredEvents(enrichedEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = () => {
    const filtered = events.filter((event) => {
      const { action, from, details } = event;
      const searchRegex = new RegExp(searchTerm, 'i');
      return searchRegex.test(action) || searchRegex.test(from) || JSON.stringify(details).match(searchRegex);
    });
    setFilteredEvents(filtered);
  };

  const toggleEventDetails = (eventIndex) => {
    setExpandedEvent(expandedEvent === eventIndex ? null : eventIndex);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h3" className={classes.title}>
        Voting DApp - Transaction Events
      </Typography>
      <div className={classes.searchContainer}>
        <TextField
          label="Search"
          variant="outlined"
          className={classes.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4}>
          {filteredEvents.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className={classes.card}>
                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar}>
                      {event.icon}
                    </Avatar>
                  }
                  title={event.action}
                  subheader={event.timestamp}
                />
                <CardContent className={classes.cardContent}>
                  <Typography variant="subtitle1" gutterBottom>
                    From: {event.from}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Transaction Hash:
                  </Typography>
                  <Typography variant="body2" component="p">
                    {event.transactionHash}
                  </Typography>
                </CardContent>
                <CardContent>
                  <IconButton
                    className={classes.iconButton}
                    onClick={() => toggleEventDetails(index)}
                  >
                    {expandedEvent === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </CardContent>
                <Collapse in={expandedEvent === index} timeout="auto" unmountOnExit>
                  <CardContent className={classes.eventDetails}>
                    <Typography variant="h6" gutterBottom>
                      Event Details:
                    </Typography>
                    {Object.entries(event.details).map(([key, value]) => (
                      <div key={key} className={classes.eventDetailItem}>
                        <Typography variant="subtitle1">{key}:</Typography>
                        <Typography variant="body2" component="p">
                          {value}
                        </Typography>
                      </div>
                    ))}
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default EventTracker;