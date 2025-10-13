const DEFAULT = { width: 15, height: 15 }

function emptyGrid(w, h) {
  return Array.from({ length: h }, () => Array.from({ length: w }, () => 0))
}

function create(level) {
  const grid = emptyGrid(DEFAULT.width, DEFAULT.height)
  const meta = { walls: {} }
  
  // Создаём границы
  for (let x = 0; x < DEFAULT.width; x++) {
    grid[0][x] = 1
    grid[DEFAULT.height - 1][x] = 1
  }
  for (let y = 0; y < DEFAULT.height; y++) {
    grid[y][0] = 1
    grid[y][DEFAULT.width - 1] = 1
  }

  // Уровень 1 - простой лабиринт с 1 обязательной головоломкой
  if (level === 0) {
    // Создаем коридор к выходу с одной обязательной головоломкой
    for (let y = 1; y <= 7; y++) {
      grid[y][3] = 1  // Левая стена
      grid[y][11] = 1 // Правая стена
    }
    
    // Горизонтальные перегородки
    for (let x = 4; x <= 10; x++) {
      grid[4][x] = 1
      grid[8][x] = 1
    }
    
    // Обязательная головоломка - единственный путь вперед
    grid[6][7] = 1
    addLockedWall(meta, 7, 6, 'prog')
    
    // Открываем путь к выходу после головоломки
    grid[6][8] = 0
    grid[7][8] = 0
    
    // Выход
    grid[13][13] = 0
    meta.exit = { x: 13, y: 13 }

    return { 
      grid, 
      width: DEFAULT.width, 
      height: DEFAULT.height, 
      meta, 
      movingWalls: [{x: 5, y: 2}, {x: 9, y: 5}] 
    }
  }

  // Уровень 2 - 2 обязательные головоломки
  if (level === 1) {
    // Основные стены
    const walls = [
      // Вертикальные
      {x: 2, y1: 1, y2: 8}, {x: 5, y1: 3, y2: 12}, {x: 8, y1: 1, y2: 6}, 
      {x: 11, y1: 4, y2: 13},
      // Горизонтальные
      {y: 3, x1: 3, x2: 4}, {y: 6, x1: 6, x2: 7}, {y: 9, x1: 9, x2: 10},
      {y: 12, x1: 3, x2: 12}
    ]
    
    walls.forEach(wall => {
      if (wall.x) {
        for (let y = wall.y1; y <= wall.y2; y++) grid[y][wall.x] = 1
      } else {
        for (let x = wall.x1; x <= wall.x2; x++) grid[wall.y][x] = 1
      }
    })

    // Первая обязательная головоломка
    grid[4][4] = 1
    addLockedWall(meta, 4, 4, 'prog')
    
    // Вторая обязательная головоломка
    grid[10][9] = 1
    addLockedWall(meta, 9, 10, 'logic')

    // Выход
    grid[13][13] = 0
    meta.exit = { x: 13, y: 13 }

    return { 
      grid, 
      width: DEFAULT.width, 
      height: DEFAULT.height, 
      meta, 
      movingWalls: [{x: 7, y: 4}, {x: 10, y: 7}, {x: 6, y: 11}] 
    }
  }

  // Уровень 3 - сложный лабиринт с 3 головоломками
  if (level === 2) {
    // Сложная структура
    const walls = [
      // Вертикальные
      {x: 3, y1: 2, y2: 10}, {x: 6, y1: 1, y2: 8}, {x: 9, y1: 3, y2: 12}, 
      {x: 12, y1: 5, y2: 13},
      // Горизонтальные
      {y: 2, x1: 4, x2: 8}, {y: 5, x1: 1, x2: 5}, {y: 8, x1: 7, x2: 11}, 
      {y: 11, x1: 4, x2: 10}
    ]
    
    walls.forEach(wall => {
      if (wall.x) {
        for (let y = wall.y1; y <= wall.y2; y++) grid[y][wall.x] = 1
      } else {
        for (let x = wall.x1; x <= wall.x2; x++) grid[wall.y][x] = 1
      }
    })

    // 3 обязательные головоломки на единственном пути
    grid[3][5] = 1
    addLockedWall(meta, 5, 3, 'prog')
    
    grid[7][8] = 1
    addLockedWall(meta, 8, 7, 'logic')
    
    grid[10][10] = 1
    addLockedWall(meta, 10, 10, 'prog')

    // Выход
    grid[13][13] = 0
    meta.exit = { x: 13, y: 13 }

    return { 
      grid, 
      width: DEFAULT.width, 
      height: DEFAULT.height, 
      meta, 
      movingWalls: [{x: 4, y: 6}, {x: 8, y: 4}, {x: 11, y: 9}] 
    }
  }

  return { grid, width: DEFAULT.width, height: DEFAULT.height, meta, movingWalls: [] }
}

function addLockedWall(meta, x, y, type) {
  meta.walls[`w_${x}_${y}`] = { x, y, locked: true, type }
}

function isWallAt(maze, x, y) {
  if (!maze) return true
  if (x < 0 || y < 0 || x >= maze.width || y >= maze.height) return true
  return maze.grid[y][x] === 1
}

function getWallMeta(maze, x, y) {
  return maze.meta && maze.meta.walls && maze.meta.walls[`w_${x}_${y}`]
}

function unlockWall(maze, x, y) {
  const key = `w_${x}_${y}`
  if (maze.meta && maze.meta.walls && maze.meta.walls[key]) {
    maze.meta.walls[key].locked = false
    maze.grid[y][x] = 0
  }
  return { ...maze }
}

function isExit(maze, x, y) {
  return maze.meta && maze.meta.exit && maze.meta.exit.x === x && maze.meta.exit.y === y
}

function canGuardPass(maze, x, y, level) {
  return !isWallAt(maze, x, y)
}

function startMovingWalls(maze) {
  if (!maze || !maze.movingWalls || maze.movingWalls.length === 0) return null
  const id = setInterval(() => {
    for (const m of maze.movingWalls) {
      const x = m.x, y = m.y
      maze.grid[y][x] = maze.grid[y][x] ? 0 : 1
    }
  }, 3000)
  return id
}

function stopMovingWalls(id) { 
  if (id) clearInterval(id) 
}

import React from 'react'
export function MazeView({ maze, player }) {
  const cellSize = 28
  const cells = []
  
  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      const isWall = maze.grid[y][x] === 1
      const meta = getWallMeta(maze, x, y)
      const locked = meta && meta.locked
      const isExit = maze.meta.exit && maze.meta.exit.x === x && maze.meta.exit.y === y
      
      let cls = 'cell'
      if (isExit) {
        cls += ' exit'
      } else if (isWall) {
        cls += locked ? ' wall locked' : ' wall'
      }
      
      const key = `${x}_${y}`
      cells.push(
        <div key={key} className={cls} style={{
          width: cellSize, 
          height: cellSize, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          {player.x === x && player.y === y ? <span className="player">А</span> : null}
          {isExit && !(player.x === x && player.y === y) ? <span className="exit-icon">🚪</span> : null}
        </div>
      )
    }
  }
  
  return (
    <div className="maze-grid" style={{ width: maze.width * cellSize }}>
      {cells}
    </div>
  )
}

export { create, startMovingWalls, stopMovingWalls, isWallAt, getWallMeta, unlockWall, isExit, canGuardPass }