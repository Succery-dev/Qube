// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
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

contract ControllerLite is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // # GENERAL CONFIGURATION
    using Counters for Counters.Counter;

    Counters.Counter private projectIdCounter;

    // The token used to pay the workers
    IERC20 public depositToken;
    error EtherNotAccepted();

    // map of arbitrators by address:
    mapping(address => bool) public arbitrators;
    event ArbitratorStatusChanged(address indexed arbitrator, bool status);

    // # PROJECTS MANAGEMENT
    
        // enum of project stages
        enum ProjectStage {
            Added,
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
            address indexed workerAddress,
            uint256 indexed projectId,
            uint256 deadline,
            uint256 budget
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
            address workerAddress;
            ProjectStage stage;
            uint tsAdded;
            uint tsDeadline;
            uint budget;
        }

        // map of projects info:
        mapping(uint => ProjectInfo) public projects;

        // map of array of projects by owner:
        mapping(address => uint256[]) public projectsByOwner;

        // struct to hold proposed extension:
        struct ProjectExtensionProposal {
            uint256 proposedBudget;
            uint256 proposedDeadline;
            uint256 proposedAt;
            string reason;
        }
        // map of proposed extensions by project:
        mapping(uint256 => ProjectExtensionProposal) private proposedExtensionInfo;

    constructor(address payable _depositToken) {
        depositToken = IERC20(_depositToken);
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
        uint256 _budget,
        uint256 _deadline,
        address _worker
    ) external nonReentrant {

        // create a project id
        uint256 projectId  = projectIdCounter.current();

        // add this project id to the list of projects of owner:
        projectsByOwner[msg.sender].push(projectId);

        // create a new project
        ProjectInfo memory project = ProjectInfo(
            msg.sender,
            _worker,
            ProjectStage.Added,
            block.timestamp,
            _deadline,
            _budget
        );

        projects[projectId] = project;

        emit ProjectCreated(
            msg.sender,
            _worker,
            projectId,
            _deadline,
            _budget
        );
    }

    // # PUBLIC WORKERS FUNCTIONS

    // @dev: worker should call this function to start working on a project:
    function startWork( uint projectId ) external nonReentrant {

        // get project info
        ProjectInfo storage project = projects[projectId];

        // check if project exists
        if ( project.clientAddress == address(0) ) {
            revert ProjectDoesNotExist();
        }

        // check if project state is BidAccepted or DeliveryRejected:
        // Added: indicates that the project is ready to start.
        // DeliveryRejected: indicates that the project was delivered but rejected by client.
        if ( project.stage != ProjectStage.Added && project.stage != ProjectStage.DeliveryRejected ) {
            revert ProjectNotStarted();
        }

        // check if the user starting this project is the worker of accepted bid:
        if ( project.workerAddress != msg.sender ) {
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

        // check if project exists
        if ( project.clientAddress == address(0) ) {
            revert ProjectDoesNotExist();
        }

        // check if project state is accepted bid
        if ( project.stage != ProjectStage.InProgress ) {
            revert ProjectNotStarted();
        }

        // check if the user proposing this extension is the worker
        if ( project.workerAddress != msg.sender ) {
            revert OnlyWorkerCanProposeExtension();
        }

        // add this proposal to the map:
        proposedExtensionInfo[projectId] = ProjectExtensionProposal(
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

        // check if the user calling this is the owner of this project:
        if ( project.clientAddress != msg.sender ) {
            revert OnlyProjectOwnerCanProcessExtension();
        }

        // check if project state is accepted bid
        if ( project.stage != ProjectStage.InProgress ) {
            revert ProjectNotStarted();
        }

        // get proposal extension info:
        ProjectExtensionProposal storage proposal = proposedExtensionInfo[projectId];

        // check if proposal extension is valid:
        if ( proposal.proposedBudget==0 && proposal.proposedDeadline==0 ) {
            revert ProposalExtensionDoesNotExist();
        }

        // set the new project deadline:
        if( proposal.proposedDeadline > 0 ){
            project.tsDeadline = proposal.proposedDeadline;
        }

        // transfer any additional funds to this contract to pay worker:
        if( proposal.proposedBudget > 0 ){
            // check if proposed budget is greater than the current payment:
            if ( proposal.proposedBudget < project.budget ) {
                uint payment = project.budget - proposal.proposedBudget;
                // refund the difference to the client:
                depositToken.safeTransfer(msg.sender, payment);
            }else{
                uint payment = proposal.proposedBudget - project.budget;
                // transfer the difference to this contract to pay worker:
                depositToken.safeTransferFrom(msg.sender, address(this), payment);
            }
            project.budget = proposal.proposedBudget;
        }

        // set proposal values to 0 to prevent re-entry attacks
        proposal.proposedBudget = 0;
        proposal.proposedDeadline = 0;
        proposal.proposedAt = 0;

        emit AcceptProposedExtension(
            projectId,
            project.budget,
            project.tsDeadline,
            block.timestamp
        );

    }

    // @dev: worker should call this function to propose a delivery of the project:
    function proposeDelivery(uint projectId) external nonReentrant{

        // get project info
        ProjectInfo storage project = projects[projectId];

        //check if project exists
        if (project.clientAddress == address(0)) {
            revert ProjectDoesNotExist();
        }

        // check if user requesting this delivery is the project worker:
        if ( project.workerAddress != msg.sender ) {
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

        depositToken.safeTransfer(project.workerAddress, project.budget);

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

        // check if caller is the worker of this project:
        if ( project.workerAddress != msg.sender ) {
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

        // transfer the bid amount to the worker:
        depositToken.safeTransfer(project.workerAddress, project.budget);

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
        depositToken.safeTransfer(project.clientAddress, project.budget);

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

    function getProjectInfoById(uint256 projectId ) external view returns (ProjectInfo memory){
        return projects[projectId];
    }

    function getProjectIdsByOwner(address owner) external view returns (uint256[] memory) {
        return projectsByOwner[owner];
    }

    // @dev manage arbitrators status:
    function setArbitrator(address _arbitratorAddress, bool _status) external onlyOwner {
        arbitrators[_arbitratorAddress] = _status;
        emit ArbitratorStatusChanged(_arbitratorAddress, _status);
    }

}
