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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registration" element={<VoterRegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/candidate-form" element={<CandidateForm />} />
        <Route path="/election-details" element={<ElectionDetails />} />
        <Route path="/candidate-approval" element={<CandidateApproval />} />
        <Route path="/pending-voters" element={<PendingVotersPage />} />
        <Route path="/approved-voters" element={<ApprovedVoters />} />
        <Route path="/elections" element={<Elections />} />
        <Route path="/rejected-voters" element={<RejectedVoters />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;