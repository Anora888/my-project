import Emoji from '../components/Emoji'

interface TopBarProps {
hp: number
love: number
}

function TopBar({ hp, love }: TopBarProps) {
return (
<div className="top-bar">
<div className="stats">
<span>
<Emoji symbol="🔋" /> HP: {hp === Infinity ? '∞' : hp + '%'}
</span>

    <span>
      <Emoji symbol="💝" /> Love: {love === Infinity ? '∞' : `${love}%`}
    </span>
  </div>

  <div className="window-buttons">
    <button onClick={() => window.electronAPI.minimize()}>
     <img src='/src/photostop/Line.png'/>
    </button>

    <button onClick={() => window.electronAPI.close()}>
      <img src='/src/photostop/x.png'/>
    </button>
  </div>
</div>

)
}

export default TopBar