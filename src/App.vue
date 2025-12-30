<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
  start,
  firstClick
} = useGame(Difficulty.Easy)

// 延遲顯示遊戲結果
const showResult = ref(false)
let resultTimer: number | null = null

watch(isGameOver, (newVal) => {
  if (newVal) {
    // 遊戲結束時，3 秒後顯示結果
    resultTimer = window.setTimeout(() => {
      showResult.value = true
    }, 2500)
  } else {
    // 重新開始時立即隱藏結果
    if (resultTimer) {
      clearTimeout(resultTimer)
      resultTimer = null
    }
    showResult.value = false
  }
})

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
const handleCellClick = async (row: number, col: number) => {
  if (status.value === GameStatus.Idle) firstClick(row, col)
  else clickCell(row, col)
}

// 處理格子右鍵
const handleCellRightClick = (row: number, col: number) => {
  toggleFlag(row, col)
}

// 顯示遊戲說明
const showInfo = () => {
  alert(`🎮 踩地雷遊戲說明

📌 遊戲規則：
• 左鍵點擊格子，打開格子
• 右鍵點擊格子，插/拔旗子
• 數字表示周圍8格的炸彈數量
• 標記所有炸彈或打開所有安全格子即可獲勝

⭐ 難度等級：
• 簡單：10x10，10個炸彈
• 中等：14x16，30個炸彈
• 困難：18x22，70個炸彈

祝你遊戲愉快！🎉`)
}

// 首次啟動遊戲
start()
</script>

<template>
  <div class="app">
    <div class="game-container">      
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
      />

      <div v-if="showResult" class="game-overlay">
        <div class="game-result">
          <h2 v-if="isWon">🎉 恭喜獲勝！</h2>
          <h2 v-else-if="isLost">💥 遊戲失敗</h2>
          <p v-if="isWon">用時：{{ timeDigits.join('') }}秒</p>
          <button @click="handleRestart" class="btn-restart">再來一局</button>
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
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  background-color: #ccc;
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
