<template>
  <div class="game-board" :style="boardStyle">
    <Cell
      v-for="cell in cells"
      :key="`${cell.row}-${cell.col}`"
      :cell-data="cell"
      :disabled="disabled"
      @click="handleCellClick"
      @right-click="handleCellRightClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Cell from './Cell.vue'
import type { CellData } from '../models/types'

interface Props {
  cells: CellData[]
  rows: number
  cols: number
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  cellClick: [row: number, col: number]
  cellRightClick: [row: number, col: number]
}>()

const boardStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.cols}, 32px)`,
  gridTemplateRows: `repeat(${props.rows}, 32px)`,
  gap: '0'
}))

const handleCellClick = (row: number, col: number) => {
  emit('cellClick', row, col)
}

const handleCellRightClick = (row: number, col: number) => {
  emit('cellRightClick', row, col)
}
</script>

<style scoped>
.game-board {
  background-color: #ccc;
  border: 4px inset #ddd;
  border-top: 2px solid #999;
  padding: 8px;
}
</style>
