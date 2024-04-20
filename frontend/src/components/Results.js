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
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
import Chart from 'chart.js/auto';
import { styled } from '@mui/system';
import {
  Home as HomeIcon,
  Event as EventIcon,
  HowToVote as HowToVoteIcon,
} from '@mui/icons-material';

Chart.register(ArcElement);

const ResultContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background?.default || '#f5f5f5',
  minHeight: '100vh',
}));

const ElectionCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const ElectionCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const ElectionResult = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
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
          electionDetails.push({
            id: i,
            name: details.name,
            positionNames: details.positionNames || [],
          });
        }

        setElections(electionDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching elections:', error);
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const fetchElectionResult = async (electionId, positionName) => {
    try {
      const result = await VotingService.getElectionResult(electionId, positionName);
      const candidateNames = await Promise.all(
        result.candidateIds.map((candidateId) =>
          VotingService.getCandidate(electionId, candidateId).then((candidate) => candidate.name)
        )
      );
      const winners = await getWinner(result.candidateIds, result.voteCounts);
      setSelectedElection({ id: electionId, name: elections.find((e) => e.id === electionId).name });
      setSelectedPosition({
        name: result.positionName,
        candidateIds: result.candidateIds,
        candidateNames,
        voteCounts: result.voteCounts,
        winners,
      });
    } catch (error) {
      console.error('Error fetching election result:', error);
    }
  };

  const getChartData = () => {
    if (!selectedPosition) return null;

    const backgroundColors = selectedPosition.candidateNames.map((_, index) => {
      if (index === 0) return theme.palette.primary.main;
      if (index === 1) return theme.palette.secondary.main;
      return theme.palette.grey[300];
    });

    return {
      labels: selectedPosition.candidateNames,
      datasets: [
        {
          data: selectedPosition.voteCounts,
          backgroundColor: backgroundColors,
        },
      ],
    };
  };

  const getTotalVotes = () => {
    if (!selectedPosition) return 0;
    return selectedPosition.voteCounts.reduce((sum, count) => sum + count, 0);
  };

  const getWinner = (candidateIds, voteCounts) => {
    if (!candidateIds || !voteCounts) return null;
    const maxVotes = Math.max(...voteCounts);
    const winnerIds = candidateIds.filter((_, index) => voteCounts[index] === maxVotes);
    return Promise.all(winnerIds.map((candidateId) => VotingService.getCandidate(selectedElection.id, candidateId)));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ResultContainer>
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
            <ElectionCard>
              <ElectionCardMedia image={`https://source.unsplash.com/random/800x600?election&sig=${election.id}`} />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {election.name}
                </Typography>
                {election.positionNames.map((positionName) => (
                  <Chip
                    key={positionName}
                    label={positionName}
                    onClick={() => fetchElectionResult(election.id, positionName)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </CardContent>
            </ElectionCard>
          </Grid>
        ))}
      </Grid>
      {selectedPosition && (
        <Box mt={4}>
          <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
            {selectedElection.name} - {selectedPosition.name}
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
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
                    {selectedPosition.candidateIds.map((candidateId, index) => (
                      <TableRow key={candidateId}>
                        <TableCell component="th" scope="row">
                          {selectedPosition.candidateNames[index]}
                        </TableCell>
                        <TableCell align="right">{selectedPosition.voteCounts[index]}</TableCell>
                        <TableCell align="right">
                          {((selectedPosition.voteCounts[index] / getTotalVotes()) * 100).toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box mt={2}>
                <Typography variant="h6">Total Votes: {getTotalVotes()}</Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="h6">
                  Winner:{' '}
                  {selectedPosition.winners?.map((winner) => (
                    <Chip
                      key={winner.id}
                      avatar={<Avatar>{winner.name[0]}</Avatar>}
                      label={winner.name}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box height="100%" position="relative">
                <Pie data={getChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom>
            Vote Distribution
          </Typography>
          {selectedPosition.candidateIds.map((candidateId, index) => (
            <Box key={candidateId} mb={2}>
              <Typography variant="body1">{selectedPosition.candidateNames[index]}</Typography>
              <LinearProgress
                variant="determinate"
                value={(selectedPosition.voteCounts[index] / getTotalVotes()) * 100}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2">Votes: {selectedPosition.voteCounts[index]}</Typography>
                <Typography variant="body2">
                  Percentage: {((selectedPosition.voteCounts[index] / getTotalVotes()) * 100).toFixed(2)}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </ResultContainer>
  );
};

export default ElectionResult;