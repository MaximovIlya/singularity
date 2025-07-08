// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPoolManager.sol";
import "./interfaces/IOracleAggregator.sol";
import "./interfaces/IInterestRateModel.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PoolManager is IPoolManager, ReentrancyGuard {
    IOracleAggregator public override oracle;
    IInterestRateModel public override interestModel;

    mapping(address => mapping(address => DepositInfo)) public override deposits; // user => token => info
    mapping(address => mapping(address => BorrowInfo)) public override borrows;   // user => token => info
    mapping(address => uint256) public override totalDeposits;
    mapping(address => uint256) public override totalBorrows;

    constructor(address _oracle, address _interestModel) {
        oracle = IOracleAggregator(_oracle);
        interestModel = IInterestRateModel(_interestModel);
    }

    function deposit(address token, uint256 amount) external override nonReentrant {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        deposits[msg.sender][token].amount += amount;
        totalDeposits[token] += amount;
    }

    function withdraw(address token, uint256 amount) external override nonReentrant {
        require(deposits[msg.sender][token].amount >= amount, "Insufficient balance");
        deposits[msg.sender][token].amount -= amount;
        totalDeposits[token] -= amount;
        IERC20(token).transfer(msg.sender, amount);
    }

    function borrow(address token, uint256 amount) external override nonReentrant {
        uint256 price = oracle.getPrice(token);
        // ✅ Add collateral + LTV checks here later

        borrows[msg.sender][token].amount += amount;
        totalBorrows[token] += amount;

        IERC20(token).transfer(msg.sender, amount);
    }

    function repay(address token, uint256 amount) external override nonReentrant {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        require(borrows[msg.sender][token].amount >= amount, "Nothing to repay");

        borrows[msg.sender][token].amount -= amount;
        totalBorrows[token] -= amount;
    }

    function getUtilization(address token) public view override returns (uint256) {
        if (totalDeposits[token] == 0) return 0;
        return (totalBorrows[token] * 1e18) / totalDeposits[token];
    }

    function getBorrowRate(address token) public view override returns (uint256) {
        uint256 utilization = getUtilization(token);
        return interestModel.calculateRate(utilization);
    }
} 