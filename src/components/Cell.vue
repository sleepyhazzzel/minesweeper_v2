<template>
  <div class="cell" 
    :class="cellClasses"
    @click.left="handleClick"
    @click.right.prevent="handleRightClick"
    @contextmenu.prevent
  >
    <div v-if="isRevealed && !isBomb && adjacentBombs > 0" :class="`num-${adjacentBombs}`" />
    <div v-if="isBomb && isRevealed" class="bomb-icon" />
    <div v-if="props.disabled && isFlagged && !isBomb" class="not-bomb-icon" />
    <div v-else-if="isFlagged" class="flag-icon" />
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

<style scoped lang="scss">
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

@for $i from 1 through 8 {
  .num-#{$i} {
    width: 32px;
    height: 32px;
    background-image: url("../assets/img/0#{$i}.png");
  }
}

$classes: bomb, not-bomb, flag;
@each $class in $classes {
  .#{$class}-icon {
    width: 32px;
    height: 32px;
    font-size: 18px;
    line-height: 1;
    background-image: url("../assets/img/#{$class}.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
