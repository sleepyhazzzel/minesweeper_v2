# 💣 踩地雷遊戲 - OOP 重構版

> 使用 Vue 3 + TypeScript + OOP 重構的現代化踩地雷遊戲

## 🎮 專案簡介

這是一個使用 **物件導向程式設計 (OOP)** 方式重構的踩地雷遊戲，從原來的 jQuery + 函數式程式設計重構為 Vue 3 + TypeScript 的現代化架構。

**原始專案**: [GitHub - minesweeper](https://github.com/sleepyhazzzel/minesweeper)

## 📂 專案結構

```
src/
├── models/           # OOP 業務邏輯層
│   ├── types.ts     # 型別定義
│   ├── Cell.ts      # 格子類
│   ├── Board.ts     # 棋盤類
│   ├── Timer.ts     # 計時器類
│   └── Game.ts      # 遊戲控制器類
├── composables/      # Vue Composition API
│   └── useGame.ts   # 遊戲狀態管理
├── components/       # Vue 組件
│   ├── Cell.vue     # 格子組件
│   ├── GameBoard.vue # 棋盤組件
│   └── GameHeader.vue # 頭部組件
└── App.vue          # 主應用
```

## 🏗️ OOP 架構設計

### 核心類

#### 🟦 Cell (格子類)
管理單個格子的狀態和行為
```typescript
class Cell {
  reveal()      // 打開格子
  toggleFlag()  // 切換旗幟
  setBomb()     // 設置為炸彈
}
```

#### 🟩 Board (棋盤類)
管理整個遊戲棋盤
```typescript
class Board {
  generateBombs()        // 生成炸彈
  revealCell(row, col)   // 打開格子（遞迴）
  checkVictory()         // 檢查勝利
}
```

#### 🟨 Timer (計時器類)
管理遊戲時間
```typescript
class Timer {
  start()   // 開始計時
  stop()    // 停止計時
  reset()   // 重置
}
```

#### 🟥 Game (遊戲控制器類)
協調整個遊戲流程
```typescript
class Game {
  start()                    // 開始遊戲
  clickCell(row, col)        // 點擊格子
  changeDifficulty(level)    // 改變難度
}
```

### 設計模式

- ✅ **單一職責原則** - 每個類只負責一個功能
- ✅ **開閉原則** - 易於擴展，無需修改現有代碼
- ✅ **依賴注入** - 通過構造函數注入依賴
- ✅ **組合優於繼承** - Game 類組合 Board 和 Timer

## 🎯 遊戲規則

- 🖱️ **左鍵點擊** - 打開格子
- 🖱️ **右鍵點擊** - 插/拔旗子
- 🔢 **數字** - 表示周圍 8 格的炸彈數量
- 🎉 **勝利條件** - 標記所有炸彈或打開所有安全格子

### 難度等級

| 難度 | 大小 | 炸彈數 |
|------|------|--------|
| 簡單 | 10×10 | 10 |
| 中等 | 14×16 | 30 |
| 困難 | 18×22 | 70 |

## 📚 文件

- 📖 [OOP 架構詳解](./OOP_ARCHITECTURE.md) - 詳細的架構設計說明
- 📁 [專案結構說明](./PROJECT_STRUCTURE.md) - 完整的檔案結構文件
- 🧪 [測試範例](./src/examples/test-examples.ts) - 如何測試 OOP 類

## 🔄 重構對比

### 重構前 (jQuery + 函數式)
```javascript
// 全域變數
let bombsArray = []
let rowTotal = 10

// 函數
function openBox(row, col) {
  // DOM 操作混雜在邏輯中
  $('.box').removeClass('hidden')
}
```

**問題**:
- ❌ 全域變數污染
- ❌ 邏輯和視圖耦合
- ❌ 難以測試和維護

### 重構後 (OOP + Vue)
```typescript
// 清晰的類職責
class Cell {
  reveal() {
    this._state = CellState.Revealed
  }
}

// 邏輯與視圖分離
<Cell :cell-data="cell" @click="handleClick" />
```

**優勢**:
- ✅ 清晰的職責劃分
- ✅ 邏輯與視圖分離
- ✅ 易於測試
- ✅ 型別安全
