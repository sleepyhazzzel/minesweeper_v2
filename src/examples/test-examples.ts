/**
 * 测试示例 - 展示如何测试 OOP 类
 * 
 * 这个文件展示了 OOP 架构的可测试性
 * 注意：这不是实际的测试文件，仅作为示例
 */

// ============= Cell 类测试示例 =============
import { Cell } from '../models/Cell'
import { CellState } from '../models/types'

function testCell() {
  console.log('=== Cell 类测试 ===')
  
  // 创建格子
  const cell = new Cell(0, 0)
  console.log('✓ 创建格子成功')
  
  // 测试初始状态
  console.assert(cell.state === CellState.Hidden, '初始状态应该是隐藏')
  console.assert(cell.isBomb === false, '初始不应该是炸弹')
  console.log('✓ 初始状态正确')
  
  // 测试设置炸弹
  cell.setBomb()
  console.assert(cell.isBomb === true, '应该是炸弹')
  console.log('✓ 设置炸弹成功')
  
  // 测试打开格子
  const revealed = cell.reveal()
  console.assert(revealed === true, '应该返回 true')
  console.assert(cell.state === CellState.Revealed, '状态应该是已打开')
  console.log('✓ 打开格子成功')
  
  // 测试重复打开
  const revealed2 = cell.reveal()
  console.assert(revealed2 === false, '重复打开应该返回 false')
  console.log('✓ 重复打开保护正确')
  
  console.log('✅ Cell 类测试通过\n')
}

// ============= Board 类测试示例 =============
import { Board } from '../models/Board'

function testBoard() {
  console.log('=== Board 类测试 ===')
  
  // 创建棋盘
  const board = new Board(10, 10, 10)
  console.log('✓ 创建棋盘成功')
  
  // 测试棋盘属性
  console.assert(board.rows === 10, '行数应该是 10')
  console.assert(board.cols === 10, '列数应该是 10')
  console.assert(board.bombsCount === 10, '炸弹数应该是 10')
  console.assert(board.totalCells === 100, '总格子数应该是 100')
  console.log('✓ 棋盘属性正确')
  
  // 生成炸弹
  board.generateBombs()
  const bombs = board.cells.filter(cell => cell.isBomb)
  console.assert(bombs.length === 10, '应该有 10 个炸弹')
  console.log('✓ 炸弹生成正确')
  
  // 测试获取格子
  const cell = board.getCell(0, 0)
  console.assert(cell !== null, '应该能获取格子')
  console.log('✓ 获取格子成功')
  
  // 测试边界检查
  const outOfBounds = board.getCell(-1, -1)
  console.assert(outOfBounds === null, '越界应该返回 null')
  console.log('✓ 边界检查正确')
  
  console.log('✅ Board 类测试通过\n')
}

// ============= Timer 类测试示例 =============
import { Timer } from '../models/Timer'

function testTimer() {
  console.log('=== Timer 类测试 ===')
  
  let tickCount = 0
  const timer = new Timer((seconds) => {
    tickCount = seconds
  })
  console.log('✓ 创建计时器成功')
  
  // 测试初始状态
  console.assert(timer.seconds === 0, '初始秒数应该是 0')
  console.assert(timer.isRunning === false, '初始不应该运行')
  console.log('✓ 初始状态正确')
  
  // 测试开始计时
  timer.start()
  console.assert(timer.isRunning === true, '应该在运行')
  console.log('✓ 开始计时成功')
  
  // 等待 1 秒测试回调
  setTimeout(() => {
    console.assert(tickCount > 0, '应该有回调')
    console.log('✓ 回调函数正确')
    
    // 测试停止
    timer.stop()
    console.assert(timer.isRunning === false, '应该停止')
    console.log('✓ 停止计时成功')
    
    // 测试重置
    timer.reset()
    console.assert(timer.seconds === 0, '重置后秒数应该是 0')
    console.log('✓ 重置成功')
    
    console.log('✅ Timer 类测试通过\n')
  }, 1100)
}

// ============= Game 类测试示例 =============
import { Game } from '../models/Game'
import { Difficulty, GameStatus } from '../models/types'

