import React, { useEffect, useState } from 'react'
import { canGuardPass } from './Maze'

// Алгоритм поиска пути (BFS)
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

    if (current.x === target.x && current.y === target.y) {
      return path
    }

    // Перемешиваем направления для случайности
    const shuffledDirections = [...directions].sort(() => Math.random() - 0.5)

    for (const dir of shuffledDirections) {
      const nx = current.x + dir.dx
      const ny = current.y + dir.dy

      if (canGuardPass(maze, nx, ny, level) && !visited.has(`${nx},${ny}`)) {
        visited.add(`${nx},${ny}`)
        const newPath = [...path, { x: nx, y: ny }]
        queue.push(newPath)
      }
    }
  }

  return []
}

export default function Guard({ maze, player, level, onPositionUpdate }) {
  const [pos, setPos] = useState({ x: maze.width - 2, y: 1 })

  useEffect(() => {
    let mounted = true

    const moveGuard = () => {
      if (!mounted) return

      setPos(currentPos => {
        // Используем поиск пути с рандомным выбором направлений
        const path = findPath(maze, currentPos, player, level)
        
        let newPos = currentPos
        if (path.length > 1) {
          newPos = path[1] // Берём следующую позицию из пути
        } else {
          // Если путь не найден, двигаемся случайно по доступным клеткам
          const directions = [
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }
          ].sort(() => Math.random() - 0.5)

          for (const dir of directions) {
            const nx = currentPos.x + dir.dx
            const ny = currentPos.y + dir.dy
            if (canGuardPass(maze, nx, ny, level)) {
              newPos = { x: nx, y: ny }
              break
            }
          }
        }

        if (onPositionUpdate && (newPos.x !== currentPos.x || newPos.y !== currentPos.y)) {
          onPositionUpdate(newPos)
        }

        return newPos
      })
    }

    const speeds = [1500, 1200, 900] // Скорости для уровней 1, 2, 3
    const interval = setInterval(moveGuard, speeds[level] || 1200)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [maze, player, level])

  return (
    <div 
      className="guard" 
      style={{ 
        position: 'absolute',
        left: `${pos.x * 30 + 14}px`,
        top: `${pos.y * 30 + 14}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <span className="guard-sprite">👁️</span>
    </div>
  )
}
