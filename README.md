# 💣 扫雷游戏 - OOP 重构版

> 使用 Vue 3 + TypeScript + OOP 重构的现代化扫雷游戏

## 🎮 项目简介

这是一个使用 **面向对象编程 (OOP)** 方式重构的扫雷游戏，从原来的 jQuery + 函数式编程重构为 Vue 3 + TypeScript 的现代化架构。

**原始项目**: [GitHub - minesweeper](https://github.com/sleepyhazzzel/minesweeper)

## ✨ 特性

- 🎯 **纯 OOP 架构** - 清晰的类设计和职责划分
- 📦 **TypeScript** - 完整的类型安全
- ⚡ **Vue 3 Composition API** - 现代化的 Vue 开发方式
- 🎨 **响应式设计** - 优雅的用户界面
- 💾 **本地存储** - 自动保存最佳记录
- 🔄 **三个难度等级** - 简单、中等、困难
- ⏱️ **计时器** - 记录游戏时间
- 🚩 **旗帜标记** - 标记炸弹位置

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📂 项目结构

```
src/
├── models/           # OOP 业务逻辑层
│   ├── types.ts     # 类型定义
│   ├── Cell.ts      # 格子类
│   ├── Board.ts     # 棋盘类
│   ├── Timer.ts     # 计时器类
│   └── Game.ts      # 游戏控制器类
├── composables/      # Vue Composition API
│   └── useGame.ts   # 游戏状态管理
├── components/       # Vue 组件
│   ├── Cell.vue     # 格子组件
│   ├── GameBoard.vue # 棋盘组件
│   └── GameHeader.vue # 头部组件
└── App.vue          # 主应用
```

## 🏗️ OOP 架构设计

### 核心类

#### 🟦 Cell (格子类)
管理单个格子的状态和行为
```typescript
class Cell {
  reveal()      // 打开格子
  toggleFlag()  // 切换旗帜
  setBomb()     // 设置为炸弹
}
```

#### 🟩 Board (棋盘类)
管理整个游戏棋盘
```typescript
class Board {
  generateBombs()        // 生成炸弹
  revealCell(row, col)   // 打开格子（递归）
  checkVictory()         // 检查胜利
}
```

#### 🟨 Timer (计时器类)
管理游戏时间
```typescript
class Timer {
  start()   // 开始计时
  stop()    // 停止计时
  reset()   // 重置
}
```

#### 🟥 Game (游戏控制器类)
协调整个游戏流程
```typescript
class Game {
  start()                    // 开始游戏
  clickCell(row, col)        // 点击格子
  changeDifficulty(level)    // 改变难度
}
```

### 设计模式

- ✅ **单一职责原则** - 每个类只负责一个功能
- ✅ **开闭原则** - 易于扩展，无需修改现有代码
- ✅ **依赖注入** - 通过构造函数注入依赖
- ✅ **组合优于继承** - Game 类组合 Board 和 Timer

## 🎯 游戏规则

- 🖱️ **左键点击** - 打开格子
- 🖱️ **右键点击** - 插/拔旗子
- 🔢 **数字** - 表示周围 8 格的炸弹数量
- 🎉 **胜利条件** - 标记所有炸弹或打开所有安全格子

### 难度等级

| 难度 | 大小 | 炸弹数 |
|------|------|--------|
| 简单 ★ | 10×10 | 10 |
| 中等 ★★ | 14×16 | 30 |
| 困难 ★★★ | 18×22 | 70 |

## 📚 文档

- 📖 [OOP 架构详解](./OOP_ARCHITECTURE.md) - 详细的架构设计说明
- 📁 [项目结构说明](./PROJECT_STRUCTURE.md) - 完整的文件结构文档
- 🧪 [测试示例](./src/examples/test-examples.ts) - 如何测试 OOP 类

## 🔄 重构对比

### 重构前 (jQuery + 函数式)
```javascript
// 全局变量
let bombsArray = []
let rowTotal = 10

// 函数
function openBox(row, col) {
  // DOM 操作混杂在逻辑中
  $('.box').removeClass('hidden')
}
```

**问题**:
- ❌ 全局变量污染
- ❌ 逻辑和视图耦合
- ❌ 难以测试和维护

### 重构后 (OOP + Vue)
```typescript
// 清晰的类职责
class Cell {
  reveal() {
    this._state = CellState.Revealed
  }
}

// 逻辑与视图分离
<Cell :cell-data="cell" @click="handleClick" />
```

**优势**:
- ✅ 清晰的职责划分
- ✅ 逻辑与视图分离
- ✅ 易于测试
- ✅ 类型安全

## 🛠️ 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: CSS (Scoped)

## 💡 学习要点

这个项目展示了：

1. ✨ **如何使用 OOP 组织代码**
2. 🎯 **业务逻辑与视图层分离**
3. 🔗 **在 Vue 中集成 TypeScript 类**
4. 📊 **使用 Composition API 管理状态**
5. 🏗️ **清晰的架构设计**

## 🔮 未来计划

- [ ] 添加音效
- [ ] 添加动画效果
- [ ] 支持自定义难度
- [ ] 添加游戏统计
- [ ] 暗色模式
- [ ] 移动端优化

## 📝 开发笔记

### 为什么选择 OOP？

1. **可测试性** - 纯逻辑类可以独立测试
2. **可维护性** - 清晰的职责划分
3. **可扩展性** - 易于添加新功能
4. **可复用性** - 类可以在其他项目中使用

### 为什么不用 Vuex/Pinia？

对于这个游戏：
- 状态管理相对简单
- Composition API 的 `useGame` Hook 足够
- OOP 类本身就是状态管理器
- 减少了不必要的复杂度

## 👨‍💻 作者

**sleepyhazzzel**
- 原始项目: [GitHub](https://github.com/sleepyhazzzel/minesweeper)

## 📄 License

MIT

---

⭐ 如果这个项目对你有帮助，请给一个 Star！

