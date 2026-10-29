import { useEffect, useRef, useState } from 'react'

interface Page9Props {
  onNavigate: (page: number) => void
  onBonusGame: () => void
}

interface Particle {
  angle: number
  radius: number
  size: number
  speed: number
  color: string
  heart: boolean
  depth: number
}

const COLORS = ['#ff174f', '#ff326d', '#ff5b91', '#ff9abd', '#ffd1e0', '#ffffff']

const PAGE_PORTALS = [
  { page: 1, label: 'НАШ ПОЧАТОК', x: 16, y: 25 },
  { page: 2, label: 'СПОГАДИ ❤️', x: 79, y: 28 },
  { page: 3, label: 'СКРИНЬКИ', x: 13, y: 43 },
  { page: 4, label: '30 СВІЧОК', x: 84, y: 44 },
  { page: 5, label: 'НАШІ ФОТО', x: 18, y: 63 },
  { page: 6, label: 'YAN-DERE ❤️', x: 81, y: 64 },
  { page: 7, label: 'ОНОВЛЕННЯ v.30', x: 27, y: 78 },
  { page: 8, label: 'МІЙ ЛИСТ', x: 72, y: 79 },
]

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: Math.random() * Math.PI * 2,
    radius: Math.random(),
    size: Math.random() * 1.8 + 0.35,
    speed: (Math.random() * 0.0008 + 0.00015) * (Math.random() > 0.5 ? 1 : -1),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    heart: i < Math.floor(count * 0.22),
    depth: Math.random(),
  }))
}

// Parametric heart shape
function heartPoint(t: number) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y:
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t),
  }
}

function Page9({ onNavigate, onBonusGame }: Page9Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showGalaxy, setShowGalaxy] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowGalaxy(true), 3500)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showGalaxy) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let animationId = 0
    let width = 0
    let height = 0
    let frame = 0

    const particles = makeParticles(1500)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      width = rect.width
      height = rect.height

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      frame++
      ctx.clearRect(0, 0, width, height)

      const cx = width * 0.5
      const cy = height * 0.53
      const diskRadius = Math.min(width * 0.95, height * 0.42)
      const heartScale = Math.min(width, height) * 0.008

      // Black space and distant stars
      ctx.fillStyle = '#020104'
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < 170; i++) {
        const x = ((i * 127.13) % 997) / 997 * width
        const y = ((i * 311.71) % 991) / 991 * height
        const twinkle = 0.2 + (Math.sin(frame * 0.035 + i) + 1) * 0.3

        ctx.globalAlpha = twinkle
        ctx.fillStyle = i % 5 === 0 ? '#ff789f' : '#ffffff'
        ctx.beginPath()
        ctx.arc(x, y, i % 9 === 0 ? 1.25 : 0.6, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1

      // Rotating particle galaxy disk
      for (const p of particles) {
        p.angle += p.speed

        const r = Math.sqrt(p.radius) * diskRadius
        const spiral = p.angle + r * 0.025
        const perspective = 0.25 + p.depth * 0.75

         const x = cx + Math.cos(spiral) * r * 1.35
         const y = cy + Math.sin(spiral) * r * 0.32 * perspective

        const centerGlow = Math.max(0, 1 - r / diskRadius)
        const twinkle = 0.45 + Math.abs(Math.sin(frame * 0.035 + p.angle)) * 0.55

        ctx.globalAlpha = twinkle
        ctx.fillStyle = p.color
        ctx.shadowBlur = p.size * 3
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(x, y, p.size * (0.7 + centerGlow), 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      // Bright central vortex
      const vortex = ctx.createRadialGradient(cx, cy, 1, cx, cy, diskRadius * 0.23)
      vortex.addColorStop(0, '#000000')
      vortex.addColorStop(0.22, '#080106')
      vortex.addColorStop(0.38, 'rgba(255, 15, 75, 0.8)')
      vortex.addColorStop(0.52, 'rgba(255, 35, 100, 0.16)')
      vortex.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = vortex
      ctx.beginPath()
      ctx.ellipse(cx, cy, diskRadius * 0.25, diskRadius * 0.09, 0, 0, Math.PI * 2)
      ctx.fill()

      // Heart made from sparkling particles
      const heartX = cx
      const heartY = cy - Math.min(height * 0.16, 75)
      const pulse = 1 + Math.sin(frame * 0.045) * 0.035
      const heartSize = heartScale * 1.6 * pulse

      for (let i = 0; i < 650; i++) {
        const t = (i / 650) * Math.PI * 2
        const point = heartPoint(t)
        const scatter = (Math.sin(i * 78.23) * 0.5 + Math.cos(i * 13.7) * 0.5) * 2.8
        const fill = (i % 4) / 4

        const x = heartX + point.x * heartSize * fill + (Math.random() - 0.5) * 1.7
        const y = heartY - point.y * heartSize * fill + scatter

        ctx.globalAlpha = 0.35 + Math.random() * 0.65
        ctx.fillStyle = COLORS[i % COLORS.length]
        ctx.shadowBlur = 5
        ctx.shadowColor = '#ff174f'
        ctx.beginPath()
        ctx.arc(x, y, Math.random() * 1.5 + 0.45, 0, Math.PI * 2)
        ctx.fill()
      }

      // Bright outline of the heart
      ctx.globalAlpha = 0.9
      ctx.strokeStyle = '#ff6b9b'
      ctx.lineWidth = 1.3
      ctx.shadowBlur = 13
      ctx.shadowColor = '#ff174f'
      ctx.beginPath()

      for (let i = 0; i <= 120; i++) {
        const point = heartPoint((i / 120) * Math.PI * 2)
        const x = heartX + point.x * heartSize
        const y = heartY - point.y * heartSize

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }

      ctx.closePath()
      ctx.stroke()

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      // Small bright center
      ctx.fillStyle = '#ffffff'
      ctx.shadowBlur = 15
      ctx.shadowColor = '#ff174f'
      ctx.beginPath()
      ctx.arc(cx, cy, 3 + Math.sin(frame * 0.08), 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      animationId = window.requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [showGalaxy])

  return (
    <section className={`page-nine ${showGalaxy ? 'galaxy-mode' : 'tunnel-mode'}`}>
      {!showGalaxy ? (
        <div className="final-tunnel">
          <div className="tunnel-particles" />
          <div className="tunnel-center">♥</div>
        </div>
      ) : (
        <div className="final-galaxy">
          <canvas
            ref={canvasRef}
            className="galaxy-canvas"
            aria-label="Анімована галактика із серцем"
          />

          <div className="galaxy-vignette" />

          <p className="galaxy-title">
            У кожному всесвіті я обрала б тебе ❤️
          </p>

          <nav className="galaxy-portals" aria-label="Портали до сторінок">
            {PAGE_PORTALS.map((portal) => (
              <button
                key={portal.page}
                className="galaxy-portal"
                style={{ left: `${portal.x}%`, top: `${portal.y}%` }}
                onClick={() => onNavigate(portal.page)}
              >
                {portal.label}
              </button>
            ))}

            <button
              className="galaxy-portal bonus-portal"
              style={{ left: '50%', top: '91%' }}
              onClick={onBonusGame}
            >
              ✦ БОНУСНА ГРА ✦
            </button>
          </nav>
        </div>
      )}
    </section>
  )
}

export default Page9