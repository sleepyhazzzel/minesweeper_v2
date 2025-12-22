import { CellState, type CellData } from './types'

/**
 * Cell 類 - 表示單個格子
 */
export class Cell {
  private _row: number
  private _col: number
  private _isBomb: boolean
  private _state: CellState
  private _adjacentBombs: number

  constructor(row: number, col: number) {
    this._row = row
    this._col = col
    this._isBomb = false
    this._state = CellState.Hidden
    this._adjacentBombs = 0
  }

  // 取值器
  get row(): number {
    return this._row
  }

  get col(): number {
    return this._col
  }

  get isBomb(): boolean {
    return this._isBomb
  }

  get state(): CellState {
    return this._state
  }

  get adjacentBombs(): number {
    return this._adjacentBombs
  }

  get isRevealed(): boolean {
    return this._state === CellState.Revealed
  }

  get isFlagged(): boolean {
    return this._state === CellState.Flagged
  }

  get isHidden(): boolean {
    return this._state === CellState.Hidden
  }

  // 設置器與操作
  setBomb(): void {
    this._isBomb = true
  }

  setAdjacentBombs(count: number): void {
    this._adjacentBombs = count
  }

  reveal(): boolean {
    if (this._state !== CellState.Hidden) {
      return false
    }
    this._state = CellState.Revealed
    return true
  }

  toggleFlag(): boolean {
    if (this._state === CellState.Revealed) {
      return false
    }
    
    if (this._state === CellState.Flagged) {
      this._state = CellState.Hidden
      return true
    } else {
      this._state = CellState.Flagged
      return true
    }
  }

  reset(): void {
    this._isBomb = false
    this._state = CellState.Hidden
    this._adjacentBombs = 0
  }

  toData(): CellData {
    return {
      row: this._row,
      col: this._col,
      isBomb: this._isBomb,
      state: this._state,
      adjacentBombs: this._adjacentBombs
    }
  }
}
