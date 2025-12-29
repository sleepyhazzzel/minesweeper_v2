import { Cell } from './Cell'

/**
 * Board 類 - 管理遊戲棋盤
 */
export class Board {
  private _rows: number
  private _cols: number
  private _bombsCount: number
  private _cells: Cell[][]
  private _bombPositions: Set<string>

  constructor(rows: number, cols: number, bombsCount: number) {
    this._rows = rows
    this._cols = cols
    this._bombsCount = bombsCount
    this._cells = []
    this._bombPositions = new Set()
    this.initializeCells()
  }

  get rows(): number {
    return this._rows
  }

  get cols(): number {
    return this._cols
  }

  get bombsCount(): number {
    return this._bombsCount
  }

  get cells(): Cell[] {
    // 將二維陣列展平為一維陣列用於顯示
    return this._cells.flat()
  }

  get totalCells(): number {
    return this._rows * this._cols
  }

  /**
   * 初始化所有格子
   */
  private initializeCells(): void {
    this._cells = []
    for (let i = 0; i < this._rows; i++) {
      this._cells[i] = []
      for (let j = 0; j < this._cols; j++) {
        this._cells[i][j] = new Cell(i, j)
      }
    }
  }

  /**
   * 生成炸彈
   * @param row 玩家第一次點擊的行
   * @param col 玩家第一次點擊的列
   */
  generateBombs(click_row: number, click_col: number): void {
    this._bombPositions.clear()
    
    // 隨機生成炸彈位置
    while (this._bombPositions.size < this._bombsCount) {
      const row = Math.floor(Math.random() * this._rows)
      const col = Math.floor(Math.random() * this._cols)
      if (row === click_row && col === click_col) continue
      const key = `${row},${col}`
      this._bombPositions.add(key)
    }

    // 設置炸彈
    this._bombPositions.forEach(key => {
      const [row, col] = key.split(',').map(Number)
      this._cells[row][col].setBomb()
    })

    // 計算每個格子周圍的炸彈數
    this.calculateAdjacentBombs()
  }

  /**
   * 計算所有格子周圍的炸彈數
   */
  private calculateAdjacentBombs(): void {
    for (let i = 0; i < this._rows; i++) {
      for (let j = 0; j < this._cols; j++) {
        const cell = this._cells[i][j]
        if (!cell.isBomb) {
          const count = this.countAdjacentBombs(i, j)
          cell.setAdjacentBombs(count)
        }
      }
    }
  }

  /**
   * 計算指定位置周圍的炸彈數
   */
  private countAdjacentBombs(row: number, col: number): number {
    let count = 0
    
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        
        const newRow = row + i
        const newCol = col + j
        
        if (this.isValidPosition(newRow, newCol)) {
          const cell = this.getCell(newRow, newCol)
          if (cell?.isBomb) {
            count++
          }
        }
      }
    }
    
    return count
  }

  /**
   * 檢查位置是否有效
   */
  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this._rows && col >= 0 && col < this._cols
  }

  /**
   * 獲取指定位置的格子
   */
  getCell(row: number, col: number): Cell | null {
    if (!this.isValidPosition(row, col)) {
      return null
    }
    return this._cells[row][col]
  }

  /**
   * 打開格子（遞迴展開）
   */
  revealCell(row: number, col: number): Cell[] {
    const revealedCells: Cell[] = []
    this.revealCellRecursive(row, col, revealedCells)
    return revealedCells
  }

  /**
   * 遞迴打開格子
   */
  private revealCellRecursive(row: number, col: number, revealedCells: Cell[]): void {
    if (!this.isValidPosition(row, col)) {
      return
    }

    const cell = this.getCell(row, col)
    if (!cell || cell.isRevealed || cell.isFlagged) {
      return
    }

    const wasRevealed = cell.reveal()
    if (wasRevealed) {
      revealedCells.push(cell)
    }

    // 如果周圍沒有炸彈，遞迴打開周圍的格子
    if (cell.adjacentBombs === 0 && !cell.isBomb) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue
          this.revealCellRecursive(row + i, col + j, revealedCells)
        }
      }
    }
  }

  /**
   * 切換旗子
   */
  toggleFlag(row: number, col: number): boolean {
    const cell = this.getCell(row, col)
    return cell ? cell.toggleFlag() : false
  }

  /**
   * 獲取剩餘旗子數
   */
  getRemainingFlags(): number {
    let flaggedCount = 0
    for (let i = 0; i < this._rows; i++) {
      for (let j = 0; j < this._cols; j++) {
        if (this._cells[i][j].isFlagged) {
          flaggedCount++
        }
      }
    }
    return this._bombsCount - flaggedCount
  }

  /**
   * 檢查是否勝利
   */
  checkVictory(): boolean {
    // 方法1：所有炸彈都被正確標記
    const allBombsFlagged = Array.from(this._bombPositions).every(key => {
      const [row, col] = key.split(',').map(Number)
      return this._cells[row][col].isFlagged
    })

    // 方法2：所有非炸彈格子都被打開
    let allSafeCellsRevealed = true
    for (let i = 0; i < this._rows; i++) {
      for (let j = 0; j < this._cols; j++) {
        const cell = this._cells[i][j]
        if (!cell.isBomb && !cell.isRevealed) {
          allSafeCellsRevealed = false
          break
        }
      }
      if (!allSafeCellsRevealed) break
    }

    return allBombsFlagged || allSafeCellsRevealed
  }

  /**
   * 顯示所有炸彈（遊戲結束時）
   */
  revealAllBombs(): void {
    this._bombPositions.forEach(key => {
      const [row, col] = key.split(',').map(Number)
      const cell = this._cells[row][col]
      if (!cell.isFlagged) {
        cell.reveal()
      }
    })
  }

  /**
   * 重置棋盤
   */
  reset(): void {
    for (let i = 0; i < this._rows; i++) {
      for (let j = 0; j < this._cols; j++) {
        this._cells[i][j].reset()
      }
    }
    this._bombPositions.clear()
  }
}
