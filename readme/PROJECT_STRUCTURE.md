# 專案檔案結構

```
minesweeper_v2/
│
├── public/                     # 靜態資源
│
├── src/                        # 原始碼
│   ├── models/                 # OOP 模型層 (業務邏輯)
│   │   ├── types.ts           # 類型定義和枚舉
│   │   ├── Cell.ts            # Cell 類 - 單個格子
│   │   ├── Board.ts           # Board 類 - 遊戲棋盤
│   │   ├── Timer.ts           # Timer 類 - 計時器
│   │   └── Game.ts            # Game 類 - 遊戲控制器
│   │
│   ├── composables/            # Vue Composition API
│   │   └── useGame.ts         # 遊戲狀態管理 Hook
│   │
│   ├── components/             # Vue 組件 (視圖層)
│   │   ├── Cell.vue           # 單個格子組件
│   │   ├── GameBoard.vue      # 遊戲棋盤組件
│   │   └── GameHeader.vue     # 遊戲頭部組件
│   │
│   ├── App.vue                # 主應用組件
│   ├── main.ts                # 應用入口
│   ├── style.css              # 全域樣式
│   └── vite-env.d.ts          # Vite 類型聲明
│
├── index.html                 # HTML 模板
├── package.json               # 專案配置
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
├── README.md                  # 專案說明
└── OOP_ARCHITECTURE.md        # OOP 架構詳細說明

```

## 檔案說明

### 📦 Models (OOP 業務邏輯層)

#### `types.ts` - 類型定義
- 定義所有枚舉類型
- 定義介面
- 遊戲配置常量

**導出內容**:
- `Difficulty` - 難度枚舉
- `CellState` - 格子狀態枚舉
- `GameStatus` - 遊戲狀態枚舉
- `CellData` - 格子資料介面
- `GameRecord` - 遊戲記錄介面
- `DIFFICULTY_CONFIGS` - 難度配置

#### `Cell.ts` - 格子類
管理單個格子的狀態和行為

**主要方法**:
```typescript
setBomb()              // 設置為炸彈
setAdjacentBombs()     // 設置周圍炸彈數
reveal()               // 打開格子
toggleFlag()           // 切換旗幟
reset()                // 重置格子
toData()               // 轉換為資料物件
```

#### `Board.ts` - 棋盤類
管理整個遊戲棋盤

**主要方法**:
```typescript
generateBombs()                    // 生成炸彈
revealCell(row, col)              // 打開格子（遞迴）
toggleFlag(row, col)              // 切換旗幟
checkVictory()                    // 檢查是否勝利
getRemainingFlags()               // 獲取剩餘旗幟數
revealAllBombs()                  // 顯示所有炸彈
```

#### `Timer.ts` - 計時器類
管理遊戲時間

**主要方法**:
```typescript
start()                // 開始計時
stop()                 // 停止計時
reset()                // 重置計時
getFormattedTime()     // 獲取格式化時間
getTimeDigits()        // 獲取時間數字陣列
```

#### `Game.ts` - 遊戲控制器
協調所有遊戲邏輯

**主要方法**:
```typescript
start()                       // 開始遊戲
restart()                     // 重新開始
changeDifficulty()            // 改變難度
clickCell(row, col)           // 點擊格子
toggleFlag(row, col)          // 切換旗幟
getRemainingFlags()           // 獲取剩餘旗幟
```

**依賴關係**:
```
Game
├── Board
│   └── Cell[]
└── Timer
```

### 🎣 Composables (Vue 集成層)

#### `useGame.ts` - 遊戲 Hook
將 OOP 類與 Vue 響應式系統集成

**返回內容**:
```typescript
{
  // 唯讀狀態
  status,            // 遊戲狀態
  seconds,           // 計時秒數
  cells,             // 所有格子
  difficulty,        // 當前難度
  remainingFlags,    // 剩餘旗幟
  currentRecord,     // 當前難度最佳記錄
  isPlaying,         // 是否遊戲中
  isWon,             // 是否獲勝
  isLost,            // 是否失敗
  
  // 方法
  start,             // 開始遊戲
  restart,           // 重新開始
  changeDifficulty,  // 改變難度
  clickCell,         // 點擊格子
  toggleFlag         // 切換旗幟
}
```

