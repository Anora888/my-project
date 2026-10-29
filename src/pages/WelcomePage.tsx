interface WelcomePageProps {
  onNext: () => void
}

function WelcomePage({ onNext }: WelcomePageProps) {
  return (
    <section className="welcome-page">
    <img src="/src/photosone/lovely.png" alt="birthday" className="hearts" />

 <img src="/src/photosone/birthday.png" alt="birthday" className="birthday-title" />

      <div className="welcome-card">
        Сьогодні кошеня, особливий день, вже 30 зим пройшло (ну ти і дєд:)) від твого народження і це мій невеличкий подарунок тобі
      </div>


       <img src="/src/photosone/duck.png" alt="Duck" className="birthday-duck" />

       <img src="/src/photosone/cake.png" alt="Cake" className="cake" />

       <img src="/src/photosone/cat.png" alt="Cat" className="cat" />


      <button className="next-button" onClick={onNext}>
         Погнали далі <img src="/src/photosone/Vectorcake.png" alt="Cakee" className="cakevec" />
      </button>
    </section>
  )
}

export default WelcomePage