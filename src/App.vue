<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { auth } from './firebase'
import { signInWithPopup, onAuthStateChanged, GoogleAuthProvider, signOut, type User } from 'firebase/auth'
import CustomPoint from './components/CustomPoint.vue'
import CustomHeader from './components/CustomHeader.vue'
import CustomCard from './components/CustomCard.vue'
import type { AppUser, CardData, Cell } from './types'
import { cardService } from './services/CardService'
import { CardModel } from './models/CardModel'
import dayjs from 'dayjs'

const currentCard = ref<CardData | null>(null)
const newCardCreating = ref<boolean>(false)
const displayAllCards = ref<boolean>(false)
const newCardData = reactive<Partial<CardData> & { cellNumber: number }>({
  title: '',
  description: '',
  cellNumber: 10,
})

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
  try {
    await signInWithPopup(auth, provider)
    getCard()
  } catch (error) {
    console.error('Error during sign-in:', error)
  }
}
const signOutUser = () => signOut(auth)

async function getCard(cardId?: string) {
  if (!firebaseUser.value) return

  const card = await cardService.queryCardByUserId(firebaseUser.value.uid)
  let tmpCard: CardData | null = null
  if (card) {
    const [cardId, cardData] = Object.entries(card)[0]
    tmpCard = cardData
  } else {
    const newCard = new CardModel({ ownerId: firebaseUser.value.uid })
    await cardService.createCardByUserId(firebaseUser.value.uid, newCard.toJSON())
    tmpCard = newCard
  }

  tmpCard.cells.map((c) => (c.checkedAt = c.checked ? dayjs().format('YYYY/MM/DD HH:mm:ss') : null))
  currentCard.value = tmpCard
}

async function toggleCellStatus(cell: Cell) {
  if (!currentCard.value || !firebaseUser.value) return
  const cellToUpdate = currentCard.value.cells.map((c) => (c.order === cell.order ? { ...c, checked: cell.checked } : c))
  await cardService.updateCardByUserId(firebaseUser.value.uid, currentCard.value.id, {
    ...currentCard.value,
    cells: cellToUpdate,
  })

  getCard()
}

async function createNewCard() {
  newCardCreating.value = true
  try {
    if (firebaseUser.value === null) return

    const MIN_CELL_NUMBER = 10
    let customCellNumber: unknown = newCardData.cells

    if (!customCellNumber) customCellNumber = MIN_CELL_NUMBER
    if (typeof customCellNumber === 'number' && customCellNumber < 10) customCellNumber = MIN_CELL_NUMBER

    const newCard = new CardModel(
      { ownerId: firebaseUser.value?.uid, title: newCardData.title, description: newCardData.description },
      Number(customCellNumber)
    )

    const newCardId = await cardService.createCardByUserId(firebaseUser.value.uid, newCard)
    console.log('new card id:', newCardId)
  } catch (error) {
    console.error('Error creating new card:', error)
  } finally {
    newCardCreating.value = false
  }
}

onAuthStateChanged(auth, (user) => {
  firebaseUser.value = user
})

watch(firebaseUser, (newUser) => {
  if (newUser) {
    getCard()
  } else {
    currentCard.value = null
  }
})
</script>

