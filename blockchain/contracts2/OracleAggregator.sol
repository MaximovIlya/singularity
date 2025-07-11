// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./interfaces/IOracleAggregator.sol";

/**
 * @dev ETH is represented by the canonical 0xEeee... placeholder.
 */
contract OracleAggregator is IOracleAggregator, Ownable {
    address public constant ETH_ADDRESS =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    mapping(address => AggregatorV3Interface) private _feeds;

    constructor(address initialOwner) Ownable(initialOwner) {}

    /* ───────────────────────────  Oracle reads  ─────────────────────────── */

    function getPrice(address asset) public view override returns (uint256) {
        AggregatorV3Interface feed = _feeds[asset];
        require(
            address(feed) != address(0),
            "Oracle: feed not available"
        );

        (, int256 answer,,,) = feed.latestRoundData();
        require(answer > 0, "Oracle: invalid price");
        return uint256(answer);
    }

    /**
     * @notice Normalises any feed to **18 decimals** (1e18).
     */
    function getNormalizedPrice(
        address asset
    ) public view override returns (uint256) {
        uint256 raw = getPrice(asset);
        uint8 d = getDecimals(asset);
        return raw * (10 ** (18 - d));
    }

    function getDecimals(
        address asset
    ) public view override returns (uint8) {
        AggregatorV3Interface feed = _feeds[asset];
        require(address(feed) != address(0), "Oracle: feed not available");
        return feed.decimals();
    }

    /* ────────────────────────────  Admin ops  ───────────────────────────── */

    function setFeed(
        address asset,
        address feedAddress
    ) external onlyOwner {
        require(feedAddress != address(0), "Oracle: zero feed");
        _feeds[asset] = AggregatorV3Interface(feedAddress);
    }
}
