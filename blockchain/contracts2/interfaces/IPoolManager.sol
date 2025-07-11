// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IOracleAggregator.sol";
import "./IInterestRateModel.sol";

interface IPoolManager {
    struct DepositInfo {
        uint256 amount;
        uint256 lastUpdated;
    }

    struct BorrowInfo {
        uint256 amount;
        uint256 lastUpdated;
    }

    function oracle() external view returns (IOracleAggregator);
    function interestModel() external view returns (IInterestRateModel);
    function deposits(address user, address token) external view returns (uint256 amount, uint256 lastUpdated);
    function borrows(address user, address token) external view returns (uint256 amount, uint256 lastUpdated);
    function totalDeposits(address token) external view returns (uint256);
    function totalBorrows(address token) external view returns (uint256);

    function deposit(address token, uint256 amount) external;
    function withdraw(address token, uint256 amount) external;
    function borrow(address token, uint256 amount) external;
    function repay(address token, uint256 amount) external;

    function getUtilization(address token) external view returns (uint256);
    function getBorrowRate(address token) external view returns (uint256);
}
