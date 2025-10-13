import React, { useEffect, useState } from 'react'
import { create as createMaze, startMovingWalls, stopMovingWalls, isWallAt, getWallMeta, unlockWall, isExit, MazeView } from './Maze'
import Guard from './Guard'
import Puzzle from './Puzzle'
import UI from './UI'

export default function Game({ level, onExitToMenu, onComplete }){
  const [player, setPlayer] = useState({x:1,y:1})
  const [maze, setMaze] = useState(null)
  const [showPuzzle, setShowPuzzle] = useState(null)
  const [guardEnabled, setGuardEnabled] = useState(false)
  const [levelFinished, setLevelFinished] = useState(false)
  const [moveIntervalId, setMoveIntervalId] = useState(null)
  const [guardPos, setGuardPos] = useState(null)
  const [gameOver, setGameOver] = useState(false)

  useEffect(()=>{
    const m = createMaze(level)
    setMaze(m)
    setPlayer({x:1,y:1})
    setGuardEnabled(true) // Страж есть на всех уровнях
    setLevelFinished(false)
    setGameOver(false)
    const id = startMovingWalls(m)
    setMoveIntervalId(id)
    return ()=>{
      if(id) stopMovingWalls(id)
    }
  },[level])

  // Обработка нажатий клавиш
  useEffect(()=>{
    function handleKeyDown(e){
      if(gameOver || levelFinished) return
      
      switch(e.key){
        case 'ArrowUp': handleMove(0,-1); break
        case 'ArrowDown': handleMove(0,1); break
        case 'ArrowLeft': handleMove(-1,0); break
        case 'ArrowRight': handleMove(1,0); break
        default: return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return ()=> window.removeEventListener('keydown', handleKeyDown)
  }, [maze, player, gameOver, levelFinished])

  function handleMove(dx,dy){
    if(gameOver || levelFinished) return
    if(!maze) return
    const nx = player.x + dx
    const ny = player.y + dy
    if(isWallAt(maze,nx,ny)){
      const pw = getWallMeta(maze,nx,ny)
      if(pw && pw.locked){
        setShowPuzzle({type: pw.type, pos:{x:nx,y:ny}})
        return
      }
      return
    }
    const newPos = {x:nx,y:ny}
    setPlayer(newPos)
    
    // Проверка столкновения со стражем
    if(guardEnabled && guardPos && guardPos.x === nx && guardPos.y === ny){
      setGameOver(true)
      return
    }
    
    if(isExit(maze,nx,ny)){
      setLevelFinished(true)
      setTimeout(()=>{
        onComplete(level)
      },600)
    }
  }

  function onPuzzleResult(ok){
    if(!showPuzzle){ setShowPuzzle(null); return }
    const {x,y} = showPuzzle.pos
    setShowPuzzle(null)
    if(ok){
      setMaze(prev => {
        const copy = unlockWall(prev,x,y)
        return copy
      })
    }
  }

  function handleGuardPositionUpdate(pos){
    setGuardPos(pos)
    // Проверка столкновения при движении стража
    if(!gameOver && !levelFinished && pos.x === player.x && pos.y === player.y){
      setGameOver(true)
    }
  }

  function restartGame(){
    setGameOver(false)
    setPlayer({x:1,y:1})
  }

  return (
    <div className="game-root">
      <div className="canvas-panel">
        <div className="level-header">
          <h3>Уровень {level+1}</h3>
          <div className="controls-hint">Используй стрелки для движения</div>
          {level === 2 && (
            <div className="level-warning">Внимание! Страж научился проходить сквозь одну специальную стену!</div>
          )}
        </div>
        
        {maze && (
          <div className="hud">
            <div className="maze-wrap" style={{position:'relative'}}>
              <MazeView maze={maze} player={player} />
              {guardEnabled && <Guard maze={maze} player={player} level={level} onPositionUpdate={handleGuardPositionUpdate} />}
            </div>
          </div>
        )}
      </div>

      {showPuzzle && (
        <Puzzle spec={showPuzzle} onResult={onPuzzleResult} />
      )}

      {levelFinished && (
        <div className="level-finish">Уровень пройден!</div>
      )}

      {gameOver && (
        <div className="game-over-modal">
          <div className="game-over-card">
            <h3>Страж поймал тебя!</h3>
            <p>"Я же говорил - не выберешься!"</p>
            <div className="game-over-controls">
              <button onClick={restartGame}>Попробовать снова</button>
              <button onClick={onExitToMenu}>Выйти в меню</button>
            </div>
          </div>
        </div>
      )}

      <div className="bottom-controls">
        <button onClick={restartGame}>Заново</button>
        <button onClick={onExitToMenu}>Меню</button>
      </div>
    </div>
  )
}