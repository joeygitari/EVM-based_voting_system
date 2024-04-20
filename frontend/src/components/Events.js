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
} from '@material-ui/core';
import VotingService from './VotingService';

const useStyles = makeStyles((theme) => ({
  // ... (existing styles)
}));

const EventTracker = () => {
  const classes = useStyles();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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
          'ElectionOpened',
          'ElectionClosed',
          'VoteCast',
          'RegisteredAddressesReset',
          'ElectionStarted',
          'ElectionEnded',
          'ElectionTimeExtended',
        ];

        const allEvents = [];

        for (const eventName of eventNames) {
          const events = await VotingService.queryEvents(eventName);
          allEvents.push(...events);
        }

        const enrichedEvents = await Promise.all(
          allEvents.map(async (event) => {
            const { event: eventName, args, blockNumber, transactionHash } = event;
            const block = await VotingService.getBlock(blockNumber);
            const timestamp = new Date(block.timestamp * 1000).toLocaleString();
            const transaction = await VotingService.getTransaction(transactionHash);
            const from = transaction.from;

            let details = '';
            if (eventName === 'VoterRegistered' || eventName === 'VoterApproved' || eventName === 'VoterRejected') {
              const { firstName, lastName, email } = await VotingService.getVoter(args.voterAddress);
              details = `Voter: ${firstName} ${lastName} (${email})`;
            } else if (eventName === 'VoteCast') {
              const { firstName, lastName, email } = await VotingService.getVoter(args.voterAddress);
              details = `Voter: ${firstName} ${lastName} (${email}), Position: ${args.positionName}, Candidate ID: ${args.candidateId}`;
            }

            return {
              ...event,
              timestamp,
              from,
              details,
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
      const { event: eventName, from, details } = event;
      const searchRegex = new RegExp(searchTerm, 'i');
      return searchRegex.test(eventName) || searchRegex.test(from) || searchRegex.test(details);
    });
    setFilteredEvents(filtered);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        Transaction Events
      </Typography>
      <div className={classes.searchContainer}>
        <TextField
          label="Search"
          variant="outlined"
          className={classes.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>From</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Transaction Hash</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>{event.timestamp}</TableCell>
                  <TableCell>{event.event}</TableCell>
                  <TableCell>{event.from}</TableCell>
                  <TableCell>{event.details}</TableCell>
                  <TableCell>{event.transactionHash}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default EventTracker;