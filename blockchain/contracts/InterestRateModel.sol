// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IInterestRateModel.sol";

/**
 * @title InterestRateModel
 * @notice A simple linear interest rate model contract.
 * @dev This is a basic implementation. A more complex model could be used for production.
 * The interest rate is determined by the formula: rate = baseRate + utilization * multiplier
 */
contract InterestRateModel is IInterestRateModel {
    uint256 public constant BASE_RATE = 2 * 1e16; // 2% APR
    uint256 public constant MULTIPLIER = 8 * 1e16; // 8% APR

    /**
     * @notice Calculates the interest rate based on utilization.
     * @param utilization The utilization of a pool's assets, in WAD (1e18) format.
     * @return The calculated interest rate per second.
     */
    function calculateRate(uint256 utilization) public pure override returns (uint256) {
        return BASE_RATE + (utilization * MULTIPLIER / 1e18);
    }
} 