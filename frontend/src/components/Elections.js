import React, { useState, useEffect } from 'react';
import VotingService from './VotingService';
import './Elections.css';

const ElectionCreationForm = () => {
  const [electionName, setElectionName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [positionName, setPositionName] = useState('');
  const [candidates, setCandidates] = useState('');
  const [selectedElection, setSelectedElection] = useState(null);
  const [elections, setElections] = useState([]);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const electionCount = await VotingService.getElectionCount();
        const electionDetails = [];
        
        for (let i = 1; i <= electionCount; i++) {
          const details = await VotingService.getElection(i);
          electionDetails.push({
            name: details[0],
            isOpen: details[1],
            startTime: details[2],
            endTime: details[3],
            positionNames: details[4] || [],
            isExpanded: false,
          });
        }

        setElections(electionDetails);
      } catch (error) {
        console.error('Error fetching elections:', error);
      }
    };

    fetchElections();
  }, []);

  const handleCreateElection = async () => {
    try {
      const startTimeTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimeTimestamp = Math.floor(new Date(endTime).getTime() / 1000);
  
      // Log the startTime value
      console.log("Start time:", startTimeTimestamp);
  
      await VotingService.createElection(
        electionName,
        startTimeTimestamp,
        endTimeTimestamp
      );
      console.log('Election created');
      setElectionName('');
      setStartTime('');
      setEndTime('');
      const newElection = {
        name: electionName,
        startTime: startTimeTimestamp,
        endTime: endTimeTimestamp,
        isOpen: false,
        positionNames: [],
        isExpanded: false,
      };
      setElections([...elections, newElection]);
    } catch (error) {
      console.error('Error creating election:', error);
    }
  };

  const handleCreatePosition = async () => {
    try {
      await VotingService.createPosition(elections.indexOf(selectedElection) + 1, positionName);
      console.log('Position created:', positionName);
      setSelectedElection({
        ...selectedElection,
        positionNames: [...(selectedElection.positionNames || []), positionName],
      });
      setPositionName('');
    } catch (error) {
      console.error('Error creating position:', error);
    }
  };

  const handleAddCandidates = async () => {
    try {
      const candidateNames = candidates.split(',').map((name) => name.trim());
      if (candidateNames.length < 2) {
        console.error('At least two candidates are required');
        return;
      }
  
      if (!selectedElection) {
        console.error('No election selected');
        return;
      }
  
      const electionId = elections.indexOf(selectedElection) + 1;
  
      await VotingService.addCandidates(electionId, positionName, candidateNames);
      console.log('Candidates added:', candidateNames);
      setCandidates('');
    } catch (error) {
      console.error('Error adding candidates:', error);
    }
  };
  const handleToggleElection = async (election) => {
    const updatedElections = elections.map((e) => {
      if (e === election) {
        return { ...e, isExpanded: !e.isExpanded };
      }
      return e;
    });
    setElections(updatedElections);

    if (!election.isExpanded) {
      try {
        const details = await VotingService.getElection(elections.indexOf(election) + 1);
        setSelectedElection({
          ...election,
          name: details[0],
          isOpen: details[1],
          startTime: details[2],
          endTime: details[3],
          positionNames: details[4] || [],
        });
      } catch (error) {
        console.error('Error fetching election details:', error);
      }
    } else {
      setSelectedElection(null);
    }
  };

  return (
    <div className="election-creation-form">
      <h2>Create Election</h2>
      <input
        type="text"
        placeholder="Election Name"
        value={electionName}
        onChange={(e) => setElectionName(e.target.value)}
      />
      <input
        type="datetime-local"
        placeholder="Start Time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        type="datetime-local"
        placeholder="End Time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <button onClick={handleCreateElection}>Create Election</button>

      <h2>Created Elections</h2>
      {elections.map((election, index) => (
        <div key={index} className="election-card">
          <div className="election-header" onClick={() => handleToggleElection(election)}>
            <h3>{election.name}</h3>
            <span className={`arrow ${election.isExpanded ? 'up' : 'down'}`}></span>
          </div>
          {election.isExpanded && (
            <div className="election-details">
              <p>Start Time: {new Date(Number(election.startTime.toString()) * 1000).toLocaleString()}</p>
              <p>End Time: {new Date(Number(election.endTime.toString()) * 1000).toLocaleString()}</p>
              <p>Status: {election.isOpen ? 'Open' : 'Closed'}</p>

              <h4>Create Position</h4>
              <input
                type="text"
                placeholder="Position Name"
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
              />
              <button onClick={handleCreatePosition}>Create Position</button>

              <h4>Positions</h4>
              <ul>
                {election.positionNames.map((position, index) => (
                  <li key={index}>{position}</li>
                ))}
              </ul>

              <h4>Add Candidates</h4>
              <select value={positionName} onChange={(e) => setPositionName(e.target.value)}>
                <option value="">Select Position</option>
                {selectedElection &&
                  selectedElection.positionNames.map((position, index) => (
                    <option key={index} value={position}>
                      {position}
                    </option>
                  ))}
              </select>
              <input
                type="text"
                placeholder="Candidate Names (comma-separated)"
                value={candidates}
                onChange={(e) => setCandidates(e.target.value)}
              />
              <button onClick={handleAddCandidates}>Add Candidates</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ElectionCreationForm;