import React from "react";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__logo">PWN</div>
      <nav className="header__nav">
        <a href="#" className="header__link">Learn</a>
        <a href="#" className="header__link">Hedge Notes</a>
        <a href="#" className="header__link">Strategies</a>
        <a href="#" className="header__link">Market</a>
        <a href="#" className="header__link">Dashboard</a>
        <a href="#" className="header__link">Tools</a>
        <a href="#" className="header__link">DAO</a>
      </nav>
      <div className="header__actions">
        <select className="header__networks">
          <option>All Networks</option>
        </select>
        <button className="header__connect">Connect</button>
      </div>
    </header>
  );
};

export default Header; 