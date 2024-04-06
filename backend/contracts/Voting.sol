// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Voting is Ownable, ReentrancyGuard {
    struct Voter {
        string firstName;
        string lastName;
        string registrationNumber;
        string email;
        string phoneNumber;
        address metamaskAddress;
        bool approved;
        bool voted;
    }

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Position {
        string name;
        uint256[] candidateIds;
    }

    struct Election {
        string name;
        bool isOpen;
        uint256 startTime;
        uint256 endTime;
        mapping(string => Position) positions;
        string[] positionNames;
    }

    mapping(address => Voter) public voters;
    address[] public pendingVoters;
    address[] public approvedVoters;
    mapping(uint256 => Election) public elections;
    uint256 public electionCount;
    mapping(uint256 => mapping(uint256 => Candidate)) private candidatesByElection;
    mapping(uint256 => uint256) public candidateCounts;
    mapping(uint256 => mapping(string => mapping(string => bool))) private candidateNameExists;

    event VoterRegistered(address indexed voterAddress, string email);
    event VoterApproved(address indexed voterAddress, string email);
    event VoterRejected(address indexed voterAddress, string email);
    event ElectionCreated(uint256 indexed electionId, string name);
    event PositionCreated(uint256 indexed electionId, string positionName);
    event CandidatesAdded(uint256 indexed electionId, string positionName, string[] candidateNames);
    event ElectionOpened(uint256 indexed electionId);
    event ElectionClosed(uint256 indexed electionId);
    event VoteCast(uint256 indexed electionId, address indexed voterAddress, string positionName, uint256 indexed candidateId);
    event RegisteredAddressesReset();
    event ElectionStarted();
    event ElectionEnded();

    bool public electionStarted;
    bool public electionEnded;

    constructor() Ownable(msg.sender) {}

    modifier validElection(uint256 _electionId) {
        require(_electionId <= electionCount, "Election does not exist");
        _;
    }

    modifier validPosition(uint256 _electionId, string memory _positionName) {
        Election storage election = elections[_electionId];
        require(bytes(election.positions[_positionName].name).length != 0, "Position does not exist");
        _;
    }

    modifier electionNotStarted(uint256 _electionId) {
        Election storage election = elections[_electionId];
        require(election.startTime > block.timestamp, "Election has already started");
        _;
    }

    function startElection() public onlyOwner {
        require(!electionStarted, "Election has already started");
        require(!electionEnded, "Election has already ended");

        electionStarted = true;
        emit ElectionStarted();
    }

    function isOwner(address _address) public view returns (bool) {
        return owner() == _address;
    }

    function endElection() public onlyOwner {
        require(electionStarted, "Election has not started yet");
        require(!electionEnded, "Election has already ended");

        electionEnded = true;
        emit ElectionEnded();
    }

    function registerVoter(
        string memory _firstName,
        string memory _lastName,
        string memory _registrationNumber,
        string memory _email,
        string memory _phoneNumber,
        address _metamaskAddress
    ) public {
        require(!electionStarted, "Cannot register voters after the election has started");
        require(!voters[_metamaskAddress].approved, "Voter is already registered and approved");
        require(!isVoterPending(_metamaskAddress), "Voter is already registered and pending approval");

        voters[_metamaskAddress] = Voter({
            firstName: _firstName,
            lastName: _lastName,
            registrationNumber: _registrationNumber,
            email: _email,
            phoneNumber: _phoneNumber,
            metamaskAddress: _metamaskAddress,
            approved: false,
            voted: false
        });
        pendingVoters.push(_metamaskAddress);
        emit VoterRegistered(_metamaskAddress, _email);
    }

    function approveVoter(address _voterAddress) public onlyOwner {
        require(isVoterPending(_voterAddress), "Voter is not in the pending list");

        voters[_voterAddress].approved = true;
        approvedVoters.push(_voterAddress);
        removePendingVoter(_voterAddress);
        emit VoterApproved(_voterAddress, voters[_voterAddress].email);
    }

    function rejectVoter(address _voterAddress) public onlyOwner {
        require(isVoterPending(_voterAddress), "Voter is not in the pending list");

        string memory email = voters[_voterAddress].email;
        delete voters[_voterAddress];
        removePendingVoter(_voterAddress);
        emit VoterRejected(_voterAddress, email);
    }

    function resetRegisteredAddresses() public onlyOwner {
        require(!electionStarted, "Cannot reset addresses while an election is in progress");

        for (uint256 i = 0; i < pendingVoters.length; i++) {
            address voterAddress = pendingVoters[i];
            delete voters[voterAddress];
        }
        for (uint256 i = 0; i < approvedVoters.length; i++) {
            address voterAddress = approvedVoters[i];
            delete voters[voterAddress];
        }
        pendingVoters = new address[](0);
        approvedVoters = new address[](0);

        emit RegisteredAddressesReset();
    }

    function createElection(string memory _name, uint256 _startTime, uint256 _endTime) public onlyOwner {
        require(_startTime < _endTime, "Invalid election start and end time");

        electionCount++;
        elections[electionCount].name = _name;
        elections[electionCount].isOpen = false;
        elections[electionCount].startTime = _startTime;
        elections[electionCount].endTime = _endTime;

        emit ElectionCreated(electionCount, _name);
    }

    function createPosition(uint256 _electionId, string memory _positionName) public onlyOwner validElection(_electionId) {
        require(bytes(_positionName).length > 0, "Position name cannot be empty");

        Election storage election = elections[_electionId];
        election.positionNames.push(_positionName);
        election.positions[_positionName] = Position(_positionName, new uint256[](0));

        emit PositionCreated(_electionId, _positionName);
    }

    function addCandidates(uint256 _electionId, string memory _positionName, string[] memory _candidateNames)
        public
        onlyOwner
        validElection(_electionId)
        validPosition(_electionId, _positionName)
        electionNotStarted(_electionId)
    {
        require(_candidateNames.length >= 2, "At least two candidates are required for a position");

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            require(!candidateNameExists[_electionId][_positionName][_candidateNames[i]], "Candidate name already exists");

            candidateCounts[_electionId]++;
            uint256 candidateId = candidateCounts[_electionId];
            candidatesByElection[_electionId][candidateId] = Candidate(candidateId, _candidateNames[i], 0);
            elections[_electionId].positions[_positionName].candidateIds.push(candidateId);

            candidateNameExists[_electionId][_positionName][_candidateNames[i]] = true;
        }

        emit CandidatesAdded(_electionId, _positionName, _candidateNames);
    }

    function openElection(uint256 _electionId) public onlyOwner validElection(_electionId) {
        Election storage election = elections[_electionId];
        require(!election.isOpen, "Election is already open");
        require(election.startTime <= block.timestamp, "Election start time has not reached");

        election.isOpen = true;
        emit ElectionOpened(_electionId);
    }

    function closeElection(uint256 _electionId) public onlyOwner validElection(_electionId) {
        Election storage election = elections[_electionId];
        require(election.isOpen, "Election is already closed");
        require(election.endTime <= block.timestamp, "Election end time has not reached");

        election.isOpen = false;
        emit ElectionClosed(_electionId);
    }

    function vote(uint256 _electionId, string memory _positionName, uint256 _candidateId) public nonReentrant validElection(_electionId) validPosition(_electionId, _positionName) {
        Election storage election = elections[_electionId];
        require(election.isOpen, "Election is not open for voting");
        require(voters[msg.sender].approved, "Voter is not approved");
        require(!voters[msg.sender].voted, "Voter has already voted");
        require(msg.sender == voters[msg.sender].metamaskAddress, "Voter's Metamask address does not match");

        Position storage position = election.positions[_positionName];
        require(isValidCandidate(position.candidateIds, _candidateId), "Invalid candidate");

        voters[msg.sender].voted = true;
        candidatesByElection[_electionId][_candidateId].voteCount++;
        emit VoteCast(_electionId, msg.sender, _positionName, _candidateId);
    }

    function getElectionResult(uint256 _electionId, string memory _positionName) public view validElection(_electionId) returns (string memory, uint256[] memory, uint256[] memory) {
        Election storage election = elections[_electionId];
        require(!election.isOpen, "Election is still open");

        Position storage position = election.positions[_positionName];
        uint256[] memory candidateIds = position.candidateIds;
        uint256[] memory voteCounts = new uint256[](candidateIds.length);
        for (uint256 i = 0; i < candidateIds.length; i++) {
            uint256 candidateId = candidateIds[i];
            voteCounts[i] = candidatesByElection[_electionId][candidateId].voteCount;
        }

        return (position.name, candidateIds, voteCounts);
    }

    function getElectionProgress(uint256 _electionId, string memory _positionName) public view validElection(_electionId) returns (string memory, uint256[] memory, uint256[] memory) {
        Election storage election = elections[_electionId];
        require(election.isOpen, "Election is not open");

        Position storage position = election.positions[_positionName];
        uint256[] memory candidateIds = position.candidateIds;
        uint256[] memory voteCounts = new uint256[](candidateIds.length);
        for (uint256 i = 0; i < candidateIds.length; i++) {
            uint256 candidateId = candidateIds[i];
            voteCounts[i] = candidatesByElection[_electionId][candidateId].voteCount;
        }

        return (position.name, candidateIds, voteCounts);
    }

    function getVoter(address _voterAddress) public view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        address,
        bool,
        bool
    ) {
        require(voters[_voterAddress].metamaskAddress != address(0) && bytes(voters[_voterAddress].firstName).length > 0, "Voter does not exist");
        Voter storage voter = voters[_voterAddress];
        return (
            voter.firstName,
            voter.lastName,
            voter.registrationNumber,
            voter.email,
            voter.phoneNumber,
            voter.metamaskAddress,
            voter.approved,
            voter.voted
        );
    }

    function getPendingVoters() public view returns (address[] memory) {
        return pendingVoters;
    }

    function getApprovedVoters(uint256 index) public view returns (address) {
        require(index < approvedVoters.length, "Invalid index");
        return approvedVoters[index];
    }

    function getElection(uint256 _electionId) public view validElection(_electionId) returns (
        string memory,
        bool,
        uint256,
        uint256,
        string[] memory
    ) {
        Election storage election = elections[_electionId];
        return (
            election.name,
            election.isOpen,
            election.startTime,
            election.endTime,
            election.positionNames
        );
    }

    function isVoterPending(address _voterAddress) internal view returns (bool) {
        for (uint256 i = 0; i < pendingVoters.length; i++) {
            if (pendingVoters[i] == _voterAddress) {
                return true;
            }
        }
        return false;
    }

    function removePendingVoter(address _voterAddress) internal {
        for (uint256 i = 0; i < pendingVoters.length; i++) {
            if (pendingVoters[i] == _voterAddress) {
                pendingVoters[i] = pendingVoters[pendingVoters.length - 1];
                pendingVoters.pop();
                break;
            }
        }
    }

    function isValidCandidate(uint256[] memory _candidateIds, uint256 _candidateId) internal pure returns (bool) {
        for (uint256 i = 0; i < _candidateIds.length; i++) {
            if (_candidateIds[i] == _candidateId) {
                return true;
            }
        }
        return false;
    }
}