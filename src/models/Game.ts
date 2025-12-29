import { Board } from './Board'
import { Timer } from './Timer'
import { 
  GameStatus, 
  Difficulty, 
  DIFFICULTY_CONFIGS, 
  type GameRecord
} from './types'

/**
 * Game 類 - 管理整個遊戲邏輯
 */
export class Game {
  private _board: Board
  private _timer: Timer
  private _status: GameStatus
  private _difficulty: Difficulty
  private _records: GameRecord
  private _onStatusChange?: (status: GameStatus) => void
  private _onTimerTick?: (seconds: number) => void
  private _onBoardUpdate?: () => void

  constructor(
    difficulty: Difficulty = Difficulty.Easy,
    callbacks?: {
      onStatusChange?: (status: GameStatus) => void
      onTimerTick?: (seconds: number) => void
      onBoardUpdate?: () => void
    }
  ) {
    this._difficulty = difficulty
    this._status = GameStatus.Idle
    this._onStatusChange = callbacks?.onStatusChange
    this._onTimerTick = callbacks?.onTimerTick
    this._onBoardUpdate = callbacks?.onBoardUpdate

    const config = DIFFICULTY_CONFIGS[difficulty]
    this._board = new Board(config.rows, config.cols, config.bombs)
    this._timer = new Timer(this._onTimerTick)
    this._records = this.loadRecords()
  }

  get board(): Board {
    return this._board
  }

  get timer(): Timer {
    return this._timer
  }

  get status(): GameStatus {
    return this._status
  }

  get difficulty(): Difficulty {
    return this._difficulty
  }

  get records(): GameRecord {
    return this._records
  }

  get currentRecord(): number {
    return this._records[this._difficulty]
  }

  /**
   * 開始新遊戲
   */
  start(): void {
    this._board.reset()
    // this._board.generateBombs()
    this._timer.reset()
    // this._timer.start()
    this._status = GameStatus.Idle
    
    if (this._onStatusChange) {
      this._onStatusChange(this._status)
    }
    if (this._onBoardUpdate) {
      this._onBoardUpdate()
    }
  }

  /**
   * 點擊第一個cell時開始計時，生成炸彈，避免第一步就選到炸彈
   */
  firstClick(row: number, col: number): void {
    this._board.generateBombs(row, col)
    this._timer.start()
    this._status = GameStatus.Playing
    
    if (this._onStatusChange) {
      this._onStatusChange(this._status)
    }

    // 進行第一次點擊
    this.clickCell(row, col)
  }

  /**
   * 重新開始當前難度
   */
  restart(): void {
    this.start()
  }

  /**
   * 改變難度並開始新遊戲
   */
  changeDifficulty(difficulty: Difficulty): void {
    this._difficulty = difficulty
    const config = DIFFICULTY_CONFIGS[difficulty]
    this._board = new Board(config.rows, config.cols, config.bombs)
    this.start()
  }

  /**
   * 點擊格子（左鍵）
   */
  clickCell(row: number, col: number): void {
    if (this._status !== GameStatus.Playing) {
      return
    }

    const cell = this._board.getCell(row, col)
    if (!cell || cell.isRevealed || cell.isFlagged) {
      return
    }

    // 如果點到炸彈，遊戲失敗
    if (cell.isBomb) {
      this.lose()
      return
    }

    // 打開格子
    this._board.revealCell(row, col)
    
    if (this._onBoardUpdate) {
      this._onBoardUpdate()
    }

    // 檢查是否勝利
    if (this._board.checkVictory()) {
      this.win()
    }
  }

  /**
   * 右鍵插旗
   */
  toggleFlag(row: number, col: number): void {
    if (this._status !== GameStatus.Playing) {
      return
    }

    this._board.toggleFlag(row, col)
    
    if (this._onBoardUpdate) {
      this._onBoardUpdate()
    }

    // 检查是否胜利
    if (this._board.checkVictory()) {
      this.win()
    }
  }

  /**
   * 遊戲失敗
   */
  private lose(): void {
    this._status = GameStatus.Lost
    this._timer.stop()
    this._board.revealAllBombs()
    
    if (this._onStatusChange) {
      this._onStatusChange(this._status)
    }
    if (this._onBoardUpdate) {
      this._onBoardUpdate()
    }
  }

  /**
   * 遊戲勝利
   */
  private win(): void {
    this._status = GameStatus.Won
    this._timer.stop()
    
    // 更新最佳記錄
    const currentTime = this._timer.seconds
    if (currentTime < this._records[this._difficulty]) {
      this._records[this._difficulty] = currentTime
      this.saveRecords()
    }
    
    if (this._onStatusChange) {
      this._onStatusChange(this._status)
    }
  }

  /**
   * 獲取剩餘旗子數
   */
  getRemainingFlags(): number {
    return this._board.getRemainingFlags()
  }

  /**
   * 載入記錄
   */
  private loadRecords(): GameRecord {
    try {
      const saved = localStorage.getItem('minesweeper_records')
      if (saved) {
        return JSON.parse(saved) as GameRecord
      }
    } catch (error) {
      console.error('Failed to load records:', error)
    }
    
    return {
      [Difficulty.Easy]: 999,
      [Difficulty.Normal]: 999,
      [Difficulty.Difficult]: 999
    }
  }

  /**
   * 儲存記錄
   */
  private saveRecords(): void {
    try {
      localStorage.setItem('minesweeper_records', JSON.stringify(this._records))
    } catch (error) {
      console.error('Failed to save records:', error)
    }
  }
}
