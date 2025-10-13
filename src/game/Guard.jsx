import React, { useEffect, useState } from 'react'
import { canGuardPass } from './Maze'

// Простой алгоритм поиска пути (A* упрощенный)
function findPath(maze, start, target, level) {
  const queue = [[start]]
  const visited = new Set()
  visited.add(`${start.x},${start.y}`)
  
  const directions = [
    { dx: 0, dy: -1 }, // up
    { dx: 1, dy: 0 },  // right
    { dx: 0, dy: 1 },  // down
    { dx: -1, dy: 0 }  // left
  ]
  
  while (queue.length > 0) {
    const path = queue.shift()
    const current = path[path.length - 1]
    
    // Если достигли цели
    if (current.x === target.x && current.y === target.y) {
      return path
    }
    
    // Проверяем все направления
    for (const dir of directions) {
      const nx = current.x + dir.dx
      const ny = current.y + dir.dy
      
      if (canGuardPass(maze, nx, ny, level) && !visited.has(`${nx},${ny}`)) {
        visited.add(`${nx},${ny}`)
        const newPath = [...path, { x: nx, y: ny }]
        queue.push(newPath)
      }
    }
  }
  
  return [] // Путь не найден
}

// "Нейросеть" - простая оценка лучшего направления
function evaluateBestMove(maze, guardPos, playerPos, level) {
  const directions = [
    { dx: 0, dy: -1, score: 0 }, // up
    { dx: 1, dy: 0, score: 0 },  // right
    { dx: 0, dy: 1, score: 0 },  // down
    { dx: -1, dy: 0, score: 0 }  // left
  ]
  
  // Оцениваем каждое направление
  directions.forEach(dir => {
    const newX = guardPos.x + dir.dx
    const newY = guardPos.y + dir.dy
    
    if (canGuardPass(maze, newX, newY, level)) {
      // Базовый счёт - расстояние до игрока (чем меньше, тем лучше)
      const distance = Math.abs(newX - playerPos.x) + Math.abs(newY - playerPos.y)
      dir.score = -distance // Инвертируем, так как меньшее расстояние лучше
      
      // Бонус за движение прямо к игроку
      if ((playerPos.x > guardPos.x && dir.dx > 0) || 
          (playerPos.x < guardPos.x && dir.dx < 0) ||
          (playerPos.y > guardPos.y && dir.dy > 0) ||
          (playerPos.y < guardPos.y && dir.dy < 0)) {
        dir.score += 2
      }
      
      // Случайный элемент для непредсказуемости
      dir.score += Math.random()
    } else {
      dir.score = -1000 // Невозможный ход
    }
  })
  
  // Выбираем направление с наивысшим счётом
  const bestMove = directions.reduce((best, current) => 
    current.score > best.score ? current : best
  )
  
  return bestMove.score > -1000 ? bestMove : null
}

export default function Guard({ maze, player, level, onPositionUpdate }) {
  const [pos, setPos] = useState({ x: maze.width - 2, y: 1 })

  useEffect(() => {
    let mounted = true
    let lastPlayerPos = { ...player }

    const moveGuard = () => {
      if (!mounted) return

      setPos(currentPos => {
        let newPos
        
        // На уровнях 2 и 3 используем умный поиск пути в 80% случаев
        if (level >= 1 && Math.random() < 0.8) {
          const path = findPath(maze, currentPos, player, level)
          if (path.length > 1) {
            newPos = path[1] // Берём следующую позицию из пути
          } else {
            // Если путь не найден, используем "нейросеть"
            const bestMove = evaluateBestMove(maze, currentPos, player, level)
            newPos = bestMove ? {
              x: currentPos.x + bestMove.dx,
              y: currentPos.y + bestMove.dy
            } : currentPos
          }
        } else {
          // На уровне 1 или 20% случаев - "нейросеть"
          const bestMove = evaluateBestMove(maze, currentPos, player, level)
          newPos = bestMove ? {
            x: currentPos.x + bestMove.dx,
            y: currentPos.y + bestMove.dy
          } : currentPos
        }

        // Обновляем позицию игрока для следующего хода
        lastPlayerPos = { ...player }

        if (onPositionUpdate && newPos.x !== currentPos.x || newPos.y !== currentPos.y) {
          onPositionUpdate(newPos)
        }

        return newPos
      })
    }

    // Более быстрое движение стража
    const speeds = [1200, 1000, 800] // Уровень 1, 2, 3
    const interval = setInterval(moveGuard, speeds[level] || 1000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [maze, player, level])

  return (
    <div className="guard" style={{ position: 'absolute', left: pos.x * 28, top: pos.y * 28 }}>
      <div className="guard-sprite">🤖</div>
      <div className="taunt">
        {level === 2 ? "Я повсюду! Не уйти!" : 
         level === 1 ? "Я становлюсь умнее!" : 
         "Я найду тебя!"}
      </div>
    </div>
  )
}