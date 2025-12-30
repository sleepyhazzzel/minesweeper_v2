# 踩地雷遊戲 - OOP 重構版本

## 🏗️ 架構設計

### OOP 類設計

```
models/
├── types.ts          # 類型定義和枚舉
├── Cell.ts           # Cell 類 - 單個格子
├── Board.ts          # Board 類 - 遊戲棋盤
├── Timer.ts          # Timer 類 - 計時器
└── Game.ts           # Game 類 - 遊戲主控制器
```

### 核心類說明

#### 1️⃣ **Cell 類** - 表示單個格子
```typescript
class Cell {
  private _index: number        // 格子索引
  private _row: number          // 行位置
  private _col: number          // 列位置
  private _isBomb: boolean      // 是否是炸彈
  private _state: CellState     // 格子狀態（隱藏/顯示/標記）
  private _adjacentBombs: number // 周圍炸彈數

  // 方法
  setBomb()           // 設置為炸彈
  reveal()            // 顯示格子
  toggleFlag()        // 切換旗幟
  reset()             // 重置格子
}
```

**職責**：
- 管理單個格子的狀態
- 提供格子操作的方法
- 封裝格子資料

#### 2️⃣ **Board 類** - 管理遊戲棋盤
```typescript
class Board {
  private _rows: number         // 行數
  private _cols: number         // 列數
  private _bombsCount: number   // 炸彈數量
  private _cells: Cell[]        // 所有格子
  private _bombIndices: Set<number> // 炸彈位置

  // 方法
  generateBombs()              // 生成炸彈
  calculateAdjacentBombs()     // 計算周圍炸彈數
  revealCell(row, col)         // 打開格子（遞迴展開）
  toggleFlag(row, col)         // 切換旗幟
  checkVictory()               // 檢查是否勝利
}
```

**職責**：
- 管理整個棋盤的格子
- 生成炸彈分布
- 實現遞迴展開邏輯
- 判斷遊戲勝利條件

#### 3️⃣ **Timer 類** - 管理計時器
```typescript
class Timer {
  private _seconds: number      // 已用時間（秒）
  private _isRunning: boolean   // 是否正在執行
  private _intervalId: number   // 定時器 ID

  // 方法
  start()                // 開始計時
  stop()                 // 停止計時
  reset()                // 重置計時
  getFormattedTime()     // 獲取格式化時間
}
```

**職責**：
- 管理遊戲時間
- 提供計時控制
- 格式化時間顯示

#### 4️⃣ **Game 類** - 遊戲主控制器
```typescript
class Game {
  private _board: Board         // 棋盤實例
  private _timer: Timer         // 計時器實例
  private _status: GameStatus   // 遊戲狀態
  private _difficulty: Difficulty // 難度
  private _records: GameRecord  // 最佳記錄

  // 方法
  start()                       // 開始遊戲
  restart()                     // 重新開始
  changeDifficulty()            // 改變難度
  clickCell(row, col)           // 點擊格子
  toggleFlag(row, col)          // 切換旗幟
  checkVictory()                // 檢查勝利
  lose()                        // 遊戲失敗
  win()                         // 遊戲勝利
}
```

**職責**：
- 協調 Board 和 Timer
- 管理遊戲狀態和流程
- 處理用戶互動
- 保存/讀取遊戲記錄

### Vue 集成層

```
composables/
└── useGame.ts        # Composition API Hook
    - 將 OOP 類與 Vue 響應式系統集成
    - 提供 computed 和 reactive 介面

components/
├── Cell.vue          # 單個格子組件
├── GameBoard.vue     # 遊戲棋盤組件
├── GameHeader.vue    # 遊戲頭部組件
└── App.vue           # 主應用組件
```

## 🎯 設計模式應用

### 1. 單一職責原則 (SRP)
每個類只負責一個功能：
- `Cell`: 只管理單個格子
- `Board`: 只管理棋盤
- `Timer`: 只管理時間
- `Game`: 只協調整體邏輯

### 2. 開閉原則 (OCP)
- 通過回調函數擴展功能，無需修改類內部
- 新增難度只需添加配置，無需修改程式碼

### 3. 依賴注入
```typescript
class Game {
  constructor(difficulty, callbacks) {
    // 通過構造函數注入依賴
    this._onStatusChange = callbacks?.onStatusChange
    this._onTimerTick = callbacks?.onTimerTick
  }
}
```

### 4. 組合優於繼承
```typescript
class Game {
  private _board: Board   // 組合 Board
  private _timer: Timer   // 組合 Timer
}
```

## 📊 資料流

```
用戶互動
    ↓
Vue 組件 (Cell.vue)
    ↓
useGame Hook
    ↓
Game 類
    ↓
Board 類 / Timer 類
    ↓
Cell 類
    ↓
回調函數
    ↓
Vue 響應式更新
    ↓
UI 重新渲染
```