<template>
  <CustomHeader
    @sign-in="signIn"
    @sign-out="signOutUser"
    @create="newCardCreating = true"
    @change-card="displayAllCards = true"
    v-model:model="user"
  ></CustomHeader>

  <div class="flex flex-col gap-12 w-full h-screen items-center justify-center p-4">
    <span class="text-center text-7xl font-semibold text-gray-900 italic"
      >Redeem your
      <span class="relative">
        <span class="absolute -inset-1 block -skew-y-e bg-pink-500" aria-hidden="true"></span>
        <span class="relative text-white">FREEDOM</span>
      </span>
      today!</span
    >

    <div
      v-if="!firebaseUser"
      id="login"
      class="bg-decor-orange shadow-xl p-10 max-h-[80dvh] aspect-9/16 w-full md:w-4/5 md:aspect-video lg:w-2/3 xl:w-3/5 2xl:w-1/2 rounded-xl max-w-[960px]"
    >
      <div class="flex flex-wrap gap-6 flex-col justify-center items-center h-full">
        <div id="firebaseui-auth-container">Sign In With</div>
        <div class="button bg-white shadow-2xl" @click="signIn"><span class="text-text-primary">GOOGLE</span></div>
      </div>
    </div>

    <div
      v-else-if="firebaseUser && currentCard && !newCardCreating && !displayAllCards"
      id="card"
      class="relative shadow-xl p-10 bg-white max-h-[80dvh] aspect-9/16 w-full md:w-4/5 md:aspect-video lg:w-2/3 xl:w-3/5 2xl:w-1/2 rounded-xl max-w-[960px]"
    >
      <div class="flex flex-wrap gap-6 justify-center items-center h-full">
        <span v-for="cell in currentCard.cells" :key="cell.order">
          <CustomPoint v-model:is-checked="cell.checked" v-bind:data="cell" @click="toggleCellStatus(cell)"></CustomPoint>
        </span>
      </div>
    </div>

    <div
      v-if="newCardCreating"
      id="login"
      class="grid bg-white shadow-xl py-10 px-16 max-h-[80dvh] aspect-9/16 w-full md:w-4/5 md:aspect-video lg:w-2/3 xl:w-3/5 2xl:w-1/2 rounded-xl max-w-[960px]"
    >
      <div class="flex flex-col items-baseline gap-6 w-full">
        <label class="whitespace-nowrap font-bold" for="title">Card Name</label>
        <input
          v-model="newCardData.title"
          id="title"
          type="text"
          class="border w-full rounded-lg appearance-none px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] focus:outline-hidden border-zinc-950/10 shadow-sm hover:inset-shadow-xs"
        />
      </div>

      <div class="flex flex-col items-baseline gap-6 w-full">
        <label class="whitespace-nowrap font-bold" for="description">Card Description</label>
        <input
          v-model="newCardData.description"
          id="description"
          type="text"
          class="border w-full rounded-lg appearance-none px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] focus:outline-hidden border-zinc-950/10 shadow-sm hover:inset-shadow-xs"
        />
      </div>

      <div class="flex flex-col items-baseline gap-6 w-full">
        <label class="whitespace-nowrap font-bold" for="cellNumber">Number of Cells</label>
        <input
          v-model="newCardData.cellNumber"
          id="cellNumber"
          type="number"
          class="border w-full rounded-lg appearance-none px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] focus:outline-hidden border-zinc-950/10 shadow-sm hover:inset-shadow-xs"
        />
      </div>

      <div class="flex justify-end w-full gap-6">
        <span
          class="rounded-xl p-3 font-semibold text-center whitespace-nowrap cursor-pointer aspect-2/1 text-2xl flex items-center justify-center bg-decor-blue hover:bg-blue-200"
          @click="newCardCreating = false"
          >return</span
        >
        <span
          class="rounded-xl p-3 font-semibold text-center whitespace-nowrap cursor-pointer aspect-2/1 text-2xl flex items-center justify-center bg-decor-yellow hover:bg-yellow-200"
          @click="createNewCard"
          >confirm</span
        >
      </div>
    </div>

    <div
      v-if="displayAllCards && !newCardCreating"
      id="cardList"
      class="bg-decor-purple overflow-y-auto shadow-xl py-10 px-8 max-h-[80dvh] aspect-9/16 w-full md:w-4/5 md:aspect-video lg:w-2/3 xl:w-3/5 2xl:w-1/2 rounded-xl max-w-[960px] grid grid-cols-3 gap-x-3 gap-y-5 place-content-start"
    >
      <CustomCard class="col" v-for="card in 10"></CustomCard>
    </div>
  </div>
</template>
