// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title InterestRateModel
 * @notice Classic two-slope “kink” curve returning a **per-second rate (1e18)**
 *         based on pool utilisation: u = totalBorrows / (cash + borrows)
 */
contract InterestRateModel is Ownable {
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    /*  All APR params use 1e18 precision (e.g. 0.05e18 = 5 %)  */
    uint256 public baseRatePerYear;   // e.g. 0.01e18  (1 %)
    uint256 public slopeLowPerYear;   // e.g. 0.05e18  (5 %)
    uint256 public slopeHighPerYear;  // e.g. 0.60e18  (60 %)
    uint256 public kink;              // e.g. 0.80e18  (80 %)

    event ParamsUpdated();

    constructor(
        uint256 base_,
        uint256 slopeLow_,
        uint256 slopeHigh_,
        uint256 kink_
    ) Ownable(msg.sender) {
        _setParams(base_, slopeLow_, slopeHigh_, kink_);
    }

    function _setParams(
        uint256 base_,
        uint256 slopeLow_,
        uint256 slopeHigh_,
        uint256 kink_
    ) internal {
        require(kink_ < 1e18, "kink must be < 1");
        baseRatePerYear = base_;
        slopeLowPerYear = slopeLow_;
        slopeHighPerYear = slopeHigh_;
        kink = kink_;
        emit ParamsUpdated();
    }

    function setParams(
        uint256 base_,
        uint256 slopeLow_,
        uint256 slopeHigh_,
        uint256 kink_
    ) external onlyOwner {
        _setParams(base_, slopeLow_, slopeHigh_, kink_);
    }

    /* --------------------------------------------------------------------- */

    function getBorrowRate(
        uint256 cash,
        uint256 borrows
    ) external view returns (uint256) {
        if (borrows == 0) return baseRatePerYear / SECONDS_PER_YEAR;

        uint256 util = (borrows * 1e18) / (cash + borrows);

        uint256 ratePerYear;
        if (util <= kink) {
            /* below kink */
            ratePerYear =
                baseRatePerYear +
                (util * slopeLowPerYear) /
                kink;
        } else {
            /* above kink */
            uint256 excess = util - kink;
            ratePerYear =
                baseRatePerYear +
                slopeLowPerYear +
                (excess * slopeHighPerYear) /
                (1e18 - kink);
        }

        return ratePerYear / SECONDS_PER_YEAR; // per-second rate, 1e18 precision
    }
}
