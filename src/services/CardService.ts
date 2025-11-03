import { get, set, child, ref } from 'firebase/database'
import { database } from '@/firebase'
import type { CardData } from '@/types/card'
import { CardModel } from '@/models/CardModel'

export class CardService {
  private dbRef = ref(database)

  async queryCardByUserId(userId: string): Promise<Record<string, CardData> | null> {
    try {
      const snapshot = await get(child(this.dbRef, `users/${userId}`))
      return snapshot.exists() ? snapshot.val() : null
    } catch (error) {
      console.error('Error querying cards:', error)
      throw error
    }
  }

  async createCardByUserId(userId: string, cardData: Partial<CardData>) {
    try {
      const card = new CardModel({ ...cardData, ownerId: userId })
      const cardPath = `users/${userId}/${card?.id}`

      await set(child(this.dbRef, cardPath), card)
      return card.id
    } catch (error) {
      console.error('Error creating card:', error)
      throw error
    }
  }

  async updateCardByUserId(userId: string, cardId: string, updates: Partial<CardData>) {
    try {
      const cardPath = `users/${userId}/${cardId}`
      const currentData = await get(child(this.dbRef, cardPath))

      if (!currentData.exists()) throw new Error('Card not found')
      const updatedCard: CardData = { ...currentData.val(), ...updates, updatedAt: new Date().toISOString() }

      await set(child(this.dbRef, cardPath), updatedCard)
    } catch (error) {
      console.error('Error updating card:', error)
      throw error
    }
  }
}

export const cardService = new CardService() 
