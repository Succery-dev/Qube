# Flow Chart Overview

## 1) Wallet Connect -> Working On Task
1 Wallet Connect - Working On Task #14>
a. (Client) Create a project.
b. (Client) Share the project with a lancer via a link.  
c. (Lancer) Approve the project by signing with a wallet.
d. (Client) Pay rewards(+gas) in advance.
## 2) No Submission By Lancer
2 No Submission By Lancer #15
a. (QubePay) Detect not submitting automatically on the day of the deadline for submission by a lancer
b. (QubePay) Pay the gas fee for the refund tx.  
c. (QubePay) Refund the reward to the client.
## 3) Approve The Submission
3 Approve The Submission #16
a. (Client) Check the deliverables and approve.
b. (Client) Pay the gas fee and the reward to the lancer.
## 4) Disapprove The Submission
4 Disapprove The Submission #17
a. (Client) Check the deliverables and disapprove.
b. (QubePay) Lock the reward on the smart contract for 9 months.
c. (QubePay) After 9 months, pay the gas fee for the refund tx.
d. (QubePay) After 9 months, refund the reward to the client.
## 5) Deadline-Extension Request (Approval)
5 Deadline-Extension Request (Approval) #18
a. (Client) Request the Deadline-Extension.
b. (Lancer) Approve it.
c. (QubePay) Set two deadlines two weeks later.
d. (Lancer) Work on the task again.
## 6) Deadline-Extension Request (Disapproval)
6 Deadline-Extension Request (Disapproval) #19
a. (Client) Request the Deadline-Extension.
b. (Lancer) Disapprove it.
c. (QubePay) Lock the reward on the smart contract for 9 months.
d. (QubePay) After 9 months, pay the gas fee for the refund tx.
e. (QubePay) After 9 months, refund the reward to the client.
## 7) No Approval ( Ignored By Client)
7 No Approval ( Ignored By Client) #20
a. (QubePay) Detect no movement automatically on the day of the deadline for payment by a client
b. (QubePay) Pay the gas fee for the payment tx.
c. (QubePay) Pay the reward to the lancer.
## Statuses
Please refer to Canva.
- Waiting for connecting lancer’s wallet
- Inside box number 1. The client has created a project and shared the published link with the lancer. Waiting for the lancer to approve (EIP-712) using the Wallet.
- Pay in advance
- A state in which the lancer is waiting for the client to prepay the reward into the smart contract after the lancer has approved it with