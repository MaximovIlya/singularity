// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MyToken (pUSDT)
 * @notice ERC-20 receipt token minted/burned exclusively by PoolManager.
 */
contract MyToken is ERC20 { // <--- This must be 'contract' not 'abstract contract'
    address public immutable pool;

    constructor(
        string memory name_,
        string memory symbol_,
        address pool_
    ) ERC20(name_, symbol_) {
        pool = pool_;
    }

    modifier onlyPool() {
        require(msg.sender == pool, "MyToken: caller not pool");
        _;
    }

    function mint(address to, uint256 amount) external onlyPool {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyPool {
        _burn(from, amount);
    }
}