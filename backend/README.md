# Controller Contract Features

The Controller contract provides the following features:

# Managing Clients

- call `registerAsClient` to add a client passing the client's name as an argument.
- you can query a list of all clients address by calling `clientAddress` function.
- after, you can get info about each client querying the map `clientInfo` by client address.

# Managing Workers
- call `registerAsWorker` to add a worker passing the worker's name as an argument.
- you can query a list of all workers address by calling `workerByAddress` function.
- after, you can get info about each worker querying the map `workerInfo` by worker address.

# Managing Projects
- call `createProject` to create a project passing the project's description, budget, deadline.
- we detect the client owner of the project being added by msg.sender.
- you can query a list of all projects id by owner calling `projectsByOwner(address _owner)` function.
- after, you can get info about each project querying the map `projects` by project ID.
- after a project is added, any worker can bid to the project calling `bidToProject` function passing the project ID, proposed budget and proposed deadline.

# Managing Bids

# Bidding on a Project

To bid on a project, a worker should call the bidOnProject function with the project ID and the bid amount as arguments.

To accept a bid, the project owner should call the acceptBid function with the project ID and the worker's address as arguments.
- to accept bids, a project mus be in `OpenToBids` stage.
- a proposed deadline and budget must be lower than max budget and deadline when a project is added.
- after a bid is added, you can query a list of all bids by project ID calling `bidsByProjectId(uint256 _projectId)` function.
- and then check the map `bidsById` by bid id to get bidInfo.

# Accepting a Bid
- after bids are added to a project, the project owner can accept a bid calling `acceptBid` function passing the bid id.
- only project owner can call this function.
- after a bid is accepted, the project stage is changed to `BidAccepted`, this indicates to the worker that his bid is accepted.
- when a bid is accepted, we transfer the payment to our contract to pay woker when the project is finished.
- worker must call `startWork` to the project stage to `InProgress` and allow time tracking.

# Managing time/budget requests

## Proposing a Deadline/Budget Extension
- after a bid is accepted, the worker can request a deadline or budget extension calling `proposeExtension` function passing the project ID, the new deadline or budget, and a reason as arguments.
- both max deadline and max budget should be lower than max deadline and max budget when a project is added.
- a project to accept a budget/deadline extension, must be in `InProgress` stage.
- only the worker assigned to the project can propose a deadline/budget extension.

## Accepting a Deadline/Budget Extension
- after a request is added, the project owner can accept the request calling `acceptProposal` function passing the project ID.
- only project owner can accept a deadline/budget extension.
- a project to accept a budget/deadline extension, must be in `InProgress` stage.
- after a request is accepted, the project budget and deadline are updated.
- if client accept a new budget that is bigger than the accepted bid, the difference is transfered to the contract.
- or if the budget is lower than the accepted bid, the difference is transfered to the client back.

# Proposing a Delivery
- to propose a delivery, a worker should call the `proposeDelivery` function with the project ID.
- only worker assigned to the project can propose a delivery.
- a project must be in state `InProgress` to propose a delivery.
- after a delivery is proposed, the project stage is changed to `DeliveryProposed`, this indicates to the client that a delivery is proposed.

# Accepting a Delivery and Paying the Worker
- to accept a delivery and pay the worker, the client should call the `acceptDeliveryAndPay` function with the project ID as the argument.
- only project owner can call this function.
- a project must be in state `DeliveryProposed` to accept a delivery.
- after a delivery is accepted, the project stage is changed to `DeliveryAccepted`, this indicates to the worker that the project is completed.
- then the worker is paid and the contract is closed.

# Declining a Delivery
- to decline a delivery, the client should call the `declineDelivery` function with the project ID and the reason of the rejection.
- only project owner can call this function.
- project must be in state `DeliveryProposed` to decline a delivery.
- then, the project is set stage to `DeliveryRejected` and the worker can propose a new delivery.
- if the client decline a delivery, the worker must call `startWork` to set the project stage to `InProgress` and allow time tracking.

# Opening a Dispute

- after a delivery is rejected, the worker can open a dispute calling the `openDispute` function with the project ID and a reason as arguments.
- only the worker assigned to the project can open a dispute.
- a project must be in state `DeliveryRejected` to open a dispute.
- after, the project stage is changed to `DisputeOpened`, this indicates to the client that a dispute is opened.

# Resolve dispute in worker favor
- after a dispute is opened, the arbitrator can resolve the dispute in worker favor calling the `resolveDisputeInWorkerFavor` function with the project ID and a reason.
- only users in the mapping `arbitrators` can call this function.
- use the function `setArbitrator` to add/remove arbitrators.
- a project must be in state `DisputeOpened` to resolve a dispute.
- after, worker get paid.
- then, the project is set stage to `DisputeResolved` and the contract is closed.

# Resolve dispute in client favor
- after a dispute is opened, the arbitrator can resolve the dispute in client favor calling the `resolveDisputeInClientFavor` function with the project ID and a reason.
- only users in the mapping `arbitrators` can call this function.
- use the function `setArbitrator` to add/remove arbitrators.
- a project must be in state `DisputeOpened` to resolve a dispute.
- after, the client get funds back.
- then, the project is set stage to `DisputeResolved` and the contract is closed.

# Views

----------------------------------------------------------

Vies to be used by frontend team to manage projects:

- `getWorkerInfoByAddress(address _workerAddress)` return WorkerInfo struct by address.
- `getClientInfoByAddress(address _clientAddress)` return ClientInfo struct by address.
- `getProjectInfoById(uint256 _projectId)` return ProjectInfo struct by project ID.
- `getBidInfoById(uint256 _bidId)` return BidInfo struct by bid ID.
- `getProjectIdsByOwner(address owner)` return a list of projects id by client address.
- `getProjectBids(uint256 projectId)` return a list of projects bid id by project id.
- `getAcceptedBidInfo(uint256 projectId)` return BidInfo struct accepted for this project.

# Admin functions
- `setArbitrator(address _arbitrator, bool _isArbitrator)` add/remove arbitrators.