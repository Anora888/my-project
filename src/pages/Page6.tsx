import { useState } from 'react'
import Emoji from '../components/Emoji'

interface Page6Props {
love: number
onPizzaClick: () => void
onNext: () => void
}

function Page6({ onPizzaClick, onNext }: Page6Props) {
const [attempts, setAttempts] = useState(0)
const [gameFinished, setGameFinished] = useState(false)
const [goodEnding, setGoodEnding] = useState(false)

const [pizzaPosition, setPizzaPosition] = useState({
  left: 70,
  top: 65,
})

const runPizzaAway = () => {
  setPizzaPosition({
    left: 55 + Math.random() * 30,
    top: 25 + Math.random() * 45,
  })
}

const choosePizza = () => {
if (gameFinished) return

const newAttempts = attempts + 1

setAttempts(newAttempts)
onPizzaClick()

if (newAttempts >= 4) {
  setGameFinished(true)
}

runPizzaAway()

}

const chooseMe = () => {
  if (gameFinished) return

  if (attempts < 4) {
    setGoodEnding(true)
    setGameFinished(true)
  }
}

return (
<section className="page-six">

<div className="yandere-heading">
<h1>Зараз дуже важливе питання  <Emoji symbol="😈"/></h1>
</div> 

<div className="favsix">
    <p>Що ти найбільше любиш?</p>
</div>


  <div className="yandere-game">
    <button
      className="me-button"
      onClick={chooseMe}
      disabled={gameFinished}
    >
      мене
    </button>

    <button
      className="pizza-button"
      style={{
        left: `${pizzaPosition.left}%`,
        top: `${pizzaPosition.top}%`,
      }}
      onClick={choosePizza}
      disabled={gameFinished}
      aria-label="Піца"
    >
      <img src='/src/photopagesix/pizza.png' alt="Pizza" />
    </button>
  </div>

  <p className="attempt-counter">
    Спроби: {attempts}/4
  </p>

      <img src="/src/photopagesix/yandere.png" alt="Yandere" className="girl" />
      <img src="/src/photopagesix/Vector.png" alt="danger" className="dangersix" />
      <img src="/src/photopagesix/shy.png" alt="Shy" className="shy" />
      <img src="/src/photopagesix/heart.png" alt="Heart" className="heartssix" />
      <img src="/src/photopagesix/bloody.png" alt="Bloody" className="bloodsix" />

  {gameFinished && (
    <div className="yandere-overlay">
      {goodEnding ? (
        <div className="pink-ending">
          <h2>ХІХІХІХІ, НЕОЧІКУВАНО <Emoji symbol="❤️"/></h2>
          <p>Думала, ти пограєшся зі мною</p>
          <img src="/src/photopagesix/lovebears.png" alt="Bears" className="lovebears" />
          <button onClick={onNext}>
            Продовжуємо, мій фан <Emoji symbol="😊"/>
          </button>
        </div>
      ) : (
        <div className="red-ending">
          
          <p>Система зрозуміла, що користувач телепень! І зробила вибір за нього</p> 
          <p className='mememe'><Emoji symbol="😒"/></p>

          <button onClick={onNext}>
            Продовжуємо, фан <Emoji symbol="🍕"/>
          </button>
        </div>
      )}
    </div>
  )}
</section>

)
}

export default Page6