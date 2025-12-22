# 🚀 快速开始指南

## 第一次运行项目

### 1. 确认环境

确保你已安装：
- Node.js (v16 或更高)
- npm 或 yarn

### 2. 克隆项目

```bash
cd minesweeper_v2
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看游戏

## 🎮 如何玩

1. 选择难度（简单/中等/困难）
2. 左键点击格子打开
3. 右键点击格子插旗
4. 打开所有安全格子或标记所有炸弹即可获胜

## 📖 理解代码结构

### 从哪里开始？

推荐阅读顺序：

1. **先看类型定义**
   - 📁 `src/models/types.ts` - 了解数据结构

2. **理解核心类**（由简到繁）
   - 📁 `src/models/Cell.ts` - 最简单的类
   - 📁 `src/models/Timer.ts` - 计时器逻辑
   - 📁 `src/models/Board.ts` - 棋盘管理
   - 📁 `src/models/Game.ts` - 游戏控制器

3. **看 Vue 集成**
   - 📁 `src/composables/useGame.ts` - 如何在 Vue 中使用类

4. **查看组件**
   - 📁 `src/components/Cell.vue` - 格子组件
   - 📁 `src/components/GameBoard.vue` - 棋盘组件
   - 📁 `src/components/GameHeader.vue` - 头部组件
   - 📁 `src/App.vue` - 主应用

## 💻 代码示例

### 创建一个游戏实例

```typescript
import { Game } from './models/Game'
import { Difficulty } from './models/types'

// 创建游戏
const game = new Game(Difficulty.Easy, {
  onStatusChange: (status) => {
    console.log('游戏状态:', status)
  },
  onTimerTick: (seconds) => {
    console.log('时间:', seconds)
  }
})

// 开始游戏
game.start()

// 点击格子
game.clickCell(0, 0)

// 插旗
game.toggleFlag(1, 1)
```

### 在 Vue 组件中使用

```vue
<script setup lang="ts">
import { useGame } from './composables/useGame'
import { Difficulty } from './models/types'

const {
  cells,      // 所有格子
  status,     // 游戏状态
  clickCell,  // 点击格子方法
  toggleFlag  // 插旗方法
} = useGame(Difficulty.Easy)
</script>

<template>
  <div>
    <div v-for="cell in cells" :key="cell.index">
      {{ cell.adjacentBombs }}
    </div>
  </div>
</template>
```

## 🔍 调试技巧

### 1. 在浏览器控制台查看游戏状态

打开浏览器控制台，输入：

```javascript
// 这些变量在开发模式下可用（需要先在 useGame 中暴露）
console.log('当前难度:', game.difficulty)
console.log('游戏状态:', game.status)
console.log('所有格子:', game.board.cells)
```

### 2. 使用 Vue DevTools

安装 Vue DevTools 扩展，可以查看：
- 组件树
- 响应式数据
- 事件流

### 3. 打印调试信息

在类的方法中添加 console.log：

```typescript
class Game {
  clickCell(row: number, col: number) {
    console.log('点击格子:', row, col)
    // ...
  }
}
```

## 🧪 测试代码

查看测试示例：

```typescript
import { runAllTests } from './examples/test-examples'

// 运行所有测试
runAllTests()
```

## 🛠️ 常见问题

### Q: 如何修改难度配置？

A: 修改 `src/models/types.ts` 中的 `DIFFICULTY_CONFIGS`：

```typescript
export const DIFFICULTY_CONFIGS = {
  [Difficulty.Easy]: { rows: 10, cols: 10, bombs: 10 }
  // 修改这里的数值
}
```

### Q: 如何添加新的游戏功能？

A: 根据功能类型：
- **格子相关** → 修改 `Cell.ts`
- **棋盘相关** → 修改 `Board.ts`
- **游戏流程** → 修改 `Game.ts`
- **UI 相关** → 修改组件文件

### Q: 如何更改样式？

A: 修改对应组件的 `<style>` 部分，或修改 `src/style.css`

## 📚 推荐阅读

1. [OOP_ARCHITECTURE.md](./OOP_ARCHITECTURE.md) - 详细架构说明
2. [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - 项目结构文档
3. [Vue 3 文档](https://vuejs.org/)
4. [TypeScript 文档](https://www.typescriptlang.org/)

## 🎓 学习路径

### 初级：理解基础
1. 阅读 `Cell.ts` 和 `Timer.ts`
2. 了解如何创建类和方法
3. 理解 getter/setter

### 中级：理解架构
1. 阅读 `Board.ts`，理解递归逻辑
2. 阅读 `Game.ts`，理解类的组合
3. 理解回调函数的使用

### 高级：Vue 集成
1. 阅读 `useGame.ts`，理解如何将类与 Vue 集成
2. 理解响应式系统
3. 学习如何设计清晰的 API

## 💡 提示

- 💾 **修改代码后自动保存** - Vite 支持热更新
- 🐛 **遇到错误？** - 查看浏览器控制台
- 📝 **添加注释** - 帮助理解复杂逻辑
- 🧪 **多测试** - 尝试不同的难度和操作

## 🎯 下一步

现在你可以：
1. 🎮 玩游戏，熟悉功能
2. 📖 阅读代码，理解逻辑
3. ✏️ 修改代码，添加功能
4. 🧪 编写测试，确保质量

祝你学习愉快！🎉
