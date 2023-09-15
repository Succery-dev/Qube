/** @format */

import {time, loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {anyValue} from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber} from "ethers";
import {MockController} from "../typechain-types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

function fromWei(value: any) {
    return ethers.utils.formatEther(value);
}

function toWei(value: any) {
    return ethers.utils.parseEther(value);
}

describe("Controller", function () {
    let controller: MockController;
    let owner = {} as SignerWithAddress;
    beforeEach(async function () {
        [owner] = await ethers.getSigners();
   });
});
