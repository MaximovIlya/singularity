// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IOracleAggregator
 * @notice Interface for the OracleAggregator contract.
 */
interface IOracleAggregator {
    /**
     * @notice Gets the price of an asset.
     * @param asset The address of the asset.
     * @return The price of the asset.
     */
    function getPrice(address asset) external view returns (uint256);
} 