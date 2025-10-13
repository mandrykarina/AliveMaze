import React, { useEffect } from 'react'

export default function UI({ onMove, onMenu }) {
  useEffect(() => {
    function onKey(e) {
      // Проверяем, что это стрелка и предотвращаем прокрутку страницы
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
      }
      
      if (e.key === 'ArrowUp') onMove(0, -1)
      if (e.key === 'ArrowDown') onMove(0, 1)
      if (e.key === 'ArrowLeft') onMove(-1, 0)
      if (e.key === 'ArrowRight') onMove(1, 0)
    }
    
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onMove])

  return (
    <div className="ui-controls">
      <div className="controls-row">
        <button onClick={() => onMove(0, -1)}>↑</button>
      </div>
      <div className="controls-row">
        <button onClick={() => onMove(-1, 0)}>←</button>
        <button onClick={() => onMove(1, 0)}>→</button>
      </div>
      <div className="controls-row">
        <button onClick={() => onMove(0, 1)}>↓</button>
      </div>
      <button className="menu-small" onClick={onMenu}>Меню</button>
    </div>
  )
}