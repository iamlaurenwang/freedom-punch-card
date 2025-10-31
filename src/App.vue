<script setup lang="ts">
import { ref, computed } from 'vue'
import { database, auth } from './firebase'
import { ref as dbRef, onValue, child, set, get } from 'firebase/database'
import { signInWithPopup, onAuthStateChanged, GoogleAuthProvider, signOut, type UserCredential, type User } from 'firebase/auth'
import CustomPoint from './components/CustomPoint.vue'
import CustomHeader from './components/CustomHeader.vue'
import type { AppUser } from './types/user'

const provider = new GoogleAuthProvider()
const firebaseUser = ref<User | null>(null)
const user = computed<AppUser | null>(() => {
  if (firebaseUser.value === null) {
    return null
  }

  return {
    id: firebaseUser.value.uid,
    username: firebaseUser.value.displayName || '',
    email: firebaseUser.value.email || '',
    photoURL: firebaseUser.value.photoURL || '',
  }
})

const createDefaultPoints = (max: number) => {
  const points: UserPoints = {}
  for (let i = 1; i <= max; i++) {
    points[i] = false
  }
  return points
}

type UserPoints = {
  [key: number]: boolean
}
const defaultPointNumber = 10
const userPoint = ref<UserPoints>({})
const displayPoints = computed(() => {
  if (Object.keys(userPoint.value).length === 0) return createDefaultPoints(defaultPointNumber)
  else return userPoint.value
})

function signIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result)
      // query db and render
      const dbResult = queryPunchCard(result.user.uid)
      if (!dbResult) {
        set(dbRef(database, `card/${result.user.uid}`), createDefaultPoints(defaultPointNumber))
      } else {
        console.log(dbResult)
        userPoint.value = dbResult.points as UserPoints
      }
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData.email
      const credential = GoogleAuthProvider.credentialFromError(error)
    })
}

function signOutUser() {
  signOut(auth)
}

function queryPunchCard(uuid: string): unknown {
  let data: unknown
  get(child(dbRef(database), `card/${uuid}`))
    .then((snapshot) => {
      if (snapshot.exists()) data = snapshot.val()
      else data = null
    })
    .catch((error) => {
      console.error(error)
    })

  return data
}

function handlePointCheck(point: number) {
  if (Object.keys(userPoint.value).length === 0) {
    userPoint.value[point] = true
  } else {
    userPoint.value[point] = userPoint.value[point] === undefined ? true : !userPoint.value[point]
  }

  updatePunchCard(firebaseUser.value?.uid || '', userPoint.value)
  console.log(userPoint.value)
}

function updatePunchCard(uuid: string, points: UserPoints) {
  // set(dbRef(database, `card/${uuid}/${}`), points[key])
}

onAuthStateChanged(auth, (user) => {
  firebaseUser.value = user
})
</script>

<template>
  <CustomHeader @sign-in="signIn" @sign-out="signOutUser" v-model:model="user"></CustomHeader>

  <div class="flex flex-col gap-12 h-screen items-center justify-center">
    <span class="text-center text-7xl font-semibold text-gray-900 italic"
      >Redeem your
      <span class="relative">
        <span class="absolute -inset-1 block -skew-y-e bg-pink-500" aria-hidden="true"></span>
        <span class="relative text-white">FREEDOM</span>
      </span>
      today!</span
    >

    <div id="card" class="shadow-xl aspect-video w-1/2 bg-white rounded-xl p-10">
      <div class="flex flex-wrap gap-6 justify-center items-center h-full">
        <span v-for="(value, key) in displayPoints" :key="key">
          <CustomPoint v-model="displayPoints[key]" @click="handlePointCheck(Number(key))"></CustomPoint>
        </span>
      </div>
    </div>
  </div>
</template>
