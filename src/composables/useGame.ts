import { ref, computed, readonly } from 'vue'
import { Game } from '../models/Game'
import { Difficulty, GameStatus } from '../models/types'

/**
 * useGame - Vue Composition API Hook
 * 將 OOP Game 類與 Vue 響應式系統整合
 */
export function useGame(initialDifficulty: Difficulty = Difficulty.Easy) {
  // 建立 Game 實例
  const game = ref<Game | null>(null)
  const status = ref<GameStatus>(GameStatus.Idle)
  const seconds = ref(0)
  const updateTrigger = ref(0) // 用於強制更新視圖

  // 初始化遊戲
  const initGame = (difficulty: Difficulty = initialDifficulty) => {
    game.value = new Game(difficulty, {
      onStatusChange: (newStatus) => {
        status.value = newStatus
      },
      onTimerTick: (newSeconds) => {
        seconds.value = newSeconds
      },
      onBoardUpdate: () => {
        // 觸發視圖更新
        updateTrigger.value++
      }
    })
  }

  // 初始化
  initGame(initialDifficulty)

  // 計算屬性
  const board = computed(() => game.value?.board)
  const cells = computed(() => {
    // 添加 updateTrigger 作为依赖，确保视图更新
    updateTrigger.value
    return board.value?.cells || []
  })
  const difficulty = computed(() => game.value?.difficulty || Difficulty.Easy)
  const remainingFlags = computed(() => game.value?.getRemainingFlags() || 0)
  const currentRecord = computed(() => game.value?.currentRecord || 999)
  const records = computed(() => game.value?.records)
  const isPlaying = computed(() => status.value === GameStatus.Playing)
  const isWon = computed(() => status.value === GameStatus.Won)
  const isLost = computed(() => status.value === GameStatus.Lost)
  const isGameOver = computed(() => isWon.value || isLost.value)

  // 時間格式化
  const formattedTime = computed(() => {
    return seconds.value.toString().padStart(3, '0')
  })

  const timeDigits = computed(() => {
    const formatted = formattedTime.value
    return [formatted[0], formatted[1], formatted[2]]
  })

  const flagsDigits = computed(() => {
    const formatted = Math.abs(remainingFlags.value).toString().padStart(3, '0')
    return [formatted[0], formatted[1], formatted[2]]
  })

  // 遊戲操作
  const start = () => {
    game.value?.start()
  }

  const firstClick = (row: number, col: number) => {
    game.value?.firstClick(row, col)
  }

  const restart = () => {
    game.value?.restart()
  }

  const changeDifficulty = (newDifficulty: Difficulty) => {
    game.value?.changeDifficulty(newDifficulty)
  }

  const clickCell = (row: number, col: number) => {
    game.value?.clickCell(row, col)
  }

  const toggleFlag = (row: number, col: number) => {
    game.value?.toggleFlag(row, col)
  }

  return {
    // 唯讀狀態
    status: readonly(status),
    seconds: readonly(seconds),
    board,
    cells,
    difficulty,
    remainingFlags,
    currentRecord,
    records,
    isPlaying,
    isWon,
    isLost,
    isGameOver,
    formattedTime,
    timeDigits,
    flagsDigits,

    // 方法
    start,
    firstClick,
    restart,
    changeDifficulty,
    clickCell,
    toggleFlag,
    initGame
  }
}
