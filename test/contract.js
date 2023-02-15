const truffleAssert = require('truffle-assertions');

const WrappedMillix = artifacts.require("WrappedMillix");

const MILLIX_ACCOUNT_ADDRESS = "152PqxYF3VCXGRXwioyhhJyQMMjH6yPKZd0a0152PqxYF3VCXGRXwioyhhJyQMMjH6yPKZd";
const MILLIX_TRANSACTION_ID = "23Dpfpt2BMzXcUkbQ3DqrnGhjvPnQC4RBfwdLUCyNHq912FGbh	"

contract("WrappedMillix", (accounts) => {
    it("should mint 10000 WMLX in the first account", async () => {
        const wmlx = await WrappedMillix.deployed();
        const amount = 10000;
        await wmlx.mint(accounts[0], amount, MILLIX_TRANSACTION_ID);
        const balance = await wmlx.balanceOf(accounts[0]);
        assert.equal(balance.valueOf(), amount, "10000 wasn't in the first account");
    });

    it("should not mint more than 9e15 WMLX", async () => {
        const wmlx = await WrappedMillix.deployed();
        const amount = 9e15 + 1;
        await truffleAssert.reverts(wmlx.mint(accounts[0], amount, MILLIX_TRANSACTION_ID), "total supply cannot be greater than 9e15.");
    });

    it("should update burn fees", async () => {
        const wmlx = await WrappedMillix.deployed();
        const fees = 100000;
        truffleAssert.eventEmitted(await wmlx.setBurnFees(fees), "BurnFeesUpdated", { burnFees: web3.utils.toBN(fees) });
        const newBurnFees = await wmlx.burnFees();
        assert.equal(newBurnFees, fees, "burn fees should be updated to 100000");
    });

    it("should not receive ether", async () => {
        const wmlx = await WrappedMillix.deployed();
        await truffleAssert.reverts(wmlx.send(10, { from: accounts[0] }));
        const balance = await web3.eth.getBalance(wmlx.address);
        assert.equal(balance, 0, "balance should be zero");
    });

    it("should not unwrap WMLX if balance is not available", async () => {
        const wmlx = await WrappedMillix.deployed();
        const amount = 10000;
        let balance = await wmlx.balanceOf(accounts[1]);
        assert.equal(balance, 0, "zero balance was expected");
        const burnFees = await wmlx.burnFees();
        await truffleAssert.reverts(wmlx.unwrap(amount, MILLIX_ACCOUNT_ADDRESS, { from: accounts[1], value: burnFees }), "burn amount exceeds balance");
    });

    it("should mint 10000 WMLX and unwrap all tokens in the first account", async () => {
        const wmlx = await WrappedMillix.deployed();
        const amount = 10000;
        await wmlx.mint(accounts[0], amount, MILLIX_TRANSACTION_ID);
        let balance = await wmlx.balanceOf(accounts[0]);
        const burnFees = await wmlx.burnFees();
        truffleAssert.eventEmitted(await wmlx.unwrap(balance, MILLIX_ACCOUNT_ADDRESS, { value: burnFees }), "UnwrapMillix", { from: accounts[0], to: MILLIX_ACCOUNT_ADDRESS, amount: balance });
        balance = await wmlx.balanceOf(accounts[0]);
        assert.equal(balance.toNumber(), 0, "zero balance expected");
    });

    it("should pay 40404 wei to the contract address to burn WMLX", async () => {
        const wmlx = await WrappedMillix.deployed();
        const amount = 10000;
        await wmlx.mint(accounts[1], amount, MILLIX_TRANSACTION_ID);
        let balance = await wmlx.balanceOf(accounts[1]);

        const burnFees = 40404;
        truffleAssert.eventEmitted(await wmlx.setBurnFees(burnFees), "BurnFeesUpdated", { burnFees: web3.utils.toBN(burnFees) });
        const ownerAccountEtherBefore = await web3.eth.getBalance(accounts[0]);
        await wmlx.unwrap(balance, MILLIX_ACCOUNT_ADDRESS, { from: accounts[1], value: burnFees });
        const ownerAccountEtherAfter = await web3.eth.getBalance(accounts[0]);

        assert.equal(web3.utils.toBN(ownerAccountEtherAfter).sub(web3.utils.toBN(ownerAccountEtherBefore)).toNumber(), burnFees, "owner account ether balance should increase by 40404 wei");
    });

    it("should not unwrap tokens if transaction doesnt cover the fees", async () => {
        const wmlx = await WrappedMillix.deployed();
        const amount = 10000;
        await wmlx.mint(accounts[1], amount, MILLIX_TRANSACTION_ID);
        await truffleAssert.reverts(wmlx.unwrap(amount, MILLIX_ACCOUNT_ADDRESS, { from: accounts[1], value: 10 }), "transaction value does not cover the MLX unwrap fees");
    });

    it("should not mint and burn WMLX if contract is paused", async () => {
        const wmlx = await WrappedMillix.deployed();
        const amount = 10000;
        await wmlx.pause();
        await truffleAssert.reverts(wmlx.mint(accounts[1], amount, MILLIX_TRANSACTION_ID), "paused");
        const burnFees = await wmlx.burnFees();
        await truffleAssert.reverts(wmlx.unwrap(amount, MILLIX_ACCOUNT_ADDRESS, {value: burnFees}), "paused");
        await wmlx.unpause();
    });

});