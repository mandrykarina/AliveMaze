const DEFAULT = { width: 15, height: 15 }

function emptyGrid(w, h) {
  return Array.from({ length: h }, () => Array.from({ length: w }, () => 0))
}

function create(level) {
  const grid = emptyGrid(DEFAULT.width, DEFAULT.height)
  const meta = { walls: {}, guardWall: null }

  // Создаём границы
  for (let x = 0; x < DEFAULT.width; x++) {
    grid[0][x] = 1
    grid[DEFAULT.height - 1][x] = 1
  }
  for (let y = 0; y < DEFAULT.height; y++) {
    grid[y][0] = 1
    grid[y][DEFAULT.width - 1] = 1
  }

  // УРОВЕНЬ 1 - ПРОСТОЙ ЛАБИРИНТ С ОБЯЗАТЕЛЬНОЙ ГОЛОВОЛОМКОЙ
  if (level === 0) {
    // Создаём лабиринт где головоломка БЛОКИРУЕТ ЕДИНСТВЕННЫЙ ПУТЬ
    
    // Входная коридор (слева вверху)
    for (let y = 2; y <= 5; y++) {
      grid[y][3] = 0
    }

    // Вертикальные стены - создают секции
    for (let y = 1; y <= 13; y++) {
      
      grid[y][5] = 1   // Левая стена секции 1
      grid[y][10] = 1  // Левая стена секции 2
    }
    grid[2][5] = 0
    grid[4][10] = 0
    // ГОЛОВОЛОМКА - единственный проход между секциями
    
    addLockedWall(meta, 10, 11, 'prog')

    // Горизонтальные стены - усложняют путь
    for (let x = 1; x <= 4; x++) {
      if (grid[4][3]){continue}
      grid[4][x] = 1   // Перегородка 1
      
    }
    for (let x = 6; x <= 9; x++) {
      grid[7][x] = 1   // Перегородка 2
    }
    for (let x = 11; x <= 14; x++) {
      grid[10][x] = 1  // Перегородка 3
    }
    grid[10][13] = 0

    // ГОЛОВОЛОМКА - единственный проход между секциями
    grid[7][7] = 1
    addLockedWall(meta, 7, 7, 'prog')


    // Проход вниз к выходу
    for (let y = 8; y <= 12; y++) {
      grid[y][7] = 0
    }

    // Выход
    grid[13][7] = 0
    meta.exit = { x: 7, y: 13 }

    return { 
      grid, 
      width: DEFAULT.width, 
      height: DEFAULT.height, 
      meta, 
      movingWalls: [{x: 3, y: 6}, {x: 11, y: 4}, {x: 5, y: 11}] 
    }
  }

  // УРОВЕНЬ 2 - СРЕДНЕЙ СЛОЖНОСТИ С ГОЛОВОЛОМКОЙ И СТРАЖЕМ
  if (level === 1) {
    // Сложный лабиринт с ОДНОЙ КРИТИЧЕСКОЙ головоломкой
    
    // Основные вертикальные стены
    for (let y = 1; y <= 13; y++) {
      grid[y][4] = 1
      grid[y][7] = 1
      grid[y][11] = 1
    }
    grid[2][4] = 0
    grid[4][4] = 0
    grid[10][4] = 0
    grid[3][7] = 0
    grid[5][11] = 1
    

    // Горизонтальные стены
    for (let x = 1; x <= 3; x++) {
      grid[3][x] = 1
      grid[9][x] = 1
    }
    for (let x = 5; x <= 6; x++) {
      grid[5][x] = 1
      grid[11][x] = 1
    }
    for (let x = 8; x <= 10; x++) {
      grid[6][x] = 1
    }
    for (let x = 12; x <= 14; x++) {
      grid[8][x] = 1
    }
    grid[6][10] = 0
    grid[9][1] = 0
    grid[10][2] = 1
    grid[11][2] = 1
    grid[12][2] = 1
  

    

    // Путь после головоломки
    for (let y = 9; y <= 12; y++) {
      grid[y][6] = 0
    }
    // ГОЛОВОЛОМКА - блокирует критический проход
    grid[11][6] = 1
    addLockedWall(meta, 6, 11, 'prog')

    addLockedWall(meta, 10, 4, 'prog')
    addLockedWall(meta, 7, 13, 'prog')

    // Выход
    grid[13][6] = 0
    meta.exit = { x: 6, y: 13 }

    return { 
      grid, 
      width: DEFAULT.width, 
      height: DEFAULT.height, 
      meta, 
      movingWalls: [{x: 2, y: 7}, {x: 9, y: 10}, {x: 11, y: 5}, {x: 12, y: 8}, {x: 11, y: 12} ] 
    }
  }

  // УРОВЕНЬ 3 - СЛОЖНЫЙ ЛАБИРИНТ С ГОЛОВОЛОМКОЙ, СТРАЖЕМ И СПЕЦИАЛЬНОЙ СТЕНОЙ
  if (level === 2) {
    // Очень сложный лабиринт
    
    // Основные вертикальные стены
    for (let y = 1; y <= 13; y++) {
      grid[y][3] = 1
      grid[y][6] = 1
      grid[y][9] = 1
      grid[y][12] = 1
    }

    // Горизонтальные перегородки
    for (let x = 1; x <= 2; x++) {
      grid[2][x] = 1
      grid[7][x] = 1
      grid[11][x] = 1
    }
    for (let x = 4; x <= 5; x++) {
      grid[3][x] = 1
      grid[10][x] = 1
    }
    for (let x = 7; x <= 8; x++) {
      grid[5][x] = 1
      grid[12][x] = 1
    }
    for (let x = 10; x <= 11; x++) {
      grid[8][x] = 1
    }
    for (let x = 13; x <= 14; x++) {
      grid[6][x] = 1
    }

    // ГОЛОВОЛОМКА - на критическом пути
    addLockedWall(meta, 9, 13, 'logic')
    addLockedWall(meta, 9, 8, 'logic')

    // Проход после головоломки
    for (let y = 10; y <= 12; y++) {
      grid[y][8] = 0
    }

    // СПЕЦИАЛЬНАЯ СТЕНА только для стража (уровень 3)
    
   
    meta.guardWall = { x: 6, y: 2 }

    grid[1][3] = 0
    grid[2][1] = 0
    grid[2][4] = 1
    grid[3][2] = 1
    grid[5][1] = 1
    grid[5][2] = 1
    grid[4][3] = 0
    grid[6][3] = 0
    grid[8][3] = 0
    grid[13][3] = 0
    grid[11][1] = 0
    grid[7][1] = 0
    grid[4][6] = 0
    grid[9][6] = 0
    grid[2][12] = 0
    grid[3][12] = 0
    grid[7][12] = 0
    grid[12][12] = 0
    grid[8][10] = 0
    grid[9][2] = 1
    grid[10][2] = 1
    grid[12][2] = 1
    grid[5][4] = 1
    grid[7][4] = 1
    grid[7][5] = 1
    grid[11][4] = 1
    grid[12][4] = 1
    grid[10][7] = 1
    grid[9][8] = 1
    grid[9][10] = 1
    grid[10][10] = 1
    grid[11][10] = 1
    grid[12][10] = 1
    grid[9][11] = 1
    grid[10][11] = 1
    grid[4][9] = 0

    // Выход
    grid[13][8] = 0
    meta.exit = { x: 8, y: 13 }

    return { 
      grid, 
      width: DEFAULT.width, 
      height: DEFAULT.height, 
      meta, 
      movingWalls: [{x: 8, y: 5}, {x: 5, y: 10}] 
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
  if (!maze) return false
  if (x < 0 || y < 0 || x >= maze.width || y >= maze.height) return false
  
  const isWall = maze.grid[y][x] === 1
  
  // На уровне 3 страж может пройти через специальную стену
  if (level === 2 && maze.meta.guardWall) {
    const gw = maze.meta.guardWall
    if (gw.x === x && gw.y === y) {
      return true
    }
  }
  
  return !isWall
}

function startMovingWalls(maze) {
  if (!maze || !maze.movingWalls || maze.movingWalls.length === 0) return null
  
  const id = setInterval(() => {
    for (const m of maze.movingWalls) {
      const x = m.x, y = m.y
      maze.grid[y][x] = maze.grid[y][x] ? 0 : 1
    }
  }, 4000)
  
  return id
}

function stopMovingWalls(id) {
  if (id) clearInterval(id)
}

import React from 'react'

export function MazeView({ maze, player }) {
  const cellSize = 30
  const cells = []

  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      const isWall = maze.grid[y][x] === 1
      const meta = getWallMeta(maze, x, y)
      const locked = meta && meta.locked
      const isExitCell = maze.meta.exit && maze.meta.exit.x === x && maze.meta.exit.y === y
      const isGuardWall = maze.meta.guardWall && maze.meta.guardWall.x === x && maze.meta.guardWall.y === y

      let cls = 'cell'
      if (isExitCell) {
        cls += ' exit'
      } else if (isWall) {
        if (locked) {
          cls += ' wall locked'
        } else if (isGuardWall) {
          cls += ' wall guard-wall'
        } else {
          cls += ' wall'
        }
      }

      const key = `${x}_${y}`
      cells.push(
        <div 
          key={key} 
          className={cls} 
        >
          {player.x === x && player.y === y && <span className="player">👧</span>}
          {isExitCell && !isWall && <span className="exit-icon">🚪</span>}
          {isGuardWall && <span className="guard-wall-icon">⚡</span>}
        </div>
      )
    }
  }

  return <div className="maze-grid">{cells}</div>
}

export { create, startMovingWalls, stopMovingWalls, isWallAt, getWallMeta, unlockWall, isExit, canGuardPass }
