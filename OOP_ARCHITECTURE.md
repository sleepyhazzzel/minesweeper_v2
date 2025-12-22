# 扫雷游戏 - OOP 重构版本

## 📋 项目概述

这是一个使用 **Vue 3 + TypeScript + OOP (面向对象编程)** 重构的扫雷游戏。从原来的 jQuery + 函数式编程方式，重构为现代化的面向对象架构。

## 🏗️ 架构设计

### OOP 类设计

```
models/
├── types.ts          # 类型定义和枚举
├── Cell.ts           # Cell 类 - 单个格子
├── Board.ts          # Board 类 - 游戏棋盘
├── Timer.ts          # Timer 类 - 计时器
└── Game.ts           # Game 类 - 游戏主控制器
```

### 核心类说明

#### 1️⃣ **Cell 类** - 表示单个格子
```typescript
class Cell {
  private _index: number        // 格子索引
  private _row: number          // 行位置
  private _col: number          // 列位置
  private _isBomb: boolean      // 是否是炸弹
  private _state: CellState     // 格子状态（隐藏/显示/标记）
  private _adjacentBombs: number // 周围炸弹数

  // 方法
  setBomb()           // 设置为炸弹
  reveal()            // 显示格子
  toggleFlag()        // 切换旗帜
  reset()             // 重置格子
}
```

**职责**：
- 管理单个格子的状态
- 提供格子操作的方法
- 封装格子数据

#### 2️⃣ **Board 类** - 管理游戏棋盘
```typescript
class Board {
  private _rows: number         // 行数
  private _cols: number         // 列数
  private _bombsCount: number   // 炸弹数量
  private _cells: Cell[]        // 所有格子
  private _bombIndices: Set<number> // 炸弹位置

  // 方法
  generateBombs()              // 生成炸弹
  calculateAdjacentBombs()     // 计算周围炸弹数
  revealCell(row, col)         // 打开格子（递归展开）
  toggleFlag(row, col)         // 切换旗帜
  checkVictory()               // 检查是否胜利
}
```

**职责**：
- 管理整个棋盘的格子
- 生成炸弹分布
- 实现递归展开逻辑
- 判断游戏胜利条件

#### 3️⃣ **Timer 类** - 管理计时器
```typescript
class Timer {
  private _seconds: number      // 已用时间（秒）
  private _isRunning: boolean   // 是否正在运行
  private _intervalId: number   // 定时器 ID

  // 方法
  start()                // 开始计时
  stop()                 // 停止计时
  reset()                // 重置计时
  getFormattedTime()     // 获取格式化时间
}
```

**职责**：
- 管理游戏时间
- 提供计时控制
- 格式化时间显示

#### 4️⃣ **Game 类** - 游戏主控制器
```typescript
class Game {
  private _board: Board         // 棋盘实例
  private _timer: Timer         // 计时器实例
  private _status: GameStatus   // 游戏状态
  private _difficulty: Difficulty // 难度
  private _records: GameRecord  // 最佳记录

  // 方法
  start()                       // 开始游戏
  restart()                     // 重新开始
  changeDifficulty()            // 改变难度
  clickCell(row, col)           // 点击格子
  toggleFlag(row, col)          // 切换旗帜
  checkVictory()                // 检查胜利
  lose()                        // 游戏失败
  win()                         // 游戏胜利
}
```

**职责**：
- 协调 Board 和 Timer
- 管理游戏状态和流程
- 处理用户交互
- 保存/读取游戏记录

### Vue 集成层

```
composables/
└── useGame.ts        # Composition API Hook
    - 将 OOP 类与 Vue 响应式系统集成
    - 提供 computed 和 reactive 接口

components/
├── Cell.vue          # 单个格子组件
├── GameBoard.vue     # 游戏棋盘组件
├── GameHeader.vue    # 游戏头部组件
└── App.vue           # 主应用组件
```

## 🔄 重构对比

### 原始代码（jQuery + 函数式）
```javascript
// 全局变量
let rowTotal = 10
let colTotal = 10
let bombsArray = []

// 生成网格
function generateGrid() {
  let gridHtml = ''
  for (let i = 0; i < rowTotal; i++) {
    for (let j = 0; j < colTotal; j++) {
      gridHtml += `<td class="box" data-index="${i * colTotal + j}"></td>`
    }
  }
  $('#grid').html(gridHtml)
}

// 打开格子
function openBox(row, col) {
  // ... 复杂的递归逻辑
  const num = bombsNearby(row, col, bombsArray)
  // ... DOM 操作
}
```

