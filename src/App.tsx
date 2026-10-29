import './App.css'
import { useState } from 'react'

import TopBar from './components/TopBar'
import WelcomePage from './pages/WelcomePage'
import Page2 from './pages/Page2'
import Page3 from './pages/Page3'
import Page4 from './pages/Page4'
import Page5 from './pages/Page5'
import Page6 from './pages/Page6'
import Page7 from './pages/Page7'
import Page8 from './pages/Page8'
import Page9 from './pages/Page9'
import BonusGame from './pages/BonusGame'

function App() {
  const [page, setPage] = useState(1)
  const [hp, setHp] = useState(100)
  const [love, setLove] = useState(100)
  const [infiniteStats, setInfiniteStats] = useState(false)

  const loseLove = () => {
    if (infiniteStats) return
    setLove((current) => Math.max(0, current - 25))
  }

  const openChest = (chest: number) => {
    if (chest === 1) {
      setInfiniteStats(true)
    } else if (chest === 2) {
      setHp((current) => current + 100)
      setLove((current) => current + 100)
    } else if (chest === 3) {
      setHp((current) => current + 10)
      setLove((current) => current + 10)
    }
  }

  return (
    <div className="window">
      <TopBar
        hp={infiniteStats ? Infinity : hp}
        love={infiniteStats ? Infinity : love}
      />

      <main className="content">
        {page === 1 && <WelcomePage onNext={() => setPage(2)} />}

        {page === 2 && <Page2 onNext={() => setPage(3)} />}

        {page === 3 && (
          <Page3
            onNext={() => setPage(4)}
            onOpenChest={openChest}
          />
        )}

        {page === 4 && <Page4 onNext={() => setPage(5)} />}

        {page === 5 && <Page5 onNext={() => setPage(6)} />}

        {page === 6 && (
          <Page6
            love={infiniteStats ? Infinity : love}
            onPizzaClick={loseLove}
            onNext={() => setPage(7)}
          />
        )}

        {page === 7 && <Page7 onNext={() => setPage(8)} />}

        {page === 8 && <Page8 onNext={() => setPage(9)} />}

        {page === 9 && (
          <Page9
            onNavigate={(targetPage) => setPage(targetPage)}
            onBonusGame={() => setPage(10)}
          />
        )}

        {page === 10 && (
          <BonusGame
            onBack={() => setPage(9)}
          />
        )}
      </main>
    </div>
  )
}

export default App