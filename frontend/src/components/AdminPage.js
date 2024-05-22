import React, { useState } from 'react';
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
  CardMedia,
  IconButton,
  Tooltip,
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
  AccountCircle,
  People,
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';

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

const AdminPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openVoters, setOpenVoters] = useState(false);
  const [openElection, setOpenElection] = useState(false);
  const [openCandidate, setOpenCandidate] = useState(false);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      // Implement logout logic
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
            <ListItemText primary="Pending Voters" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/ApprovedVoters">
            <ListItemText primary="Approved Voters" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/RejectedVoters">
            <ListItemText primary="Rejected Voters" />
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
            <ListItemText primary="Create Election" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/ElectionDetails">
            <ListItemText primary="View Elections" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/Results">
            <ListItemText primary="Election Results" />
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
            <ListItemText primary="Pending Candidates" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/ApprovedCandidates">
            <ListItemText primary="Approved Candidates" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/RejectedCandidates">
            <ListItemText primary="Rejected Candidates" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/CandidateForm">
            <ListItemText primary="Candidate Registration" />
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
          <AdminTitle variant={isMobile ? 'h6' : 'h5'} sx={{ color: 'white' }}>
            ADMINISTRATOR
          </AdminTitle>
          <Box sx={{ flexGrow: 1 }} />
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
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random?election"
                alt="Election Management"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Election Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create, view, and manage elections. Set up election details, positions, and candidates.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/Elections')}>
                  Create Election
                </Button>
                <Button size="small" color="primary" onClick={() => navigate('/ElectionDetails')}>
                  View Elections
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random?voters"
                alt="Voter Management"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Voter Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage voter registration and approvals. Review pending voters and make approval decisions.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/PendingVotersPage')}>
                  Pending Voters
                </Button>
                <Button size="small" color="primary" onClick={() => navigate('/ApprovedVoters')}>
                  Approved Voters
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random?candidate"
                alt="Candidate Management"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Candidate Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage candidate registration and approvals. Review pending candidates and make approval decisions.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/CandidateApproval')}>
                  Pending Candidates
                </Button>
                <Button size="small" color="primary" onClick={() => navigate('/ApprovedCandidates')}>
                  Approved Candidates
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random?results"
                alt="Election Results"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Election Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and analyze election results. Generate reports and gain insights into voting trends.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/Results')}>
                  View Results
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random?events"
                alt="Event Logs"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Event Logs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor and track important events in the voting system. Review logs for auditing purposes.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/Events')}>
                  View Logs
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random?register"
                alt="Voter Registration"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Voter Registration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Register new voters and manage their information. Collect necessary details for voter eligibility.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate('/VoterRegistrationForm')}>
                  Register Voter
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AdminContainer>
  );
};

export default AdminPage;