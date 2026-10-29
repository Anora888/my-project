
import { useEffect, useRef, useState } from 'react'
import './styles/bonus-game.css'

import mikiFront from '../Bonus/player/front.png'
import mikiBack from '../Bonus/player/back.png'
import mikiLeft from '../Bonus/player/left.png'
import mikiRight from '../Bonus/player/right.png'
import mikiLeftWalk1 from '../Bonus/player/leftwalk1.png'
import mikiLeftWalk2 from '../Bonus/player/leftwalk2.png'
import mikiRightWalk1 from '../Bonus/player/rightwalk1.png'
import mikiRightWalk2 from '../Bonus/player/rightwalk2.png'

import nonstopImage from '../Bonus/item/nonstop.png'
import weaponImage from '../Bonus/item/weapon.png'
import ammoImage from '../Bonus/item/ammo.png'
import baseImage from '../Bonus/background/room-base-one.jpg'

type GamePhase = 'intro' | 'supplies' | 'scan' | 'bunker' | 'party'
type ModalType = 'note' | 'computer' | null
type Direction = 'front' | 'back' | 'left' | 'right'

interface BonusGameProps {
  onBack: () => void
}

type Obstacle = {
  x: number
  y: number
  width: number
  height: number
}

const obstacles: Obstacle[] = [
  { x: 50, y: 3, width: 94, height: 6 },
  { x: 13, y: 35, width: 22, height: 35 },
  { x: 35, y: 22, width: 17, height: 15 },
  { x: 57, y: 20, width: 17, height: 12 },
  { x: 77, y: 15, width: 13, height: 17 },
  { x: 82, y: 39, width: 14, height: 21 },
  { x: 33, y: 78, width: 17, height: 13 },
  { x: 81, y: 77, width: 13, height: 14 },
  { x: 50, y: 98, width: 94, height: 4 },
]

const interactables = [
  { id: 'note' as const, x: 42, y: 34, label: 'ЗАПИСКА' },
  { id: 'computer' as const, x: 65, y: 33, label: 'КОМП’ЮТЕР' },
]

const INTERACTION_DISTANCE = 7

