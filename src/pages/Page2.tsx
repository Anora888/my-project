import Emoji from '../components/Emoji'
interface Page2Props {
  onNext: () => void
} 

function Page2({ onNext }: Page2Props) {
  return (
    <section className="page-two">
      <div className="red-card">
        <div className="red-text">
          <p className='p-text-two'>
            Ти вже велика жєбка, тому тепер можеш офіційно без дозволу (можливо знадобиться мій)) купувати всілякі дурнички.
          </p>

          <p className='p-text-two'>
            Твоя демо-версія закінчилася, починається
            найцікавіше<Emoji symbol="😈" />:
          </p>

          <p>
            <Emoji symbol="💍" /> Я твоя красотка і майбутня дружина
          </p>

          <p>
            <Emoji symbol="🧓" /> ХП довше відновлюється (і більше гемору;))
          </p>

          <p>
            <Emoji symbol="💼" /> Дофіга відповідальності
          </p>

          <p>
            <Emoji symbol="💪" /> Ну і звісно +10000 до вашої мужності (як то кажуть, як вино)<Emoji symbol="😏" />
          </p>
        </div>

        <img src="/src/photostwo/th.png" alt="Star" className="stars" />
        
        <img src="/src/photostwo/balloons.png" alt="Balloons" className="balloons" />


        <button className="continue-button-two" onClick={onNext}>
            Далі буде менше тексту <Emoji symbol="😜" />
        </button>
      </div>
    </section>
  )
}

export default Page2