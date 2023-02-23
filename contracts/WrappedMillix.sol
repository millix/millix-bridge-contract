// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import './interfaces/IMillixBridge.sol';

/**
 * WrappedMillix is a smart contract for an ERC20 token with additional features, including pause and resume, minting and burning, and vesting restrictions. 
 * 
 * @title WrappedMillix
 * @dev Developer contact: developer@millix.com
 */

/// @custom:security-contact developer@millix.com
contract WrappedMillix is ERC20, Pausable, Ownable, IMillixBridge {
    uint256 public constant MAX_SUPPLY = 9 * 10**15;
    uint256 private _burnFees = 662780;
    mapping(address => bool) private _vesting;

    constructor() ERC20("WrappedMillix", "WMLX") {}
    
    /**
     * @dev Get the number of decimals for the token
     * @return {uint8} The number of decimals
     */
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    /**
     * @dev Pause the token transfers
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the token transfers
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Mint `amount` tokens to `to`
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     * @param txhash The transaction hash in the millix network for the minting operation
     */
    function mint(
        address to,
        uint256 amount,
        string memory txhash
    ) public onlyOwner {
        require(
            totalSupply() + amount < MAX_SUPPLY,
            "total supply cannot be greater than 9e15"
        );
        require( bytes(txhash).length != 0, "txhash cannot be empty" );
        _mint(to, amount);
        emit MintWrappedMillix(txhash);
    }

    /**
     * @dev Set the burn fees for unwrapping tokens to the millix network
     * @param fees The burn fees
     */
    function setBurnFees(uint256 fees) public onlyOwner {
        _burnFees = fees;
        emit BurnFeesUpdated(_burnFees);
    }

    /**
     * @dev Get the current burn fees for unwrapping tokens to the millix network
     * @return {uint256} The current burn fees
     */
    function burnFees() public view virtual returns (uint256) {
        return _burnFees;
    }

    /**
     * @dev Check if an address is vested
     * @param addr The address to check
     * @return {bool} True if the address is vested, false otherwise
     */
    function isVested(address addr) public view returns (bool) {
        return _vesting[addr];
    }

    /**
     * @dev Set the vesting state of an address
     * @param addr The address to set the vesting state for
     * @param vested True if the address is vested, false otherwise
     */
    function setVestingState(address addr, bool vested) public onlyOwner {
        _vesting[addr] = vested;
        emit AddressVestedStateUpdate(addr, vested);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        require(
            !_vesting[from],
            "address from is in the list of vesting addresses"
        );
        super._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev Unwrap `amount` tokens to the millix network address `to`
     * @param amount The amount of tokens to unwrap
     * @param to The millix network address
     */
    function unwrap(uint256 amount, string calldata to) public payable {
        require(
            msg.value == _burnFees,
            "transaction value does not cover the MLX unwrap fees"
        );
        require( bytes(to).length != 0, "to address cannot be empty" );
        _burn(_msgSender(), amount);
        (bool success, ) = owner().call{value: _burnFees}("");
        require(success, "Burn fees transfer failed.");
        emit UnwrapMillix(_msgSender(), to, amount);
    }
}
