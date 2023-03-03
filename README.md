# millix bridge contract

## Introduction:
This is the smart contract for the WrappedMillix ERC20 token. It implements the ERC20, Pausable, and Ownable contracts from OpenZeppelin and the IMillixBridge interface.

## Getting started
The smart contract is developed using the Truffle Suite. To get started you have to install all the dependencies.
```
npm install
```

Before you begin, ensure that you've read the [official Ethereum documentation](https://ethereum.org/en/what-is-ethereum/) and [Truffle Suite quickstart](https://trufflesuite.com/docs/truffle/quickstart/).

The project has the following structure:

- contracts/: Directory for Solidity contracts
- migrations/: Directory for scriptable deployment files
- test/: Directory for test files for testing your application and contracts
- truffle-config.js: Truffle configuration file

Start the Truffle develop console to deploy and test the smart contract.
```
npx truffle develop
```

In the Truffle develop console, compile the code
```
truffle(develop)> compile
```
Then migrate the smart contract
```
truffle(develop)> migrate
```

And test the smart contract
```
truffle(develop)> test
```

## Token Name:
WrappedMillix

## Symbol:
WMLX

## Decimals:
0

## Token Contract Address:
The contract is deployed on the Ethereum network and has the following address [0x77d0cb0ab54f9e74b9405a5b3f60da06a78f1aad](https://etherscan.io/token/0x77d0cb0ab54f9e74b9405a5b3f60da06a78f1aad).

## Purpose:
WrappedMillix is a token that can be used on the Ethereum network. The purpose of WrappedMillix is to allow users to wrap and unwrap Millix tokens in the Ethereum network and to provide a seamless integration with the Millix network.

## Token Distribution:
The total supply of WrappedMillix tokens is capped at 9 * 10^15. The distribution details are specified in the [whitepaper](https://millix.org/whitepaper.html) available in the Millix foundation website.

## Use Cases:
WrappedMillix can be used on the Ethereum network for various use cases such as payment for goods and services, governance, and staking.

## Smart Contract Security:
The security of the Wrapped Millix smart contract is of utmost importance. If you have any security concerns, please contact [developer@millix.com](mailto:developer@millix.com). The Wrapped Millix smart contract audit was completed by [Hacken](https://hacken.io/audits/) on March 1, 2023.

## Contract Features:
- Ownable: The smart contract is ownable, meaning that only the owner can perform certain actions such as minting tokens, setting burn fees, and setting the vesting state of addresses. The millix foundation is the owner of the smart contract.

- Pausable: The smart contract has a pausable feature, which allows the owner to pause and unpause the contract as needed.

- IMillixBridge: The smart contract implements the IMillixBridge interface, which provides the ability to unwrap Millix tokens and emit events when tokens are unwrapped or minted.

- MAX_SUPPLY: The maximum supply of WrappedMillix tokens is set to 9 * 10^15.

- Burn Fees: The smart contract has a burn fee mechanism in place, which requires a minimum transaction value to be sent in order to unwrap Millix tokens. The burn fee can be set by the owner.

- Vesting: The smart contract keeps track of vesting addresses, which are addresses that are not allowed to transfer tokens. The vesting state of an address can be set by the owner.

- Minting: The owner can mint WrappedMillix tokens and specify the recipient address and the amount. The minting function also emits a MintWrappedMillix event.

- Unwrap: The smart contract provides a function to unwrap Millix tokens by sending a minimum transaction value and specifying the destination address on the Millix network. The unwrap function also emits an UnwrapMillix event.