### 🎨 Components (視圖層)

#### `Cell.vue` - 格子組件
顯示單個格子

**Props**:
- `cellData: CellData` - 格子資料
- `disabled?: boolean` - 是否禁用

**Events**:
- `@click` - 左鍵點擊
- `@rightClick` - 右鍵點擊

#### `GameBoard.vue` - 棋盤組件
顯示整個遊戲棋盤

**Props**:
- `cells: CellData[]` - 所有格子資料
- `rows: number` - 行數
- `cols: number` - 列數
- `disabled?: boolean` - 是否禁用

**Events**:
- `@cellClick` - 格子點擊
- `@cellRightClick` - 格子右鍵

#### `GameHeader.vue` - 頭部組件
顯示遊戲資訊和控制

**Props**:
- `difficulty: Difficulty` - 難度
- `timeDigits: string[]` - 時間數字
- `flagsDigits: string[]` - 旗幟數字
- `currentRecord: number` - 最佳記錄

**Events**:
- `@restart` - 重啟遊戲
- `@info` - 顯示資訊
- `@changeDifficulty` - 改變難度

#### `App.vue` - 主組件
整合所有組件，管理遊戲流程

## 資料流向

```
┌─────────────────────────────────────────────────┐
│                   App.vue                       │
│          (使用 useGame Hook，協調整體)             │
└──────────┬──────────────────────┬───────────────┘
           │                      │
           ▼                      ▼
    ┌─────────────┐        ┌──────────────┐
    │ GameHeader  │        │  GameBoard   │
    │  (控制面板)  │        │    (棋盤)     │
    └─────────────┘        └──────┬───────┘
                                  │
                                  ▼
                            ┌──────────┐
                            │   Cell   │
                            │  (格子)   │
                            └──────────┘

用戶互動 → Vue 組件 → useGame Hook → Game 類 → Board/Timer → Cell
                                              ↓
                                          回調更新
                                              ↓
                                        Vue 響應式更新
```

## 關鍵特性

### 1. 清晰的職責分離
- **Models**: 純業務邏輯，不依賴 Vue
- **Composables**: Vue 響應式集成層
- **Components**: 純展示組件

### 2. 類型安全
- 全部使用 TypeScript
- 嚴格的類型檢查
- 清晰的介面定義

### 3. 可測試性
- 業務邏輯獨立於框架
- 可以單獨測試每個類
- Mock 友好

### 4. 可維護性
- 程式碼組織清晰
- 單一職責原則
- 易於擴展

### 5. 效能優化
- Vue 的響應式系統
- 計算屬性快取
- 組件級別的更新

## 使用示例

### 創建遊戲
```typescript
import { Game } from '@/models/Game'
import { Difficulty } from '@/models/types'

const game = new Game(Difficulty.Easy, {
  onStatusChange: (status) => console.log(status),
  onTimerTick: (seconds) => console.log(seconds),
  onBoardUpdate: () => console.log('更新')
})

game.start()
```

### 在 Vue 中使用
```vue
<script setup lang="ts">
import { useGame } from '@/composables/useGame'
import { Difficulty } from '@/models/types'

const {
  cells,
  clickCell,
  toggleFlag
} = useGame(Difficulty.Easy)
</script>
```

## 擴展建議

如果需要添加新功能，建議的擴展點：

1. **新增遊戲模式**: 在 `types.ts` 添加新枚舉，在 `Game.ts` 添加邏輯
2. **自訂難度**: 擴展 `DIFFICULTY_CONFIGS`
3. **音效**: 在 `Game.ts` 添加音訊管理
4. **動畫**: 在 Vue 組件中添加 transition
5. **統計資料**: 擴展 `Game` 類添加統計屬性
6. **多人模式**: 創建新的 `MultiplayerGame` 類繼承 `Game`

## 最佳實踐

1. **業務邏輯放在 models/**
2. **Vue 相關程式碼放在 components/ 和 composables/**
3. **保持組件簡單，邏輯在 Hook 中**
4. **使用 TypeScript 類型提示**
5. **遵循單一職責原則**
