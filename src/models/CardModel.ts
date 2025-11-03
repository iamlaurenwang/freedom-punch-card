import type { CardData, Cell } from '@/types/card'

// 只負責卡片數據管理
export class CardModel implements CardData {
  id: string
  ownerId: string
  title?: string
  description?: string
  cells: Cell[]
  createdAt: string
  updatedAt: string

  constructor(data: Partial<CardData> & { ownerId: string }, cellCount: number = 10) {
    this.id = data.id ?? this.generateId()
    this.ownerId = data.ownerId
    this.cells = data.cells ?? this.createEmptyCells(cellCount)
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
    this.title = data.title ?? ''
    this.description = data.description ?? ''
  }

  private generateId() {
    return Math.random().toString(36).slice(2, 9)
  }

  private createEmptyCells(count: number): Cell[] {
    return Array.from({ length: count }, () => ({ checked: false }))
  }

  // todo: 這是getter嗎?
  toJSON(): CardData {
    return {
      id: this.id,
      ownerId: this.ownerId,
      title: this.title,
      description: this.description,
      cells: this.cells,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}

/**
 * 進一步建議

若要支援多張卡片：在儲存層用 UserCardsMap (userId -> Record<cardId, CardData>)。
若需歷史紀錄或多次撤銷、還原：再加一個 events 陣列（每次變更都 push 一筆 event）。
若資料量大、查詢頻繁：在 DB（例如 Firestore / Mongo）中把 cell.checkedAt 設為索引或把 events 存成分表。

 */