function testGame() {
  console.log('=== Game 类测试 ===')
  
  let statusChanges: GameStatus[] = []
  
  const game = new Game(Difficulty.Easy, {
    onStatusChange: (status) => {
      statusChanges.push(status)
    }
  })
  console.log('✓ 创建游戏成功')
  
  // 测试初始状态
  console.assert(game.status === GameStatus.Idle, '初始状态应该是 Idle')
  console.assert(game.difficulty === Difficulty.Easy, '难度应该是 Easy')
  console.log('✓ 初始状态正确')
  
  // 测试开始游戏
  game.start()
  console.assert(game.status === GameStatus.Playing, '状态应该是 Playing')
  console.assert(statusChanges.includes(GameStatus.Playing), '应该触发状态回调')
  console.log('✓ 开始游戏成功')
  
  // 测试棋盘和计时器
  console.assert(game.board !== null, '应该有棋盘')
  console.assert(game.timer !== null, '应该有计时器')
  console.assert(game.timer.isRunning === true, '计时器应该在运行')
  console.log('✓ 棋盘和计时器初始化正确')
  
  // 测试点击安全格子
  const safeCell = game.board.cells.find(c => !c.isBomb)
  if (safeCell) {
    game.clickCell(safeCell.row, safeCell.col)
    console.assert(safeCell.isRevealed, '格子应该被打开')
    console.log('✓ 点击安全格子成功')
  }
  
  // 测试插旗
  const flagCell = game.board.cells.find(c => c.isHidden)
  if (flagCell) {
    game.toggleFlag(flagCell.row, flagCell.col)
    console.assert(flagCell.isFlagged, '格子应该被标记')
    console.log('✓ 插旗成功')
  }
  
  // 测试改变难度
  game.changeDifficulty(Difficulty.Normal)
  console.assert(game.difficulty === Difficulty.Normal, '难度应该改变')
  console.assert(game.board.rows === 14, '行数应该改变')
  console.log('✓ 改变难度成功')
  
  console.log('✅ Game 类测试通过\n')
}

// ============= 集成测试示例 =============
function testIntegration() {
  console.log('=== 集成测试 ===')
  
  const game = new Game(Difficulty.Easy)
  game.start()
  
  // 模拟游戏流程
  console.log('模拟游戏流程...')
  
  // 1. 找到所有非炸弹格子
  const safeCells = game.board.cells.filter(c => !c.isBomb)
  console.log(`安全格子数: ${safeCells.length}`)
  
  // 2. 打开所有安全格子
  safeCells.forEach(cell => {
    if (cell.isHidden) {
      game.clickCell(cell.row, cell.col)
    }
  })
  
  // 3. 检查胜利条件
  if (game.status === GameStatus.Won) {
    console.log('✓ 游戏胜利检测正确')
  }
  
  console.log('✅ 集成测试通过\n')
}

// ============= 性能测试示例 =============
function testPerformance() {
  console.log('=== 性能测试 ===')
  
  // 测试大棋盘创建
  const startTime = performance.now()
  const board = new Board(30, 30, 100)
  board.generateBombs()
  const endTime = performance.now()
  
  console.log(`创建 30x30 棋盘耗时: ${(endTime - startTime).toFixed(2)}ms`)
  console.assert(endTime - startTime < 100, '创建应该快于 100ms')
  console.log('✓ 性能符合预期')
  
  // 测试大量操作
  const startTime2 = performance.now()
  for (let i = 0; i < 1000; i++) {
    const cell = board.getCell(
      Math.floor(Math.random() * 30),
      Math.floor(Math.random() * 30)
    )
    cell?.reveal()
  }
  const endTime2 = performance.now()
  
  console.log(`1000 次操作耗时: ${(endTime2 - startTime2).toFixed(2)}ms`)
  console.log('✅ 性能测试通过\n')
}

// ============= 运行所有测试 =============
export function runAllTests() {
  console.log('🧪 开始运行测试...\n')
  
  testCell()
  testBoard()
  testTimer()
  testGame()
  testIntegration()
  testPerformance()
  
  console.log('🎉 所有测试完成！')
}

// 使用方法：
// import { runAllTests } from '@/examples/test-examples'
// runAllTests()
