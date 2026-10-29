import Emoji from '../components/Emoji'

interface Page7Props {
onNext: () => void
}

function Page7({ onNext }: Page7Props) {
return (
<section className="page-seven">
<h1 className="update-title">
Оновлення
<br />
системи
</h1>

     <img src="/src/photoseven/miki.png" alt="My lovely boyfriend" className="mikimyboy" />
    <img src="/src/photoseven/foxuhy.png" alt="lovely fox" className="foxsevenpage" />

  <h2 className="update-version">
    BOYFRIEND v.30.0
  </h2>

  <p className="update-success">
    Оновлення успішно встановлено ✓
  </p>

  <div className="update-info">
    <p>Що нового:</p>

    <p>
      <Emoji symbol="💪"/> +10 до мужності
      <br />
      <Emoji symbol="🧠"/> +5 до мудрості
      <br />
      <Emoji symbol="🧡"/> +∞ до моєї любові
      <br />
      <Emoji symbol="😳"/> +можеш будь-кого називати «Гімно мале»
    </p>

    <p>Відомі баги:</p>

    <p>
      – досі не завжди слухає свою дівчину
      <br />
      – гарантія на здоров'я по трохи закінчується
      <br />
      – занадто сильно мені подобається
    </p>
  </div>

  <button className="continue-button" onClick={onNext}>
    Продовжуємо)))
  </button>
</section>

)
}

export default Page7