// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IOracleAggregator {
    /**
     * @notice Gets the raw price of an asset from the oracle.
     * @param asset The asset address (use 0xEeee... for ETH).
     * @return The price with native feed decimals (e.g., 8 decimals).
     */
    function getPrice(address asset) external view returns (uint256);

    /**
     * @notice Gets the normalized price of an asset (scaled to 18 decimals).
     * @param asset The asset address (use 0xEeee... for ETH).
     * @return The normalized price in 18 decimals.
     */
    function getNormalizedPrice(address asset) external view returns (uint256);

    /**
     * @notice Gets the number of decimals returned by the asset's Chainlink feed.
     * @param asset The asset address.
     * @return Number of decimals used in price.
     */
    function getDecimals(address asset) external view returns (uint8);
}
