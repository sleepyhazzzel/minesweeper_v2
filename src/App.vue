<script setup lang="ts">
import { computed } from 'vue'
import GameHeader from './components/GameHeader.vue'
import GameBoard from './components/GameBoard.vue'
import { useGame } from './composables/useGame'
import { Difficulty, GameStatus } from './models/types'

// 使用遊戲 Hook
const {
  status,
  cells,
  board,
  difficulty,
  timeDigits,
  flagsDigits,
  currentRecord,
  isGameOver,
  isWon,
  isLost,
  restart,
  changeDifficulty,
  clickCell,
  toggleFlag,
  start
} = useGame(Difficulty.Easy)

// 計算屬性
const cellsData = computed(() => cells.value.map(cell => cell.toData()))
const rows = computed(() => board.value?.rows || 0)
const cols = computed(() => board.value?.cols || 0)

// 處理重啟
const handleRestart = () => {
  restart()
}

// 處理難度改變
const handleChangeDifficulty = (newDifficulty: Difficulty) => {
  changeDifficulty(newDifficulty)
}

// 處理格子點擊
const handleCellClick = (row: number, col: number) => {
  clickCell(row, col)
}

// 處理格子右鍵
const handleCellRightClick = (row: number, col: number) => {
  toggleFlag(row, col)
}

// 顯示遊戲說明
const showInfo = () => {
  alert(`🎮 扫雷游戏说明

📌 游戏规则：
• 左键点击格子，打开格子
• 右键点击格子，插/拔旗子
• 数字表示周围8格的炸弹数量
• 标记所有炸弹或打开所有安全格子即可获胜

⭐ 难度等级：
• 简单：10x10，10个炸弹
• 中等：14x16，30个炸弹
• 困难：18x22，70个炸弹

祝你遊戲愉快！🎉`)
}

// 遊戲狀態變化處理
const handleGameOver = () => {
  setTimeout(() => {
    if (isWon.value) {
      const playAgain = confirm(`🎉 恭喜获胜！\n用时：${timeDigits.value.join('')}秒\n\n是否再来一局？`)
      if (playAgain) {
        restart()
      }
    } else if (isLost.value) {
      const playAgain = confirm(`💥 很遗憾，踩到地雷了！\n\n是否再来一局？`)
      if (playAgain) {
        restart()
      }
    }
  }, 300)
}

// 监听游戏状态
const prevStatus = computed(() => status.value)
const checkGameOver = () => {
  if (isGameOver.value && prevStatus.value !== GameStatus.Idle) {
    handleGameOver()
  }
}

// 首次啟動遊戲
start()
</script>

<template>
  <div class="app">
    <div class="game-container">
      <h1 class="title">💣 扫雷游戏</h1>
      
      <GameHeader
        :difficulty="difficulty"
        :time-digits="timeDigits"
        :flags-digits="flagsDigits"
        :current-record="currentRecord"
        @restart="handleRestart"
        @info="showInfo"
        @change-difficulty="handleChangeDifficulty"
      />

      <GameBoard
        :cells="cellsData"
        :rows="rows"
        :cols="cols"
        :disabled="isGameOver"
        @cell-click="handleCellClick"
        @cell-right-click="handleCellRightClick"
        @vue:updated="checkGameOver"
      />

      <div v-if="isGameOver" class="game-overlay">
        <div class="game-result">
          <h2 v-if="isWon">🎉 恭喜获胜！</h2>
          <h2 v-else-if="isLost">💥 游戏失败</h2>
          <p v-if="isWon">用时：{{ timeDigits.join('') }}秒</p>
          <button @click="handleRestart" class="btn-restart">再来一局</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.game-container {
  position: relative;
  border: 10px solid #999;
  border-radius: 4px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  background-color: #ccc;
}

.title {
  text-align: center;
  padding: 16px;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 28px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  border-bottom: 4px solid #999;
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.game-result {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}

.game-result h2 {
  margin: 0 0 16px 0;
  font-size: 32px;
}

.game-result p {
  margin: 0 0 24px 0;
  font-size: 18px;
  color: #666;
}

.btn-restart {
  padding: 12px 32px;
  font-size: 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-restart:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

.btn-restart:active {
  transform: translateY(0);
}
</style>
