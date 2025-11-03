<script setup lang="ts">
import { ref, computed } from 'vue'
import { auth } from './firebase'
import { signInWithPopup, onAuthStateChanged, GoogleAuthProvider, signOut, type User } from 'firebase/auth'
import CustomPoint from './components/CustomPoint.vue'
import CustomHeader from './components/CustomHeader.vue'
import type { AppUser, CardData, Cell } from './types'
import { cardService } from './services/CardService'
import { CardModel } from './models/CardModel'

const currentCard = ref<CardData | null>(null)
const firebaseUser = ref<User | null>(null)
const user = computed<AppUser | null>(() => {
  if (firebaseUser.value === null) return null

  return {
    id: firebaseUser.value.uid,
    username: firebaseUser.value.displayName || '',
    email: firebaseUser.value.email || '',
    photoURL: firebaseUser.value.photoURL || '',
  }
})

const signIn = async () => {
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
  getCard()
}
const signOutUser = () => signOut(auth)

async function getCard() {
  if (!firebaseUser.value) return

  const card = await cardService.queryCardByUserId(firebaseUser.value.uid)
  if (card) {
    const [cardId, cardData] = Object.entries(card)[0]
    currentCard.value = cardData
  } else {
    const newCard = new CardModel({ ownerId: firebaseUser.value.uid })
    await cardService.createCardByUserId(firebaseUser.value.uid, newCard.toJSON())
    currentCard.value = newCard
  }
}

async function toggleCellStatus(cell: Cell) {
  if (!currentCard.value) return

  const cardToUpdate = new CardModel({ ...currentCard.value })
  cardToUpdate.setCell(cell.order)

  const newCard = cardToUpdate.toJSON()

  await cardService.updateCardByUserId(firebaseUser.value!.uid, newCard.id, cardToUpdate)
}

onAuthStateChanged(auth, (user) => {
  firebaseUser.value = user
})

getCard()
</script>

<template>
  <CustomHeader @sign-in="signIn" @sign-out="signOutUser" v-model:model="user"></CustomHeader>

  <div class="flex flex-col gap-12 h-screen items-center justify-center">
    <span class="text-center text-7xl font-semibold text-gray-900 italic" @click="getCard"
      >Redeem your
      <span class="relative">
        <span class="absolute -inset-1 block -skew-y-e bg-pink-500" aria-hidden="true"></span>
        <span class="relative text-white">FREEDOM</span>
      </span>
      today!</span
    >

    <div v-if="!firebaseUser" id="login" class="shadow-xl aspect-video w-1/2 bg-decor-orange rounded-xl p-10">
      <div class="flex flex-wrap gap-6 flex-col justify-center items-center h-full">
        <div id="firebaseui-auth-container">Sign In With</div>
        <div class="button bg-white shadow-2xl" @click="signIn"><span class="text-text-primary">GOOGLE</span></div>
      </div>
    </div>

    <div v-else-if="firebaseUser && currentCard" id="card" class="shadow-xl aspect-video w-1/2 bg-white rounded-xl p-10">
      <div class="flex flex-wrap gap-6 justify-center items-center h-full">
        <span v-for="cell in currentCard.cells" :key="cell.order">
          <CustomPoint v-model:is-checked="cell.checked" v-bind:data="cell" @click="toggleCellStatus(cell)"></CustomPoint>
        </span>
      </div>
    </div>

    <div v-else>
      <div>{{ currentCard }}</div>
    </div>
  </div>
</template>
