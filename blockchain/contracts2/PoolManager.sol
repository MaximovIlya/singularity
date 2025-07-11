// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./MyToken.sol";
import "./OracleAggregator.sol";
import "./InterestRateModel.sol";
// import "./INonReentrant.sol"; // This import is now essentially useless for the modifier pattern

/**
 * @title PoolManager
 * @notice  ▸ Lenders deposit USDT and receive pUSDT.  
 * ▸ Borrowers pledge ETH, borrow USDT, repay within 90 days.  
 * ▸ Continuous compound interest, kink-model APR, LTV & liquidation.
 */
// Removed `NonReentrant` inheritance, as the interface cannot provide the modifier.
// We now have to implement the re-entrancy guard *directly* in PoolManager or
// use OpenZeppelin's ReentrancyGuard.
contract PoolManager is Ownable { // Removed NonReentrant
    using SafeERC20 for IERC20;

    // We need to re-implement the re-entrancy state and modifier here,
    // or use OpenZeppelin's ReentrancyGuard contract.
    // For this example, I'll put it directly here, making PoolManager contain the logic.
    uint256 internal unlocked = 1;
    modifier nonReentrant() {
        require(unlocked == 1, "re-entrancy");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    /* ───── Constants & immutables ───────────────────────────────────────── */

    uint256 public constant SECONDS_PER_YEAR = 365 days;
    uint256 public constant MANTISSA = 1e18; // internal precision

    IERC20  public immutable stable;   // e.g. USDT (6 decimals)
    MyToken public immutable pToken;   // receipt token
    OracleAggregator    public immutable oracle;
    InterestRateModel   public immutable irm;

    /* ───── Risk params (1e18) ───────────────────────────────────────────── */
    uint256 public maxLTV            = 0.75e18;   // 75 %
    uint256 public liquidationThres  = 0.80e18;   // 80 %
    uint256 public liquidationBonus  = 1.05e18;   // +5 %
    uint256 public reserveFactor     = 0.10e18;   // 10 % of interest

    /* ───── Pool global bookkeeping ─────────────────────────────────────── */
    uint256 public totalCash;           // USDT held
    uint256 public totalBorrows;        // principal + accrued
    uint256 public totalReserves;
    uint256 public borrowIndex = MANTISSA;
    uint40  public lastAccrual;

    /* ───── Collateral & loan structs ───────────────────────────────────── */
    struct Loan {
        uint256 principal;          // denom: USDT (6 dec)
        uint256 borrowIndexSnap;    // borrowIndex at last change
        uint40  start;
        uint40  maturity;
    }
    mapping(address => uint256) public ethCollateral;   // wei
    mapping(address => Loan)    public loans;

    /* ───── Events ───────────────────────────────────────────────────────── */
    event Deposit(address indexed user, uint256 amount, uint256 shares);
    event Withdraw(address indexed user, uint256 shares, uint256 amount);
    event Borrow(address indexed user, uint256 amount);
    event Repay(address indexed payer, address indexed borrower, uint256 amount);
    event Liquidate(address indexed keeper, address indexed borrower,
                    uint256 repayAmount, uint256 seizedCollateral);

    /* ───── Constructor ─────────────────────────────────────────────────── */
    constructor(
        address stable_,
        address oracle_,
        address irm_,
        address initialOwner
    ) Ownable(initialOwner) {
        stable = IERC20(stable_);
        oracle = OracleAggregator(oracle_);
        irm    = InterestRateModel(irm_);

        pToken = new MyToken("Pool-USDT", "pUSDT", address(this));
        lastAccrual = uint40(block.timestamp);
    }

    /* ═════════════════════════  Lender functions  ═════════════════════════ */

    function deposit(uint256 amt) external nonReentrant {
        accrueInterest();

        stable.safeTransferFrom(msg.sender, address(this), amt);
        totalCash += amt;

        uint256 shares = (pToken.totalSupply() == 0)
            ? amt * 1e12
            : (amt * MANTISSA) / exchangeRate();

        pToken.mint(msg.sender, shares);
        emit Deposit(msg.sender, amt, shares);
    }

    function withdraw(uint256 shares) external nonReentrant {
        accrueInterest();

        uint256 amt = (shares * exchangeRate()) / MANTISSA;
        require(totalCash >= amt, "insufficient cash");

        pToken.burn(msg.sender, shares);
        totalCash -= amt;
        stable.safeTransfer(msg.sender, amt);

        emit Withdraw(msg.sender, shares, amt);
    }

    /* ═══════════════════════  Borrower: collateral  ═══════════════════════ */

    function supplyCollateral() external payable nonReentrant {
        require(msg.value > 0, "zero value");
        ethCollateral[msg.sender] += msg.value;
    }

    function addCollateral() external payable nonReentrant {
        require(msg.value > 0, "zero");
        ethCollateral[msg.sender] += msg.value;
    }

    /* NB: collateral withdrawal omitted for brevity – ensure LTV stays safe */

    /* ═══════════════════════  Borrow / repay logic  ═══════════════════════ */

    function borrow(uint256 amt) external nonReentrant {
        accrueInterest();
        _checkMaturityAndLTV(msg.sender);

        uint256 newDebt = loans[msg.sender].principal + amt;
        _checkLTV(msg.sender, newDebt);

        loans[msg.sender].principal = newDebt;
        loans[msg.sender].borrowIndexSnap = borrowIndex;
        if (loans[msg.sender].start == 0) {
            loans[msg.sender].start     = uint40(block.timestamp);
            loans[msg.sender].maturity  = uint40(block.timestamp + 90 days);
        }

        totalBorrows += amt;
        totalCash    -= amt;
        stable.safeTransfer(msg.sender, amt);

        emit Borrow(msg.sender, amt);
    }

    /**
     * @param borrower  Address whose debt is being serviced
     * @param amtMax    Repayment cap (use type(uint256).max for full)
     */
    function repay(address borrower, uint256 amtMax) external nonReentrant {
        accrueInterest();
        _checkMaturityAndLTV(borrower);

        uint256 outstanding = _borrowBalance(borrower);
        uint256 pay = amtMax < outstanding ? amtMax : outstanding;
        require(pay > 0, "nothing to repay");

        stable.safeTransferFrom(msg.sender, address(this), pay);
        totalCash    += pay;
        totalBorrows -= pay;

        /* update principal */
        loans[borrower].principal = outstanding - pay;
        loans[borrower].borrowIndexSnap = borrowIndex;
        if (loans[borrower].principal == 0) delete loans[borrower];

        emit Repay(msg.sender, borrower, pay);
    }

    /* ═══════════════════════════  Liquidation  ════════════════════════════ */

    function liquidate(
        address borrower,
        uint256 repayAmount
    ) external nonReentrant {
        accrueInterest();

        require(
            _currentLTV(borrower) >= liquidationThres || _isLoanDefaulted(borrower),
            "healthy"
        );

        uint256 outstanding = _borrowBalance(borrower);
        uint256 pay = repayAmount < outstanding ? repayAmount : outstanding;
        require(pay > 0, "repay zero");

        /* Pull USDT from keeper */
        stable.safeTransferFrom(msg.sender, address(this), pay);
        totalCash    += pay;
        totalBorrows -= pay;

        /* Collateral to seize in wei */
        uint256 price = oracle.getNormalizedPrice(
            oracle.ETH_ADDRESS()
        ); // USD/ETH 18 dec
        uint256 usdValue = pay * 1e12; // 6->18 dec (USDT has 6 decimals, convert to 18 for calculation)
        uint256 ethToSeize = (usdValue * liquidationBonus) / price;

        require(ethCollateral[borrower] >= ethToSeize, "not enough collat");
        ethCollateral[borrower] -= ethToSeize;
        (bool ok,) = payable(msg.sender).call{value: ethToSeize}("");
        require(ok, "eth transfer fail");

        /* Reduce principal */
        loans[borrower].principal = outstanding - pay;
        loans[borrower].borrowIndexSnap = borrowIndex;
        if (loans[borrower].principal == 0) delete loans[borrower];

        emit Liquidate(msg.sender, borrower, pay, ethToSeize);
    }

    /* ══════════════════════  Interest & accounting  ═══════════════════════ */

    function accrueInterest() public {
        uint40 nowT = uint40(block.timestamp);
        if (nowT == lastAccrual) return;

        uint256 borrowRate = irm.getBorrowRate(totalCash, totalBorrows); // per-sec, 1e18
        uint256 delta = nowT - lastAccrual;

        uint256 interest = (borrowRate * delta * totalBorrows) / MANTISSA;
        totalBorrows += interest;

        uint256 reserves = (interest * reserveFactor) / MANTISSA;
        totalReserves += reserves;
        totalBorrows  -= reserves;            // net to borrowers
        
        borrowIndex   += (borrowIndex * interest) / (totalBorrows - interest);

        lastAccrual = nowT;
    }

    /* ═══════════════════════  View helpers  ══════════════════════════════ */

    function exchangeRate() public view returns (uint256) {
        uint256 cashPlusBorrows = totalCash + totalBorrows - totalReserves;
        uint256 supply = pToken.totalSupply();
        return supply == 0 ? 1e18 : (cashPlusBorrows * 1e18) / supply;
    }

    function _borrowBalance(address user) internal view returns (uint256) {
        Loan memory L = loans[user];
        if (L.principal == 0) return 0;
        return (L.principal * borrowIndex) / L.borrowIndexSnap;
    }

    function _currentLTV(address user) internal view returns (uint256) {
        uint256 debtUSD = _borrowBalance(user) * 1e12;
        uint256 price   = oracle.getNormalizedPrice(
            oracle.ETH_ADDRESS()
        );
        uint256 collatUSD = (ethCollateral[user] * price) / 1e18;
        if (collatUSD == 0) return type(uint256).max;
        return (debtUSD * 1e18) / collatUSD;
    }

    function _checkLTV(address user, uint256 newPrincipal) internal view {
        uint256 price = oracle.getNormalizedPrice(oracle.ETH_ADDRESS());
        uint256 debtUSD = newPrincipal * 1e12;
        uint256 collatUSD = (ethCollateral[user] * price) / 1e18;
        require(collatUSD > 0, "no collateral");
        uint256 newLTV = (debtUSD * 1e18) / collatUSD;
        require(newLTV <= maxLTV, "LTV overflow");
    }

    function _isLoanDefaulted(address user) internal view returns (bool) {
        Loan memory L = loans[user];
        return L.principal > 0 && block.timestamp > L.maturity;
    }

    function _checkMaturityAndLTV(address user) internal view {
        // This function can be expanded if there are other checks needed before borrow/repay
    }


    /* ═══════════════════════  Admin setters  ═════════════════════════════ */

    function setRiskParams(
        uint256 maxLTV_,
        uint256 liqThres_,
        uint256 bonus_,
        uint256 reserveFactor_
    ) external onlyOwner {
        require(
            maxLTV_ < liqThres_ && liqThres_ < bonus_,
            "bad params"
        );
        require(reserveFactor_ <= MANTISSA, "reserveFactor too high");
        maxLTV           = maxLTV_;
        liquidationThres = liqThres_;
        liquidationBonus = bonus_;
        reserveFactor    = reserveFactor_;
    }

    /* ─────────────────────── fallback for ETH collateral ───────────────── */
    receive() external payable {
        ethCollateral[msg.sender] += msg.value; // convenience deposit
    }
}