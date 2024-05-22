import React, { useState, useEffect } from 'react';
import VotingService from './VotingService';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  Container,
  Avatar,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import {
  Home as HomeIcon,
  Event as EventIcon,
  HowToVote as HowToVoteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const ElectionResult = () => {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [selectedElection, setSelectedElection] = useState(null);
  const [electionResults, setElectionResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const electionCount = await VotingService.getElectionCount();
        const electionDetails = [];

        for (let i = 1; i <= electionCount; i++) {
          const details = await VotingService.getElection(i);
          electionDetails.push(details);
        }

        setElections(electionDetails);
        setSelectedElectionId(electionDetails[0]?.id || null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching elections:', error);
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  useEffect(() => {
    const fetchElectionResult = async () => {
      if (!selectedElectionId) return;

      try {
        const election = await VotingService.getElection(selectedElectionId);
        setSelectedElection(election);

        const results = {};

        for (const positionName of election.positionNames) {
          const candidates = await VotingService.getCandidates(selectedElectionId, positionName);
          const candidateIds = candidates.map((candidate) => candidate.id);
          const candidateNames = candidates.map((candidate) => candidate.name);

          const result = await VotingService.getElectionResult(selectedElectionId, positionName);
          results[positionName] = {
            ...result,
            candidateIds,
            candidateNames,
          };
        }

        setElectionResults(results);
      } catch (error) {
        console.error('Error fetching election result:', error);
      }
    };

    fetchElectionResult();
  }, [selectedElectionId]);

  const getChartData = (positionName) => {
    const defaultData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
    };

    if (!electionResults || !electionResults[positionName]) {
      return defaultData;
    }

    const { candidateNames, voteCounts } = electionResults[positionName];

    if (candidateNames.length === 0) {
      return defaultData;
    }

    return {
      labels: candidateNames,
      datasets: [
        {
          data: voteCounts,
          backgroundColor: voteCounts.map((_, index) =>
            `hsl(${(index * 120) % 360}, 50%, 50%)`
          ),
        },
      ],
    };
  };

  const getTotalVotes = (positionName) => {
    if (!electionResults || !electionResults[positionName]) return 0;
    const { voteCounts } = electionResults[positionName];
    return voteCounts.reduce((sum, count) => sum + count, 0);
  };

  const getWinners = (positionName) => {
    if (!electionResults || !electionResults[positionName]) return [];
    const { candidateIds, candidateNames, voteCounts } = electionResults[positionName];

    if (!candidateNames || candidateNames.length === 0) return [];

    const maxVotes = Math.max(...voteCounts);
    const winnerIndices = candidateIds.reduce((indices, id, index) => {
      if (voteCounts[index] === maxVotes) {
        indices.push(index);
      }
      return indices;
    }, []);

    return winnerIndices.map((index) => candidateNames[index]);
  };

  const getVotePercentage = (positionName, candidateIndex) => {
    if (!electionResults || !electionResults[positionName]) return 0;
    const totalVotes = getTotalVotes(positionName);
    const candidateVotes = electionResults[positionName].voteCounts[candidateIndex];
    return totalVotes === 0 ? 0 : ((candidateVotes / totalVotes) * 100).toFixed(2);
  };

  const handleElectionClick = (electionId) => {
    setSelectedElectionId(electionId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, background: 'linear-gradient(45deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant={isMobile ? 'h4' : 'h3'} gutterBottom>
          Election Results
        </Typography>
        <Box>
          <Tooltip title="Home">
            <IconButton href="/">
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Elections">
            <IconButton href="/elections">
              <HowToVoteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Events">
            <IconButton href="/events">
              <EventIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Grid container spacing={4}>
        {elections.map((election) => (
          <Grid item xs={12} sm={6} md={4} key={election.id}>
            <Card onClick={() => handleElectionClick(election.id)} sx={{ cursor: 'pointer', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <CardMedia
                image={`https://source.unsplash.com/random/800x600?election&sig=${election.id}`}
                title={election.name}
                sx={{ height: 200 }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {election.name}
                </Typography>
                {election.positionNames?.map((positionName) => (
                  <Chip key={positionName} label={positionName} sx={{ m: 0.5 }} />
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedElection && electionResults && (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant={isMobile ? 'h5' : 'h4'} align="center" gutterBottom>
            {selectedElection.name} Results
          </Typography>
          {selectedElection.positionNames?.map((positionName) => (
            <Accordion
              key={positionName}
              sx={{ mt: 2, background: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              defaultExpanded
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{positionName}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Voting Results
                        </Typography>
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Candidate</TableCell>
                                <TableCell align="right">Votes</TableCell>
                                <TableCell align="right">Percentage</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {electionResults[positionName]?.candidateIds?.map((candidateId, index) => (
                                <TableRow key={candidateId}>
                                  <TableCell component="th" scope="row">
                                    <Box display="flex" alignItems="center">
                                      <Avatar src={`https://i.pravatar.cc/150?u=${candidateId}`} alt={electionResults[positionName]?.candidateNames[index]} sx={{ mr: 2 }} />
                                      {electionResults[positionName]?.candidateNames[index]}
                                    </Box>
                                  </TableCell>
                                  <TableCell align="right">{electionResults[positionName]?.voteCounts[index]}</TableCell>
                                  <TableCell align="right">
                                    <Box display="flex" alignItems="center">
                                      {getVotePercentage(positionName, index)}%
                                      <Box ml={1} flexGrow={1}>
                                        <LinearProgress variant="determinate" value={parseFloat(getVotePercentage(positionName, index))} color="primary" />
                                      </Box>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Box mt={2}>
                          <Typography variant="subtitle1">
                            Total Votes: {getTotalVotes(positionName)}
                          </Typography>
                          <Typography variant="subtitle1">
                            Winner(s): {getWinners(positionName).join(', ')}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Voting Distribution
                        </Typography>
                        <Box height={400} position="relative">
                          <Pie
                            data={getChartData(positionName)}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'right',
                                },
                              },
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Votes Breakdown
                        </Typography>
                        <Box height={400} position="relative">
                          <Bar
                            data={getChartData(positionName)}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  title: {
                                    display: true,
                                    text: 'Number of Votes',
                                  },
                                },
                              },
                              plugins: {
                                legend: {
                                  display: false,
                                },
                              },
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      )}
    </Box>
  );
};

export default ElectionResult;