**问题**：
- ❌ 全局变量污染
- ❌ 逻辑和视图耦合
- ❌ 难以测试
- ❌ 缺乏类型安全
- ❌ 代码复用困难

### 重构后代码（OOP + Vue）
```typescript
// Cell 类封装格子逻辑
class Cell {
  reveal() {
    if (this._state !== CellState.Hidden) return false
    this._state = CellState.Revealed
    return true
  }
}

// Board 类管理棋盘
class Board {
  revealCell(row: number, col: number): Cell[] {
    const revealedCells: Cell[] = []
    this.revealCellRecursive(row, col, revealedCells)
    return revealedCells
  }
}

// Vue 组件只负责渲染
<Cell :cell-data="cell" @click="handleClick" />
```

**优势**：
- ✅ 清晰的类职责划分
- ✅ 逻辑与视图分离
- ✅ 易于单元测试
- ✅ 完整的类型安全
- ✅ 高度可复用

## 🎯 设计模式应用

### 1. 单一职责原则 (SRP)
每个类只负责一个功能：
- `Cell`: 只管理单个格子
- `Board`: 只管理棋盘
- `Timer`: 只管理时间
- `Game`: 只协调整体逻辑

### 2. 开闭原则 (OCP)
- 通过回调函数扩展功能，无需修改类内部
- 新增难度只需添加配置，无需修改代码

### 3. 依赖注入
```typescript
class Game {
  constructor(difficulty, callbacks) {
    // 通过构造函数注入依赖
    this._onStatusChange = callbacks?.onStatusChange
    this._onTimerTick = callbacks?.onTimerTick
  }
}
```

### 4. 组合优于继承
```typescript
class Game {
  private _board: Board   // 组合 Board
  private _timer: Timer   // 组合 Timer
}
```

## 📊 数据流

```
用户交互
    ↓
Vue 组件 (Cell.vue)
    ↓
useGame Hook
    ↓
Game 类
    ↓
Board 类 / Timer 类
    ↓
Cell 类
    ↓
回调函数
    ↓
Vue 响应式更新
    ↓
UI 重新渲染
```

## 🚀 运行项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📝 代码示例

### 创建游戏实例
```typescript
const game = new Game(Difficulty.Easy, {
  onStatusChange: (status) => {
    console.log('游戏状态变化:', status)
  },
  onTimerTick: (seconds) => {
    console.log('时间更新:', seconds)
  },
  onBoardUpdate: () => {
    console.log('棋盘更新')
  }
})

game.start()
```

### 在 Vue 中使用
```vue
<script setup lang="ts">
import { useGame } from './composables/useGame'

const {
  cells,
  status,
  clickCell,
  toggleFlag
} = useGame(Difficulty.Easy)
</script>

<template>
  <div @click="clickCell(row, col)">
    <!-- ... -->
  </div>
</template>
```

## 🎮 游戏功能

- ✅ 三个难度等级（简单/中等/困难）
- ✅ 计时器
- ✅ 炸弹计数
- ✅ 旗帜标记
- ✅ 递归展开空白区域
- ✅ 最佳成绩记录（LocalStorage）
- ✅ 游戏胜负判断
- ✅ 重新开始

## 📈 未来优化

- [ ] 添加音效
- [ ] 添加动画效果
- [ ] 支持自定义难度
- [ ] 添加游戏统计
- [ ] 支持暗色模式
- [ ] 添加排行榜功能
- [ ] 移动端优化

## 🔧 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: CSS (Scoped)
- **状态管理**: Composition API (无需 Pinia/Vuex)

## 📚 学习要点

这个项目展示了如何：
1. 使用 OOP 思想组织代码
2. 将业务逻辑与视图层分离
3. 在 Vue 中集成 TypeScript 类
4. 使用 Composition API 管理状态
5. 实现清晰的架构设计

---

**作者**: sleepyhazzzel  
**重构日期**: 2025  
**原始项目**: [GitHub - minesweeper](https://github.com/sleepyhazzzel/minesweeper)
