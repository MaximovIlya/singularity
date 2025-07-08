import React from "react";
import "./HeroSection.css";

const HeroSection: React.FC = () => {
  return (
    <section className="hero">
      <h1 className="hero__title">Hedge Notes — ETH & BTC</h1>
      <p className="hero__subtitle">
        Earn <span className="hero__highlight">fixed yield</span> on discounted BTC & ETH notes with no <span className="hero__highlight">opportunity costs</span> - upgrading your yield from 3rd party pools.<br/>
        Borrow stablecoins with guaranteed rate & <span className="hero__highlight">zero liquidation risks!</span>
      </p>
    </section>
  );
};

export default HeroSection; 