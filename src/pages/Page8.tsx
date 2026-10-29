import Emoji from '../components/Emoji'

interface Page8Props {
onNext: () => void
}

function Page8({ onNext }: Page8Props) {
return (
<section className="page-eight">
<div className="letter-heading">
А зараз серйозно
<br />
Вітаю тебе котику з
<br />
днем народження<Emoji symbol="🥳"/>
</div>

  <img
    src="/src/photoseight/birthdayyyy.png"
    alt="Happy Birthday"
    className="letter-sticker"
  />

  <div className="letter-card">
    Я хочу, щоб цей рік приніс тобі багато
    моментів, якими ти будеш пишатися, щоб у
    тебе вистачало сил на все, чого ти хочеш,
    здоров'я побільше, діточок як на небі
    зірочок (але народжувати будеш ти:)), щоб поруч
    завжди були люди, які тебе люблять і я
    завжди буду однією з них. Знай я завжди
    поряд і ми впораємось з усім<Emoji symbol="🥰"/><Emoji symbol="✨"/>
    <br />
    Я тебе люблю
    <br />
    З днем народження, моя охана<Emoji symbol="💝"/>
  </div>

  <img
    src="/src/photoseight/dog.png"
    alt="Dog"
    className="letter-photo"
  />

  <button className="letter-final-button" onClick={onNext}>
    Це буде остання сторінка<Emoji symbol="👉"/>
  </button>

  <p className="letter-signature">
    made with love by your favourite Foxy ♡
  </p>
</section>

)
}

export default Page8