/**
 * Timer 類 - 管理遊戲計時器
 */
export class Timer {
  private _seconds: number
  private _isRunning: boolean
  private _intervalId: number | null
  private _onTick?: (seconds: number) => void

  constructor(onTick?: (seconds: number) => void) {
    this._seconds = 0
    this._isRunning = false
    this._intervalId = null
    this._onTick = onTick
  }

  get seconds(): number {
    return this._seconds
  }

  get isRunning(): boolean {
    return this._isRunning
  }

  /**
   * 開始計時
   */
  start(): void {
    if (this._isRunning) {
      return
    }

    this._isRunning = true
    this._intervalId = window.setInterval(() => {
      this._seconds++
      if (this._onTick) {
        this._onTick(this._seconds)
      }
    }, 1000)
  }

  /**
   * 停止計時
   */
  stop(): void {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId)
      this._intervalId = null
    }
    this._isRunning = false
  }

  /**
   * 重置計時器
   */
  reset(): void {
    this.stop()
    this._seconds = 0
    if (this._onTick) {
      this._onTick(this._seconds)
    }
  }

  /**
   * 格式化時間顯示（返回三位數字串）
   */
  getFormattedTime(): string {
    return this._seconds.toString().padStart(3, '0')
  }

  /**
   * 獲取時間的各個數字（用於顯示）
   */
  getTimeDigits(): [string, string, string] {
    const formatted = this.getFormattedTime()
    return [formatted[0], formatted[1], formatted[2]]
  }
}
