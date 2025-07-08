import { useState } from 'react'
import Header from './Header'
import HeroSection from './HeroSection'
import StrategyTerms from './StrategyTerms'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <HeroSection />
      <StrategyTerms />
      {/* Здесь будет основной контент */}
    </>
  )
}

export default App
