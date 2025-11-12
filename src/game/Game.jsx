import React, { useEffect, useState } from 'react'
import { create as createMaze, startMovingWalls, stopMovingWalls, isWallAt, getWallMeta, unlockWall, isExit, MazeView } from './Maze'
import Guard from './Guard'
import Puzzle from './Puzzle'
import UI from './UI'

export default function Game({ level, onExitToMenu, onComplete }) {
  const [player, setPlayer] = useState({ x: 1, y: 1 })
  const [maze, setMaze] = useState(null)
  const [showPuzzle, setShowPuzzle] = useState(null)
  const [guardEnabled, setGuardEnabled] = useState(false)
  const [levelFinished, setLevelFinished] = useState(false)
  const [moveIntervalId, setMoveIntervalId] = useState(null)
  const [guardPos, setGuardPos] = useState(null)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const m = createMaze(level)
    setMaze(m)
    setPlayer({ x: 1, y: 1 })
    setGuardEnabled(level >= 1)
    setLevelFinished(false)
    setGameOver(false)
    setShowPuzzle(null)
    setGuardPos(null)
    
    const id = startMovingWalls(m)
    setMoveIntervalId(id)
    
    return () => {
      if (id) stopMovingWalls(id)
    }
  }, [level])

  const movePlayer = (dx, dy) => {
    if (!maze || levelFinished || gameOver) return

    const newX = player.x + dx
    const newY = player.y + dy

    // Проверяем, не выходим ли за границы
    if (isWallAt(maze, newX, newY)) {
      // Проверяем, есть ли головоломка на этой стене
      const wallMeta = getWallMeta(maze, newX, newY)
      if (wallMeta && wallMeta.locked) {
        // Показываем головоломку
        setShowPuzzle(wallMeta)
      }
      return
    }

    // Проверяем столкновение со стражем
    if (guardPos && guardPos.x === newX && guardPos.y === newY) {
      setGameOver(true)
      return
    }

    // Двигаем игрока
    setPlayer({ x: newX, y: newY })

    // Проверяем, достигли ли выхода
    if (isExit(maze, newX, newY)) {
      setLevelFinished(true)
      setTimeout(() => {
        onComplete(level)
      }, 800)
      return
    }
  }

  const onGuardMove = (newPos) => {
    setGuardPos(newPos)
    if (newPos && newPos.x === player.x && newPos.y === player.y) {
      setGameOver(true)
    }
  }

  const onPuzzleSolved = () => {
    if (showPuzzle && maze) {
      // Убираем загораженость стены
      const solved = unlockWall(maze, showPuzzle.x, showPuzzle.y)
      setMaze(solved)
      setShowPuzzle(null)
      
      // После решения головоломки, игрок может пройти на эту стену
      const newX = player.x + (showPuzzle.x - player.x === 1 ? 1 : showPuzzle.x - player.x === -1 ? -1 : 0)
      const newY = player.y + (showPuzzle.y - player.y === 1 ? 1 : showPuzzle.y - player.y === -1 ? -1 : 0)
      
      if (!isWallAt(solved, newX, newY)) {
        setPlayer({ x: newX, y: newY })
      }
    }
  }

  if (!maze) return <div className="loading">Загрузка уровня...</div>

  return (
    <div className="game-container">
      {/* Текст стража уровень 1 */}
      {level === 0 && !gameOver && !levelFinished && (
        <div className="guard-message level-1">
          Теперь ты заключена здесь со мной и ты не выберешься...
        </div>
      )}

      {/* Текст стража уровень 3 */}
      {level === 2 && guardEnabled && !gameOver && !levelFinished && (
        <div className="guard-message level-3">
          Хаха, смотри! Я всё умнею, ведь это ты меня создала! 🔥
        </div>
      )}

      <div className="game-view">
        <MazeView maze={maze} player={player} />
        {guardEnabled && (
          <Guard maze={maze} player={player} level={level} onPositionUpdate={onGuardMove} />
        )}
      </div>

      <UI onMove={movePlayer} onMenu={onExitToMenu} />

      {showPuzzle && (
        <Puzzle
          wallMeta={showPuzzle}
          onSolved={onPuzzleSolved}
          level={level}
        />
      )}

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>💀 Страж тебя поймал!</h2>
            <div className="game-controls">
              <button className="btn-primary" onClick={() => window.location.reload()}>Заново</button>
              <button className="btn-secondary" onClick={onExitToMenu}>Меню</button>
            </div>
          </div>
        </div>
      )}

      {levelFinished && (
        <div className="level-finish">
          ✓ Уровень пройден!
        </div>
      )}

      <div className="bottom-controls">
        <button className="btn-icon" onClick={onExitToMenu} title="Меню">📋</button>
        <button className="btn-icon" onClick={() => window.location.reload()} title="Заново">🔄</button>
      </div>
    </div>
  )
}
