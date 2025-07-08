// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IInterestRateModel
 * @notice Interface for the InterestRateModel contract.
 */
interface IInterestRateModel {
    /**
     * @notice Calculates the interest rate based on utilization.
     * @param utilization The utilization of a pool's assets (in WAD format, 1e18).
     * @return The calculated interest rate.
     */
    function calculateRate(uint256 utilization) external view returns (uint256);
} 