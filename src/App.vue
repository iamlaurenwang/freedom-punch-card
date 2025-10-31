<script setup lang="ts">
import { ref, computed } from 'vue'
import { database, auth } from './firebase'
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

function signIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result)
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
        <CustomPoint v-for="point in 10" :key="point"></CustomPoint>
      </div>
    </div>
  </div>
</template>
