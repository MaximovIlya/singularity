// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IOracleAggregator.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OracleAggregator
 * @notice Aggregates prices from multiple oracle sources.
 * @dev This is a simplified version where the owner can set prices.
 * A production version should integrate with Chainlink or other reliable oracles.
 */
contract OracleAggregator is IOracleAggregator, Ownable {
    mapping(address => uint256) private _prices;

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Gets the price of an asset.
     * @param asset The address of the asset.
     * @return The price of the asset.
     */
    function getPrice(address asset) public view override returns (uint256) {
        uint256 price = _prices[asset];
        require(price > 0, "Oracle: Price not available");
        return price;
    }

    /**
     * @notice Sets the price for an asset.
     * @dev Only the owner can call this function.
     * @param asset The address of the asset.
     * @param price The price to set.
     */
    function setPrice(address asset, uint256 price) external onlyOwner {
        _prices[asset] = price;
    }
} 