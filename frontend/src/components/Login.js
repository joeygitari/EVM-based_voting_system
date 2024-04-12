import React, { useState, useEffect } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import './Login.css';

const ownerAccount = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

const PopupModal = () => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <p>Welcome Admin</p>
          <p>
            Connecting you to admin dashboard<span className="connecting-dots"></span>
          </p>
        </div>
      </div>
    </div>
  );
};

const DisconnectModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <p>To disconnect from MetaMask, please switch networks or disconnect manually within the MetaMask extension/app.</p>
          <button onClick={onClose}>Okay</button>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    if (isConnected && accountAddress.toLowerCase() === ownerAccount.toLowerCase()) {
      setIsLoading(true);
      setShowModal(true);
      setTimeout(() => {
        navigate('/AdminPage');
      }, 3000);
    }
  }, [isConnected, accountAddress, navigate]);

  const handleLogin = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Connected account:', accounts[0]);
      setIsConnected(true);
      setAccountAddress(accounts[0]);
    } catch (err) {
      console.warn('Failed to connect to MetaMask:', err);
    }
  };

  const handleDisconnect = async () => {
    setIsConnected(false);
    setAccountAddress('');
    setShowDisconnectModal(true);
  };

  const handleCloseDisconnectModal = () => {
    setShowDisconnectModal(false);
  };

  return (
    <div className="login-container">
      <h1>Welcome to the Voting DApp</h1>
      <p className="welcome-message">
        This application allows you to securely cast your vote using the Ethereum blockchain. To get started, please connect your registered MetaMask wallet.
      </p>
      <div className="button-container">
        <button onClick={handleLogin} className="login-button">
          {isConnected ? 'Connected' : 'Connect wallet'}
        </button>
        {isConnected && (
          <div className="account-info">
            <p>
              Connected account: <strong>{accountAddress}</strong>
            </p>
            <button onClick={handleDisconnect} className="disconnect-button">
              Disconnect
            </button>
          </div>
        )}
      </div>
      {!isConnected && (
        <div className="instructions">
          <h3>Instructions</h3>
          <ol>
            <li>Download and install the MetaMask browser extension or mobile app.</li>
            <li>You must be a registered voter, else, your account will be connected but directed nowhere.</li>
            <li>Import your Ethereum wallet.</li>
            <li>Click the "Log in with MetaMask" button above to connect your wallet.</li>
          </ol>
        </div>
      )}
      {isLoading && showModal && <PopupModal />}
      {showDisconnectModal && <DisconnectModal onClose={handleCloseDisconnectModal} />}
      <p>
        Not registered?{' '}
        <Link to="/VoterRegistrationForm">Go to Registration page</Link>
       
      </p>
    </div>
  );
};

export default Login;