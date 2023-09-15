import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory, Contract, Signer } from "ethers";

describe("Escrow and MockToken interaction", function () {
  let MockToken: ContractFactory, Escrow: ContractFactory;
  let USDC: Contract, Qube: Contract;
  let owner: Signer, userA: Signer, userB: Signer, userC: Signer;
  let amount: any;
  let depositId: string, depositId2: string;

  beforeEach(async () => {
    MockToken = await ethers.getContractFactory("MockToken");
    Escrow = await ethers.getContractFactory("Escrow");

    [owner, userA, userB, userC] = await ethers.getSigners();

    USDC = await MockToken.deploy();
    Qube = await Escrow.deploy(USDC.address);

    amount = ethers.utils.parseEther("1000");

    // Mint some USDC to userA
    await USDC.mint(await userA.getAddress(), amount);

    depositId = "testId";
    depositId2 = "testId2";

    // USDC: Init Distribution Status
    // owner: 1000000 (by constructor in MockToken.sol)
    // userA: 1000 (by above)
    // userB: 0
    // userC: 0
  });

  async function _deposit(_depositor: Signer, _recipient: Signer, _amount: any, _depositId: string) {
    // depositor approves Qube to spend USDC
    await USDC.connect(_depositor).approve(Qube.address, _amount);

    // depositor deposites USDC to Qube
    await Qube.connect(_depositor).depositTokens(await _recipient.getAddress(), amount, _depositId);

    // Check deposit in Qube
    expect((await Qube.deposits(_depositId)).amount).to.equal(_amount);
  }

  it("Should allow userA to deposit and release USDC to userB", async () => {
    await _deposit(userA, userB, amount, depositId);

    // userA releases USDC to userB
    await Qube.connect(userA).withdrawTokensToRecipientByDepositor(depositId);

    // Check userB's balance
    expect(await USDC.balanceOf(await userB.getAddress())).to.equal(amount);
  });

  it("Should not allow userA to withdraw USDC twice", async () => {
    await _deposit(userA, userB, amount, depositId);

    // userA releases USDC to userB
    await Qube.connect(userA).withdrawTokensToRecipientByDepositor(depositId);

    // Check deposit struct's "withdrawn" property
    expect((await Qube.deposits(depositId)).withdrawn).to.equal(true);

    // Check re-withdrawal
    expect(Qube.connect(userA).withdrawTokensToRecipientByDepositor(depositId)).to.be.revertedWith("This deposit has already been withdrawn");
  });

  it("Should not allow userB and userC to withdraw USDC", async () => {
    await _deposit(userA, userB, amount, depositId);

    // Check withdrawal by userB
    expect(Qube.connect(userB).withdrawTokensToRecipientByDepositor(depositId)).to.be.revertedWith("Not authorized to withdraw this deposit");

    // Check withdrawal by userC
    expect(Qube.connect(userC).withdrawTokensToRecipientByDepositor(depositId)).to.be.revertedWith("Not authorized to withdraw this deposit");
  });

  it("Should allow owner to withdraw USDC in any deposits", async () => {
    await _deposit(userA, userB, amount, depositId);

    // Withdraw USDC from the deposit between userA and userB by owner
    await Qube.connect(owner).withdrawTokensToRecipientByOwner(depositId);

    // Check userB's balance
    expect(await USDC.balanceOf(await userB.getAddress())).to.equal(amount);

    // ===========================================================================

    await _deposit(userB, userC, amount, depositId2);

    // Withdraw USDC from the deposit between userB and userC by owner
    await Qube.connect(owner).withdrawTokensToRecipientByOwner(depositId2);

    // Check userB's balance
    expect(await USDC.balanceOf(await userC.getAddress())).to.equal(amount);
  });

  it("Should allow owner to withdraw USDC to the depositor", async () => {
    await _deposit(userA, userB, amount, depositId);

    // Withdraw USDC to the depositor (userA) by owner
    await Qube.connect(owner).withdrawTokensToDepositorByOwner(depositId);

    // Check userA's balance
    expect(await USDC.balanceOf(await userA.getAddress())).to.equal(amount);
  });
});