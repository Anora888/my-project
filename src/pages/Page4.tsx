import { useState, useEffect, useRef } from 'react'
import Emoji from '../components/Emoji'

interface Page4Props {
  onNext: () => void
}

function Page4({ onNext }: Page4Props) {
  const [candlesBlown, setCandlesBlown] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [micError, setMicError] = useState<string | null>(null)
  const [isCurrentlyBlowing, setIsCurrentlyBlowing] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const blowingTimeoutRef = useRef<number | null>(null)
  const startMic = async () => {
    try {
      setMicError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
     
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 512
      microphone.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      setIsListening(true)
      detectBlow()
    } catch (err) {
      setMicError('Не вдалося отримати доступ до мікрофона (але ти можеш задувати кліками!)')
    }
  }

  const detectBlow = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    const sum = dataArray.reduce((acc, val) => acc + val, 0)
    const average = sum / dataArray.length

    
    const blowThreshold = 48;

    if (average > blowThreshold) {
     
      setIsCurrentlyBlowing(true);

      
      if (blowingTimeoutRef.current) {
        clearTimeout(blowingTimeoutRef.current);
      }

      setCandlesBlown((current) => {
        if (current < 30) {
          
          return Math.min(30, current + 1)
        }
        return current
      })  
    
      blowingTimeoutRef.current = setTimeout(() => {
        setIsCurrentlyBlowing(false);
      }, 200); 

    } else if (isCurrentlyBlowing && average < blowThreshold - 5) {
     
        setIsCurrentlyBlowing(false);
    }

    setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(detectBlow)
    }, 100) 
  }

  
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (audioContextRef.current) audioContextRef.current.close()
      if (blowingTimeoutRef.current) clearTimeout(blowingTimeoutRef.current);
    }
  }, [])

  const blowOutCandle = () => {
    setCandlesBlown((current) => Math.min(30, current + 1))
  }

  return (
    <section className="page-four">
      <h1 className="mikiexersise">ФІНАЛЬНЕ ЗАВДАННЯ №1</h1>

      <div className="birthday-description">
        <p>
          Кажуть, що в день народження бажання збуваються.
          <br />
          Тому тобі потрібно загадати бажання.
          <br />
          Але спочатку дмухни в мікрофон або натисни на свічки! 
        </p>
      </div>

      <div className="blow-header-container">
<div className="mic-control">
  {!isListening ? (
    <button className="mic-button" onClick={startMic}>
      Увімкнути мікрофон
    </button>
  ) : (
    <div
      className={`mic-status ${
        isCurrentlyBlowing ? 'status-blowing' : ''
      }`}
    >
      {isCurrentlyBlowing
        ? 'ДМУХАЄШ!'
        : 'Слухаю тебе... Дмухай!'}
    </div>
  )}
</div>
        <p className="candle-counter">{candlesBlown}/30</p>
      </div>

      {micError && <p className="mic-error">{micError}</p>}

   
      <div className="cake-container">
        <img src="/src/photosfour/cake-base.png" alt="Основа торта" className="cake-base" />
        <img src="/src/photosfour/Ellipse.png" alt="" className="ellipse" />

<div className="candles-wrapper">
  {Array.from({ length: 30 }).map((_, index) => {
    const isBlown = index < candlesBlown;

    // Розміщуємо свічки по еліпсу
    const angle = (index / 30) * Math.PI * 2 - Math.PI / 2;
    const radiusX = 43;
    const radiusY = 23;

    const x = 50 + Math.cos(angle) * radiusX;
    const y = 50 + Math.sin(angle) * radiusY;

    const candleClasses = [
      'candle-img-btn',
      isBlown ? 'blown' : '',
      isCurrentlyBlowing && !isBlown ? 'blowing-active' : '',
    ].join(' ');

    return (
      <button
        key={index}
        className={candleClasses}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          zIndex: Math.round(y * 10),
        }}
        onClick={blowOutCandle}
        disabled={isBlown}
        aria-label={`Задмухати свічку ${index + 1}`}
      >
        {isBlown ? (
          <span className="candle-body candle-extinguished">
            <span className="candle-wick" />
          </span>
        ) : (
          <span className="candle-body">
            <span className="candle-wick" />
            <span className="candle-flame" />
          </span>
        )}
      </button>
    );
  })}

</div>

      </div>
     <p className="blow-title">
    ЗАДУВАЄМО СВІЧКИИИИИ <Emoji symbol="🥳" />
  </p> 
      <img src="/src/photosfour/cat.png" alt="Cat" className="cake-cat" />
      <img src="/src/photosfour/monkeys.png" alt="Monkeys" className="cake-monkeys" />
      <img src="/src/photosfour/ohno.png" alt="Ohno" className="ohno-four" />
      <img src="/src/photosfour/emojicake.png" alt="Cake" className="cake-emoji" />
      <img src="/src/photosfour/loveshearts.png" alt="Hearts" className="hearts-emoji" />

      {candlesBlown === 30 && (
        <div className="modal-overlay">
          <div className="candle-modal">
            <h2>Юху<br />Умнічка! <Emoji symbol="🥳" /></h2>
            <button onClick={onNext}>
              Нумо далі)))
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Page4