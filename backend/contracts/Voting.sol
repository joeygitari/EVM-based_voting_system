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
        bool approved;
        address addr;
    }

    struct Position {
        string name;
        uint256[] candidateIds;
    }

    struct Election {
        string name;
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
    mapping(uint256 => mapping(uint256 => Candidate))
        private candidatesByElection;
    mapping(uint256 => uint256) public candidateCounts;
    mapping(uint256 => mapping(string => mapping(string => bool)))
        private candidateNameExists;

    event VoterRegistered(address indexed voterAddress, string email);
    event VoterApproved(address indexed voterAddress, string email);
    event VoterRejected(address indexed voterAddress, string email);
    event ElectionCreated(uint256 indexed electionId, string name);
    event PositionCreated(uint256 indexed electionId, string positionName);
    event CandidateRegistered(
        uint256 indexed electionId,
        string positionName,
        string candidateName,
        address candidateAddress
    );
    event CandidateApproved(
        uint256 indexed electionId,
        string positionName,
        string candidateName
    );
    event CandidateRejected(
        uint256 indexed electionId,
        string positionName,
        string candidateName
    );
    event VoteCast(
        uint256 indexed electionId,
        address indexed voterAddress,
        string positionName,
        uint256 indexed candidateId
    );
    event RegisteredAddressesReset();
    event ElectionTimeExtended(uint256 indexed electionId, uint256 newEndTime);
    constructor() Ownable(msg.sender) {}

    modifier validElection(uint256 _electionId) {
        require(_electionId <= electionCount, "Election does not exist");
        _;
    }

    modifier validPosition(uint256 _electionId, string memory _positionName) {
        Election storage election = elections[_electionId];
        require(
            bytes(election.positions[_positionName].name).length != 0,
            "Position does not exist"
        );
        _;
    }

    modifier electionNotStarted(uint256 _electionId) {
        Election storage election = elections[_electionId];
        require(
            block.timestamp < election.startTime,
            "Election has already started"
        );
        _;
    }

    modifier notOwner() {
        require(msg.sender != owner(), "Owner cannot vote");
        _;
    }

    function isOwner(address _address) public view returns (bool) {
        return owner() == _address;
    }

    function registerVoter(
        string memory _firstName,
        string memory _lastName,
        string memory _registrationNumber,
        string memory _email,
        string memory _phoneNumber,
        address _metamaskAddress
    ) public {
        require(
            block.timestamp < elections[electionCount].startTime,
            "Cannot register voters after the election has started"
        );
        require(
            !voters[_metamaskAddress].approved,
            "Voter is already registered and approved"
        );
        require(
            !isVoterPending(_metamaskAddress),
            "Voter is already registered and pending approval"
        );

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
        require(
            isVoterPending(_voterAddress),
            "Voter is not in the pending list"
        );

        voters[_voterAddress].approved = true;
        approvedVoters.push(_voterAddress);
        removePendingVoter(_voterAddress);
        emit VoterApproved(_voterAddress, voters[_voterAddress].email);
    }

    function rejectVoter(address _voterAddress) public onlyOwner {
        require(
            isVoterPending(_voterAddress),
            "Voter is not in the pending list"
        );

        string memory email = voters[_voterAddress].email;
        delete voters[_voterAddress];
        removePendingVoter(_voterAddress);
        emit VoterRejected(_voterAddress, email);
    }

    function resetRegisteredAddresses() public onlyOwner {
        require(
            block.timestamp < elections[electionCount].startTime,
            "Cannot reset addresses while an election is in progress"
        );

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

    function createElection(
        string memory _name,
        uint256 _startTime,
        uint256 _endTime
    ) public onlyOwner {
        require(_startTime < _endTime, "Invalid election start and end time");

        electionCount++;
        elections[electionCount].name = _name;
        elections[electionCount].startTime = _startTime;
        elections[electionCount].endTime = _endTime;

        emit ElectionCreated(electionCount, _name);
    }

    function createPosition(
        uint256 _electionId,
        string memory _positionName
    ) public onlyOwner validElection(_electionId) {
        require(
            bytes(_positionName).length > 0,
            "Position name cannot be empty"
        );

        Election storage election = elections[_electionId];
        election.positionNames.push(_positionName);
        election.positions[_positionName] = Position(
            _positionName,
            new uint256[](0)
        );

        emit PositionCreated(_electionId, _positionName);
    }

    function registerCandidate(
        uint256 _electionId,
        string memory _positionName,
        string memory _candidateName
    )
        public
        validElection(_electionId)
        validPosition(_electionId, _positionName)
        electionNotStarted(_electionId)
    {
        require(
            !candidateNameExists[_electionId][_positionName][_candidateName],
            "Candidate name already exists"
        );

        candidateCounts[_electionId]++;
        uint256 candidateId = candidateCounts[_electionId];
        candidatesByElection[_electionId][candidateId] = Candidate(
            candidateId,
            _candidateName,
            0,
            false,
            msg.sender
        );

        candidateNameExists[_electionId][_positionName][_candidateName] = true;

        emit CandidateRegistered(
            _electionId,
            _positionName,
            _candidateName,
            msg.sender
        );
    }

    function approveCandidate(
        uint256 _electionId,
        string memory _positionName,
        uint256 _candidateId
    )
        public
        onlyOwner
        validElection(_electionId)
        validPosition(_electionId, _positionName)
        electionNotStarted(_electionId)
    {
        Candidate storage candidate = candidatesByElection[_electionId][
            _candidateId
        ];
        require(!candidate.approved, "Candidate is already approved");

        candidate.approved = true;
        elections[_electionId].positions[_positionName].candidateIds.push(
            _candidateId
        );

        emit CandidateApproved(_electionId, _positionName, candidate.name);
    }

    function getRegisteredCandidates(
        uint256 _electionId,
        string memory _positionName
    )
        public
        view
        validElection(_electionId)
        validPosition(_electionId, _positionName)
        returns (uint256[] memory, string[] memory, bool[] memory)
    {
        uint256 count = candidateCounts[_electionId];
        uint256[] memory candidateIds = new uint256[](count);
        string[] memory candidateNames = new string[](count);
        bool[] memory candidateApprovals = new bool[](count);

        uint256 index = 0;
        for (uint256 candidateId = 1; candidateId <= count; candidateId++) {
            Candidate storage candidate = candidatesByElection[_electionId][
                candidateId
            ];
            if (
                candidateNameExists[_electionId][_positionName][candidate.name]
            ) {
                candidateIds[index] = candidateId;
                candidateNames[index] = candidate.name;
                candidateApprovals[index] = candidate.approved;
                index++;
            }
        }

        // Resize the arrays to remove any empty slots
        assembly {
            mstore(candidateIds, index)
            mstore(candidateNames, index)
            mstore(candidateApprovals, index)
        }

        return (candidateIds, candidateNames, candidateApprovals);
    }

    function rejectCandidate(
        uint256 _electionId,
        string memory _positionName,
        uint256 _candidateId
    )
        public
        onlyOwner
        validElection(_electionId)
        validPosition(_electionId, _positionName)
        electionNotStarted(_electionId)
    {
        Candidate storage candidate = candidatesByElection[_electionId][
            _candidateId
        ];
        require(!candidate.approved, "Candidate is already approved");

        string memory candidateName = candidate.name;
        delete candidateNameExists[_electionId][_positionName][candidateName];
        delete candidatesByElection[_electionId][_candidateId];

        uint256[] storage candidateIds = elections[_electionId]
            .positions[_positionName]
            .candidateIds;
        for (uint256 i = 0; i < candidateIds.length; i++) {
            if (candidateIds[i] == _candidateId) {
                candidateIds[i] = candidateIds[candidateIds.length - 1];
                candidateIds.pop();
                break;
            }
        }

        emit CandidateRejected(_electionId, _positionName, candidateName);
    }

    function extendElectionTime(
        uint256 _electionId,
        uint256 _newEndTime
    ) public onlyOwner validElection(_electionId) {
        Election storage election = elections[_electionId];
        require(
            block.timestamp <= election.endTime,
            "Election has already ended"
        );
        require(
            _newEndTime > election.endTime,
            "New end time must be greater than the current end time"
        );

        election.endTime = _newEndTime;
        emit ElectionTimeExtended(_electionId, _newEndTime);
    }

    function vote(
        uint256 _electionId,
        string[] memory _positionNames,
        uint256[] memory _candidateIds
    ) public {
        require(_positionNames.length == _candidateIds.length, "Invalid input");

        for (uint256 i = 0; i < _positionNames.length; i++) {
            string memory positionName = _positionNames[i];
            uint256 candidateId = _candidateIds[i];

            Election storage election = elections[_electionId];
            require(
                block.timestamp >= election.startTime &&
                    block.timestamp <= election.endTime,
                "Election is not open for voting"
            );
            require(voters[msg.sender].approved, "Voter is not approved");
            require(!voters[msg.sender].voted, "Voter has already voted");
            require(
                msg.sender == voters[msg.sender].metamaskAddress,
                "Voter's Metamask address does not match"
            );

            Position storage position = election.positions[positionName];
            require(
                isValidCandidate(position.candidateIds, candidateId),
                "Invalid candidate"
            );
            require(
                candidatesByElection[_electionId][candidateId].approved,
                "Candidate is not approved"
            );

            candidatesByElection[_electionId][candidateId].voteCount++;
            emit VoteCast(_electionId, msg.sender, positionName, candidateId);
        }

        voters[msg.sender].voted = true;
    }

    function getElectionResult(
        uint256 _electionId,
        string memory _positionName
    )
        public
        view
        validElection(_electionId)
        returns (
            string memory,
            uint256[] memory,
            uint256[] memory,
            address[] memory
        )
    {
        Election storage election = elections[_electionId];
        require(
            voters[msg.sender].voted || isOwner(msg.sender),
            "Only voted voters or admin can view results"
        );

        Position storage position = election.positions[_positionName];
        uint256[] memory candidateIds = position.candidateIds;
        uint256[] memory voteCounts = new uint256[](candidateIds.length);
        address[] memory candidateAddresses = new address[](
            candidateIds.length
        );
        for (uint256 i = 0; i < candidateIds.length; i++) {
            uint256 candidateId = candidateIds[i];
            voteCounts[i] = candidatesByElection[_electionId][candidateId]
                .voteCount;
            candidateAddresses[i] = candidatesByElection[_electionId][
                candidateId
            ].addr;
        }

        return (position.name, candidateIds, voteCounts, candidateAddresses);
    }

    function getElectionProgress(
        uint256 _electionId,
        string memory _positionName
    )
        public
        view
        onlyOwner
        validElection(_electionId)
        returns (
            string memory,
            uint256[] memory,
            uint256[] memory,
            address[] memory
        )
    {
        Position storage position = elections[_electionId].positions[
            _positionName
        ];
        uint256[] memory candidateIds = position.candidateIds;
        uint256[] memory voteCounts = new uint256[](candidateIds.length);
        address[] memory candidateAddresses = new address[](
            candidateIds.length
        );
        for (uint256 i = 0; i < candidateIds.length; i++) {
            uint256 candidateId = candidateIds[i];
            voteCounts[i] = candidatesByElection[_electionId][candidateId]
                .voteCount;
            candidateAddresses[i] = candidatesByElection[_electionId][
                candidateId
            ].addr;
        }

        return (position.name, candidateIds, voteCounts, candidateAddresses);
    }

    function getVoter(
        address _voterAddress
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            address,
            bool,
            bool
        )
    {
        require(
            voters[_voterAddress].metamaskAddress != address(0) &&
                bytes(voters[_voterAddress].firstName).length > 0,
            "Voter does not exist"
        );
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

    function getElection(
        uint256 _electionId
    )
        public
        view
        validElection(_electionId)
        returns (string memory, uint256, uint256, string[] memory)
    {
        Election storage election = elections[_electionId];
        return (
            election.name,
            election.startTime,
            election.endTime,
            election.positionNames
        );
    }

    function isVoterPending(
        address _voterAddress
    ) internal view returns (bool) {
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

    function isValidCandidate(
        uint256[] memory _candidateIds,
        uint256 _candidateId
    ) internal pure returns (bool) {
        for (uint256 i = 0; i < _candidateIds.length; i++) {
            if (_candidateIds[i] == _candidateId) {
                return true;
            }
        }
        return false;
    }
}
