import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../widgets/Header/Header';
import { BorrowTab } from '../pages/BorrowTab/BorrowTab';
import { InvestTab } from '../pages/InvestTab/InvestTab';
import { ChatAgent } from '../widgets/ChatAgent/ChatAgent';
import './App.css';

export type TabType = 'borrow' | 'invest';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('borrow');

  return (
    <BrowserRouter>
      <div className='app'>
        <Header />
        <main className='main-content'>
          <div className='container'>
            <div className='tabs-container'>
              <div className='tabs-header'>
                <button
                  className={`tab-button ${activeTab === 'borrow' ? 'active' : ''}`}
                  onClick={() => setActiveTab('borrow')}
                >
                  Взять в долг
                </button>
                <button
                  className={`tab-button ${activeTab === 'invest' ? 'active' : ''}`}
                  onClick={() => setActiveTab('invest')}
                >
                  Вложить
                </button>
              </div>

              <div className='tab-content'>
                {activeTab === 'borrow' && <BorrowTab />}
                {activeTab === 'invest' && <InvestTab />}
              </div>
            </div>
          </div>
        </main>
        <ChatAgent />
      </div>
    </BrowserRouter>
  );
}

export default App;
