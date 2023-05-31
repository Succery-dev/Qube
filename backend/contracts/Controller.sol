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

    Counters.Counter private projectIdCounter;
    Counters.Counter private bidIdsCounter;

    // The token used to pay the workers
    IERC20 public depositToken;
    error EtherNotAccepted();

    // map of arbitrators by address:
    mapping(address => bool) public arbitrators;
    event ArbitratorStatusChanged(address indexed arbitrator, bool status);

    // # WORKERS MANAGEMENT
        // workers errors:
        error WorkerAlreadyExists();
        // workers event
        event WorkerRegistered(address indexed worker, string name);

        // store info about workers
        struct WorkerInfo {
            string name;
            address paymentAddress;
            uint256 since;
            uint256 projectsCount;
        }

        mapping(address => WorkerInfo) public workerInfo;
        // map of works by name, just to check if exists
        mapping(string => bool) private workersNames;

        // array of workers:
        address[] public workerByAddress;

    // # CLIENT MANAGEMENT
        // clients errors:
        error ClientAlreadyExists();
        // clients event
        event ClientRegistered(address indexed clientAddress, string name);

        // store info about clients
        struct ClientInfo {
            string name;
            address clientAddress;
            uint256 since;
            uint256 projectsCount;
        }

        // map of clients by address:
        mapping(address => ClientInfo) public clientInfo;

        // map of clients by name, just to check if exists
        mapping(string => bool) private clientByName;

        // array of clients:
        address[] private clientAddress;

    // # PROJECTS MANAGEMENT


        // enum of project stages
        enum ProjectStage {
            OpenToBids,
            BidAccepted,
            InProgress,
            DeliveryProposed,
            DeliveryAccepted,
            DeliveryRejected,
            DisputeOpened,
            InDispute,
            DisputeResolved,
            Completed
        }

        // project events
        event ProjectCreated(
            address indexed clientAddress,
            uint256 indexed projectId,
            uint256 maxAcceptableAmount,
            uint256 maxAcceptableDeadline,
            string description
        );

        event BidToProject(
            uint256 indexed projectId,
            address indexed worker,
            uint256 proposedBudget,
            uint256 proposedDeadline
        );

        event ProposalExtension(
            uint256 indexed projectId,
            uint256 proposedBudget,
            uint256 proposedDeadline,
            uint256 proposedAt
        );

        event AcceptProposedExtension(
            uint256 indexed projectId,
            uint256 proposedBudget,
            uint256 proposedDeadline,
            uint256 proposedAt
        );

        event ProjectStarted(
            uint256 indexed projectId,
            uint256 startedAt
        );

        event DeliveryProposed(
            uint256 indexed projectId,
            uint256 requestedAt
        );

        event DeliveryAccepted(
            uint256 indexed projectId,
            uint256 acceptedAt
        );

        event DeliveryRejected(
            uint256 indexed projectId,
            uint256 acceptedAt,
            string reason
        );

        event DisputeOpened(
            uint256 indexed projectId,
            uint256 openedAt,
            string reason
        );

        event DisputeResolved(
            uint256 indexed projectId,
            uint256 resolvedAt,
            bool inWorkersFavor,
            string reason
        );

        // error messages
        error ProjectAlreadyExists();
        error BidsAreClosed();
        error BidDoesNotBelongToProject();
        error ProjectNotOpenToBids();
        error ProjectDoesNotExist();
        error ProjectNotStarted();
        error OnlyWorkerCanProposeExtension();
        error OnlyProjectOwnerCanProcessExtension();
        error ProposalExtensionDoesNotExist();
        error OnlyWorkerCanStartProject();
        error OnlyWorkerCanRequestDelivery();
        error OnlyProjectOwnerCanAcceptDelivery();
        error OnlyWorkerCanOpenDispute();
        error ProjectNotInDispute();
        error OnlyAdminCanResolveDispute();
        error OnlyProjectOwnerCanDenyDelivery();
        error ProjectNotInDeliveryProposed();

        // store info about projects
        struct ProjectInfo {
            address clientAddress;
            uint256 maxAcceptableAmount;
            uint256 maxAcceptableDeadline;
            string description;
            ProjectStage stage;
            uint addedAt;
            uint bidAccepted;
            uint bidAcceptedAt;
            uint bidAcceptedAmount;
            uint bidAcceptedDeadline;
        }

        // map of projects info:
        mapping(uint => ProjectInfo) public projects;

        // map of array of projects by owner:
        mapping(address => uint256[]) public projectsByOwner;

        // control projects creation by description and by client:
        mapping(address => mapping(string=>bool)) private projectsNameByClient;

        // struct to hold proposed extension:
        struct ProjectExtensionProposal {
            uint256 proposedBudget;
            uint256 proposedDeadline;
            uint256 proposedAt;
            string reason;
        }
        // map of proposed extensions by project:
        mapping(uint256 => ProjectExtensionProposal) private proposedExtensionByProject;

    // # BIDS MANAGEMENT

        error OnlyProjectOwnerCanAcceptBids();
        error TooHighProposedDeadline();
        error TooHighProposedBudget();

        // event about an accepted bid
        event BidAccepted(
            uint256 indexed projectId,
            uint256 indexed bidId,
            uint256 proposedBudget,
            uint256 proposedDeadline,
            uint acceptedIn
        );

        // map of bids by bid id
        struct BidInfo {
            uint projectId;
            uint bidId;
            address worker;
            uint256 proposedBudget;
            uint256 proposedDeadline;
            bool accepted;
            uint addedAt;
            uint acceptedAt;
        }

        // map of bids by project id
        mapping(uint256 => uint256[]) public bidsByProjectId;

        // map of bid for easy access:
        mapping(uint256 => BidInfo) private bidsById;


    constructor(address payable _depositToken) {
        depositToken = IERC20(_depositToken);
    }

    // # CLIENT MANAGEMENT
    function registerAsClient(string memory _name) external nonReentrant {

        // check if client already exists
        if (clientByName[_name]) {
            revert ClientAlreadyExists();
        }
        clientByName[_name] = true;

        ClientInfo memory client = ClientInfo(
            _name,
            msg.sender,
            block.timestamp,
            0);

        // add client to list of clients to allow iteration
        clientAddress.push(msg.sender);

        clientInfo[msg.sender] = client;

        emit ClientRegistered(msg.sender, _name);

    }

    // # WORKER MANAGEMENT

    function registerAsWorker(string memory _name) external nonReentrant {

        // check if work already exists
        if (workersNames[_name]) {
            revert WorkerAlreadyExists();
        }

        // create a new work
        workersNames[_name] = true;
        WorkerInfo memory worker = WorkerInfo(
            _name,
            msg.sender,
            block.timestamp,
            0
        );
        workerByAddress.push(msg.sender);
        workerInfo[msg.sender] = worker;

        emit WorkerRegistered(msg.sender, _name);

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

        // check if project already exists by projectsNameByClient
        if (projectsNameByClient[msg.sender][_description]) {
            revert ProjectAlreadyExists();
        }
        projectsNameByClient[msg.sender][_description] = true;

        // create a project id
        uint256 projectId  = projectIdCounter.current();

        // add this project id to the list of projects of owner:
        projectsByOwner[msg.sender].push(projectId);

        // increment owner projects count
        clientInfo[msg.sender].projectsCount++;

        // create a new project
        ProjectInfo memory project = ProjectInfo(
            msg.sender,
            _maxAcceptableAmount,
            _maxAcceptableDeadline,
            _description,
            ProjectStage.OpenToBids, // stage
            block.timestamp, // addedAt
            0, // bidAccepted
            0, // bidAcceptedAt
            0, // bidAcceptedAmount
            0 // bidAcceptedDeadline
        );

        projects[projectId ] = project;

        emit ProjectCreated(
            msg.sender,
            projectId ,
            project.maxAcceptableAmount,
            project.maxAcceptableDeadline,
            project.description
        );
    }

    // # PUBLIC WORKERS FUNCTIONS

    // allow any worker to bid to a project:
    function bidToProject(uint projectId, uint proposedBudget, uint proposedDeadline) external nonReentrant {

        // get project info
        ProjectInfo storage project = projects[projectId];

        // check if project exists
        if ( project.clientAddress == address(0) ) {
            revert ProjectDoesNotExist();
        }

        // check if bids are open:
        if (project.stage != ProjectStage.OpenToBids) {
            revert BidsAreClosed();
        }

        // get worker by address from global storage
        //WorkerInfo memory worker = workerInfo[msg.sender];

        // check if proposed budget is not greater than project budget:
        if (proposedBudget < project.maxAcceptableAmount) {
            revert TooHighProposedBudget();
        }

        // check deadline is not greater than project deadline:
        if (proposedDeadline > project.maxAcceptableDeadline) {
            revert TooHighProposedDeadline();
        }

        // get next bid id
        uint256 _bidId = bidIdsCounter.current();

        // build info
        BidInfo memory bidInfo = BidInfo(
            projectId,
            _bidId,
            msg.sender,
            proposedBudget,
            proposedDeadline,
            false,
            block.timestamp,
            0
        );

        // add this bid id to the list of bids of project:
        bidsByProjectId[projectId].push(_bidId);

        // store this bid info in a map for easy access:
        bidsById[_bidId] = bidInfo;

        emit BidToProject(
            projectId,
            msg.sender,
            proposedBudget,
            proposedDeadline);
    }

    function acceptBid(uint bidId) external nonReentrant {

        // get bid info:
        BidInfo storage bidInfo = bidsById[bidId];

        // get project info from bid:
        ProjectInfo storage project = projects[bidInfo.projectId];

        // get client info from project:
        ClientInfo storage client = clientInfo[msg.sender];

        // get worker info by bid id
        WorkerInfo storage worker = workerInfo[bidInfo.worker];

        // check if project exists and is owned by client:
        if(project.clientAddress != msg.sender) {
            revert ProjectDoesNotExist();
        }

        // check project stage is open for bids:
        if (project.stage == ProjectStage.OpenToBids) {
            revert ProjectNotOpenToBids();
        }

        // make sure only project owner can accept bids:
        if (client.clientAddress != msg.sender) {
            revert OnlyProjectOwnerCanAcceptBids();
        }

        // set project stage to bid accepted, to prevent
        // new bids to be accepted:
        project.stage = ProjectStage.BidAccepted;

        // set bid info in the current project from the following worker:
        project.bidAccepted = bidId;
        project.bidAcceptedAt = block.timestamp;
        project.bidAcceptedAmount = bidInfo.proposedBudget;
        project.bidAcceptedDeadline = bidInfo.proposedDeadline;

        // set bid accepted info:
        bidInfo.accepted = true;
        bidInfo.acceptedAt = block.timestamp;

        // increment worker projects count
        worker.projectsCount++;

        // transfer deposit from client to this contract to pay worker:
        depositToken.safeTransferFrom(
            msg.sender,
            address(this),
            bidInfo.proposedBudget
        );

        emit BidAccepted(
            bidInfo.projectId,
            bidId,
            bidInfo.proposedBudget,
            bidInfo.proposedDeadline,
            block.timestamp
        );

    }

    // @dev: worker should call this function to start working on a project:
    function startWork( uint projectId ) external nonReentrant {

        // get project info
        ProjectInfo storage project = projects[projectId];

        // get bid info
        BidInfo storage bidInfo = bidsById[project.bidAccepted];

        // check if project exists
        if ( project.clientAddress == address(0) ) {
            revert ProjectDoesNotExist();
        }

        // check if project state is BidAccepted or DeliveryRejected:
        // BidAccepted: indicates that the project is ready to start.
        // DeliveryRejected: indicates that the project was delivered but rejected by client.
        if ( project.stage != ProjectStage.BidAccepted && project.stage != ProjectStage.DeliveryRejected ) {
            revert ProjectNotStarted();
        }

        // check if the user starting this project is the worker of accepted bid:
        if ( bidInfo.worker != msg.sender ) {
            revert OnlyWorkerCanStartProject();
        }

        // set project stage to in progress:
        project.stage = ProjectStage.InProgress;

        emit ProjectStarted(
            projectId,
            block.timestamp
        );

    }

    // @dev a worker can propose a extension in deadline and/or budget:
    function proposeExtension( uint projectId, uint proposedNewDeadLine, uint proposedNewBudget, string memory reason ) external nonReentrant{
        // get project project info
        ProjectInfo storage project = projects[projectId];

        // get bid info
        BidInfo storage bidInfo = bidsById[project.bidAccepted];

        // check if project exists
        if ( project.clientAddress == address(0) ) {
            revert ProjectDoesNotExist();
        }

        // check if project state is accepted bid
        if ( project.stage != ProjectStage.InProgress ) {
            revert ProjectNotStarted();
        }

        // check if the user proposing this extension is the worker
        if ( bidInfo.worker != msg.sender ) {
            revert OnlyWorkerCanProposeExtension();
        }

        // check if proposed budget is greater than max project budget:
        if ( proposedNewBudget > project.maxAcceptableAmount ) {
            revert TooHighProposedBudget();
        }

        // check if proposed deadline is greater than max project deadline:
        if ( proposedNewDeadLine > project.maxAcceptableDeadline ) {
            revert TooHighProposedDeadline();
        }

        // add this proposal to the map:
        proposedExtensionByProject[projectId] = ProjectExtensionProposal(
            proposedNewBudget,
            proposedNewDeadLine,
            block.timestamp,
            reason
        );

        emit ProposalExtension(
            projectId,
            proposedNewBudget,
            proposedNewDeadLine,
            block.timestamp
        );

    }

    // @dev: project owner should call this function to accept a extension proposal
    function acceptProposal( uint projectId ) external nonReentrant{

        // get project info:
        ProjectInfo storage project = projects[projectId];

        // get client info:
        ClientInfo storage client = clientInfo[msg.sender];

        // check if the user calling this is the owner of this project:
        if ( client.clientAddress != msg.sender ) {
            revert OnlyProjectOwnerCanProcessExtension();
        }

        // check if project state is accepted bid
        if ( project.stage != ProjectStage.InProgress ) {
            revert ProjectNotStarted();
        }

        // get proposal extension info:
        ProjectExtensionProposal storage proposal = proposedExtensionByProject[projectId];

        // check if proposal extension is valid:
        if ( proposal.proposedBudget==0 && proposal.proposedDeadline==0 ) {
            revert ProposalExtensionDoesNotExist();
        }

        // set the new project deadline:
        if( proposal.proposedDeadline > 0 ){
            project.bidAcceptedDeadline = proposal.proposedDeadline;
        }

        // we reset the bid accepted at to the current time
        // so that the worker has the full time to complete the project
        project.bidAcceptedAt = block.timestamp;

        // transfer any additional funds to this contract to pay worker:
        if( proposal.proposedBudget > 0 ){
            // check if proposed budget is greater than the current payment:
            if ( proposal.proposedBudget < project.bidAcceptedAmount ) {
                uint payment = project.bidAcceptedAmount - proposal.proposedBudget;
                // refund the difference to the client:
                depositToken.safeTransfer(msg.sender, payment);
            }else{
                uint payment = proposal.proposedBudget - project.bidAcceptedAmount;
                // transfer the difference to this contract to pay worker:
                depositToken.safeTransferFrom(msg.sender, address(this), payment);
            }
        }

        // set proposal values to 0 to prevent re-entry attacks
        proposal.proposedBudget = 0;
        proposal.proposedDeadline = 0;
        proposal.proposedAt = 0;

        emit AcceptProposedExtension(
            projectId,
            project.bidAcceptedAmount,
            project.bidAcceptedDeadline,
            block.timestamp
        );

    }

    // @dev: worker should call this function to propose a delivery of the project:
    function proposeDelivery(uint projectId) external nonReentrant{

        // get project info
        ProjectInfo storage project = projects[projectId];

        // get bid info
        BidInfo storage bidInfo = bidsById[project.bidAccepted];

        //check if project exists
        if (project.clientAddress == address(0)) {
            revert ProjectDoesNotExist();
        }

        // check if user requesting this delivery is the project worker:
        if ( bidInfo.worker != msg.sender ) {
            revert OnlyWorkerCanRequestDelivery();
        }

        // project stage must be in progress to accept a delivery
        if ( project.stage != ProjectStage.InProgress ) {
            revert ProjectNotStarted();
        }

        // change project state to delivery requested
        project.stage = ProjectStage.DeliveryProposed;

        emit DeliveryProposed(
            projectId,
            block.timestamp
        );

    }

    // @dev: project owner should call this function to accept a delivery proposal
    function acceptDeliveryAndPay(uint projectId) external nonReentrant{

        // get project info:
        ProjectInfo storage project = projects[projectId];

        // check if caller is the owner of this project:
        if ( project.clientAddress != msg.sender ) {
            revert OnlyProjectOwnerCanAcceptDelivery();
        }

        // project must be in tage delivery proposed to accept a delivery
        if ( project.stage != ProjectStage.DeliveryProposed ) {
            revert ProjectNotInDeliveryProposed();
        }

        // set project state to delivery accepted
        project.stage = ProjectStage.DeliveryAccepted;

        // now we pay the worker:
        BidInfo storage bidInfo = bidsById[project.bidAccepted];
        depositToken.safeTransfer(bidInfo.worker, project.bidAcceptedAmount);

        emit DeliveryAccepted(
            projectId,
            block.timestamp
        );

    }

    // @dev: project owner can call this function to deny a delivery proposal:
    function declineDelivery(uint projectId, string memory reason) external nonReentrant{

        // get project info:
        ProjectInfo storage project = projects[projectId];

        // check if caller is the owner of this project:
        if ( project.clientAddress != msg.sender ) {
            revert OnlyProjectOwnerCanDenyDelivery();
        }

        // project must be in stage delivery proposed to deny a delivery
        if ( project.stage != ProjectStage.DeliveryProposed ) {
            revert ProjectNotInDeliveryProposed();
        }

        // set project state to delivery rejected
        project.stage = ProjectStage.DeliveryRejected;

        emit DeliveryRejected(
            projectId,
            block.timestamp,
            reason
        );

    }

    // @dev: worker can call this function to open a dispute after project is not accepted:
    function openDispute(uint projectId, string memory reason) external nonReentrant{

        // get project info:
        ProjectInfo storage project = projects[projectId];

        // get bid info
        BidInfo storage bidInfo = bidsById[project.bidAccepted];

        // check if caller is the worker of this project:
        if ( bidInfo.worker != msg.sender ) {
            revert OnlyWorkerCanOpenDispute();
        }

        // check if project state is delivery rejected
        if ( project.stage != ProjectStage.DeliveryRejected ) {
            revert ProjectNotInDispute();
        }

        // set project state to dispute opened
        project.stage = ProjectStage.DisputeOpened;

        emit DisputeOpened(
            projectId,
            block.timestamp,
            reason
        );

    }

    // @dev: admin can call this function to resolve a dispute in worker's favor:
    function resolveDisputeInWorkerFavor(uint projectId, string memory reason) external nonReentrant{

        // get project info:
        ProjectInfo storage project = projects[projectId];

        // check if caller is an arbitrator:
        if ( arbitrators[msg.sender] == false ) {
            revert OnlyAdminCanResolveDispute();
        }

        // check if project state is dispute opened
        if ( project.stage != ProjectStage.DisputeOpened ) {
            revert ProjectNotInDispute();
        }

        // get bid info
        BidInfo storage bidInfo = bidsById[project.bidAccepted];

        // transfer the bid amount to the worker:
        depositToken.safeTransfer(bidInfo.worker, project.bidAcceptedAmount);

        // set project state to dispute resolved
        project.stage = ProjectStage.DisputeResolved;

        emit DisputeResolved(
            projectId,
            block.timestamp,
            true,
            reason
        );

    }

    // @dev: admin can call this function to resolve a dispute in client's favor:
    function resolveDisputeInClientFavor(uint projectId, string memory reason) external nonReentrant{
        // TODO: we may add an % of the bid amount to be paid to the worker?

        // get project info:
        ProjectInfo storage project = projects[projectId];

        // check if caller is an arbitrator:
        if ( arbitrators[msg.sender] == false ) {
            revert OnlyAdminCanResolveDispute();
        }

        // check if project state is dispute opened
        if ( project.stage != ProjectStage.DisputeOpened ) {
            revert ProjectNotInDispute();
        }

        // transfer the bid amount to the client:
        depositToken.safeTransfer(project.clientAddress, project.bidAcceptedAmount);

        // set project state to dispute resolved
        project.stage = ProjectStage.DisputeResolved;

        emit DisputeResolved(
            projectId,
            block.timestamp,
            false,
            reason
        );

    }

    // # PUBLIC PROJECT INTERACTION FUNCTIONS

    // # PUBLIC VIEWS
    function getWorkerInfoByAddress(address _workerAddress)
        external
        view
        returns (WorkerInfo memory worker)
    {
        return workerInfo[_workerAddress];
    }


    function getClientInfoByAddress(address _clientAddress)
        external
        view
        returns (ClientInfo memory client)
    {
        return clientInfo[_clientAddress];
    }

    function getProjectInfoById(uint256 projectId ) external view returns (ProjectInfo memory){
        return projects[projectId];
    }

    // get bid info by bid id
    function getBidInfoById(uint256 bidId ) external view returns (BidInfo memory){
        return bidsById[bidId];
    }

    function getProjectIdsByOwner(address owner) external view returns (uint256[] memory) {
        return projectsByOwner[owner];
    }

    function getProjectBids(uint256 projectId )
        external
        view
        returns (uint256[] memory)
    {
        return  bidsByProjectId[projectId ];
    }

    // get info about the accepted bid by project id:
    function getAcceptedBidInfo(uint256 projectId )
        external
        view
        returns (BidInfo memory)
    {
        return bidsById[projects[projectId ].bidAccepted];
    }

    // @dev manage arbitrators status:
    function setArbitrator(address _arbitratorAddress, bool _status) external onlyOwner {
        arbitrators[_arbitratorAddress] = _status;
        emit ArbitratorStatusChanged(_arbitratorAddress, _status);
    }

}
