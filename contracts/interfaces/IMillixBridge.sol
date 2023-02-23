// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * IMillixBridge is a interface implemented by the WMLX contract. 
 * 
 * @title IMillixBridge
 * @dev Developer contact: developer@millix.com
 */

interface IMillixBridge {
    /**
     * @dev Emitted when `amount` tokens are moved from account (`from`) to millix network address (`to`)
     */
    event UnwrapMillix(address indexed from, string to, uint256 amount);

    /**
     * @dev Emitted when `burnFees` value is updated
     */
    event BurnFeesUpdated(uint256 burnFees);

    /**
     * @dev Emitted when `addr` address is added to the list of vested addresses
     */
    event AddressVestedStateUpdate(address indexed addr, bool vested);

    /**
     * @dev Emitted when `amount` tokens are minted from millix transaction (`txhash`)
     */
    event MintWrappedMillix(string txhash);

    function unwrap(uint256 amount, string calldata to) external payable;
}