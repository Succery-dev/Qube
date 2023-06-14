// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// add openzeppelin counter to count the number of works
import "@openzeppelin/contracts/utils/Counters.sol";
import "./mocks/MockToken.sol";
// Uncomment this line to use console.log
//import "hardhat/console.sol";

/**
* @title Controller
* @dev This contract is used to control the financial backend of a dApp.
* It is used to create works and to pay the workers.
* The core idea is that is contract serve as hube to a dApp that manage
* customers and works.
* The dApp will be able to create works and pay the workers using this contract.
*/

contract Controller is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // # GENERAL CONFIGURATION
    using Counters for Counters.Counter;
    Counters.Counter private _workIds;
    // The token used to pay the workers
    IERC20 public depositToken;
    error EtherNotAccepted();

    // # WORKERS MANAGEMENT
        // workers errors:
        error WorkerAlreadyExists();
        // workers event
        event WorkerRegistered(uint id, address indexed worker, string name);

        // store info about workers
        struct Worker {
            string name;
            address paymentAddress;
            uint256 since;
            uint256 projectsCount;
        }

        mapping(uint => Worker) public _workersInfo;
        // map of works by name, just to check if exists
        mapping(string => address) public workersNames;
        // map of workers id by address
        mapping(address => uint256) public _workersIdByAddress;
        // map of workers id by string name
        mapping(string => uint256) public _workersIdByName;
        // map of works by address, just to check if exists
        mapping(address => uint256) public workersByAddress;
        // array of workers:
        address[] private _workersList;

    // # CLIENT MANAGEMENT
        // clients errors:
        error ClientAlreadyExists();
        // clients event
        event ClientRegistered(address indexed client, string name);

        // store info about clients
        struct Client {
            string name;
            address paymentAddress;
            uint256 since;
            uint256 projectsCount;
        }

        mapping(address => Client) public _clientsInfo;
        // map of clients by name, just to check if exists
        mapping(string => address) public clientsNames;

        // map of clients by address, just to check if exists
        mapping(address => uint256) public clientsByAddress;
        // array of clients:
        address[] private _clientsList;
        address[] private _workersList;

    // # PROJECTS MANAGEMENT


        // project stages
        struct ProjectStage {
            bool openToBids;
            bool bidAccepted
        }

        // project events
        event ProjectCreated(
            uint256 indexed id,
            address indexed customer,
            uint256 proposedAmount,
            uint256 deadline,
            string description,
            ProjectStage stage
        );

        event BidToProject(
            uint256 indexed projectId,
            address indexed worker,
            uint256 proposedAmount,
            uint256 proposedDeadline
        );
        // error messages

        error ProjectAlreadyExists();
        error TooHighProposedBudget();
        error BidsAreClosed();

        // store info about projects
        struct Project {
            uint id;
            address customer;
            uint256 MaxAcceptableAmount;
            uint256 acceptedAmount;
            uint256 maxAcceptableDeadline;
            string description;
            ProjectStage stage;
            uint bidAccepted;
            uint bidAcceptedAt;
        }
        mapping(uint256 => Project) public projects;
        // array of projects by owner:
        mapping(address => uint256[]) public projectsByOwner;


        // control projects creation by description and by client:
        mapping(address => mapping(string=>bool)) public projectsByClientByDescription;

        // map of bids by bid id
        struct BidInfo {
            uint projectId,
            uint bidId,
            uint workerId
            uint256 proposedAmount;
            uint256 proposedDeadline;
            bool accepted;
            uint addedAt;
        }
        mapping(uint256 => BidInfo[]) privae _bidsByProject;

        // event about an accepted bid
        event BidAccepted(
            uint256 indexed projectId,
            uint256 indexed bidId,
            uint256 proposedAmount,
            uint256 proposedDeadline
            uint acceptedIn
        );

    constructor(address payable _depositToken) {
        depositToken = IERC20(_depositToken);
    }

    // # CLIENT MANAGEMENT
    function registerAsClient(string memory _name) external nonReentrant {
        address = _paymentAddress = msg.sender;
        // check if client already exists
        if (clientsNames[_name]) {
            revert ClientAlreadyExists();
        }
        if (clientsByAddress[_paymentAddress]) {
            revert ClientAlreadyExists();
        }

        // create a new client
        clientsNames[_name] = _paymentAddress;
        Client memory client = Client(_name, _paymentAddress, block.timestamp, 0);
        _clientsList.push(_paymentAddress);
        _clientsInfo[_paymentAddress] = client;

        emit ClientRegistered(_paymentAddress, _name);

    }

    // # WORKER MANAGEMENT

    function registerAsWorker(string memory _name) external nonReentrant {
        address = _paymentAddress = msg.sender;
        // check if work already exists
        if (workersNames[_name]) {
            revert WorkerAlreadyExists();
        }
        if (workersByAddress[_paymentAddress]) {
            revert WorkerAlreadyExists();
        }


        // create a new work
        workersNames[_name] = _paymentAddress;
        Worker memory worker = Worker(_name, _paymentAddress, block.timestamp, 0);
        _workersList.push(_paymentAddress);
        _workersIdByAddress[_paymentAddress] = _workerId;
        _workersIdByName[_name] = _workerId;
        // next worker id
        uint256 _workerId = _workIds.current();
        _workersInfo[_workerId] = worker;

        emit WorkerRegistered(_workerId, _paymentAddress, _name);

    }

    // prevent sending ether to this contract:
    fallback() external payable {
        revert EtherNotAccepted();
    }

    receive() external payable {
        revert EtherNotAccepted();
    }

    // # PROJECTS MANAGEMENT
    function createProject(
        uint256 _maxAcceptableAmount,
        uint256 _maxAcceptableDeadline,
        string memory _description
    ) external nonReentrant {

        address _customer = msg.sender;

        // check if project already exists by projectsByClientByDescription
        if (projectsByClientByDescription[_customer][_description]) {
            revert ProjectAlreadyExists();
        }

        // create a project id
        uint256 _projectId = _workIds.current();

        // create a new project
        Project memory project = Project(
            _projectId,
            _customer,
            _maxAcceptableAmount,
            _maxAcceptableDeadline,
            _description,
            ProjectStage.openToBids
        );

        projects[_projectId] = project;
        emit ProjectCreated(
            project.id,
            project.customer,
            project.MaxAcceptableAmount,
            project.maxAcceptableDeadline,
            project.description,
            project.stage
        );

        // transfer asset to this contract for safekeeping:
        depositToken.safeTransferFrom(msg.sender, address(this), _maxAcceptableAmount);

    }

    // # PUBLIC WORKERS FUNCTIONS
    function bidToProject(uint projectId, uint proposedBudget, uint proposedDeadline) external nonReentrant {
        // check if project exists
        if (!projects[projectId]) {
            revert ProjectDoesNotExist();
        }

        // get project info
        Project memory project = projects[projectId];


        // check if bids are open:
        if (!project.stage == ProjectStage.openToBids) {
            revert BidsAreClosed();
        }
        // get worker by address from global storage
        Worker memory worker = _workersInfo[msg.sender];

        // check if proposed budget is greater than minimum project budget:
        if (proposedBudget < project.proposedAmount) {
            revert TooHighProposedBudget();
        }

        // check deadline is not greater than project deadline
        if (proposedDeadline > projects[projectId].maxAcceptableDeadline) {
            revert TooHighProposedDeadline();
        }

        // get next bid id
        uint256 _bidId = _bidIds.current();

        // build info
        BidInfo memory bidInfo = BidInfo(
            projectId,
            _bidId,
            worker.id,
            proposedBudget,
            proposedDeadline,
            false,
            block.timestamp
        );

        // add this bid to global bid storage
        _bidsByProject[projectId].push(bidInfo);

        emit BidToProject(
            projectId,
            msg.sender,
            proposedBudget,
            proposedDeadline);
    }

    function acceptBid(uint bidId) external nonReentrant{

        // get project id from bid:
        uint projectId = _bidsInfo[bidId].projectId;

        // check if project exists
        if (!projects[projectId]) {
            revert ProjectDoesNotExist();
        }
        // get project info
        Project storage project = projects[projectId];

        // check project stage
        if (!project.stage == ProjectStage.OpenToBids) {
            revert ProjectNotOpenToBids();
        }
        project.stage = ProjectStage.BidAccepted;

        // set bid info in the current project from the following worker:
        project.bidAccepted = bidId;
        project.bidAcceptedAt = block.timestamp;

        // get bid info
        BidInfo memory bidInfo = _bidsInfo[bidId];

        emit BidAccepted(
            projectId,
            bidId,
            bidInfo.proposedBudget,
            bidInfo.proposedDeadline,
            block.timestamp
        );

    }

    // # PUBLIC VIEWS
    function getCurrentWorkId() external view returns (uint256) {
        return _workIds.current();
    }
    function getCurrentWorkerId() external view returns (uint256) {
        return _workerIds.current();
    }
    function getWorkerByAddress(address _workerAddress)
        external
        view
        returns (Worker memory worker)
    {
        return _worksInfo[_workerAddress];
    }

    function getWorkerByName(Worker memory worker)
        external
        view
        returns (Worker memory)
    {
        return _worksInfo[workersNames[_name]];
    }

    function getClientByAddress(address _clientAddress)
        external
        view
        returns (Client memory client)
    {
        return _clientsInfo[_clientAddress];
    }

    function getClientByName(Client memory client)
        external
        view
        returns (Client memory)
    {
        return _clientsInfo[clientsNames[_name]];
    }

    function getMyProjects(address owner) external view returns (Project[] memory) {
        return projectsByOwner[owner];
    }

    function getProjectById(uint256 _projectId)
        external
        view
        returns (Project memory)
    {
        return projects[_projectId];
    }

    function getProjectBids(uint256 _projectId)
        external
        view
        returns (BidInfo[] memory)
    {
        return _bidsByProject[_projectId];
    }

    // get info about the accepted bid by project id:
    function getAcceptedBidInfo(uint256 _projectId)
        external
        view
        returns (BidInfo memory)
    {
        return _bidsByProject[_projectId][projects[_projectId].bidAccepted];
    }
}
