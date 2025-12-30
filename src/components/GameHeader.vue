<template>
  <div class="game-header">
    <div class="header-section">
      <button class="btn-icon" @click="$emit('info')" title="遊戲說明">
        ❓
      </button>
      <button class="btn-icon" @click="$emit('restart')" title="重新開始">
        🔄
      </button>
    </div>

    <div class="header-section record">
      <span>最佳紀錄 ({{ difficulty }})：</span>
      <span class="record-time">{{ recordDisplay }}</span>
    </div>
  </div>

  <div class="game-controls">
    <div class="display">
      <div class="digit-display">
        <span v-for="(digit, index) in flagsDigits" :key="`flag-${index}`" :class="`digit-${digit}`" />
      </div>
    </div>

    <div class="difficulty-select">
      <select :value="difficulty" @change="handleDifficultyChange">
        <option value="Easy">Easy ★</option>
        <option value="Normal">Normal ★★</option>
        <option value="Difficult">Difficult ★★★</option>
      </select>
    </div>

    <div class="display">
      <div class="digit-display">
        <span v-for="(digit, index) in timeDigits" :key="`time-${index}`" :class="`digit-${digit}`" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Difficulty } from '../models/types'

interface Props {
  difficulty: Difficulty
  timeDigits: string[]
  flagsDigits: string[]
  currentRecord: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  restart: []
  info: []
  changeDifficulty: [difficulty: Difficulty]
}>()

const recordDisplay = computed(() => {
  return props.currentRecord === 999 ? '?' : `${props.currentRecord}s`
})

const handleDifficultyChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('changeDifficulty', target.value as Difficulty)
}
</script>

<style scoped lang="scss">
.game-header {
  padding: 8px;
  background-color: #ccc;
  border: 4px inset #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  width: 28px;
  height: 28px;
  border: 3px outset #ddd;
  background-color: #ccc;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
}

.btn-icon:hover {
  background-color: #ddd;
}

.btn-icon:active {
  border-style: inset;
}

.record {
  font-size: 12px;
}

.record-time {
  padding: 2px 6px;
  border: 1px solid #999;
  border-radius: 3px;
  background-color: #fff;
  font-weight: bold;
}

.game-controls {
  padding: 8px;
  background-color: #ccc;
  border: 4px inset #ddd;
  border-top: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.display {
  background-color: #000;
  padding: 4px 8px;
  border-radius: 2px;
}

.digit-display {
  display: flex;
  gap: 2px;
}

@for $i from 0 through 9 {
  .digit-#{$i} {
    width:  20px;
    height: 36px;
    background-image: url("../assets/img/num-#{$i}.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.difficulty-select select {
  padding: 8px 12px;
  border: 2px outset #ddd;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
  min-width: 120px;
}

.difficulty-select select:hover {
  background-color: #f0f0f0;
}
</style>
