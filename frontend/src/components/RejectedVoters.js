// RejectedVoters.js

import React from 'react';
import { Link } from 'react-router-dom';
import './PendingVotersPage.css';

const RejectedVoters = () => {
  return (
    <div className="admin-page-container">
      <h2 className="admin-page-title">Rejected Voters</h2>
      <div className="admin-page-content">
        <Link to="/AdminPage" className="admin-page-link">Back to Admin Dashboard</Link>
      </div>
    </div>
  );
}
export default RejectedVoters;
