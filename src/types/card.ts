// card types


export interface Cell {
  checked: boolean
  checkedAt?: string // ISO timestamp
  reason?: string
}

export interface CardData {
  id: string // card id
  ownerId: string
  title?: string
  description?: string
  cells: Cell[]
  createdAt: string
  updatedAt: string
}

// dev note: design with interface, not model & class
// export interface UserCardsData {
//   [userId: string]: {
//     [cardId: string]: CardData
//   }
// }
