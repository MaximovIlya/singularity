import React from "react";
import "./StrategyTerms.css";

const StrategyTerms: React.FC = () => {
  return (
    <section className="strategy">
      <div className="strategy__header">
        <span className="strategy__title">Strategy terms</span>
        <a href="#" className="strategy__details">see details</a>
      </div>
      <p className="strategy__desc">
        Earn fixed yield or borrow against your ETH/BTC for 90 days without the risk of liquidation!
      </p>
      <div className="strategy__grid">
        <div className="strategy__item">
          <div className="strategy__label">Credit Tokens</div>
          <div className="strategy__icons">
            <span className="token token-usdc" title="USDC">&#36;</span>
            <span className="token token-usdt" title="USDT">&#36;</span>
            <span className="token token-dai" title="DAI">&#36;</span>
            <span className="token token-susd" title="sUSD">&#36;</span>
            <span className="token token-tether" title="Tether">&#36;</span>
          </div>
        </div>
        <div className="strategy__item">
          <div className="strategy__label">Lender Yield</div>
          <div className="strategy__value strategy__value--accent">8.75%</div>
        </div>
        <div className="strategy__item">
          <div className="strategy__label">Loan To Value</div>
          <div className="strategy__value">65%</div>
        </div>
        <div className="strategy__item">
          <div className="strategy__label">Collateral</div>
          <div className="strategy__icons">
            <span className="token token-eth" title="ETH">&#9673;</span>
            <span className="token token-weth" title="WETH">&#9673;</span>
            <span className="token token-btc" title="BTC">&#9673;</span>
            <span className="token token-wbtc" title="WBTC">&#9673;</span>
            <span className="token token-steth" title="stETH">&#9673;</span>
          </div>
        </div>
        <div className="strategy__item">
          <div className="strategy__label">Borrow Rate</div>
          <div className="strategy__value">8.75%</div>
        </div>
        <div className="strategy__item">
          <div className="strategy__label">Loan duration</div>
          <div className="strategy__value">90 Days</div>
        </div>
      </div>
      <div className="strategy__actions">
        <button className="strategy__btn strategy__btn--lend">LEND STABLECOINS</button>
        <button className="strategy__btn strategy__btn--borrow">BORROW STABLECOINS</button>
      </div>
    </section>
  );
};

export default StrategyTerms; 