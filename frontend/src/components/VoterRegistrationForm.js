import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VoterRegistration.css';
import VotingService from './VotingService';

const VoterRegistrationForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const connectToMetamask = async () => {
    try {
      await VotingService.connectToMetamask();
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to Metamask:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect to Metamask first');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const metamaskAddress = await VotingService.signer.getAddress();
      await VotingService.registerVoter(
        firstName,
        lastName,
        registrationNumber,
        email,
        phoneNumber,
        metamaskAddress
      );
      setFirstName('');
      setLastName('');
      setRegistrationNumber('');
      setEmail('');
      setPhoneNumber('');
      alert('Voter registration successful!');
    } catch (error) {
      console.error('Error registering voter:', error);
      let errorMessage = 'Failed to register voter. Please try again.';
      if (error.message.includes('Voter is already registered and approved')) {
        errorMessage = 'Voter is already registered and approved.';
      } else if (error.message.includes('Voter is already registered and pending approval')) {
        errorMessage = 'Voter is already registered and pending approval.';
      } else if (error.message.includes('Cannot register voters after the election has started')) {
        errorMessage = 'Registration is not allowed after the election has started.';
      }
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <h2>Voter Registration</h2>
      {!isConnected ? (
        <button type="button" onClick={connectToMetamask}>Connect to Metamask</button>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="registrationNumber">Registration Number:</label>
            <input type="text" id="registrationNumber" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      )}
      {error && <p className="error-message">{error}</p>}
      <p className="registration-link">
        Already registered?{' '}
        <Link to="/login">Go to Login</Link>
        <h1>Or</h1>
        <Link to="/CandidateForm">Go to Candidate Registration form page</Link>
      </p>
    </div>
  );
};

export default VoterRegistrationForm;