function BonusGame({ onBack }: BonusGameProps) {
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [player, setPlayer] = useState({ x: 8, y: 70 })
  const [direction, setDirection] = useState<Direction>('front')
  const [walkingFrame, setWalkingFrame] = useState(0)
  const keysPressed = useRef<Set<string>>(new Set())
  const [isWalking, setIsWalking] = useState(false)
  const [collected, setCollected] = useState<string[]>([])
  const [scanInput, setScanInput] = useState<string[]>([])
  const [ammo, setAmmo] = useState(0)
  const [hasWeapon, setHasWeapon] = useState(false)
  const [activeModal, setActiveModal] = useState<ModalType>(null)

const supplies = [
  {
    id: 'energy',
    image: nonstopImage,
    name: 'Енергетик',
    x: 58,
    y: 68,
  },
]

  const nearbyObject =
    phase === 'supplies' && activeModal === null
      ? interactables.find((object) =>
          Math.hypot(player.x - object.x, player.y - object.y) <
          INTERACTION_DISTANCE,
        )
      : undefined

  // Рух персонажа та колізії.
  useEffect(() => {
    if (phase !== 'supplies' || activeModal !== null) {
      keysPressed.current.clear()
      setIsWalking(false)
      return
    }

    let animationId = 0
    let lastTime = 0
    let frameTimer = 0
    const speed = 0.030

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const movementKeys = [
        'arrowleft', 'arrowright', 'arrowup', 'arrowdown',
        'a', 'd', 'w', 's',
      ]

      if (movementKeys.includes(key)) {
        event.preventDefault()
        keysPressed.current.add(key)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key.toLowerCase())
    }

    const handleBlur = () => keysPressed.current.clear()

    const animate = (time: number) => {
      const delta = lastTime === 0 ? 0 : Math.min(time - lastTime, 32)
      lastTime = time

      const keys = keysPressed.current
      let dx = 0
      let dy = 0

      if (keys.has('arrowleft') || keys.has('a')) dx -= 1
      if (keys.has('arrowright') || keys.has('d')) dx += 1
      if (keys.has('arrowup') || keys.has('w')) dy -= 1
      if (keys.has('arrowdown') || keys.has('s')) dy += 1

      const moving = dx !== 0 || dy !== 0
      setIsWalking(moving)

      if (moving && delta > 0) {
        const length = Math.hypot(dx, dy)
        dx /= length
        dy /= length

        setPlayer((current) => {
          const nextX = Math.max(2, Math.min(94, current.x + dx * speed * delta))
          const nextY = Math.max(12, Math.min(84, current.y + dy * speed * delta))
          const radiusX = 1.5
          const radiusY = 2

          const collides = (x: number, y: number) =>
            obstacles.some((obstacle) =>
              x + radiusX > obstacle.x - obstacle.width / 2 &&
              x - radiusX < obstacle.x + obstacle.width / 2 &&
              y + radiusY > obstacle.y - obstacle.height / 2 &&
              y - radiusY < obstacle.y + obstacle.height / 2,
            )

          // Перевіряємо осі окремо, щоб можна було ковзати вздовж меблів.
          const canMoveX = !collides(nextX, current.y)
          const canMoveY = !collides(current.x, nextY)

          return {
            x: canMoveX ? nextX : current.x,
            y: canMoveY ? nextY : current.y,
          }
        })

        if (dx < 0) setDirection('left')
        else if (dx > 0) setDirection('right')
        else if (dy < 0) setDirection('back')
        else setDirection('front')

        frameTimer += delta
        if (frameTimer >= 130) {
          frameTimer = 0
          setWalkingFrame((frame) => 1 - frame)
        }
      } else {
        frameTimer = 0
      }

      animationId = window.requestAnimationFrame(animate)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)
    animationId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
      keysPressed.current.clear()
    }
  }, [phase, activeModal])

  // Взаємодія з запискою та комп'ютером.
  useEffect(() => {
    if (phase !== 'supplies' || activeModal !== null) return

    const handleInteraction = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'e' || !nearbyObject) return

      event.preventDefault()
      keysPressed.current.clear()
      setActiveModal(nearbyObject.id)
    }

    window.addEventListener('keydown', handleInteraction)
    return () => window.removeEventListener('keydown', handleInteraction)
  }, [phase, activeModal, nearbyObject])

  // Закриття модалки клавішею Escape.
  useEffect(() => {
    if (!activeModal) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveModal(null)
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [activeModal])

  // Збір припасів.
  useEffect(() => {
    if (phase !== 'supplies' || activeModal !== null) return

    supplies.forEach((supply) => {
      const distance = Math.hypot(
        player.x - supply.x,
        player.y - supply.y,
      )

      if (distance < 6 && !collected.includes(supply.id)) {
        if (supply.id === 'weapon') setHasWeapon(true)
        if (supply.id === 'ammo') {
          setAmmo((current) => Math.min(370, current + 50))
        }

        setCollected((current) =>
          current.includes(supply.id) ? current : [...current, supply.id],
        )
      }
    })
  }, [player, phase, activeModal, collected])

  const submitScanKey = (key: string) => {
    const expected = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft']
    const next = [...scanInput, key].slice(-expected.length)
    setScanInput(next)

    if (next.join(',') === expected.join(',')) {
      setPhase('bunker')
    }
  }

  useEffect(() => {
    if (phase !== 'scan') return

    const handleScan = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(event.key)) {
        event.preventDefault()
        submitScanKey(event.key)
      }
    }

    window.addEventListener('keydown', handleScan)
    return () => window.removeEventListener('keydown', handleScan)
  }, [phase, scanInput])

  return (
    <section className={`bonus-game phase-${phase}`}>
      <button className="game-button back-button" onClick={onBack}>
        ← ДО ГАЛАКТИКИ
      </button>

      {phase === 'intro' && (
        <div className="mission-intro">
          <p className="mission-tag">SUPER EARTH // EMERGENCY TRANSMISSION</p>
          <h1>СЮРПРИЗ БУНКЕР</h1>
          <p className="dispatcher">— Диспетчер —</p>
          <p className="intro-text">
            Операторе! Тобі виповнилося 30 років.
            <br />
            Ти опинився в Зоні Дорослого Життя.
            <br />
            Зв’язок із Головним Союзником втрачено.
            <br />
            Збери припаси та знайди її координати!
          </p>
          <button className="game-button" onClick={() => setPhase('supplies')}>
            РОЗПОЧАТИ ДЕСАНТ
          </button>
        </div>
      )}

      {phase === 'supplies' && (
        <div className="mission-map">
          <div className="mission-hud">
            <span>СЕКТОР 30</span>
            <span>ПРИПАСИ: {collected.includes('energy') ? '1' : '0'}/1</span>
            <span>ЗБРОЯ: {hasWeapon ? 'Є' : 'НЕМАЄ'}</span>
            <span>БОЄПРИПАСИ: {ammo}/370</span>
          </div>

          <div
            className="game-terrain"
            style={{
              backgroundImage: `url(${baseImage})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div
              className="pixel-player"
              style={{ left: `${player.x}%`, top: `${player.y}%` }}
              aria-label="Мікі"
            >
              <img
                src={
                  direction === 'front'
                    ? mikiFront
                    : direction === 'back'
                      ? mikiBack
                      : direction === 'left'
                        ? isWalking
                          ? walkingFrame === 0 ? mikiLeftWalk1 : mikiLeftWalk2
                          : mikiLeft
                        : isWalking
                          ? walkingFrame === 0 ? mikiRightWalk1 : mikiRightWalk2
                          : mikiRight
                }
                alt="Мікі"
                draggable={false}
              />
            </div>

            {supplies.map((supply) =>
              !collected.includes(supply.id) ? (
                <div
                  key={supply.id}
                  className="supply-item"
                  style={{ left: `${supply.x}%`, top: `${supply.y}%` }}
                  title={supply.name}
                >
                  {supply.image ? (
                    <img src={supply.image} alt={supply.name} />
                  ) : (
                    supply.label
                  )}
                </div>
              ) : null,
            )}

            <div className="routine-enemy enemy-one">👾</div>
            <div className="routine-enemy enemy-two">👾</div>

            {nearbyObject && (
              <div
                className="interaction-prompt"
                style={{
                  left: `${nearbyObject.x}%`,
                  top: `${nearbyObject.y - 7}%`,
                }}
              >
                <kbd>E</kbd> — {nearbyObject.label}
              </div>
            )}
          </div>

          <p className="game-hint">
            Рух: WASD або стрілки. Натисни E біля записки чи комп'ютера.
          </p>

          {collected.length === supplies.length && (
            <div className="mission-notice">
              <p>ПРИПАСИ ЗІБРАНО. КООРДИНАТИ ЗАШИФРОВАНІ.</p>
              <button
                className="game-button"
                onClick={() => {
                  setScanInput([])
                  setPhase('scan')
                }}
              >
                ВИКЛИКАТИ СКАНУВАННЯ
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'supplies' && activeModal && (
        <div
          className="resident-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveModal(null)
          }}
        >
          <div
            className={`resident-modal ${activeModal}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="resident-modal-title"
          >
            <div className="resident-modal-header">
              <span>
                {activeModal === 'note'
                  ? 'PERSONAL DOCUMENT'
                  : 'TERMINAL ACCESS'}
              </span>
              <button
                className="resident-close"
                onClick={() => setActiveModal(null)}
                aria-label="Закрити"
              >
                ×
              </button>
            </div>

            {activeModal === 'note' ? (
              <>
                <h2 id="resident-modal-title">ЗАПИСКА</h2>
                <div className="resident-document">
                  <p>Мікі,</p>
                  <p>
                    Я ненадовго вийшла у справах. Не хвилюйся, я скоро повернуся.
                  </p>
                  <p>
                    Якщо мене довго не буде — перевір повідомлення на комп'ютері.
                  </p>
                  <p className="note-signature">— Твоя лисичка</p>
                </div>
              </>
            ) : (
              <>
                <h2 id="resident-modal-title">ТЕРМІНАЛ БАЗИ</h2>
                <div className="terminal-content">
                  <p className="terminal-status">
                    SYSTEM STATUS: <span>WARNING</span>
                  </p>
                  <p>ОСТАННЄ ПОВІДОМЛЕННЯ:</p>
                  <p>Зв'язок із ГОЛОВНИМ СОЮЗНИКОМ втрачено.</p>
                  <p>Останні координати недоступні.</p>
                  <p>
                    Для отримання доступу необхідно відновити зашифрований канал.
                  </p>
                  <p className="terminal-cursor">&gt; ОЧІКУВАННЯ КОМАНДИ...</p>
                </div>
              </>
            )}

            <button
              className="game-button resident-continue"
              onClick={() => setActiveModal(null)}
            >
              ЗАКРИТИ [ESC]
            </button>
          </div>
        </div>
      )}

      {phase === 'scan' && (
        <div className="mission-intro">
          <p className="mission-tag">STRATAGEM // SCANNING</p>
          <h1>ВВЕДИ КОМБІНАЦІЮ</h1>
          <p className="scan-combination">↑ ↓ → ←</p>
          <p>Натискай стрілки на клавіатурі в указаному порядку.</p>
          <p className="scan-progress">
            ВВЕДЕНО:{' '}
            {scanInput
              .map((key) => ({
                ArrowUp: '↑',
                ArrowDown: '↓',
                ArrowRight: '→',
                ArrowLeft: '←',
              })[key])
              .join(' ')}
          </p>
        </div>
      )}

      {phase === 'bunker' && (
        <div className="mission-intro">
          <p className="mission-tag">SIGNAL ACQUIRED</p>
          <h1>СИГНАЛ ВИЯВЛЕНО</h1>
          <p className="intro-text">
            СЕКРЕТНИЙ БУНКЕР У СЕКТОРІ 30.
            <br />
            ГЕРМОДВЕРІ ЗАБЛОКОВАНІ.
          </p>
          <button className="game-button" onClick={() => setPhase('party')}>
            ПРОДОВЖИТИ ТЕСТОВИЙ ПРОХІД
          </button>
          <p className="game-hint">
            Наступним кроком додамо прорив і таймер на 20 секунд.
          </p>
        </div>
      )}

      {phase === 'party' && (
        <div className="mission-intro party-ending">
          <p className="mission-tag">MISSION COMPLETE</p>
          <h1>СЮРПРИЗ!!!!! 🎉</h1>
          <p className="intro-text">
            СИСТЕМА ПОМИЛИЛАСЯ!
            <br />
            Це була підготовка до твого 30-річчя!
            <br />
            Усі монстри приборкані. Час святкувати!
          </p>
          <div className="party-decor">🎂 🪖 🎈 👾 🎊</div>
        </div>
      )}
    </section>
  )
}

export default BonusGame