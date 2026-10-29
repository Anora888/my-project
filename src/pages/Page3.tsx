import { useState } from 'react'
import chestClosed from '../photostwo/chest.png'
import chestOpen from '../photostwo/openchest.png'
import Emoji from '../components/Emoji'

interface Page3Props {
  onNext: () => void
  onOpenChest: (chest: number) => void
}

const rewards = [
  {
    title: 'НЕСКІНЧЕННІСТЬ ♾️',
    description: 'Нескінченні HP та Love. Тебе тепер нічим не зламати!',
  },
  {
    title: '+100 ДО HP І LOVE',
    description: 'Запас міцності й любові збільшено на 100!',
  },
  {
    title: '+10 ДО ВСЬОГО',
    description: 'Усі доступні характеристики покращено на 10!',
  },
]

function Page3({ onNext, onOpenChest }: Page3Props) {
  const [selectedChest, setSelectedChest] = useState<number | null>(null)
  const [showReward, setShowReward] = useState(false)

  const chooseChest = (chest: number) => {
    if (selectedChest !== null) return

    setSelectedChest(chest)
    onOpenChest(chest)
    setShowReward(true)
  }

  return (
    <section className="page-three chest-page">
      <h1 className="system-message">SYSTEM MESSAGE</h1>

      <div className="age-message">
        Вітаю!
        <br />
        Samurai успішно досягнув віку:{' '}
        <strong className="age">30</strong>
      </div>

      <p className="sub-text">
        Тобі варто відновити трохи HP і Love,
        <br />
        тому раджу обрати скриньку)))
      </p>

      <div className="chest-options">
        {rewards.map((reward, index) => (
          <button
            key={reward.title}
            className={`chest-option ${
              selectedChest === index + 1 ? 'chest-selected' : ''
            }`}
            onClick={() => chooseChest(index + 1)}
            disabled={selectedChest !== null}
            aria-label={`Відкрити скриню ${index + 1}`}
          >
            <span className="chest-icon">
              <img
                src={selectedChest === index + 1 ? chestOpen : chestClosed}
                alt="Скринька"
              />
            </span>
          </button>
        ))}
      </div>

      {showReward && selectedChest !== null && (
        <div
          className="reward-overlay"
          onClick={() => setShowReward(false)}
        >
          <div
            className="reward-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="reward-close"
              onClick={() => setShowReward(false)}
              aria-label="Закрити віконце"
            >
              ×
            </button>

            <h2>{rewards[selectedChest - 1].title}</h2>
            <p>{rewards[selectedChest - 1].description}</p>

            <button
              className="reward-ok"
              onClick={() => setShowReward(false)}
            >
              Чудово! <Emoji symbol="😘"/>
            </button>
          </div>
        </div>
      )}

      <button
        className="chest-continue"
        onClick={onNext}
        disabled={selectedChest === null}
      >
        Продовжуємо)))
      </button>
    </section>
  )
}

export default Page3