import { useState, useRef, useEffect } from 'react'
import Emoji from '../components/Emoji'

interface Page5Props {
  onNext: () => void
}

const photos = [
  '/src/photossix/one.jpg',
  '/src/photossix/two.jpg',
  '/src/photossix/three.jpg',
  '/src/photossix/four.jpg',
  '/src/photossix/five.jpg',
  '/src/photossix/six.jpg',
  '/src/photossix/seven.jpg',
  '/src/photossix/eight.jpg',
  '/src/photossix/nine.jpg',
  '/src/photossix/ten.jpg',
  '/src/photossix/eleven.jpg',
  '/src/photossix/twelf.jpg',
]

function Page5({ onNext }: Page5Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const directionRef = useRef<number>(0)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)


  useEffect(() => {
    let animationFrameId: number
    const step = () => {
      if (scrollRef.current && directionRef.current !== 0 && !selectedPhoto) {
        
        scrollRef.current.scrollLeft += directionRef.current * 4
      }
      animationFrameId = requestAnimationFrame(step)
    }
    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [selectedPhoto]) 

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedPhoto) return 

    const container = scrollRef.current
    if (!container) return

    const { left, width } = container.getBoundingClientRect()
    const mouseX = e.clientX - left
    const threshold = width * 0.3

    if (mouseX < threshold) {
      directionRef.current = -1
    } else if (mouseX > width - threshold) {
      directionRef.current = 1
    } else {
      directionRef.current = 0
    }
  }

  const handleMouseLeave = () => {
    directionRef.current = 0
  }


  const closePhoto = () => {
    setSelectedPhoto(null)
  }
  return (
    <section className="page-five"> 
      
      <div className="memory-text">
        Трішки спогадів і невеличке нагадування,
        що щоб не сталось ми завжди є один в одного<Emoji symbol="🥹" />
      </div>


     <img src="/src/photossix/foxybunny.png" alt="Foxyandbunny" className="cutie" />
     <img src="/src/photossix/homic.png" alt="Hamster" className="homic" />

      <div 
        className="photo-strip-container"
        ref={scrollRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="photo-strip">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className="memory-photo-wrapper"
              onClick={() => setSelectedPhoto(photo)} 
            >
              <img
                src={photo}
                alt={`Наш спогад ${index + 1}`}
                className="memory-photo-grid"
              />
            </div>
          ))}
        </div>
      </div>

     
      {selectedPhoto && (
        <div className="photo-modal-overlay" onClick={closePhoto}>
          <div className="photo-modal-content">
            <img src={selectedPhoto} alt="Повний спогад" />
            <button className="close-modal-button" onClick={closePhoto}>×</button>
          </div>
        </div>
      )}

      <button className="continue-button-six" onClick={onNext}>
        Я сі надивився
      </button>

      <div className="memory-bottom-text">
        Поки ти це будеш розглядати я пішла плакати
      </div>
    </section>
  )
}

export default Page5