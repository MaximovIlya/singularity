// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
    constructor() ERC20("MockUSDT", "USDT") {}

    // Mint for testing
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    // Match USDT's decimals
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}