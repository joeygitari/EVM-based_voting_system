import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
  Tooltip,
  Badge,
  Switch,
  AppBar,
  Toolbar,
  Drawer,
  CssBaseline,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ExpandLess,
  ExpandMore,
  HowToVote,
  HowToReg,
  Person,
  ExitToApp,
  Event,
  Dashboard,
  Settings,
  Notifications,
  AccountCircle,
  People,
  Assignment,
  Assessment,
  VerifiedUser,
  Block,
  Pending,
  AddBox,
  Ballot,
  HowToRegOutlined,
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import VotingService from './VotingService';

const drawerWidth = 240;

const AdminContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  background: theme.palette.mode === 'dark' ? theme.palette.background.default : 'linear-gradient(45deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const AdminTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.primary.dark,
  textAlign: 'center',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
}));

const AdminNavList = styled(List)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.default,
}));

const AdminNavItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const AdminNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.text.primary,
  transition: 'color 0.3s',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    color: theme.palette.primary.main,
  },
  '&.active': {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
}));

const DropdownContent = styled(Collapse)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  '& .MuiListItem-root': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  '& .MuiListItemIcon-root': {
    minWidth: 'unset',
    marginRight: theme.spacing(2),
  },
  '& a': {
    textDecoration: 'none',
    color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.text.secondary,
    transition: 'color 0.3s',
    '&:hover': {
      color: theme.palette.primary.main,
    },
    '&.active': {
      color: theme.palette.primary.main,
      fontWeight: 'bold',
    },
  },
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

const DashboardCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  cursor: 'pointer',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const DashboardCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const DashboardCardIcon = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: theme.spacing(6),
  height: theme.spacing(6),
  marginBottom: theme.spacing(2),
}));

const DashboardCardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
}));

const AdminPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openVoters, setOpenVoters] = useState(false);
  const [openElection, setOpenElection] = useState(false);
  const [openCandidate, setOpenCandidate] = useState(false);
  const navigate = useNavigate();
  const [totalElections, setTotalElections] = useState(0);
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [pendingVoters, setPendingVoters] = useState(0);
  const [pendingCandidates, setPendingCandidates] = useState(0);
  const [upcomingElections, setUpcomingElections] = useState(0);
  const [ongoingElections, setOngoingElections] = useState(0);
  const [completedElections, setCompletedElections] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const electionCount = await VotingService.getElectionCount();
        setTotalElections(electionCount);

        const approvedVoters = await VotingService.getApprovedVoters();
        setTotalVoters(approvedVoters.length);

        const registeredCandidates = await VotingService.getRegisteredCandidates();
        setTotalCandidates(registeredCandidates.length);

        const pendingVotersCount = await VotingService.getPendingVotersCount();
        setPendingVoters(pendingVotersCount);

        const pendingCandidatesCount = await VotingService.getPendingCandidatesCount();
        setPendingCandidates(pendingCandidatesCount);

        const upcomingElectionsCount = await VotingService.getUpcomingElectionsCount();
        setUpcomingElections(upcomingElectionsCount);

        const ongoingElectionsCount = await VotingService.getOngoingElectionsCount();
        setOngoingElections(ongoingElectionsCount);

        const completedElectionsCount = await VotingService.getCompletedElectionsCount();
        setCompletedElections(completedElectionsCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleVoterRegistered = (voterAddress, email) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `New voter registered: ${email}`,
      ]);
    };

    const handleCandidateRegistered = (electionId, positionName, candidateName) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `New candidate registered: ${candidateName} for ${positionName} in Election ${electionId}`,
      ]);
    };

    const handleVoteCast = (electionId, voterAddress, positionName, candidateId) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `Vote cast by ${voterAddress} for ${positionName} in Election ${electionId}`,
      ]);
    };

    VotingService.listenToContractEvents('VoterRegistered', handleVoterRegistered);
    VotingService.listenToContractEvents('CandidateRegistered', handleCandidateRegistered);
    VotingService.listenToContractEvents('VoteCast', handleVoteCast);

    return () => {
      VotingService.removeContractListener('VoterRegistered', handleVoterRegistered);
      VotingService.removeContractListener('CandidateRegistered', handleCandidateRegistered);
      VotingService.removeContractListener('VoteCast', handleVoteCast);
    };
  }, []);

  const handleVotersClick = () => {
    setOpenVoters(!openVoters);
  };

  const handleElectionClick = () => {
    setOpenElection(!openElection);
  };

  const handleCandidateClick = () => {
    setOpenCandidate(!openCandidate);
  };

  const handleLogout = async () => {
    try {
      await VotingService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const drawer = (
    <div>
      <AdminNavList component="nav">
        <AdminNavItem button onClick={handleVotersClick}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="Voters Management" />
          {openVoters ? <ExpandLess /> : <ExpandMore />}
        </AdminNavItem>
        <DropdownContent in={openVoters} timeout="auto" unmountOnExit>
          <AdminNavLink to="/PendingVotersPage">
            <ListItemIcon>
              <Pending />
            </ListItemIcon>
            <ListItemText primary="Pending Voters" />
            <Badge badgeContent={pendingVoters} color="primary" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/ApprovedVoters">
            <ListItemIcon>
              <VerifiedUser />
            </ListItemIcon>
            <ListItemText primary="Approved Voters" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/RejectedVoters">
            <ListItemIcon>
              <Block />
            </ListItemIcon>
            <ListItemText primary="Rejected Voters" />
          </AdminNavLink>
        </DropdownContent>
        <AdminNavItem button onClick={handleCandidateClick}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Candidate Management" />
          {openCandidate ? <ExpandLess /> : <ExpandMore />}
        </AdminNavItem>
        <DropdownContent in={openCandidate} timeout="auto" unmountOnExit>
          <AdminNavLink to="/CandidateApproval">
            <ListItemIcon>
              <Pending />
            </ListItemIcon>
            <ListItemText primary="Pending Candidates" />
            <Badge badgeContent={pendingCandidates} color="primary" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/ApprovedCandidates">
            <ListItemIcon>
              <VerifiedUser />
            </ListItemIcon>
            <ListItemText primary="Approved Candidates" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/RejectedCandidates">
            <ListItemIcon>
              <Block />
            </ListItemIcon>
            <ListItemText primary="Rejected Candidates" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/CandidateForm">
            <ListItemIcon>
              <HowToRegOutlined />
            </ListItemIcon>
            <ListItemText primary="Candidate Registration" />
          </AdminNavLink>
        </DropdownContent>
        <AdminNavItem button onClick={handleElectionClick}>
          <ListItemIcon>
            <HowToVote />
          </ListItemIcon>
          <ListItemText primary="Election Management" />
          {openElection ? <ExpandLess /> : <ExpandMore />}
        </AdminNavItem>
        <DropdownContent in={openElection} timeout="auto" unmountOnExit>
          <AdminNavLink to="/Elections">
            <ListItemIcon>
              <AddBox />
            </ListItemIcon>
            <ListItemText primary="Create Election" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/ElectionDetails">
            <ListItemIcon>
              <Ballot />
            </ListItemIcon>
            <ListItemText primary="View Elections" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/Results">
            <ListItemIcon>
              <Assessment />
            </ListItemIcon>
            <ListItemText primary="Election Results" />
          </AdminNavLink>
        </DropdownContent>
        <AdminNavItem>
          <AdminNavLink to="/Events">
            <ListItemIcon>
              <Event />
            </ListItemIcon>
            <ListItemText primary="Event Logs" />
          </AdminNavLink>
        </AdminNavItem>
        <AdminNavItem>
          <AdminNavLink to="/VoterRegistrationForm">
            <ListItemIcon>
              <HowToReg />
            </ListItemIcon>
            <ListItemText primary="Voter Registration" />
          </AdminNavLink>
        </AdminNavItem>
      </AdminNavList>
      <LogoutButton variant="contained" startIcon={<ExitToApp />} onClick={handleLogout}>
        Logout
      </LogoutButton>
    </div>
  );

  return (
    <AdminContainer>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <AdminTitle variant={isMobile ? 'h6' : 'h5'}>ADMINISTRATOR</AdminTitle>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Notifications">
          <IconButton color="inherit">
            <Badge badgeContent={notifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
          <IconButton color="inherit">
            <Settings />
          </IconButton>
          </Tooltip>
          <Tooltip title="Account">
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          </Tooltip>
          <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
          <IconButton color="inherit" onClick={handleDarkModeToggle}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          </Tooltip>
          </Toolbar>
          </AppBar>
          <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          >
          {drawer}
          </Drawer>
          <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
          >
          {drawer}
          </Drawer>
          </Box>
          <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
          <Toolbar />
          <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/ElectionDetails')}>
            <DashboardCardContent>
              <DashboardCardIcon>
                <HowToVote />
              </DashboardCardIcon>
              <DashboardCardTitle variant="h6">Total Elections</DashboardCardTitle>
              <Typography variant="h4">{totalElections}</Typography>
            </DashboardCardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Elections
              </Button>
            </CardActions>
          </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/ApprovedVoters')}>
            <DashboardCardContent>
              <DashboardCardIcon>
                <People />
              </DashboardCardIcon>
              <DashboardCardTitle variant="h6">Total Voters</DashboardCardTitle>
              <Typography variant="h4">{totalVoters}</Typography>
            </DashboardCardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Voters
              </Button>
            </CardActions>
          </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/CandidateApproval')}>
            <DashboardCardContent>
              <DashboardCardIcon>
                <Person />
              </DashboardCardIcon>
              <DashboardCardTitle variant="h6">Total Candidates</DashboardCardTitle>
              <Typography variant="h4">{totalCandidates}</Typography>
            </DashboardCardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Candidates
              </Button>
            </CardActions>
          </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/PendingVotersPage')}>
            <DashboardCardContent>
              <DashboardCardIcon>
                <Pending />
              </DashboardCardIcon>
              <DashboardCardTitle variant="h6">Pending Voters</DashboardCardTitle>
              <Typography variant="h4">{pendingVoters}</Typography>
            </DashboardCardContent>
            <CardActions>
              <Button size="small" color="primary">
                Review Voters
              </Button>
            </CardActions>
          </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/CandidateApproval')}>
            <DashboardCardContent>
              <DashboardCardIcon>
                <Pending />
              </DashboardCardIcon>
              <DashboardCardTitle variant="h6">Pending Candidates</DashboardCardTitle>
              <Typography variant="h4">{pendingCandidates}</Typography>
            </DashboardCardContent>
            <CardActions>
              <Button size="small" color="primary">
                Review Candidates
              </Button>
            </CardActions>
          </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
          <DashboardCard>
            <DashboardCardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <DashboardCardIcon>
                    <AddBox />
                  </DashboardCardIcon>
                  <Typography variant="subtitle1">Upcoming</Typography>
                  <Typography variant="h6">{upcomingElections}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <DashboardCardIcon>
                    <Ballot />
                  </DashboardCardIcon>
                  <Typography variant="subtitle1">Ongoing</Typography>
                  <Typography variant="h6">{ongoingElections}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <DashboardCardIcon>
                    <Assignment />
                  </DashboardCardIcon>
                  <Typography variant="subtitle1">Completed</Typography>
                  <Typography variant="h6">{completedElections}</Typography>
                </Grid>
              </Grid>
            </DashboardCardContent>
          </DashboardCard>
          </Grid>
          </Grid>
          </Box>
          </AdminContainer>
          );
          };

export default AdminPage;