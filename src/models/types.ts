// 遊戲難度配置
export enum Difficulty {
  Easy = 'Easy',
  Normal = 'Normal',
  Difficult = 'Difficult'
}

export interface DifficultyConfig {
  rows: number
  cols: number
  bombs: number
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.Easy]: { rows: 10, cols: 10, bombs: 10 },
  [Difficulty.Normal]: { rows: 14, cols: 16, bombs: 30 },
  [Difficulty.Difficult]: { rows: 18, cols: 22, bombs: 70 }
}

// 格子狀態
export enum CellState {
  Hidden = 'hidden',      // 未打開
  Revealed = 'revealed',  // 已打開
  Flagged = 'flagged'     // 已插旗
}

// 遊戲狀態
export enum GameStatus {
  Idle = 'idle',         // 未開始
  Playing = 'playing',   // 進行中
  Won = 'won',           // 勝利
  Lost = 'lost'          // 失敗
}

// 格子數據介面
export interface CellData {
  row: number
  col: number
  isBomb: boolean
  state: CellState
  adjacentBombs: number
}

// 遊戲記錄
export interface GameRecord {
  [Difficulty.Easy]: number
  [Difficulty.Normal]: number
  [Difficulty.Difficult]: number
}
