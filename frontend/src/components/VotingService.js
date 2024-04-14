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
    console.log('Contract instance:', this.contract);
    console.log('Method name:', methodName);
    console.log('Method exists:', typeof this.contract[methodName]);
    if (this.contract && typeof this.contract[methodName] === 'function') {
      try {
        return this.contract[methodName](...args);
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

  async createPosition(electionId, positionName) {
    return this.callContractMethod('createPosition', electionId, positionName);
  }

  async registerCandidate(electionId, positionName, candidateName) {
    return this.callContractMethod('registerCandidate', electionId, positionName, candidateName);
  }

  async approveCandidate(electionId, positionName, candidateId) {
    return this.callContractMethod('approveCandidate', electionId, positionName, candidateId);
  }

  async rejectCandidate(electionId, positionName, candidateId) {
    return this.callContractMethod('rejectCandidate', electionId, positionName, candidateId);
  }

  async openElection(electionId) {
    return this.callContractMethod('openElection', electionId);
  }

  async closeElection(electionId) {
    return this.callContractMethod('closeElection', electionId);
  }

  async extendElectionTime(electionId, newEndTime) {
    return this.callContractMethod('extendElectionTime', electionId, newEndTime);
  }

  async vote(electionId, positionName, candidateId) {
    return this.callContractMethod('vote', electionId, positionName, candidateId);
  }

  async getElectionResult(electionId, positionName) {
    try {
      const result = await this.callContractMethod('getElectionResult', electionId, positionName);
      const [name, candidateIds, voteCounts] = result;
      return {
        positionName: name,
        candidateIds: candidateIds.map(id => id.toNumber()),
        voteCounts: voteCounts.map(count => count.toNumber()),
      };
    } catch (error) {
      console.error('Error calling getElectionResult:', error);
      throw error;
    }
  }

  async getElectionProgress(electionId, positionName) {
    try {
      const result = await this.callContractMethod('getElectionProgress', electionId, positionName);
      const [name, candidateIds, voteCounts] = result;
      return {
        positionName: name,
        candidateIds: candidateIds.map(id => id.toNumber()),
        voteCounts: voteCounts.map(count => count.toNumber()),
      };
    } catch (error) {
      console.error('Error calling getElectionProgress:', error);
      throw error;
    }
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
    try {
      console.log('Calling getElection with electionId:', electionId);
      const result = await this.callContractMethod('getElection', electionId);
      console.log('Result returned from getElection:', result);
  
      if (result && Array.isArray(result)) {
        const [name, isOpen, startTime, endTime, positionNames] = result;
        console.log('Destructured values from result:', {
          name,
          isOpen,
          startTime,
          endTime,
          positionNames,
        });
  
        const election = {
          id: electionId,
          name,
          isOpen,
          startTime: parseInt(startTime, 10),
          endTime: parseInt(endTime, 10),
          positionNames,
        };
        console.log('Returning election object:', election);
        return election;
      } else {
        console.error('Invalid election data:', result);
        throw new Error('Invalid election data');
      }
    } catch (error) {
      console.error('Error calling getElection:', error);
      throw error;
    }
  }
  
  async getElectionCount() {
    return this.callContractMethod('electionCount');
  }

  async getCandidate(electionId, candidateId) {
    try {
      const result = await this.callContractMethod('getCandidate', electionId, candidateId);
      const [id, name, voteCount, approved] = result;
      return {
        id: id.toNumber(),
        name,
        voteCount: voteCount.toNumber(),
        approved,
      };
    } catch (error) {
      console.error('Error calling getCandidate:', error);
      throw error;
    }
  }

  async getCandidates(electionId, positionName) {
    try {
      const [candidateIds, candidateNames, candidateApprovals] = await this.callContractMethod('getRegisteredCandidates', electionId, positionName);
      const candidates = candidateIds.map((id, index) => ({
        id: id.toString(),
        name: candidateNames[index],
        approved: candidateApprovals[index],
      }));
      return candidates.filter((candidate) => candidate.approved);
    } catch (error) {
      console.error('Error calling getRegisteredCandidates:', error);
      throw error;
    }
  }
  async getPositionNames(electionId) {
    try {
      const election = await this.getElection(electionId);
      return election.positionNames;
    } catch (error) {
      console.error('Error getting position names:', error);
      throw error;
    }
  }

  async getRegisteredCandidates() {
    try {
      const electionCount = await this.getElectionCount();
      const registeredCandidates = [];
  
      for (let electionId = 1; electionId <= electionCount; electionId++) {
        const election = await this.getElection(electionId);
        const { positionNames } = election;
  
        for (const positionName of positionNames) {
          const [candidateIds, candidateNames, candidateApprovals] = await this.callContractMethod('getRegisteredCandidates', electionId, positionName);
  
          for (let i = 0; i < candidateIds.length; i++) {
            const candidateId = candidateIds[i];
            const candidateName = candidateNames[i];
            const candidateApproval = candidateApprovals[i];
  
            if (!candidateApproval) {
              registeredCandidates.push({
                id: `${electionId}-${positionName}-${candidateId}`, // Generate a unique identifier
                name: candidateName,
                electionId,
                electionName: election.name,
                positionName,
              });
            }
          }
        }
      }
  
      return registeredCandidates;
    } catch (error) {
      console.error('Error fetching registered candidates:', error);
      throw error;
    }
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