import { ethers } from 'ethers';
import contractData from '../contractData.json';

const contractAddress = contractData.address;
const contractABI = contractData.abi;

class VotingService {
  constructor() {
    if (window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      console.error('Metamask not detected');
      this.provider = null;
    }
    this.signer = null;
    this.contract = null;
  }

  async connectToMetamask() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(contractAddress, contractABI, this.signer);
    } catch (error) {
      console.error('Failed to connect to Metamask:', error);
    }
  }

  async callContractMethod(methodName, ...args) {
    if (!this.contract) {
      await this.connectToMetamask();
    }
    if (this.contract && typeof this.contract[methodName] === 'function') {
      try {
        const result = await this.contract[methodName](...args);
        return result;
      } catch (error) {
        console.error(`Error calling ${methodName}:`, error);
        throw error;
      }
    } else {
      console.error(`Method ${methodName} not found in the contract`);
      throw new Error(`Method ${methodName} not found in the contract`);
    }
  }

  async isOwner(address) {
    return this.callContractMethod('isOwner', address);
  }

  async startElection() {
    return this.callContractMethod('startElection');
  }

  async endElection() {
    return this.callContractMethod('endElection');
  }

  async registerVoter(firstName, lastName, registrationNumber, email, phoneNumber, metamaskAddress) {
    return this.callContractMethod('registerVoter', firstName, lastName, registrationNumber, email, phoneNumber, metamaskAddress);
  }

  async approveVoter(voterAddress) {
    return this.callContractMethod('approveVoter', voterAddress);
  }

  async rejectVoter(voterAddress) {
    return this.callContractMethod('rejectVoter', voterAddress);
  }

  async resetRegisteredAddresses() {
    return this.callContractMethod('resetRegisteredAddresses');
  }

  async createElection(name, startTime, endTime) {
    return this.callContractMethod('createElection', name, startTime, endTime);
  }
  async getElection(electionId) {
    try {
      const result = await this.callContractMethod('getElection', electionId);
      const [name, isOpen, startTime, endTime, positionNames] = result;
      return {
        id: electionId,
        name,
        isOpen,
        startTime: startTime.toNumber(),
        endTime: endTime.toNumber(),
        positionNames,
      };
    } catch (error) {
      console.error('Error calling getElection:', error);
      throw error;
    }
  }

  async createPosition(electionId, positionName) {
    return this.callContractMethod('createPosition', electionId, positionName);
  }

  async addCandidates(electionId, positionName, candidateNames) {
    try {
      const election = await this.getElection(electionId);
      if (!election) {
        throw new Error(`Election with ID ${electionId} not found`);
      }
      return this.callContractMethod('addCandidates', electionId, positionName, candidateNames);
    } catch (error) {
      console.error('Error adding candidates:', error);
      throw error;
    }
  }

  async openElection(electionId) {
    return this.callContractMethod('openElection', electionId);
  }

  async closeElection(electionId) {
    return this.callContractMethod('closeElection', electionId);
  }

  async vote(electionId, positionName, candidateId) {
    return this.callContractMethod('vote', electionId, positionName, candidateId);
  }

  async getElectionResult(electionId, positionName) {
    return this.callContractMethod('getElectionResult', electionId, positionName);
  }

  async getElectionProgress(electionId, positionName) {
    return this.callContractMethod('getElectionProgress', electionId, positionName);
  }

  async getVoter(voterAddress) {
    try {
      console.log('Calling getVoter method with address:', voterAddress);
      const result = await this.callContractMethod('getVoter', voterAddress);
      console.log('Successfully called getVoter:', result);

      if (result) {
        const [firstName, lastName, registrationNumber, email, phoneNumber, metamaskAddress, approved, voted] = result;
        console.log('Voter details:', {
          firstName,
          lastName,
          registrationNumber,
          email,
          phoneNumber,
          metamaskAddress,
          approved,
          voted,
        });
        return {
          firstName,
          lastName,
          registrationNumber,
          email,
          phoneNumber,
          metamaskAddress,
          approved,
          voted,
        };
      } else {
        console.error('Invalid voter data:', result);
        throw new Error('Invalid voter data');
      }
    } catch (error) {
      console.error('Error calling getVoter:', error);
      throw error;
    }
  }

  async getPendingVoters() {
    try {
      console.log('Calling getPendingVoters method...');
      const result = await this.callContractMethod('getPendingVoters');
      console.log('Successfully called getPendingVoters:', result);

      if (result && Array.isArray(result)) {
        console.log('Pending voters addresses:', result);
        return result;
      } else {
        console.error('Invalid pending voters data:', result);
        throw new Error('Invalid pending voters data');
      }
    } catch (error) {
      console.error('Error calling getPendingVoters:', error);
      throw error;
    }
  }

  async getApprovedVoters(index) {
    return this.callContractMethod('getApprovedVoters', index);
  }

  async getElection(electionId) {
    return this.callContractMethod('getElection', electionId);
  }

  async getElectionCount() {
    return this.callContractMethod('electionCount');
  }

  async listenToContractEvents(eventName, callback) {
    if (!this.contract) {
      await this.connectToMetamask();
    }
    this.contract.on(eventName, callback);
  }

  async queryEvents(eventName, filter, fromBlock, toBlock) {
    if (!this.contract) {
      await this.connectToMetamask();
    }
    return this.contract.queryFilter(eventName, filter, fromBlock, toBlock);
  }

  async signMessage(message) {
    if (!this.signer) {
      await this.connectToMetamask();
    }
    return this.signer.signMessage(message);
  }

  async verifyMessage(message, signature) {
    return ethers.verifyMessage(message, signature);
  }
}

export default new VotingService();