import React from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ExpandLess,
  ExpandMore,
  HowToVote,
  HowToReg,
  Person,
  ExitToApp,
} from '@mui/icons-material';

const AdminContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  background: 'linear-gradient(45deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
}));

const AdminTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.primary.dark,
  textAlign: 'center',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
  animation: 'fadeIn 1s ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const AdminNavList = styled(List)(({ theme }) => ({
  width: '100%',
  maxWidth: 360,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  overflow: 'hidden',
  animation: 'slideIn 0.5s ease-in-out',
  '@keyframes slideIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
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
  color: theme.palette.text.primary,
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
    color: theme.palette.text.secondary,
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
  const [openVoters, setOpenVoters] = React.useState(false);
  const [openElection, setOpenElection] = React.useState(false);
  const navigate = useNavigate();

  const handleVotersClick = () => {
    setOpenVoters(!openVoters);
  };

  const handleElectionClick = () => {
    setOpenElection(!openElection);
  };

  const handleLogout = () => {
    // Perform logout actions (e.g., clear session, reset state)
    navigate('/login');
  };

  return (
    <AdminContainer>
      <AdminTitle variant={isMobile ? 'h4' : 'h2'}>ADMINISTRATOR</AdminTitle>
      <AdminNavList component="nav">
        <AdminNavItem button onClick={handleVotersClick}>
          <ListItemText primary="Voters" />
          {openVoters ? <ExpandLess /> : <ExpandMore />}
        </AdminNavItem>
        <DropdownContent in={openVoters} timeout="auto" unmountOnExit>
          <AdminNavLink to="/PendingVotersPage">
            <ListItemIcon>
              <HowToReg />
            </ListItemIcon>
            <ListItemText primary="Pending Registers" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/ApprovedVoters">
            <ListItemIcon>
              <HowToVote />
            </ListItemIcon>
            <ListItemText primary="Approved Voters" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/CandidateApproval">
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Pending Candidates" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/RejectedVoters">
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Rejected Voters" />
          </AdminNavLink>
        </DropdownContent>
        <AdminNavItem button onClick={handleElectionClick}>
          <ListItemText primary="Election" />
          {openElection ? <ExpandLess /> : <ExpandMore />}
        </AdminNavItem>
        <DropdownContent in={openElection} timeout="auto" unmountOnExit>
          <AdminNavLink to="/Elections">
            <ListItemIcon>
              <HowToVote />
            </ListItemIcon>
            <ListItemText primary="Create Election" />
          </AdminNavLink>
          <Divider />
          <AdminNavLink to="/ElectionDetails">
            <ListItemIcon>
              <HowToVote />
            </ListItemIcon>
            <ListItemText primary="View Elections" />
          </AdminNavLink>
        </DropdownContent>
        <AdminNavItem>
          <AdminNavLink to="/admin/results">
            <ListItemIcon>
              <HowToVote />
            </ListItemIcon>
            <ListItemText primary="Results" />
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
        <AdminNavItem>
          <AdminNavLink to="/CandidateForm">
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Candidate Registration" />
          </AdminNavLink>
        </AdminNavItem>
      </AdminNavList>
      <LogoutButton
        variant="contained"
        startIcon={<ExitToApp />}
        onClick={handleLogout}
      >
        Logout
      </LogoutButton>
    </AdminContainer>
  );
};

export default AdminPage;