import React, { useState } from 'react'
import Game from './game/Game'
import guardSvg from './assets/guard.svg'

export default function App(){
  const [screen, setScreen] = useState('start')
  const [level, setLevel] = useState(null)
  const [completed, setCompleted] = useState([false,false,false])

  function onStart(){ setScreen('intro') }
  function gotoMenu(){ setScreen('menu') }
  function playLevel(i){ setLevel(i); setScreen('play') }

  function onLevelComplete(i){
    const copy = [...completed]
    copy[i] = true
    setCompleted(copy)
  }

  return (
    <div className="app-root">
      {screen==='start' && (
        <div className="start-screen">
          <h1>Violet Labyrinth</h1>
          <button className="big-btn" onClick={onStart}>СТАРТ</button>
        </div>
      )}

      {screen==='intro' && (
        <div className="intro-screen" onClick={gotoMenu}>
          <div className="intro-card">
            <img src={guardSvg} alt="strazh" className="guard-hero" />
            <h2>Алиса — талантливый инженер</h2>
            <p>Алиса создала мощнейший ИИ. Он стал слишком умным и заточил её в лабиринте компьютера. Он стал стражем этого мира. Ты — Алиса. Тебе придётся пройти 3 уровня, распутать загадки и победить стража.</p>
            <p className="hint">Нажми куда угодно, чтобы продолжить →</p>
          </div>
        </div>
      )}

      {screen==='menu' && (
        <div className="menu-screen">
          <h2>Выбери уровень</h2>
          <div className="levels">
            {[0,1,2].map(i=> (
              <button key={i}
                className={`level-btn ${completed[i]? 'done':''}`}
                onClick={()=>playLevel(i)}>
                Уровень {i+1}
              </button>
            ))}
          </div>
          {completed.every(Boolean) && (
            <div className="victory-banner">Алиса победила стража и вернула его в ноут.</div>
          )}
        </div>
      )}

      {screen==='play' && (
        <Game level={level} onExitToMenu={()=>setScreen('menu')} onComplete={(i)=>{onLevelComplete(i); setScreen('menu')}} />
      )}
    </div>
  )
}