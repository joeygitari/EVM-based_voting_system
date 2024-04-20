import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import VoterRegistrationForm from './components/VoterRegistrationForm';
import AdminPage from './components/AdminPage';
import PendingVotersPage from './components/PendingVotersPage';
import ApprovedVoters from './components/ApprovedVoters';
import RejectedVoters from './components/RejectedVoters';
import Elections from './components/Elections';
import CandidateForm from './components/CandidateForm';
import CandidateApproval from './components/CandidateApproval';
import ElectionDetails from './components/ElectionDetails';
import HomePage from './components/HomePage';
import Events from './components/Events';
import Results from './components/Results';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/VoterRegistrationForm" element={<VoterRegistrationForm />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/CandidateForm" element={<CandidateForm />} />
        <Route path="/ElectionDetails" element={<ElectionDetails />} />
        <Route path="/CandidateApproval" element={<CandidateApproval />} />
        <Route path="/PendingVotersPage" element={<PendingVotersPage />} />
        <Route path="/ApprovedVoters" element={<ApprovedVoters />} />
        <Route path="/Elections" element={<Elections />} />
        <Route path="/RejectedVoters" element={<RejectedVoters />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/Results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;