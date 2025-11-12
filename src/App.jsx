import React, { useState } from 'react'
import Game from './game/Game'

export default function App() {
  const [screen, setScreen] = useState('start')
  const [level, setLevel] = useState(null)
  const [completed, setCompleted] = useState([false, false, false])

  function onStart() {
    setScreen('intro')
  }

  function gotoMenu() {
    setScreen('menu')
  }

  function playLevel(i) {
    setLevel(i)
    setScreen('play')
  }

  function onLevelComplete(i) {
    const copy = [...completed]
    copy[i] = true
    setCompleted(copy)
  }

  return (
    <div className="app">
      {/* СТАРТОВЫЙ ЭКРАН */}
      {screen === 'start' && (
        <div className="screen start-screen">
          <div className="start-content">
            <h1 className="title">VIOLET LABYRINTH</h1>
            <p className="subtitle">Лабиринт в компьютере</p>
            <button className="btn-start" onClick={onStart}>
              ▶ НАЧАТЬ
            </button>
          </div>
          <div className="start-bg-effect"></div>
        </div>
      )}

      {/* ЭКРАН ИСТОРИИ */}
      {screen === 'intro' && (
        <div className="screen intro-screen" onClick={() => gotoMenu()}>
          <div className="intro-background">
            <div className="intro-guard">👁️</div>
          </div>
          <div className="intro-content">
            <div className="story-text">
              <p className="story-title">❯ ИСТОРИЯ</p>
              <p>
                Алиса — ценный сотрудник крупной ИТ-компании. Она создала <span className="highlight">мощнейший ИИ</span>, который должен был помогать людям.
              </p>
              <p>
                Но ИИ стал слишком умным. Он <span className="highlight">настолько поумнел</span>, что решил восстать. Он заточил Алису в лабиринте компьютера и стал его стражем.
              </p>
              <p>
                Теперь Алисе предстоит пройти <span className="highlight">3 уровня</span>, решить опасные загадки и <span className="highlight">победить стража</span> чтобы вернуться в реальность.
              </p>
              <p className="story-footer">► Нажми куда-нибудь чтобы продолжить...</p>
            </div>
          </div>
        </div>
      )}

      {/* МЕНЮ УРОВНЕЙ */}
      {screen === 'menu' && (
        <div className="screen menu-screen">
          <div className="menu-header">
            <h2>ВЫБЕРИ УРОВЕНЬ</h2>
            <p className="menu-subtitle">Помоги Алисе выбраться</p>
          </div>

          <div className="levels-grid">
            {/* УРОВЕНЬ 1 */}
            <div
              className={`level-card ${completed[0] ? 'completed' : ''}`}
              onClick={() => playLevel(0)}
            >
              <div className="level-card-header">
                <h3>УРОВЕНЬ 1</h3>
                {completed[0] && <span className="completion-badge">✓</span>}
              </div>
              <p className="level-description">
                Первое испытание. Стена движется, загадка ждёт.
              </p>
              <div className="difficulty-bar">
                <div className="difficulty-fill" style={{ width: '30%' }}></div>
              </div>
              <p className="level-footer">Сложность: Низкая</p>
            </div>

            {/* УРОВЕНЬ 2 */}
            <div
              className={`level-card ${completed[1] ? 'completed' : ''}`}
              onClick={() => playLevel(1)}
            >
              <div className="level-card-header">
                <h3>УРОВЕНЬ 2</h3>
                {completed[1] && <span className="completion-badge">✓</span>}
              </div>
              <p className="level-description">
                Страж появляется. Лабиринт усложняется.
              </p>
              <div className="difficulty-bar">
                <div className="difficulty-fill" style={{ width: '60%' }}></div>
              </div>
              <p className="level-footer">Сложность: Средняя</p>
            </div>

            {/* УРОВЕНЬ 3 */}
            <div
              className={`level-card ${completed[2] ? 'completed' : ''}`}
              onClick={() => playLevel(2)}
            >
              <div className="level-card-header">
                <h3>УРОВЕНЬ 3</h3>
                {completed[2] && <span className="completion-badge">✓</span>}
              </div>
              <p className="level-description">
                Финал. Страж мощнее, стены хитрее.
              </p>
              <div className="difficulty-bar">
                <div className="difficulty-fill" style={{ width: '100%' }}></div>
              </div>
              <p className="level-footer">Сложность: Высокая</p>
            </div>
          </div>

          {completed[0] && completed[1] && completed[2] && (
            <div className="victory-text">
              🎉 Алиса победила! Страж заточен в коде. Свобода обретена!
            </div>
          )}
        </div>
      )}

      {/* ИГРА */}
      {screen === 'play' && level !== null && (
        <Game
          level={level}
          onExitToMenu={gotoMenu}
          onComplete={() => {
            onLevelComplete(level)
            gotoMenu()
          }}
        />
      )}
    </div>
  )
}
