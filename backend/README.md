# Controller Contract

This is a sample Controller contract that manages workers, clients and projects.

## General Configuration

The contract uses OpenZeppelin's SafeERC20 library to safely interact with ERC20 tokens. 

It also uses the Ownable and ReentrancyGuard modifiers for access control and reentrancy protection.

The Counters library is used to keep track of work IDs and worker IDs.

The depositToken variable holds the address of the ERC20 token used to pay workers.

## Worker Management

Workers can register by calling the registerAsWorker function with their name. 
This will emit a WorkerRegistered event and store the worker's info.

Workers have a name, payment address, registration timestamp, and number of completed projects.

Mappings are used to lookup workers by name, ID and address. 
An array also stores all worker addresses.

## Client Management

Clients can register by calling the `registerAsClient` function with their name. 

This will emit a `ClientRegistered` event and store the client's info.


## Project Management

Anyone can create a project by calling the `createProject` function, passing the maximum budget, deadline and description. 

Asset to pay worker is transferred to the contract to make sure worker get paid.

This will emit a ProjectCreated event and store the new project's info.

Projects have an ID, creator address, maximum/accepted budget, maximum deadline, description and stage (either open for bids or bid accepted).

Workers can bid on open projects by calling the `bidToProject` function. 

This will emit a `BidToProject` event and store the bid info, which includes the proposed budget and deadline.

Project owners can accept a bid by calling the `acceptBid` function, passing the bid ID. 

This will set the project stage to "bid accepted", store the accepted bid info and emit a `BidAccepted` event.

## Views

Vies to be used by frontend team to manage projects:

- `getCurrentWorkId() external view returns (uint256)` - Returns the current work ID. No parameters.
- `getCurrentWorkerId() external view returns (uint256) `- Returns the current worker ID. No parameters.
- `getWorkerByAddress(address _workerAddress) external view returns (Worker memory)` - Returns the worker info for a given address.
    - `_workerAddress` - The address of the worker to lookup.
- `getWorkerByName(string _name) external view returns (Worker memory)` - Returns the worker info for a given name.
    - `_name` - The name of the worker to lookup.
- `getClientByAddress(address _clientAddress) external view returns (Client memory)` - Returns the client info for a given address.
    - `_clientAddress` - The address of the client to lookup.
- `getClientByName(string _name) external view returns (Client memory)` - Returns the client info for a given name.
    - `_name` - The name of the client to lookup.
- `getMyProjects(address owner) external view returns (Project[] memory)` - Returns an array of projects created by owner argument.
- `getProjectById(uint256 _projectId) external view returns (Project memory)` - Returns a project info for a given ID.
    - `_projectId` - The ID of the project to lookup.
- `getProjectBids(uint256 _projectId) external view returns (BidInfo[] memory)` - Returns an array of bids for a given project ID.
    - `_projectId` - The ID of the project to get bids for.
- `getAcceptedBidInfo(uint256 _projectId) external view returns (BidInfo memory)` - Returns the info for the accepted bid for a given project ID.
    - `_projectId` - The ID of the project to get the accepted bid info for.