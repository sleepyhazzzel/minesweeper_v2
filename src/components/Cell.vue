<template>
  <div class="cell" 
       :class="cellClasses"
       @click.left="handleClick"
       @click.right.prevent="handleRightClick"
       @contextmenu.prevent>
    <span v-if="isRevealed && !isBomb && adjacentBombs > 0" 
          :class="`num-${adjacentBombs}`">
      {{ adjacentBombs }}
    </span>
    <span v-if="isBomb && isRevealed" class="bomb-icon">💣</span>
    <span v-if="isFlagged" class="flag-icon">🚩</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CellState } from '../models/types'
import type { CellData } from '../models/types'

interface Props {
  cellData: CellData
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: [row: number, col: number]
  rightClick: [row: number, col: number]
}>()

const isRevealed = computed(() => props.cellData.state === CellState.Revealed)
const isFlagged = computed(() => props.cellData.state === CellState.Flagged)
const isHidden = computed(() => props.cellData.state === CellState.Hidden)
const isBomb = computed(() => props.cellData.isBomb)
const adjacentBombs = computed(() => props.cellData.adjacentBombs)

const cellClasses = computed(() => ({
  'cell--hidden': isHidden.value,
  'cell--revealed': isRevealed.value,
  'cell--flagged': isFlagged.value,
  'cell--bomb': isBomb.value && isRevealed.value,
  'cell--disabled': props.disabled
}))

const handleClick = () => {
  if (props.disabled) return
  emit('click', props.cellData.row, props.cellData.col)
}

const handleRightClick = () => {
  if (props.disabled) return
  emit('rightClick', props.cellData.row, props.cellData.col)
}
</script>

<style scoped>
.cell {
  width: 32px;
  height: 32px;
  border: 3px outset #ddd;
  background-color: #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  user-select: none;
  transition: all 0.1s;
}

.cell:hover:not(.cell--revealed):not(.cell--disabled) {
  background-color: #ddd;
}

.cell--revealed {
  border: 1px solid #999;
  background-color: #e8e8e8;
  cursor: default;
}

.cell--flagged {
  background-color: #ccc;
}

.cell--bomb {
  background-color: #ff4444;
}

.cell--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 数字颜色 */
.num-1 { color: #0000ff; }
.num-2 { color: #008000; }
.num-3 { color: #ff0000; }
.num-4 { color: #000080; }
.num-5 { color: #800000; }
.num-6 { color: #008080; }
.num-7 { color: #000000; }
.num-8 { color: #808080; }

.bomb-icon,
.flag-icon {
  font-size: 18px;
  line-height: 1;
}
</style>
