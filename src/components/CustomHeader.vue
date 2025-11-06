<script setup lang="ts">
import type { AppUser } from '@/types/user'

const user = defineModel<AppUser | null>('model', {
  type: Object as () => AppUser | null,
  default: null,
})

defineEmits(['sign-in', 'sign-out', 'create', 'edit', 'change-card'])
</script>
<template>
  <div class="sticky w-full top-0 isolate grid grid-cols-6 grid-rows-1 justify-end items-center gap-x-6 overflow-hidden bg-white px-6 py-2.5 h-14">
    <div v-if="user !== null" class="col-start-1 flex gap-3">
      <div
        v-if="user !== null"
        class="rounded-full col-start-1 justify-self-center whitespace-nowrap bg-decor-orange px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        @click="$emit('create')"
      >
        Add New Card
      </div>

      <div
        v-if="user !== null"
        class="rounded-full col-start-2 justify-self-center whitespace-nowrap bg-decor-yellow px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        @click="$emit('edit')"
      >
        Edit Current Card
      </div>
      <div
        v-if="user !== null"
        class="rounded-full col-start-3 justify-self-center whitespace-nowrap bg-decor-purple px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        @click="$emit('change-card')"
      >
        Change a Card
      </div>
    </div>

    <div
      v-if="user === null"
      class="rounded-full col-start-6 justify-self-center bg-decor-orange px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
      @click="$emit('sign-in')"
    >
      Sign In
    </div>

    <span v-else class="flex justify-center items-center gap-x-6 col-start-6">
      <div
        class="rounded-full bg-decor-blue px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        @click="$emit('sign-out')"
      >
        Sign Out
      </div>

      <div class="flex items-center gap-x-3">
        <img v-if="user.photoURL" :src="user?.photoURL" class="size-12 rounded-full outline-1 -outline-offset-1 outline-black/5" />
        <!-- <svg v-else viewBox="0 0 24 24" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-12 text-gray-300">
          <path
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clip-rule="evenodd"
            fill-rule="evenodd"
          />
        </svg> -->
      </div>
    </span>
  </div>
</template>
